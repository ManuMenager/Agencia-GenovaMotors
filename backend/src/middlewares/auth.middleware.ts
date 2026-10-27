import type { NextFunction, Request, Response } from 'express'
import { unauthorized } from '../errors/app-error.js'
import { authService } from '../services/auth.service.js'

export const SESSION_COOKIE = 'gm_admin'

function readCookie(req: Request, name: string): string | undefined {
  const header = req.headers.cookie
  if (!header) return undefined
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=')
    if (key === name) return decodeURIComponent(rest.join('='))
  }
  return undefined
}

export const isAdmin = (req: Request): boolean => authService.isValidToken(readCookie(req, SESSION_COOKIE))

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  next(isAdmin(req) ? undefined : unauthorized())
}
