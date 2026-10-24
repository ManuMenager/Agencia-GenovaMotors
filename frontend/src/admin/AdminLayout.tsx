import { Link, Navigate, NavLink, Outlet } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { useSiteData } from '@/context/SiteDataContext'
import { useAdminAuth } from './AdminAuth'

const tabs = [
  { to: '/admin', label: 'Vehículos', end: true },
  { to: '/admin/clientes', label: 'Clientes' },
  { to: '/admin/ajustes', label: 'Datos del sitio' },
]

export default function AdminLayout() {
  const { status, logout } = useAdminAuth()
  const { status: dataStatus, reload } = useSiteData()

  if (status === 'checking') {
    return <p className="py-32 text-center text-zinc-400">Cargando…</p>
  }
  if (status === 'out') return <Navigate to="/admin/login" replace />

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-ink-deep">
        {/* Escritorio: una sola fila (logo | pestañas centradas | botones). Celular: dos filas compactas. */}
        <div className="flex flex-wrap items-center justify-between px-4 sm:px-8 lg:grid lg:h-16 lg:grid-cols-[1fr_auto_1fr] lg:px-16">
          <div className="flex h-14 items-center gap-3 lg:h-auto">
            <Logo className="w-32" sizes="128px" />
            <span className="hidden rounded-full border border-brand-500/40 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand-400 sm:inline">
              Panel del dueño
            </span>
          </div>

          <nav className="order-last w-full overflow-x-auto lg:order-none lg:w-auto lg:self-stretch" aria-label="Secciones del panel">
            {/* El contenedor interno centra las pestañas; si no entran (celular chico), se desplazan. */}
            <div className="mx-auto flex w-max gap-1 lg:h-full">
              {tabs.map((t) => (
                <NavLink
                  key={t.to}
                  to={t.to}
                  end={t.end}
                  className={({ isActive }) =>
                    `flex h-11 items-center whitespace-nowrap border-b-2 px-4 text-sm font-semibold transition-colors lg:h-full lg:px-5 ${
                      isActive ? 'border-brand-500 text-brand-400' : 'border-transparent text-zinc-400 hover:text-white'
                    }`
                  }
                >
                  {t.label}
                </NavLink>
              ))}
            </div>
          </nav>

          <div className="flex items-center justify-end gap-2 text-sm">
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-md bg-brand-500 px-3 py-1.5 font-semibold text-ink transition-colors hover:bg-brand-400"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                <path d="M14 4h6v6M20 4l-9 9M18 13v5a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h5" />
              </svg>
              Ver sitio
            </Link>
            <button
              type="button"
              onClick={() => void logout()}
              aria-label="Cerrar sesión"
              className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-1.5 font-semibold text-white transition-colors hover:border-red-400 hover:text-red-300"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                <path d="M15 17l5-5-5-5M20 12H9M12 20H6a2 2 0 01-2-2V6a2 2 0 012-2h6" />
              </svg>
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 sm:px-8 sm:py-8 lg:px-16">
        {dataStatus === 'loading' && <p className="py-20 text-center text-zinc-400">Cargando…</p>}
        {dataStatus === 'error' && (
          <div className="py-20 text-center">
            <p className="text-white">No se pudieron cargar los datos.</p>
            <Button className="mt-4" onClick={() => void reload()}>
              Reintentar
            </Button>
          </div>
        )}
        {dataStatus === 'ready' && <Outlet />}
      </main>
    </div>
  )
}
