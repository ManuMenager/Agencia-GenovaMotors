import { useSiteData } from '@/context/SiteDataContext'
import { defaultSettings, formatPhone, mapsUrl, whatsappLink } from '@/lib/contact'

/** Datos de contacto del sitio (los edita el dueño desde el panel) con sus enlaces ya armados. */
export function useContact() {
  const { settings } = useSiteData()
  const s = settings ?? defaultSettings

  return {
    /** false mientras los datos reales todavía no llegaron (hasta entonces se usan valores por defecto). */
    ready: settings !== null,
    email: s.email,
    address: s.address,
    hours: s.hours,
    whatsappDisplay: formatPhone(s.whatsapp),
    whatsappLink: (message: string) => whatsappLink(s.whatsapp, message),
    mapsUrl: mapsUrl(s.address),
  }
}
