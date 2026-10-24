export function formatPrice(value: number, currency: 'USD' | 'ARS' = 'USD'): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatMileage(km: number): string {
  return km === 0 ? '0 km' : `${new Intl.NumberFormat('es-AR').format(km)} km`
}
