import type { Vehicle } from './vehicle.js'

/** Datos del sitio que el dueño puede modificar desde el panel. */
export interface SiteSettings {
  address: string
  /** Número internacional sin signos ni espacios, ej. 5491123456789. */
  whatsapp: string
  email: string
  /** Una línea por franja horaria. */
  hours: string[]
}

export interface Db {
  vehicles: Vehicle[]
  /** Fotos de la sección Clientes, en orden. */
  clients: string[]
  settings: SiteSettings
}
