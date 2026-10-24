import { useState, type ImgHTMLAttributes } from 'react'
import { assetUrl, imageVariant, type ImageSize } from '@/lib/api'

interface PhotoProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  /** Ruta de la foto original (JPG). */
  src: string
  /** Ancho de la versión WebP a pedir (la más chica que se ve bien en ese lugar). */
  size: ImageSize
  /**
   * Otros anchos disponibles: con `sizes` el navegador elige el que mejor se ajusta a la pantalla
   * (por ejemplo, 400 en celular y 640 en escritorio).
   */
  widths?: ImageSize[]
  /** Para las imágenes que se ven al abrir la página: se piden primero y no se cargan en diferido. */
  priority?: boolean
}

/** Foto liviana: pide la versión WebP del tamaño justo y, si no existe, usa la original. */
export function Photo({ src, size, widths, priority = false, alt = '', ...rest }: PhotoProps) {
  const [useOriginal, setUseOriginal] = useState(false)
  const srcSet =
    !useOriginal && widths ? widths.map((w) => `${imageVariant(src, w)} ${w}w`).join(', ') : undefined

  return (
    <img
      src={useOriginal ? assetUrl(src) : imageVariant(src, size)}
      srcSet={srcSet}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      onError={() => setUseOriginal(true)}
      {...rest}
    />
  )
}
