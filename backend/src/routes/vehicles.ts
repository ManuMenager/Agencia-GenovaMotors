import { Router } from 'express'
import { z } from 'zod'
import { readDb } from '../store.js'

export const vehiclesRouter = Router()

const querySchema = z.object({
  condition: z.enum(['nuevo', 'usado']).optional(),
  featured: z.enum(['true', 'false']).optional(),
  search: z.string().trim().optional(),
})

vehiclesRouter.get('/', async (req, res) => {
  const parsed = querySchema.safeParse(req.query)
  if (!parsed.success) {
    res.status(400).json({ error: 'Parámetros inválidos', details: parsed.error.issues })
    return
  }

  const { condition, featured, search } = parsed.data
  const term = search?.toLowerCase()
  const { vehicles } = await readDb()

  res.json(
    vehicles.filter((v) => {
      if (condition && v.condition !== condition) return false
      if (featured && Boolean(v.featured) !== (featured === 'true')) return false
      if (term && !`${v.brand} ${v.model} ${v.version}`.toLowerCase().includes(term)) return false
      return true
    }),
  )
})

vehiclesRouter.get('/:id', async (req, res) => {
  const { vehicles } = await readDb()
  const vehicle = vehicles.find((v) => v.id === req.params.id)
  if (!vehicle) {
    res.status(404).json({ error: 'Vehículo no encontrado' })
    return
  }
  res.json(vehicle)
})
