import type { ReactNode } from 'react'
import type { VehicleFilters } from '@/hooks/useVehicleFilters'

interface Bounds {
  price: { min: number; max: number }
  year: { min: number; max: number }
  mileage: { min: number; max: number }
}

interface VehicleFiltersPanelProps {
  filters: VehicleFilters
  onChange: <K extends keyof VehicleFilters>(key: K, value: VehicleFilters[K]) => void
  onReset: () => void
  brands: string[]
  bounds: Bounds
  activeCount: number
  /** Cantidad de resultados con los filtros actuales. */
  resultCount: number
  /** En celular, cierra el panel y vuelve a los resultados. */
  onClose?: () => void
}

const field =
  'w-full rounded-md border border-line bg-ink px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-brand-500 focus:outline-none'

const fmt = (n: number) => new Intl.NumberFormat('es-AR').format(n)

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">{label}</p>
      {children}
    </div>
  )
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <div className="grid grid-flow-col auto-cols-fr gap-1 rounded-md border border-line bg-ink p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={`whitespace-nowrap rounded px-1.5 py-1.5 text-[13px] font-medium transition-colors ${
            value === o.value ? 'bg-brand-500 text-ink' : 'text-zinc-300 hover:text-white'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function RangeField({
  label,
  min,
  max,
  onMin,
  onMax,
  bounds,
  format = fmt,
}: {
  label: string
  min: string
  max: string
  onMin: (v: string) => void
  onMax: (v: string) => void
  bounds: { min: number; max: number }
  format?: (n: number) => string
}) {
  const invalid = min !== '' && max !== '' && Number(min) > Number(max)
  return (
    <Group label={label}>
      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={min}
          onChange={(e) => onMin(e.target.value)}
          placeholder={`Mín. ${format(bounds.min)}`}
          aria-label={`${label}, mínimo`}
          className={field}
        />
        <span className="text-zinc-400" aria-hidden="true">
          –
        </span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={max}
          onChange={(e) => onMax(e.target.value)}
          placeholder={`Máx. ${format(bounds.max)}`}
          aria-label={`${label}, máximo`}
          className={field}
        />
      </div>
      {invalid && <p className="mt-1 text-xs text-brand-400">El mínimo es mayor que el máximo.</p>}
    </Group>
  )
}

export function VehicleFiltersPanel({
  filters,
  onChange,
  onReset,
  brands,
  bounds,
  activeCount,
  resultCount,
  onClose,
}: VehicleFiltersPanelProps) {
  return (
    <div className="space-y-5 rounded-xl border border-line bg-panel p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-white">Filtros</h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-sm font-semibold text-brand-400 hover:text-brand-500"
          >
            Limpiar ({activeCount})
          </button>
        )}
      </div>

      <Group label="Buscar">
        <input
          type="search"
          value={filters.search}
          onChange={(e) => onChange('search', e.target.value)}
          placeholder="Marca, modelo o versión…"
          className={field}
        />
      </Group>

      <Group label="Marca">
        <select
          aria-label="Marca"
          value={filters.brand}
          onChange={(e) => onChange('brand', e.target.value)}
          className={field}
        >
          <option value="">Todas las marcas</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </Group>

      <Group label="Condición">
        <Segmented
          value={filters.condition}
          onChange={(v) => onChange('condition', v)}
          options={[
            { value: '', label: 'Todos' },
            { value: 'nuevo', label: 'Nuevo' },
            { value: 'usado', label: 'Usado' },
          ]}
        />
      </Group>

      <Group label="Transmisión">
        <Segmented
          value={filters.transmission}
          onChange={(v) => onChange('transmission', v)}
          options={[
            { value: '', label: 'Todas' },
            { value: 'manual', label: 'Manual' },
            { value: 'automatica', label: 'Automática' },
          ]}
        />
      </Group>

      <RangeField
        label="Precio (US$)"
        min={filters.priceMin}
        max={filters.priceMax}
        onMin={(v) => onChange('priceMin', v)}
        onMax={(v) => onChange('priceMax', v)}
        bounds={bounds.price}
      />
      <RangeField
        label="Año"
        min={filters.yearMin}
        max={filters.yearMax}
        onMin={(v) => onChange('yearMin', v)}
        onMax={(v) => onChange('yearMax', v)}
        bounds={bounds.year}
        format={String}
      />
      <RangeField
        label="Kilometraje (km)"
        min={filters.mileageMin}
        max={filters.mileageMax}
        onMin={(v) => onChange('mileageMin', v)}
        onMax={(v) => onChange('mileageMax', v)}
        bounds={bounds.mileage}
      />

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-md bg-brand-500 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-brand-400 lg:hidden"
        >
          Ver {resultCount} {resultCount === 1 ? 'vehículo' : 'vehículos'}
        </button>
      )}
    </div>
  )
}
