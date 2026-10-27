export const VEHICLE_CONDITIONS = ['nuevo', 'usado'] as const
export const FUEL_TYPES = ['nafta', 'diesel', 'hibrido', 'electrico', 'gnc'] as const
export const TRANSMISSIONS = ['manual', 'automatica'] as const
export const CURRENCIES = ['USD', 'ARS'] as const

export type VehicleCondition = (typeof VEHICLE_CONDITIONS)[number]
export type FuelType = (typeof FUEL_TYPES)[number]
export type Transmission = (typeof TRANSMISSIONS)[number]
export type Currency = (typeof CURRENCIES)[number]

/** Datos de un vehículo que carga el dueño (todo menos el `id`). */
export interface VehicleInput {
  brand: string
  model: string
  version: string
  year: number
  price: number
  currency: Currency
  condition: VehicleCondition
  mileage: number
  fuel: FuelType
  transmission: Transmission
  color: string
  description: string
  featured: boolean
  /** Fotos del vehículo: la primera es la principal. */
  images: string[]
}

export interface Vehicle extends VehicleInput {
  id: string
}

export interface VehicleFilters {
  condition?: VehicleCondition
  featured?: boolean
  search?: string
}
