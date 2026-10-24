import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  // Misma URL de la API que usa el sitio (vacía = mismo origen), para armar la precarga del index.html.
  const apiUrl = (loadEnv(mode, process.cwd(), 'VITE_').VITE_API_URL ?? '').replace(/\/$/, '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'api-url-in-html',
        transformIndexHtml: (html: string) => html.replaceAll('__API_URL__', apiUrl),
      },
    ],
    server: {
      // En desarrollo, la API y las fotos subidas desde el panel las sirve el backend.
      proxy: { '/api': 'http://localhost:3001', '/uploads': 'http://localhost:3001' },
    },
    resolve: {
      alias: { '@': path.resolve(import.meta.dirname, 'src') },
    },
  }
})
