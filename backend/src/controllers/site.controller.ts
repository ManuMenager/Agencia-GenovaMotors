import type { Request, Response } from 'express'
import { clientPhotoService } from '../services/client-photo.service.js'
import { settingsService } from '../services/settings.service.js'
import { siteService } from '../services/site.service.js'
import { clientsInputSchema, settingsInputSchema } from '../validators/site.validator.js'

export const siteController = {
  async snapshot(_req: Request, res: Response) {
    res.json(await siteService.snapshot())
  },

  async clients(_req: Request, res: Response) {
    res.json(await clientPhotoService.list())
  },

  async saveClients(req: Request, res: Response) {
    const { photos } = clientsInputSchema.parse(req.body)
    res.json(await clientPhotoService.replace(photos))
  },

  async settings(_req: Request, res: Response) {
    res.json(await settingsService.get())
  },

  async saveSettings(req: Request, res: Response) {
    const data = settingsInputSchema.parse(req.body)
    res.json(await settingsService.update(data))
  },
}
