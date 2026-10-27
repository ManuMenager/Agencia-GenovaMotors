import { z } from 'zod'

export const contactInputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email().max(120),
  phone: z.string().trim().max(40).optional(),
  message: z.string().trim().min(1).max(2000),
})
