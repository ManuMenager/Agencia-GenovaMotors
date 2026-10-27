import { z } from 'zod'
import { mediaPath, text } from './common.js'

export const clientsInputSchema = z.object({
  photos: z.array(mediaPath).max(60),
})

export const settingsInputSchema = z.object({
  address: text(120),
  whatsapp: z
    .string()
    .transform((s) => s.replace(/\D/g, ''))
    .pipe(z.string().regex(/^\d{8,15}$/, 'Ingresá el número completo, con código de país')),
  email: z.email().max(120),
  hours: z.array(text(80)).min(1, 'Cargá al menos un horario').max(8),
})
