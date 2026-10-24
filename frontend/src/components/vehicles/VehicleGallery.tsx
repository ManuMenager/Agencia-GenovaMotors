import { useState } from 'react'
import { Photo } from '@/components/ui/Photo'

interface VehicleGalleryProps {
  images: string[]
  alt: string
}

const arrow =
  'absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink-deep/70 text-xl text-white backdrop-blur transition-colors hover:bg-brand-500 hover:text-ink focus-visible:outline-2 focus-visible:outline-brand-500'

export function VehicleGallery({ images, alt }: VehicleGalleryProps) {
  const [index, setIndex] = useState(0)
  const total = images.length

  if (total === 0) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center rounded-xl border border-line bg-surface text-zinc-400">
        Sin fotos
      </div>
    )
  }

  const go = (step: number) => setIndex((i) => (i + step + total) % total)

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line bg-surface">
        {/* Es la imagen principal de la ficha: se pide primero, sin carga diferida. */}
        <Photo
          key={images[index]}
          src={images[index]}
          size={1280}
          priority
          alt={`${alt}, foto ${index + 1} de ${total}`}
          className="h-full w-full object-contain"
        />
        {total > 1 && (
          <>
            <button type="button" aria-label="Foto anterior" onClick={() => go(-1)} className={`${arrow} left-3`}>
              ‹
            </button>
            <button type="button" aria-label="Foto siguiente" onClick={() => go(1)} className={`${arrow} right-3`}>
              ›
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-ink-deep/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              {index + 1} / {total}
            </span>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={`aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-colors sm:w-28 ${
                i === index ? 'border-brand-500' : 'border-line opacity-70 hover:opacity-100'
              }`}
            >
              <Photo src={src} size={240} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
