import { z } from 'zod'
import { CURRENCIES, FUEL_TYPES, TRANSMISSIONS, VEHICLE_CONDITIONS } from '../models/vehicle.model.js'
import { mediaPath, text } from './common.js'

export const vehicleInputSchema = z.object({
  brand: text(60),
  model: text(60),
  version: text(100),
  year: z.coerce
    .number()
    .int()
    .min(1950)
    .max(new Date().getFullYear() + 1),
  price: z.coerce.number().min(0).max(1_000_000_000),
  currency: z.enum(CURRENCIES).default('USD'),
  condition: z.enum(VEHICLE_CONDITIONS),
  mileage: z.coerce.number().int().min(0).max(2_000_000),
  fuel: z.enum(FUEL_TYPES),
  transmission: z.enum(TRANSMISSIONS),
  color: text(40),
  description: z.string().trim().max(1000).default(''),
  featured: z.boolean().default(false),
  images: z.array(mediaPath).min(1, 'Cargá al menos una foto').max(20),
})

export const vehicleFiltersSchema = z.object({
  condition: z.enum(VEHICLE_CONDITIONS).optional(),
  featured: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  search: z.string().trim().optional(),
})
