import { useRef, useState } from 'react'
import { Photo } from '@/components/ui/Photo'
import { api } from '@/lib/api'
import { ErrorNotice } from './fields'

interface ImageManagerProps {
  images: string[]
  onChange: (images: string[]) => void
  /** Marca la primera foto como "Principal" (vehículos). */
  showMain?: boolean
  max?: number
}

const iconBtn =
  'flex h-8 w-8 items-center justify-center rounded-md bg-ink-deep/80 text-sm text-white backdrop-blur transition-colors hover:bg-brand-500 hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-ink-deep/80 disabled:hover:text-white'

export function ImageManager({ images, onChange, showMain = false, max = 20 }: ImageManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<unknown>(null)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setError(null)
    setUploading(true)
    try {
      const urls = await api.admin.uploadImages(Array.from(files).slice(0, max - images.length))
      onChange([...images, ...urls])
    } catch (err) {
      setError(err)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const move = (from: number, to: number) => {
    const next = [...images]
    next.splice(to, 0, next.splice(from, 1)[0])
    onChange(next)
  }

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {images.map((src, i) => (
            <li key={src} className="group relative overflow-hidden rounded-lg border border-line bg-ink">
              <Photo
                src={src}
                size={400}
                widths={[240, 400]}
                sizes="(min-width: 1280px) 15vw, (min-width: 1024px) 20vw, (min-width: 640px) 28vw, 45vw"
                alt={`Foto ${i + 1}`}
                className="aspect-[4/3] w-full object-cover"
              />
              {showMain && i === 0 && (
                <span className="absolute left-2 top-2 rounded-full bg-brand-500 px-2.5 py-0.5 text-xs font-bold uppercase text-ink">
                  Principal
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/70 to-transparent p-2">
                <div className="flex gap-1">
                  <button type="button" className={iconBtn} aria-label="Mover a la izquierda" disabled={i === 0} onClick={() => move(i, i - 1)}>
                    ‹
                  </button>
                  <button type="button" className={iconBtn} aria-label="Mover a la derecha" disabled={i === images.length - 1} onClick={() => move(i, i + 1)}>
                    ›
                  </button>
                  {showMain && i > 0 && (
                    <button type="button" className={iconBtn} aria-label="Usar como foto principal" title="Usar como principal" onClick={() => move(i, 0)}>
                      ★
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  className={`${iconBtn} hover:!bg-red-500`}
                  aria-label="Quitar foto"
                  onClick={() => onChange(images.filter((_, idx) => idx !== i))}
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          hidden
          onChange={(e) => void handleFiles(e.target.files)}
        />
        <button
          type="button"
          disabled={uploading || images.length >= max}
          onClick={() => inputRef.current?.click()}
          className="rounded-md border border-dashed border-brand-500/60 px-4 py-2.5 text-sm font-semibold text-brand-400 transition-colors hover:bg-brand-500/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? 'Subiendo…' : '+ Subir fotos'}
        </button>
        <span className="text-xs text-zinc-400">
          JPG, PNG o WebP. Se optimizan solas. {images.length}/{max}
          {showMain && ' · La primera foto es la que se ve en el catálogo.'}
        </span>
      </div>
      <ErrorNotice error={error} />
    </div>
  )
}
