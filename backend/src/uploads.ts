import { randomBytes } from 'node:crypto'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import multer from 'multer'
import sharp from 'sharp'
import { config } from './config.js'
import { encodeWebp, WEBP_VARIANTS } from './webp.js'

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024, files: 12 },
  fileFilter: (_req, file, cb) => cb(null, /^image\/(jpeg|png|webp)$/.test(file.mimetype)),
})

/**
 * Procesa una foto subida y devuelve la URL pública de la versión principal (JPEG de hasta 1600 px).
 * Además guarda versiones WebP livianas junto a ella (`nombre-240.webp`, `-400`, `-640` y `-1280`), que el
 * sitio elige según dónde se muestre la foto (miniatura, tarjeta o ficha) para cargar más rápido.
 */
export async function saveImage(buffer: Buffer): Promise<string> {
  await fs.mkdir(config.uploadsDir, { recursive: true })
  const base = `${Date.now()}-${randomBytes(6).toString('hex')}`
  const image = sharp(buffer).rotate()

  await Promise.all([
    image
      .clone()
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(path.join(config.uploadsDir, `${base}.jpg`)),
    ...WEBP_VARIANTS.map(async ({ width, quality, maxBytes }) => {
      const data = await encodeWebp(image, width, quality, maxBytes)
      await fs.writeFile(path.join(config.uploadsDir, `${base}-${width}.webp`), data)
    }),
  ])
  return `/uploads/${base}.jpg`
}

/** Borra del disco las fotos subidas que dejaron de usarse, con sus versiones WebP (las de /images no se tocan). */
export async function removeUploads(urls: string[]): Promise<void> {
  const files = urls
    .filter((u) => u.startsWith('/uploads/'))
    .flatMap((u) => {
      const name = path.basename(u)
      const stem = name.replace(/\.jpg$/i, '')
      return [name, ...WEBP_VARIANTS.map(({ width }) => `${stem}-${width}.webp`)]
    })
  await Promise.all(files.map((f) => fs.rm(path.join(config.uploadsDir, f), { force: true })))
}
