// Genera versiones WebP livianas de las fotos estáticas del frontend (public/images):
//   foto.jpg  ->  foto-240.webp  (miniaturas chicas: lista del panel, galería de la ficha)
//                 foto-400.webp  (tarjetas en celular)
//                 foto-640.webp  (tarjetas en pantallas grandes)
//                 foto-1280.webp (foto grande de la ficha)
//   hero.jpg  ->  hero-800.webp y hero-1600.webp (imagen principal del inicio)
//   logo-header.png -> logo-header-256.webp, -384.webp y .webp (523 px)
// Las fotos que sube el dueño desde el panel se procesan igual al subirlas (ver src/uploads.ts).
//
// Uso (desde backend/):  npm run variants
import { promises as fs } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..', '..', 'frontend', 'public', 'images')

// ancho, calidad inicial y peso máximo al que se intenta llegar (misma configuración que las fotos subidas)
const PHOTO_VARIANTS = [
  [240, 60, 12 * 1024],
  [400, 62, 30 * 1024],
  [640, 62, 60 * 1024],
  [1280, 66, 140 * 1024],
]

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)])),
  )
  return files.flat()
}

/** Genera una versión WebP; si pesa más que `maxBytes`, baja la calidad de a poco (mínimo 30, igual que src/webp.ts). */
async function variant(file, width, suffix, quality, maxBytes = Infinity) {
  const out = file.replace(/\.jpg$/i, `-${suffix}.webp`)
  const image = sharp(file).rotate()
  let q = quality
  let data
  do {
    data = await image.clone().resize({ width, withoutEnlargement: true }).webp({ quality: q, effort: 6, smartSubsample: true }).toBuffer()
    q -= 6
  } while (data.length > maxBytes && q >= 30)
  await fs.writeFile(out, data)
  return data.length
}

const all = await walk(root)
const sources = all.filter((f) => /\.jpg$/i.test(f) && !/logo/i.test(path.basename(f)))
let before = 0
let after = 0

for (const file of sources) {
  before += (await fs.stat(file)).size
  if (path.basename(file) === 'hero.jpg') {
    // El hero se muestra con una capa oscura encima, así que tolera más compresión.
    after += await variant(file, 800, '800', 58)
    after += await variant(file, 1600, '1600', 50)
  } else {
    for (const [width, quality, maxBytes] of PHOTO_VARIANTS) {
      after += await variant(file, width, String(width), quality, maxBytes)
    }
  }
}

// Logo del header: se muestra entre 128 y 344 px de ancho; el original tiene 523 px.
const logo = path.join(root, 'logo-header.png')
for (const width of [256, 384, 523]) {
  const out = path.join(root, width === 523 ? 'logo-header.webp' : `logo-header-${width}.webp`)
  await sharp(logo).resize({ width, withoutEnlargement: true }).webp({ quality: 66, alphaQuality: 80, effort: 6 }).toFile(out)
  after += (await fs.stat(out)).size
}

const mb = (n) => (n / 1024 / 1024).toFixed(1)
console.log(`${sources.length} fotos procesadas. Originales: ${mb(before)} MB | variantes WebP generadas: ${mb(after)} MB`)
