import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { useAdminAuth } from './AdminAuth'
import { ErrorNotice, Field, inputClass } from './fields'

export default function AdminLoginPage() {
  const { status, login } = useAdminAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<unknown>(null)
  const [busy, setBusy] = useState(false)

  if (status === 'in') return <Navigate to="/admin" replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await login(password)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err)
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink-deep px-4">
      <Logo className="w-64" sizes="256px" />
      <form onSubmit={handleSubmit} className="mt-10 w-full max-w-sm space-y-4 rounded-xl border border-line bg-panel p-6">
        <div>
          <h1 className="text-xl font-bold text-white">Panel de administración</h1>
          <p className="mt-1 text-sm text-zinc-400">Acceso exclusivo para el dueño.</p>
        </div>
        <Field label="Contraseña">
          <input
            type="password"
            autoFocus
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </Field>
        <ErrorNotice error={error} />
        <Button type="submit" disabled={busy} className="w-full disabled:opacity-60">
          {busy ? 'Ingresando…' : 'Ingresar'}
        </Button>
      </form>
      <Link to="/" className="mt-6 text-sm text-zinc-400 hover:text-white">
        ← Volver al sitio
      </Link>
    </div>
  )
}
