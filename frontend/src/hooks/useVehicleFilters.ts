import { useCallback, useMemo, useState } from 'react'
import type { Transmission, Vehicle, VehicleCondition } from '@/types/vehicle'

export type SortKey = 'default' | 'price' | 'year' | 'mileage'
export type SortDir = 'asc' | 'desc'

export interface VehicleFilters {
  search: string
  /** Vacío = todas las marcas. */
  brand: string
  condition: VehicleCondition | ''
  transmission: Transmission | ''
  // Los rangos se guardan como texto para poder dejar los campos vacíos.
  priceMin: string
  priceMax: string
  yearMin: string
  yearMax: string
  mileageMin: string
  mileageMax: string
  sortBy: SortKey
  sortDir: SortDir
}

export const defaultFilters: VehicleFilters = {
  search: '',
  brand: '',
  condition: '',
  transmission: '',
  priceMin: '',
  priceMax: '',
  yearMin: '',
  yearMax: '',
  mileageMin: '',
  mileageMax: '',
  sortBy: 'default',
  sortDir: 'asc',
}

/** Convierte el texto de un campo numérico: vacío o inválido = sin límite. */
function toNumber(value: string): number | null {
  if (value.trim() === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function inRange(value: number, min: string, max: string): boolean {
  const lo = toNumber(min)
  const hi = toNumber(max)
  if (lo !== null && value < lo) return false
  if (hi !== null && value > hi) return false
  return true
}

export function useVehicleFilters(vehicles: Vehicle[]) {
  const [filters, setFilters] = useState<VehicleFilters>(defaultFilters)

  const setFilter = useCallback(
    <K extends keyof VehicleFilters>(key: K, value: VehicleFilters[K]) =>
      setFilters((f) => ({ ...f, [key]: value })),
    [],
  )
  const reset = useCallback(() => setFilters((f) => ({ ...defaultFilters, sortBy: f.sortBy, sortDir: f.sortDir })), [])

  const brands = useMemo(
    () => [...new Set(vehicles.map((v) => v.brand))].sort((a, b) => a.localeCompare(b, 'es')),
    [vehicles],
  )

  // Mínimos y máximos reales del catálogo, para mostrarlos como ayuda en los campos.
  const bounds = useMemo(() => {
    const range = (pick: (v: Vehicle) => number) => {
      const values = vehicles.map(pick)
      return { min: Math.min(...values), max: Math.max(...values) }
    }
    return { price: range((v) => v.price), year: range((v) => v.year), mileage: range((v) => v.mileage) }
  }, [vehicles])

  const filtered = useMemo(() => {
    const term = filters.search.trim().toLowerCase()
    const result = vehicles.filter((v) => {
      if (filters.brand && v.brand !== filters.brand) return false
      if (filters.condition && v.condition !== filters.condition) return false
      if (filters.transmission && v.transmission !== filters.transmission) return false
      if (!inRange(v.price, filters.priceMin, filters.priceMax)) return false
      if (!inRange(v.year, filters.yearMin, filters.yearMax)) return false
      if (!inRange(v.mileage, filters.mileageMin, filters.mileageMax)) return false
      if (term && !`${v.brand} ${v.model} ${v.version}`.toLowerCase().includes(term)) return false
      return true
    })

    if (filters.sortBy === 'default') return result
    const key = filters.sortBy
    const dir = filters.sortDir === 'asc' ? 1 : -1
    return [...result].sort((a, b) => (a[key] - b[key]) * dir)
  }, [vehicles, filters])

  // Cantidad de filtros aplicados (un rango min–max cuenta como uno). El orden no cuenta.
  const activeCount = [
    filters.search.trim() !== '',
    filters.brand !== '',
    filters.condition !== '',
    filters.transmission !== '',
    filters.priceMin !== '' || filters.priceMax !== '',
    filters.yearMin !== '' || filters.yearMax !== '',
    filters.mileageMin !== '' || filters.mileageMax !== '',
  ].filter(Boolean).length

  return { filters, setFilter, reset, filtered, brands, bounds, activeCount }
}
