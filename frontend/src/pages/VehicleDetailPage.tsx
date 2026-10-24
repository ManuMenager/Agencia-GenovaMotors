import { Link, useParams } from 'react-router-dom'
import { DataGate } from '@/components/ui/DataGate'
import { VehicleGallery } from '@/components/vehicles/VehicleGallery'
import { useSiteData } from '@/context/SiteDataContext'
import { useContact } from '@/hooks/useContact'
import { formatMileage, formatPrice } from '@/lib/format'
import NotFoundPage from './NotFoundPage'

export default function VehicleDetailPage() {
  return (
    <DataGate>
      <VehicleDetail />
    </DataGate>
  )
}

function VehicleDetail() {
  const { id } = useParams()
  const { vehicles } = useSiteData()
  const { whatsappLink } = useContact()
  const vehicle = vehicles.find((v) => v.id === id)

  if (!vehicle) return <NotFoundPage />

  const specs: [string, string][] = [
    ['Año', String(vehicle.year)],
    ['Kilometraje', formatMileage(vehicle.mileage)],
    ['Combustible', vehicle.fuel],
    ['Transmisión', vehicle.transmission],
    ['Color', vehicle.color],
    ['Estado', vehicle.condition],
  ]

  const waLink = whatsappLink(`Hola! Me interesa el ${vehicle.brand} ${vehicle.model} ${vehicle.year}.`)

  return (
    <div className="mx-auto px-4 pt-4 sm:px-8 sm:pt-8 lg:pb-8 lg:max-w-[72rem] lg:px-0 xl:max-w-[81.25rem]">
      <Link
        to="/vehiculos"
        className="inline-flex items-center gap-2 rounded-md border border-line bg-panel px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-brand-500 hover:text-brand-400"
      >
        <span aria-hidden="true">←</span> Volver al catálogo
      </Link>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)] items-start gap-5 sm:mt-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] xl:grid-cols-[minmax(0,1fr)_26rem]">
        <VehicleGallery
          key={vehicle.id}
          images={vehicle.images}
          alt={`${vehicle.brand} ${vehicle.model}`}
        />

        <aside className="rounded-xl border border-line bg-panel p-5 sm:p-6 lg:sticky lg:top-28">
          <span className="inline-block rounded-full bg-brand-500 px-3 py-1 text-xs font-bold uppercase text-ink">
            {vehicle.condition}
          </span>
          <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
            {vehicle.brand} {vehicle.model}
          </h1>
          <p className="text-zinc-400">{vehicle.version}</p>
          <p className="mt-3 text-2xl font-extrabold text-brand-400 sm:mt-4 sm:text-3xl">
            {formatPrice(vehicle.price, vehicle.currency)}
          </p>
          <p className="mt-3 text-sm text-zinc-400">{vehicle.description}</p>

          <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-5">
            {specs.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs uppercase tracking-wide text-zinc-400">{label}</dt>
                <dd className="font-semibold capitalize text-white">{value}</dd>
              </div>
            ))}
          </dl>

          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="mt-6 hidden w-full justify-center rounded-md bg-brand-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-brand-400 lg:flex"
          >
            Consultar por WhatsApp
          </a>
        </aside>
      </div>

      {/* En celular la consulta queda siempre a mano al pie de la pantalla. */}
      <div className="sticky bottom-0 z-30 -mx-4 mt-6 flex items-center gap-3 border-t border-line bg-ink-deep/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8 lg:hidden">
        <div className="min-w-0">
          <p className="truncate text-xs text-zinc-400">
            {vehicle.brand} {vehicle.model}
          </p>
          <p className="font-extrabold text-brand-400">{formatPrice(vehicle.price, vehicle.currency)}</p>
        </div>
        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          className="ml-auto rounded-md bg-brand-500 px-5 py-3 text-center text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-brand-400"
        >
          Consultar
        </a>
      </div>
    </div>
  )
}
