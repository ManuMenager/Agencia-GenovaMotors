import type { Vehicle } from '@/types/vehicle'
import { VehicleCard } from './VehicleCard'

interface VehicleGridProps {
  vehicles: Vehicle[]
  /** Clases de Tailwind con las columnas de la grilla. */
  columns?: string
  emptyMessage?: string
  /** Cuántas tarjetas del principio se ven al abrir la página (sus fotos no se cargan en diferido). */
  priorityCount?: number
}

export function VehicleGrid({
  vehicles,
  priorityCount = 0,
  columns = 'grid-cols-2 md:grid-cols-3 2xl:grid-cols-4',
  emptyMessage = 'No encontramos vehículos con esos filtros.',
}: VehicleGridProps) {
  if (vehicles.length === 0) {
    return <p className="py-12 text-center text-zinc-400">{emptyMessage}</p>
  }

  return (
    <div className={`grid gap-3 sm:gap-6 ${columns}`}>
      {vehicles.map((v, i) => (
        <VehicleCard key={v.id} vehicle={v} priority={i < priorityCount} />
      ))}
    </div>
  )
}
