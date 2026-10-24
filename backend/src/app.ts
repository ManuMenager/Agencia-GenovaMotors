import express, { type ErrorRequestHandler } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import multer from 'multer'
import { config } from './config.js'
import { adminRouter } from './routes/admin.js'
import { contactRouter } from './routes/contact.js'
import { siteRouter } from './routes/site.js'
import { vehiclesRouter } from './routes/vehicles.js'

export const app = express()

// Las fotos las muestra el frontend (otro origen en producción), por eso se permite cross-origin.
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({ origin: config.corsOrigin, credentials: true }))
app.use(express.json({ limit: '100kb' }))

app.use('/uploads', express.static(config.uploadsDir, { maxAge: '7d', immutable: true }))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})
app.use('/api/vehicles', vehiclesRouter)
app.use('/api', siteRouter)
app.use('/api/contact', contactRouter)
app.use('/api/admin', adminRouter)

app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'Cada foto puede pesar hasta 12 MB.' : 'No se pudieron subir las fotos.'
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
app.use(errorHandler)
