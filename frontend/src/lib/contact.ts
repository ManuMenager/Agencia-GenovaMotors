import type { SiteSettings } from '@/types/site'

/** Valores mostrados mientras se cargan los datos reales desde la API. */
export const defaultSettings: SiteSettings = {
  address: 'Zapiola 262, Bernal',
  whatsapp: '5491100000000',
  email: 'ventas@genovamotors.com',
  hours: ['Lunes a viernes: 9 a 19 hs', 'Sábados: 9 a 13 hs'],
}

/** Da formato legible a un número internacional: 5491112345678 -> +54 9 11 1234-5678. */
export function formatPhone(digits: string): string {
  const m = digits.match(/^549(\d{2})(\d{4})(\d{4})$/)
  return m ? `+54 9 ${m[1]} ${m[2]}-${m[3]}` : `+${digits}`
}

export function whatsappLink(whatsapp: string, message: string): string {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`
}

export function mapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}
