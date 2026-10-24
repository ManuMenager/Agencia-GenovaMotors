import type { ReactNode } from 'react'
import { useSiteData } from '@/context/SiteDataContext'
import { Button } from './Button'

/** Muestra su contenido solo cuando los datos del sitio ya llegaron de la API (con estados de carga y error). */
export function DataGate({ children }: { children: ReactNode }) {
  const { status, reload } = useSiteData()

  // Los estados de carga y error ocupan al menos una pantalla (min-h-screen): así el pie de página queda
  // fuera de la vista y no "salta" hacia abajo cuando llegan los datos (evita el desplazamiento de diseño).
  if (status === 'loading') {
    return (
      <p role="status" className="flex min-h-screen items-center justify-center text-zinc-400">
        Cargando…
      </p>
    )
  }
  if (status === 'error') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <p className="text-lg text-white">No pudimos cargar la información.</p>
        <p className="mt-2 text-sm text-zinc-400">Revisá tu conexión e intentá de nuevo.</p>
        <Button className="mt-6" onClick={() => void reload()}>
          Reintentar
        </Button>
      </div>
    )
  }
  return <>{children}</>
}
