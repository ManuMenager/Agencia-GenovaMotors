import { useState } from 'react'
import { DataGate } from '@/components/ui/DataGate'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { VehicleFiltersPanel } from '@/components/vehicles/VehicleFiltersPanel'
import { VehicleGrid } from '@/components/vehicles/VehicleGrid'
import { useSiteData } from '@/context/SiteDataContext'
import { useVehicleFilters } from '@/hooks/useVehicleFilters'
import type { SortKey } from '@/hooks/useVehicleFilters'

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'default', label: 'Destacados' },
  { value: 'price', label: 'Precio' },
  { value: 'year', label: 'Año' },
  { value: 'mileage', label: 'Kilometraje' },
]

const control =
  'rounded-md border border-line bg-panel px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none'

export default function VehiclesPage() {
  return (
    <DataGate>
      <VehiclesContent />
    </DataGate>
  )
}

function VehiclesContent() {
  const { vehicles } = useSiteData()
  const { filters, setFilter, reset, filtered, brands, bounds, activeCount } =
    useVehicleFilters(vehicles)
  const [showFilters, setShowFilters] = useState(false)

  const sortable = filters.sortBy !== 'default'

  return (
    <div className="px-3 py-8 sm:px-8 sm:py-16 lg:px-16">
      <SectionTitle as="h1">Vehículos</SectionTitle>

      <div className="grid items-start gap-5 sm:gap-8 lg:grid-cols-[19rem_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
          <button
            type="button"
            aria-expanded={showFilters}
            onClick={() => setShowFilters((s) => !s)}
            className={`${control} flex w-full items-center justify-between font-semibold lg:hidden`}
          >
            <span>Filtros{activeCount > 0 ? ` (${activeCount})` : ''}</span>
            <span aria-hidden="true">{showFilters ? '▲' : '▼'}</span>
          </button>
          <div className={`${showFilters ? 'mt-3 block' : 'hidden'} lg:mt-0 lg:block`}>
            <VehicleFiltersPanel
              filters={filters}
              onChange={setFilter}
              onReset={reset}
              brands={brands}
              bounds={bounds}
              activeCount={activeCount}
              resultCount={filtered.length}
              onClose={() => {
                setShowFilters(false)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          </div>
        </aside>

        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-6">
            <p className="text-sm text-zinc-400">
              <span className="font-bold text-white">{filtered.length}</span>{' '}
              {filtered.length === 1 ? 'vehículo' : 'vehículos'}
            </p>

            <div className="flex w-full items-center gap-2 sm:w-auto">
              <label htmlFor="sort-by" className="hidden text-sm text-zinc-400 sm:inline">
                Ordenar por
              </label>
              <select
                id="sort-by"
                value={filters.sortBy}
                onChange={(e) => setFilter('sortBy', e.target.value as SortKey)}
                className={`${control} min-w-0 flex-1 sm:flex-none`}
                aria-label="Ordenar por"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={!sortable}
                onClick={() => setFilter('sortDir', filters.sortDir === 'asc' ? 'desc' : 'asc')}
                aria-label={
                  filters.sortDir === 'asc'
                    ? 'Orden ascendente, cambiar a descendente'
                    : 'Orden descendente, cambiar a ascendente'
                }
                className={`${control} min-w-0 flex-1 font-semibold sm:min-w-32 sm:flex-none transition-colors enabled:hover:border-brand-500 enabled:hover:text-brand-400 disabled:cursor-not-allowed disabled:opacity-40`}
              >
                {filters.sortDir === 'asc' ? '↑ Ascendente' : '↓ Descendente'}
              </button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-line bg-panel py-16 text-center">
              <p className="text-zinc-300">No encontramos vehículos con esos filtros.</p>
              <button
                type="button"
                onClick={reset}
                className="mt-4 text-sm font-semibold uppercase tracking-wide text-brand-400 hover:text-brand-500"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <VehicleGrid vehicles={filtered} priorityCount={4} columns="grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" />
          )}
        </section>
      </div>
    </div>
  )
}
