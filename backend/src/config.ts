import 'dotenv/config'
import { randomBytes } from 'node:crypto'
import path from 'node:path'

const isProduction = process.env.NODE_ENV === 'production'

if (!process.env.SESSION_SECRET) {
  console.warn(
    '[config] SESSION_SECRET no está definido: se usa un valor aleatorio y las sesiones del panel se pierden al reiniciar.',
  )
}
if (!process.env.ADMIN_PASSWORD) {
  console.warn('[config] ADMIN_PASSWORD no está definido: el acceso al panel de administración está deshabilitado.')
}

export const config = {
  port: Number(process.env.PORT ?? 3001),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  isProduction,
  adminPassword: process.env.ADMIN_PASSWORD ?? '',
  sessionSecret: process.env.SESSION_SECRET ?? randomBytes(32).toString('hex'),
  sessionHours: 8,
  dataDir: path.resolve(import.meta.dirname, '..', 'data'),
  uploadsDir: path.resolve(import.meta.dirname, '..', 'uploads'),
}
