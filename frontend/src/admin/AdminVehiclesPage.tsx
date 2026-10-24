import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ButtonLink } from '@/components/ui/Button'
import { useSiteData } from '@/context/SiteDataContext'
import { Photo } from '@/components/ui/Photo'
import { api } from '@/lib/api'
import { formatMileage, formatPrice } from '@/lib/format'
import { ErrorNotice, inputClass } from './fields'

export default function AdminVehiclesPage() {
  const { vehicles, reload } = useSiteData()
  const [search, setSearch] = useState('')
  const [error, setError] = useState<unknown>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const term = search.trim().toLowerCase()
  const list = term
    ? vehicles.filter((v) => `${v.brand} ${v.model} ${v.version} ${v.year}`.toLowerCase().includes(term))
    : vehicles

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return
    setError(null)
    setDeleting(id)
    try {
      await api.admin.deleteVehicle(id)
      await reload()
    } catch (err) {
      setError(err)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Vehículos</h1>
          <p className="text-sm text-zinc-400">{vehicles.length} cargados en el sitio.</p>
        </div>
        <ButtonLink to="/admin/vehiculos/nuevo">+ Nuevo vehículo</ButtonLink>
      </div>

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por marca, modelo o año…"
        aria-label="Buscar vehículo"
        className={`${inputClass} sm:max-w-sm`}
      />

      <ErrorNotice error={error} />

      {list.length === 0 ? (
        <p className="rounded-xl border border-line bg-panel py-12 text-center text-zinc-400">
          No hay vehículos que coincidan.
        </p>
      ) : (
        <ul className="grid gap-3 xl:grid-cols-2">
          {list.map((v, i) => {
            const name = `${v.brand} ${v.model} ${v.version}`
            return (
              <li
                key={v.id}
                className="flex flex-wrap items-center gap-4 rounded-xl border border-line bg-panel p-3 sm:flex-nowrap"
              >
                {v.images[0] ? (
                  <Photo
                    src={v.images[0]}
                    size={240}
                    // Las primeras filas se ven al abrir la pantalla (en escritorio, unas 14 en dos columnas):
                    // su foto no se carga en diferido. El resto sí, para listas largas.
                    priority={i < 14}
                    width={96}
                    height={64}
                    className="h-16 w-24 shrink-0 rounded-md bg-ink object-cover"
                  />
                ) : (
                  <div className="h-16 w-24 shrink-0 rounded-md bg-ink" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">
                    {v.brand} {v.model} <span className="font-normal text-zinc-400">{v.version}</span>
                  </p>
                  <p className="text-sm text-zinc-400">
                    {v.year} · {formatMileage(v.mileage)} ·{' '}
                    <span className="font-semibold text-brand-400">{formatPrice(v.price, v.currency)}</span>
                  </p>
                  <p className="mt-1 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-ink px-2 py-0.5 capitalize text-zinc-300">{v.condition}</span>
                    {v.featured && <span className="rounded-full bg-brand-500 px-2 py-0.5 font-bold text-ink">Destacado</span>}
                    <span className="text-zinc-400">{v.images.length} fotos</span>
                  </p>
                </div>
                <div className="grid w-full shrink-0 grid-cols-2 gap-2 sm:flex sm:w-auto">
                  <Link
                    to={`/admin/vehiculos/${v.id}`}
                    className="rounded-md border border-line px-3 py-2 text-center text-sm font-semibold text-white hover:border-brand-500 hover:text-brand-400"
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    disabled={deleting === v.id}
                    onClick={() => void handleDelete(v.id, name)}
                    className="rounded-md border border-line px-3 py-2 text-sm font-semibold text-red-300 hover:border-red-500 disabled:opacity-50"
                  >
                    {deleting === v.id ? 'Eliminando…' : 'Eliminar'}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
