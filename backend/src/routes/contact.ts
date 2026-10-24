import { Router } from 'express'
import { z } from 'zod'

export const contactRouter = Router()

const contactSchema = z.object({
  name: z.string().trim().min(1),
  email: z.email(),
  phone: z.string().trim().optional(),
  message: z.string().trim().min(1),
})

contactRouter.post('/', (req, res) => {
  const parsed = contactSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Datos inválidos', details: parsed.error.issues })
    return
  }

  // TODO: guardar en base de datos y/o enviar por email.
  console.log('Nueva consulta:', parsed.data)
  res.status(201).json({ ok: true })
})
