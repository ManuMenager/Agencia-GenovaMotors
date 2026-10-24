import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, type ImageDimensions, type SiteSnapshot } from '@/lib/api'
import type { SiteSettings } from '@/types/site'
import type { Vehicle } from '@/types/vehicle'

type Status = 'loading' | 'ready' | 'error'

interface SiteData {
  vehicles: Vehicle[]
  clients: string[]
  clientSizes: Record<string, ImageDimensions>
  settings: SiteSettings | null
  status: Status
  /** Vuelve a pedir todo a la API (se usa tras guardar cambios en el panel). */
  reload: () => Promise<void>
}

const SiteDataContext = createContext<SiteData | null>(null)

// El pedido a la API arranca apenas se carga este módulo, sin esperar a que React monte la página.
let firstLoad: Promise<SiteSnapshot> | null = api.site()
firstLoad.catch(() => undefined)

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [clients, setClients] = useState<string[]>([])
  const [clientSizes, setClientSizes] = useState<Record<string, ImageDimensions>>({})
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [status, setStatus] = useState<Status>('loading')

  const reload = useCallback(async () => {
    try {
      const pending = firstLoad ?? api.site()
      firstLoad = null
      const snapshot = await pending
      setVehicles(snapshot.vehicles)
      setClients(snapshot.clients)
      setClientSizes(snapshot.clientSizes ?? {})
      setSettings(snapshot.settings)
      setStatus('ready')
    } catch {
      setStatus((prev) => (prev === 'ready' ? prev : 'error'))
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos remotos
    void reload()
  }, [reload])

  const value = useMemo(
    () => ({ vehicles, clients, clientSizes, settings, status, reload }),
    [vehicles, clients, clientSizes, settings, status, reload],
  )
  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSiteData(): SiteData {
  const ctx = useContext(SiteDataContext)
  if (!ctx) throw new Error('useSiteData debe usarse dentro de SiteDataProvider')
  return ctx
}
