import 'dotenv/config'
import { randomBytes } from 'node:crypto'
import path from 'node:path'

const isProduction = process.env.NODE_ENV === 'production'
const root = path.resolve(import.meta.dirname, '..', '..')

if (!process.env.DATABASE_URL) {
  console.error('[config] Falta DATABASE_URL (ej. postgresql://usuario:clave@localhost:5432/genova_motors). Revisá backend/.env.')
  process.exit(1)
}
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
  databaseUrl: process.env.DATABASE_URL,
  adminPassword: process.env.ADMIN_PASSWORD ?? '',
  sessionSecret: process.env.SESSION_SECRET ?? randomBytes(32).toString('hex'),
  sessionHours: 8,
  migrationsDir: path.join(root, 'migrations'),
  uploadsDir: path.join(root, 'uploads'),
  /** Datos del JSON anterior: si existe, `db:seed` los importa en lugar de los datos de ejemplo. */
  legacyDbFile: path.join(root, 'data', 'db.json'),
}
