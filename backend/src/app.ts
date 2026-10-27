import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { config } from './config/index.js'
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js'
import { apiRouter } from './routes/index.js'

export const app = express()

// Las fotos las muestra el frontend (otro origen en producción), por eso se permite cross-origin.
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({ origin: config.corsOrigin, credentials: true }))
app.use(express.json({ limit: '100kb' }))

app.use('/uploads', express.static(config.uploadsDir, { maxAge: '7d', immutable: true }))
app.use('/api', apiRouter)

app.use(notFoundHandler)
app.use(errorHandler)
