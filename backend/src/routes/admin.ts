import { Router, type Response } from 'express'
import type { ZodType } from 'zod'
import {
  clearLoginAttempts,
  endSession,
  isAdmin,
  loginBlocked,
  passwordMatches,
  registerFailedLogin,
  requireAdmin,
  startSession,
} from '../auth.js'
import { config } from '../config.js'
import { clientsInput, loginInput, settingsInput, vehicleInput } from '../schemas.js'
import { mutateDb } from '../store.js'
import type { Db } from '../types/site.js'
import { removeUploads, saveImage, upload } from '../uploads.js'

export const adminRouter = Router()

/** Valida el cuerpo; si es inválido responde 400 con el detalle y devuelve null. */
function parse<T>(schema: ZodType<T>, body: unknown, res: Response): T | null {
  const result = schema.safeParse(body)
  if (result.success) return result.data
  res.status(400).json({
    error: 'Datos inválidos',
    details: result.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
  })
  return null
}

const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/** Todas las fotos que hoy usa el sitio (vehículos y clientes). */
const usedImages = (db: Db) => new Set([...db.vehicles.flatMap((v) => v.images), ...db.clients])

// ---------- Sesión ----------

adminRouter.post('/login', (req, res) => {
  const ip = req.ip ?? 'unknown'
  if (!config.adminPassword) {
    res.status(503).json({ error: 'El acceso al panel no está configurado en el servidor.' })
    return
  }
  if (loginBlocked(ip)) {
    res.status(429).json({ error: 'Demasiados intentos. Probá de nuevo en unos minutos.' })
    return
  }
  const body = parse(loginInput, req.body, res)
  if (!body) return

  if (!passwordMatches(body.password)) {
    registerFailedLogin(ip)
    res.status(401).json({ error: 'Contraseña incorrecta' })
    return
  }
  clearLoginAttempts(ip)
  startSession(res)
  res.json({ admin: true })
})

adminRouter.post('/logout', (_req, res) => {
  endSession(res)
  res.json({ admin: false })
})

adminRouter.get('/me', (req, res) => {
  res.json({ admin: isAdmin(req) })
})

// Todo lo que sigue exige sesión de administrador.
adminRouter.use(requireAdmin)

// ---------- Vehículos ----------

adminRouter.post('/vehicles', async (req, res) => {
  const data = parse(vehicleInput, req.body, res)
  if (!data) return

  const vehicle = await mutateDb((db) => {
    const base = slugify(`${data.brand}-${data.model}-${data.year}`)
    let id = base
    for (let n = 2; db.vehicles.some((v) => v.id === id); n++) id = `${base}-${n}`
    const created = { id, ...data }
    db.vehicles.push(created)
    return created
  })
  res.status(201).json(vehicle)
})

adminRouter.put('/vehicles/:id', async (req, res) => {
  const data = parse(vehicleInput, req.body, res)
  if (!data) return

  const result = await mutateDb((db) => {
    const index = db.vehicles.findIndex((v) => v.id === req.params.id)
    if (index === -1) return null
    const previous = db.vehicles[index].images
    const updated = { id: db.vehicles[index].id, ...data }
    db.vehicles[index] = updated
    const used = usedImages(db)
    return { updated, orphaned: previous.filter((u) => !used.has(u)) }
  })

  if (!result) {
    res.status(404).json({ error: 'Vehículo no encontrado' })
    return
  }
  await removeUploads(result.orphaned)
  res.json(result.updated)
})

adminRouter.delete('/vehicles/:id', async (req, res) => {
  const orphaned = await mutateDb((db) => {
    const index = db.vehicles.findIndex((v) => v.id === req.params.id)
    if (index === -1) return null
    const [removed] = db.vehicles.splice(index, 1)
    const used = usedImages(db)
    return removed.images.filter((u) => !used.has(u))
  })

  if (!orphaned) {
    res.status(404).json({ error: 'Vehículo no encontrado' })
    return
  }
  await removeUploads(orphaned)
  res.status(204).end()
})

// ---------- Fotos de clientes ----------

adminRouter.put('/clients', async (req, res) => {
  const data = parse(clientsInput, req.body, res)
  if (!data) return

  const orphaned = await mutateDb((db) => {
    const previous = db.clients
    db.clients = data.photos
    const used = usedImages(db)
    return previous.filter((u) => !used.has(u))
  })
  await removeUploads(orphaned)
  res.json(data.photos)
})

// ---------- Datos del sitio ----------

adminRouter.put('/settings', async (req, res) => {
  const data = parse(settingsInput, req.body, res)
  if (!data) return

  await mutateDb((db) => {
    db.settings = data
  })
  res.json(data)
})

// ---------- Subida de imágenes ----------

adminRouter.post('/uploads', upload.array('files', 12), async (req, res) => {
  const files = (req.files as Express.Multer.File[] | undefined) ?? []
  if (files.length === 0) {
    res.status(400).json({ error: 'No se recibieron imágenes válidas (JPG, PNG o WebP).' })
    return
  }
  try {
    const urls = await Promise.all(files.map((f) => saveImage(f.buffer)))
    res.status(201).json({ urls })
  } catch {
    res.status(400).json({ error: 'Una de las imágenes no se pudo procesar. Probá con otra.' })
  }
})
