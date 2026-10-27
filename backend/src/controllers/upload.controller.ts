import type { Request, Response } from 'express'
import { AppError } from '../errors/app-error.js'
import { saveImage } from '../services/upload.service.js'

export const uploadController = {
  async upload(req: Request, res: Response) {
    const files = (req.files as Express.Multer.File[] | undefined) ?? []
    if (files.length === 0) throw new AppError(400, 'No se recibieron imágenes válidas (JPG, PNG o WebP).')
    try {
      const urls = await Promise.all(files.map((f) => saveImage(f.buffer)))
      res.status(201).json({ urls })
    } catch {
      throw new AppError(400, 'Una de las imágenes no se pudo procesar. Probá con otra.')
    }
  },
}
