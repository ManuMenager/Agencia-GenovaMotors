import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { AdminAuthProvider } from './AdminAuth'

/** Raíz de todas las pantallas del panel: provee la sesión y evita que los buscadores lo indexen. */
export function AdminRoot() {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    const previousTitle = document.title
    document.title = 'Panel | Génova Motors'
    return () => {
      meta.remove()
      document.title = previousTitle
    }
  }, [])

  return (
    <AdminAuthProvider>
      <Outlet />
    </AdminAuthProvider>
  )
}
