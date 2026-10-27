import type { ErrorRequestHandler, RequestHandler } from 'express'
import multer from 'multer'
import { ZodError } from 'zod'
import { AppError } from '../errors/app-error.js'
import { MAX_UPLOAD_MB } from './upload.middleware.js'

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.message, ...(err.details ? { details: err.details } : {}) })
    return
  }
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Datos inválidos',
      details: err.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
    })
    return
  }
  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE' ? `Cada foto puede pesar hasta ${MAX_UPLOAD_MB} MB.` : 'No se pudieron subir las fotos.'
    res.status(400).json({ error: message })
    return
  }
  if (err instanceof SyntaxError) {
    res.status(400).json({ error: 'JSON inválido' })
    return
  }
  console.error(err)
  res.status(500).json({ error: 'Error interno del servidor' })
}
