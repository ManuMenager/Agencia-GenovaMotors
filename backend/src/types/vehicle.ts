export type VehicleCondition = 'nuevo' | 'usado'
export type FuelType = 'nafta' | 'diesel' | 'hibrido' | 'electrico' | 'gnc'
export type Transmission = 'manual' | 'automatica'

export interface Vehicle {
  id: string
  brand: string
  model: string
  version: string
  year: number
  price: number
  currency: 'USD' | 'ARS'
  condition: VehicleCondition
  mileage: number
  fuel: FuelType
  transmission: Transmission
  color: string
  description: string
  featured?: boolean
  /** Fotos del vehículo: la primera es la principal. */
  images: string[]
}
