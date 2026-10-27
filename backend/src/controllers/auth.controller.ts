import type { CookieOptions, Request, Response } from 'express'
import { config } from '../config/index.js'
import { isAdmin, SESSION_COOKIE } from '../middlewares/auth.middleware.js'
import { authService, SESSION_MAX_AGE_MS } from '../services/auth.service.js'
import { loginInputSchema } from '../validators/auth.validator.js'

const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: config.isProduction,
  path: '/',
}

export const authController = {
  login(req: Request, res: Response) {
    const { password } = loginInputSchema.parse(req.body)
    const token = authService.login(password, req.ip ?? 'unknown')
    res.cookie(SESSION_COOKIE, token, { ...cookieOptions, maxAge: SESSION_MAX_AGE_MS })
    res.json({ admin: true })
  },

  logout(_req: Request, res: Response) {
    res.clearCookie(SESSION_COOKIE, cookieOptions)
    res.json({ admin: false })
  },

  me(req: Request, res: Response) {
    res.json({ admin: isAdmin(req) })
  },
}
