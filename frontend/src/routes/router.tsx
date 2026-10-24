import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import HomePage from '@/pages/HomePage'
import VehiclesPage from '@/pages/VehiclesPage'
import NotFoundPage from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    // Se muestra solo si el primer ingreso es a una página que se carga bajo demanda.
    HydrateFallback: () => (
      <p className="flex min-h-screen items-center justify-center text-zinc-400">Cargando…</p>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'vehiculos', element: <VehiclesPage /> },
      // Páginas menos visitadas: se cargan bajo demanda para que el paquete inicial sea más chico.
      {
        path: 'vehiculos/:id',
        lazy: async () => ({ Component: (await import('@/pages/VehicleDetailPage')).default }),
      },
      {
        path: 'clientes',
        lazy: async () => ({ Component: (await import('@/pages/ClientsPage')).default }),
      },
      { path: 'nosotros', element: <Navigate to="/clientes" replace /> },
      {
        path: 'contacto',
        lazy: async () => ({ Component: (await import('@/pages/ContactPage')).default }),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    // Panel del dueño: no aparece en el menú del sitio; se entra escribiendo /admin.
    // Se carga bajo demanda (code splitting): los visitantes del sitio no descargan este código.
    path: 'admin',
    lazy: async () => ({ Component: (await import('@/admin/AdminRoot')).AdminRoot }),
    HydrateFallback: () => <p className="py-32 text-center text-zinc-400">Cargando…</p>,
    children: [
      {
        path: 'login',
        lazy: async () => ({ Component: (await import('@/admin/AdminLoginPage')).default }),
      },
      {
        lazy: async () => ({ Component: (await import('@/admin/AdminLayout')).default }),
        children: [
          {
            index: true,
            lazy: async () => ({ Component: (await import('@/admin/AdminVehiclesPage')).default }),
          },
          {
            path: 'vehiculos/nuevo',
            lazy: async () => ({ Component: (await import('@/admin/VehicleFormPage')).default }),
          },
          {
            path: 'vehiculos/:id',
            lazy: async () => ({ Component: (await import('@/admin/VehicleFormPage')).default }),
          },
          {
            path: 'clientes',
            lazy: async () => ({ Component: (await import('@/admin/AdminClientsPage')).default }),
          },
          {
            path: 'ajustes',
            lazy: async () => ({ Component: (await import('@/admin/AdminSettingsPage')).default }),
          },
        ],
      },
    ],
  },
])
