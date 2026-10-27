import type { SiteSettings } from '../models/site.model.js'
import type { Vehicle } from '../models/vehicle.model.js'
import { clientPhotoService } from './client-photo.service.js'
import { imageSizes, type ImageSize } from './image-size.service.js'
import { settingsService } from './settings.service.js'
import { vehicleService } from './vehicle.service.js'

export interface SiteSnapshot {
  vehicles: Vehicle[]
  clients: string[]
  settings: SiteSettings
  clientSizes: Record<string, ImageSize>
}

export const siteService = {
  /** Todo lo que necesita el sitio público para mostrarse, en un solo pedido. */
  async snapshot(): Promise<SiteSnapshot> {
    const [vehicles, clients, settings] = await Promise.all([
      vehicleService.list({}),
      clientPhotoService.list(),
      settingsService.get(),
    ])
    // Tamaño de las fotos de clientes: el frontend reserva su lugar y la página no se reacomoda al cargarlas.
    return { vehicles, clients, settings, clientSizes: await imageSizes(clients) }
  },
}
