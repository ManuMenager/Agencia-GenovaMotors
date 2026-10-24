import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, setUnauthorizedHandler } from '@/lib/api'

type AuthStatus = 'checking' | 'in' | 'out'

interface AdminAuth {
  status: AuthStatus
  login: (password: string) => Promise<void>
  logout: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuth | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('checking')

  useEffect(() => {
    // Si el servidor responde 401 en cualquier acción del panel, la sesión venció: volver al login.
    setUnauthorizedHandler(() => setStatus('out'))
    api.admin
      .me()
      .then((r) => setStatus(r.admin ? 'in' : 'out'))
      .catch(() => setStatus('out'))
    return () => setUnauthorizedHandler(null)
  }, [])

  const login = useCallback(async (password: string) => {
    await api.admin.login(password)
    setStatus('in')
  }, [])

  const logout = useCallback(async () => {
    await api.admin.logout().catch(() => undefined)
    setStatus('out')
  }, [])

  const value = useMemo(() => ({ status, login, logout }), [status, login, logout])
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAdminAuth(): AdminAuth {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth debe usarse dentro de AdminAuthProvider')
  return ctx
}
