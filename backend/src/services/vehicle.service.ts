import { withTransaction } from '../database/pool.js'
import { notFound } from '../errors/app-error.js'
import type { Vehicle, VehicleFilters, VehicleInput } from '../models/vehicle.model.js'
import { vehicleRepository } from '../repositories/vehicle.repository.js'
import { slugify } from '../utils/slugify.js'
import { removeUnusedImages } from './image-cleanup.service.js'

const UNIQUE_VIOLATION = '23505'
const NOT_FOUND = 'Vehículo no encontrado'

/** El id es un slug legible (marca-modelo-año); si ya existe se le suma un número. */
async function generateId(data: VehicleInput): Promise<string> {
  const base = slugify(`${data.brand}-${data.model}-${data.year}`)
  let id = base
  for (let n = 2; await vehicleRepository.exists(id); n++) id = `${base}-${n}`
  return id
}

export const vehicleService = {
  list(filters: VehicleFilters): Promise<Vehicle[]> {
    return vehicleRepository.findAll(filters)
  },

  async get(id: string): Promise<Vehicle> {
    const vehicle = await vehicleRepository.findById(id)
    if (!vehicle) throw notFound(NOT_FOUND)
    return vehicle
  },

  async create(data: VehicleInput): Promise<Vehicle> {
    // Si dos altas simultáneas eligen el mismo id, la base rechaza la segunda y se reintenta con otro.
    for (let attempt = 0; ; attempt++) {
      const id = await generateId(data)
      try {
        await withTransaction(async (tx) => {
          await vehicleRepository.insert(id, data, tx)
          await vehicleRepository.replaceImages(id, data.images, tx)
        })
        return { id, ...data }
      } catch (err) {
        if ((err as { code?: string }).code !== UNIQUE_VIOLATION || attempt >= 4) throw err
      }
    }
  },

  async update(id: string, data: VehicleInput): Promise<Vehicle> {
    const previous = await vehicleRepository.findById(id)
    if (!previous) throw notFound(NOT_FOUND)

    await withTransaction(async (tx) => {
      await vehicleRepository.update(id, data, tx)
      await vehicleRepository.replaceImages(id, data.images, tx)
    })
    await removeUnusedImages(previous.images)
    return { id, ...data }
  },

  async remove(id: string): Promise<void> {
    const previous = await vehicleRepository.findById(id)
    if (!previous || !(await vehicleRepository.delete(id))) throw notFound(NOT_FOUND)
    await removeUnusedImages(previous.images)
  },
}
