import type { Request, Response } from 'express'
import { contactService } from '../services/contact.service.js'
import { contactInputSchema } from '../validators/contact.validator.js'

export const contactController = {
  async submit(req: Request, res: Response) {
    await contactService.submit(contactInputSchema.parse(req.body))
    res.status(201).json({ ok: true })
  },

  async list(_req: Request, res: Response) {
    res.json(await contactService.list())
  },
}
