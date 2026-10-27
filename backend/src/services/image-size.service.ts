import path from 'node:path'
import sharp from 'sharp'
import { config } from '../config/index.js'

export interface ImageSize {
  width: number
  height: number
}

// Las fotos estáticas viven en el frontend (public/images); las subidas desde el panel, en uploads/.
const staticRoot = path.resolve(import.meta.dirname, '..', '..', '..', 'frontend', 'public')

// Los archivos no cambian (las subidas tienen nombre único), así que alcanza con leerlos una vez.
const cache = new Map<string, ImageSize | null>()

/** Ruta en disco de una foto, o null si no está dentro de las carpetas permitidas. */
function resolveFile(url: string): string | null {
  const [root, relative] = url.startsWith('/uploads/')
    ? [config.uploadsDir, url.slice('/uploads/'.length)]
    : url.startsWith('/images/')
      ? [path.join(staticRoot, 'images'), url.slice('/images/'.length)]
      : [null, '']
  if (!root) return null
  const file = path.resolve(root, relative)
  // Evita salir de la carpeta con rutas tipo ../../
  return file.startsWith(root + path.sep) ? file : null
}

/** Ancho y alto de una foto (con la orientación EXIF aplicada), para reservar su lugar en la página. */
export async function imageSize(url: string): Promise<ImageSize | null> {
  if (cache.has(url)) return cache.get(url) ?? null

  let size: ImageSize | null = null
  const file = resolveFile(url)
  if (file) {
    try {
      const { width, height, orientation } = await sharp(file).metadata()
      if (width && height) size = orientation && orientation >= 5 ? { width: height, height: width } : { width, height }
    } catch {
      size = null // Si el archivo no está (por ejemplo, frontend desplegado aparte), el sitio usa una proporción por defecto.
    }
  }
  if (size) cache.set(url, size)
  return size
}

export async function imageSizes(urls: string[]): Promise<Record<string, ImageSize>> {
  const entries = await Promise.all(urls.map(async (u) => [u, await imageSize(u)] as const))
  return Object.fromEntries(entries.filter((e): e is [string, ImageSize] => e[1] !== null))
}
