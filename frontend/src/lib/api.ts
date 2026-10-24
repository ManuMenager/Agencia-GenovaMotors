import type { SiteSettings } from '@/types/site'
import type { Vehicle } from '@/types/vehicle'

const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

export type VehicleInput = Omit<Vehicle, 'id'>

export class ApiError extends Error {
  status: number
  details: { field: string; message: string }[]
  constructor(message: string, status: number, details: { field: string; message: string }[] = []) {
    super(message)
    this.status = status
    this.details = details
  }
}

let onUnauthorized: (() => void) | null = null
/** El panel registra acá qué hacer cuando la sesión vence (ej. volver al login). */
export function setUnauthorizedHandler(fn: (() => void) | null) {
  onUnauthorized = fn
}

/** Las fotos subidas desde el panel las sirve el backend; si está en otro dominio hay que prefijarlo. */
export function assetUrl(path: string): string {
  return path.startsWith('/uploads/') ? `${API_URL}${path}` : path
}

export type ImageSize = 240 | 400 | 640 | 1280

/** Versión WebP liviana de una foto (`foto.jpg` -> `foto-640.webp`), que se genera junto a la original. */
export function imageVariant(path: string, size: ImageSize): string {
  return assetUrl(path.replace(/\.jpg$/i, `-${size}.webp`))
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const isForm = init.body instanceof FormData
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    ...init,
    headers: { ...(init.body && !isForm ? { 'Content-Type': 'application/json' } : {}), ...init.headers },
  })

  if (res.status === 204) return undefined as T
  const data = await res.json().catch(() => null)

  if (!res.ok) {
    if (res.status === 401 && path.startsWith('/api/admin/') && path !== '/api/admin/login') onUnauthorized?.()
    throw new ApiError(data?.error ?? 'Ocurrió un error inesperado', res.status, data?.details ?? [])
  }
  return data as T
}

const json = (method: string, body: unknown): RequestInit => ({ method, body: JSON.stringify(body) })

export interface ImageDimensions {
  width: number
  height: number
}

export interface SiteSnapshot {
  vehicles: Vehicle[]
  clients: string[]
  settings: SiteSettings
  /** Tamaño de las fotos de clientes (por ruta), para reservar su lugar antes de que carguen. */
  clientSizes: Record<string, ImageDimensions>
}

export const api = {
  /** Vehículos, fotos de clientes y datos de contacto en un solo pedido. */
  // Endpoint público: sin cookies, así el pedido coincide con el que se precarga desde el index.html.
  site: () => request<SiteSnapshot>('/api/site', { credentials: 'same-origin' }),
  vehicles: () => request<Vehicle[]>('/api/vehicles'),
  clients: () => request<string[]>('/api/clients'),
  settings: () => request<SiteSettings>('/api/settings'),

  admin: {
    me: () => request<{ admin: boolean }>('/api/admin/me'),
    login: (password: string) => request<{ admin: boolean }>('/api/admin/login', json('POST', { password })),
    logout: () => request<{ admin: boolean }>('/api/admin/logout', { method: 'POST' }),

    createVehicle: (data: VehicleInput) => request<Vehicle>('/api/admin/vehicles', json('POST', data)),
    updateVehicle: (id: string, data: VehicleInput) =>
      request<Vehicle>(`/api/admin/vehicles/${id}`, json('PUT', data)),
    deleteVehicle: (id: string) => request<void>(`/api/admin/vehicles/${id}`, { method: 'DELETE' }),

    saveClients: (photos: string[]) => request<string[]>('/api/admin/clients', json('PUT', { photos })),
    saveSettings: (data: SiteSettings) => request<SiteSettings>('/api/admin/settings', json('PUT', data)),

    uploadImages: async (files: File[]) => {
      const form = new FormData()
      files.forEach((f) => form.append('files', f))
      const { urls } = await request<{ urls: string[] }>('/api/admin/uploads', { method: 'POST', body: form })
      return urls
    },
  },
}
