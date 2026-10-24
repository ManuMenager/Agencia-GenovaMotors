import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import type { NextFunction, Request, Response } from 'express'
import { config } from './config.js'

const COOKIE = 'gm_admin'
const MAX_AGE_MS = config.sessionHours * 60 * 60 * 1000

const b64 = (s: string) => Buffer.from(s).toString('base64url')
const mac = (data: string) => createHmac('sha256', config.sessionSecret).update(data).digest('base64url')

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  return ba.length === bb.length && timingSafeEqual(ba, bb)
}

function createToken(): string {
  const payload = b64(JSON.stringify({ exp: Date.now() + MAX_AGE_MS }))
  return `${payload}.${mac(payload)}`
}

function isValidToken(token: string | undefined): boolean {
  if (!token) return false
  const [payload, signature] = token.split('.')
  if (!payload || !signature || !safeEqual(signature, mac(payload))) return false
  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { exp: number }
    return typeof exp === 'number' && exp > Date.now()
  } catch {
    return false
  }
}

function readCookie(req: Request, name: string): string | undefined {
  const header = req.headers.cookie
  if (!header) return undefined
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=')
    if (key === name) return decodeURIComponent(rest.join('='))
  }
  return undefined
}

/** Compara las contraseñas por su hash para que el tiempo de respuesta no dependa del contenido. */
export function passwordMatches(input: string): boolean {
  if (!config.adminPassword) return false
  const digest = (s: string) => createHash('sha256').update(s).digest()
  return timingSafeEqual(digest(input), digest(config.adminPassword))
}

export function startSession(res: Response): void {
  res.cookie(COOKIE, createToken(), {
    httpOnly: true,
    sameSite: 'strict',
    secure: config.isProduction,
    maxAge: MAX_AGE_MS,
    path: '/',
  })
}

export function endSession(res: Response): void {
  res.clearCookie(COOKIE, { httpOnly: true, sameSite: 'strict', secure: config.isProduction, path: '/' })
}

export function isAdmin(req: Request): boolean {
  return isValidToken(readCookie(req, COOKIE))
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!isAdmin(req)) {
    res.status(401).json({ error: 'No autorizado' })
    return
  }
  next()
}

// Límite de intentos de login por IP: 5 cada 15 minutos.
const attempts = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 5

export function loginBlocked(ip: string): boolean {
  const entry = attempts.get(ip)
  if (!entry || entry.resetAt < Date.now()) return false
  return entry.count >= MAX_ATTEMPTS
}

export function registerFailedLogin(ip: string): void {
  const now = Date.now()
  const entry = attempts.get(ip)
  if (!entry || entry.resetAt < now) attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
  else entry.count += 1
}

export function clearLoginAttempts(ip: string): void {
  attempts.delete(ip)
}
