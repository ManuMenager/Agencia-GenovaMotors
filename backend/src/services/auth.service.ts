import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { config } from '../config/index.js'
import { AppError } from '../errors/app-error.js'

export const SESSION_MAX_AGE_MS = config.sessionHours * 60 * 60 * 1000

const b64 = (s: string) => Buffer.from(s).toString('base64url')
const mac = (data: string) => createHmac('sha256', config.sessionSecret).update(data).digest('base64url')

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  return ba.length === bb.length && timingSafeEqual(ba, bb)
}

// Límite de intentos de login por IP: 5 cada 15 minutos.
const attempts = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 5

/** Compara las contraseñas por su hash para que el tiempo de respuesta no dependa del contenido. */
function passwordMatches(input: string): boolean {
  const digest = (s: string) => createHash('sha256').update(s).digest()
  return timingSafeEqual(digest(input), digest(config.adminPassword))
}

export const authService = {
  /** Verifica la contraseña del dueño y devuelve el token de sesión. */
  login(password: string, ip: string): string {
    if (!config.adminPassword) throw new AppError(503, 'El acceso al panel no está configurado en el servidor.')

    const entry = attempts.get(ip)
    if (entry && entry.resetAt >= Date.now() && entry.count >= MAX_ATTEMPTS) {
      throw new AppError(429, 'Demasiados intentos. Probá de nuevo en unos minutos.')
    }
    if (!passwordMatches(password)) {
      const now = Date.now()
      if (!entry || entry.resetAt < now) attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
      else entry.count += 1
      throw new AppError(401, 'Contraseña incorrecta')
    }
    attempts.delete(ip)

    const payload = b64(JSON.stringify({ exp: Date.now() + SESSION_MAX_AGE_MS }))
    return `${payload}.${mac(payload)}`
  },

  isValidToken(token: string | undefined): boolean {
    if (!token) return false
    const [payload, signature] = token.split('.')
    if (!payload || !signature || !safeEqual(signature, mac(payload))) return false
    try {
      const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { exp: number }
      return typeof exp === 'number' && exp > Date.now()
    } catch {
      return false
    }
  },
}
