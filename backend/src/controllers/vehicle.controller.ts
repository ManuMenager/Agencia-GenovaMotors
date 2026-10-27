import type { Request, Response } from 'express'
import { vehicleService } from '../services/vehicle.service.js'
import { vehicleFiltersSchema, vehicleInputSchema } from '../validators/vehicle.validator.js'

const idOf = (req: Request) => String(req.params.id)

export const vehicleController = {
  async list(req: Request, res: Response) {
    const filters = vehicleFiltersSchema.parse(req.query)
    res.json(await vehicleService.list(filters))
  },

  async get(req: Request, res: Response) {
    res.json(await vehicleService.get(idOf(req)))
  },

  async create(req: Request, res: Response) {
    const data = vehicleInputSchema.parse(req.body)
    res.status(201).json(await vehicleService.create(data))
  },

  async update(req: Request, res: Response) {
    const data = vehicleInputSchema.parse(req.body)
    res.json(await vehicleService.update(idOf(req), data))
  },

  async remove(req: Request, res: Response) {
    await vehicleService.remove(idOf(req))
    res.status(204).end()
  },
}
