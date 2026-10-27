import { promises as fs } from 'node:fs'
import { config } from '../config/index.js'
import { clientPhotoRepository } from '../repositories/client-photo.repository.js'
import { settingsRepository } from '../repositories/settings.repository.js'
import { vehicleRepository } from '../repositories/vehicle.repository.js'
import { withTransaction } from './pool.js'
import { seedData, type SeedData } from './seed-data.js'

/** Si quedó el `data/db.json` de la versión anterior, se importa ese contenido en lugar de los datos de ejemplo. */
async function loadSource(): Promise<{ data: SeedData; origin: string }> {
  try {
    const legacy = JSON.parse(await fs.readFile(config.legacyDbFile, 'utf8')) as SeedData
    return { data: legacy, origin: 'data/db.json' }
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err
    return { data: seedData, origin: 'datos de ejemplo' }
  }
}

/** Carga los datos iniciales. No hace nada si ya hay vehículos. Devuelve true si cargó algo. */
export async function seed(): Promise<boolean> {
  if ((await vehicleRepository.count()) > 0) return false

  const { data, origin } = await loadSource()
  await withTransaction(async (tx) => {
    for (const { id, ...vehicle } of data.vehicles) {
      const input = { ...vehicle, featured: vehicle.featured ?? false, description: vehicle.description ?? '' }
      await vehicleRepository.insert(id, input, tx)
      await vehicleRepository.replaceImages(id, input.images, tx)
    }
    await clientPhotoRepository.replaceAll(data.clients, tx)
    await settingsRepository.save(data.settings, tx)
  })
  console.log(`[db] Origen: ${origin} (${data.vehicles.length} vehículos).`)
  return true
}
