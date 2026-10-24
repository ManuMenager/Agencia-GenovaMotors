import { z } from 'zod'

/** Ruta de una imagen propia: del sitio (/images/…) o subida desde el panel (/uploads/…). */
const mediaPath = z
  .string()
  .regex(/^\/(images|uploads)\/[\w\-./]+$/, 'Ruta de imagen inválida')
  .refine((p) => !p.split('/').includes('..'), 'Ruta de imagen inválida')

const text = (max: number) => z.string().trim().min(1, 'Obligatorio').max(max)

export const vehicleInput = z.object({
  brand: text(60),
  model: text(60),
  version: text(100),
  year: z.coerce.number().int().min(1950).max(new Date().getFullYear() + 1),
  price: z.coerce.number().min(0).max(1_000_000_000),
  currency: z.enum(['USD', 'ARS']).default('USD'),
  condition: z.enum(['nuevo', 'usado']),
  mileage: z.coerce.number().int().min(0).max(2_000_000),
  fuel: z.enum(['nafta', 'diesel', 'hibrido', 'electrico', 'gnc']),
  transmission: z.enum(['manual', 'automatica']),
  color: text(40),
  description: z.string().trim().max(1000).default(''),
  featured: z.boolean().default(false),
  images: z.array(mediaPath).min(1, 'Cargá al menos una foto').max(20),
})

export const clientsInput = z.object({
  photos: z.array(mediaPath).max(60),
})

export const settingsInput = z.object({
  address: text(120),
  whatsapp: z
    .string()
    .transform((s) => s.replace(/\D/g, ''))
    .pipe(z.string().regex(/^\d{8,15}$/, 'Ingresá el número completo, con código de país')),
  email: z.email().max(120),
  hours: z.array(text(80)).min(1, 'Cargá al menos un horario').max(8),
})

export const loginInput = z.object({ password: z.string().min(1).max(200) })
