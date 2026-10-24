/** Datos del sitio que el dueño edita desde el panel. */
export interface SiteSettings {
  address: string
  /** Número internacional sin signos ni espacios, ej. 5491123456789. */
  whatsapp: string
  email: string
  /** Una línea por franja horaria. */
  hours: string[]
}
