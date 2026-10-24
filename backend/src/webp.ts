import type { Sharp } from 'sharp'

/** Ancho y calidad inicial de cada versión WebP, con el peso máximo al que se intenta llegar. */
export const WEBP_VARIANTS = [
  { width: 240, quality: 60, maxBytes: 12 * 1024 }, // miniaturas chicas (lista del panel, galería)
  { width: 400, quality: 62, maxBytes: 30 * 1024 }, // tarjetas en celular
  { width: 640, quality: 62, maxBytes: 60 * 1024 }, // tarjetas en pantallas grandes
  { width: 1280, quality: 66, maxBytes: 140 * 1024 }, // foto grande de la ficha
] as const

/** Calidad mínima a la que se baja para cumplir el tope de peso (más abajo la foto se ve demasiado degradada). */
const MIN_QUALITY = 30

/**
 * Redimensiona y codifica a WebP. Si el resultado pesa más que `maxBytes` (fotos con mucho detalle,
 * como hojas o texturas), baja la calidad de a poco hasta cumplir, sin pasar de un mínimo aceptable.
 */
export async function encodeWebp(image: Sharp, width: number, quality: number, maxBytes: number): Promise<Buffer> {
  let q = quality
  let out = await image.clone().resize({ width, withoutEnlargement: true }).webp({ quality: q, effort: 6, smartSubsample: true }).toBuffer()
  while (out.length > maxBytes && q > MIN_QUALITY) {
    q -= 6
    out = await image.clone().resize({ width, withoutEnlargement: true }).webp({ quality: q, effort: 6, smartSubsample: true }).toBuffer()
  }
  return out
}
