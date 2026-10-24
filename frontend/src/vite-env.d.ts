/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL de la API si el frontend y el backend están en dominios distintos. Vacío = mismo origen. */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
