import { Link } from 'react-router-dom'
import type { Vehicle } from '@/types/vehicle'
import { Photo } from '@/components/ui/Photo'
import { formatMileage, formatPrice } from '@/lib/format'

export function VehicleCard({ vehicle, priority = false }: { vehicle: Vehicle; priority?: boolean }) {
  const { id, brand, model, version, year, price, currency, condition, mileage, images } = vehicle
  const mainImage = images[0]

  return (
    <Link
      to={`/vehiculos/${id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-line bg-panel transition hover:border-brand-500/60 hover:shadow-lg hover:shadow-brand-500/5 sm:rounded-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        {mainImage ? (
          <Photo
            src={mainImage}
            size={400}
            widths={[400, 640]}
            sizes="(min-width: 1536px) 22vw, (min-width: 1024px) 28vw, (min-width: 768px) 31vw, 48vw"
            priority={priority}
            alt={`${brand} ${model}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">Sin foto</div>
        )}
        <span className="absolute left-1.5 top-1.5 rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold uppercase text-ink sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-xs">
          {condition}
        </span>
        {images.length > 1 && (
          <span className="absolute bottom-1.5 right-1.5 rounded-full bg-ink-deep/70 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur sm:bottom-3 sm:right-3 sm:px-3 sm:py-1 sm:text-xs">
            <span className="sm:hidden">{images.length}</span>
            <span className="hidden sm:inline">{images.length} fotos</span>
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-2.5 sm:p-5">
        <h3 className="truncate text-sm font-bold text-white group-hover:text-brand-400 sm:text-base">
          {brand} {model}
        </h3>
        <p className="truncate text-xs text-zinc-400 sm:text-sm">{version}</p>
        <p className="mt-1 text-xs text-zinc-400 sm:mt-2 sm:text-sm">
          {year} · {formatMileage(mileage)}
        </p>
        <p className="mt-auto pt-1.5 text-sm font-extrabold text-brand-400 sm:pt-3 sm:text-lg">
          {formatPrice(price, currency)}
        </p>
      </div>
    </Link>
  )
}
