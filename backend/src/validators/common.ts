import { z } from 'zod'

/** Ruta de una imagen propia: del sitio (/images/…) o subida desde el panel (/uploads/…). */
export const mediaPath = z
  .string()
  .regex(/^\/(images|uploads)\/[\w\-./]+$/, 'Ruta de imagen inválida')
  .refine((p) => !p.split('/').includes('..'), 'Ruta de imagen inválida')

export const text = (max: number) => z.string().trim().min(1, 'Obligatorio').max(max)
