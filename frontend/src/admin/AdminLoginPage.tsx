import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { Photo } from '@/components/ui/Photo'
import { useAdminAuth } from './AdminAuth'
import { ErrorNotice, Field, inputClass } from './fields'

const icon = {
  lock: 'M7 11V8a5 5 0 0110 0v3M6 11h12a1 1 0 011 1v7a1 1 0 01-1 1H6a1 1 0 01-1-1v-7a1 1 0 011-1z',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zm10 3a3 3 0 100-6 3 3 0 000 6z',
  eyeOff: 'M3 3l18 18M10.6 6.1A9.8 9.8 0 0112 6c6.5 0 10 6 10 6a17 17 0 01-3.2 3.8M6.6 6.7A16.5 16.5 0 002 12s3.5 6 10 6a9.7 9.7 0 003.4-.6M9.9 9.9a3 3 0 004.2 4.2',
  back: 'M19 12H5M12 19l-7-7 7-7',
}

function Icon({ d, className = 'h-5 w-5' }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

export default function AdminLoginPage() {
  const { status, login } = useAdminAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
    <div className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink-deep px-4 py-10">
      {/* Fondo: Audi R8 (foto de ejemplo de Unsplash) con capas oscuras para que se lean el logo y el formulario. */}
      <Photo
        src="/images/vehicles/audi-r8-2021/1.jpg"
        size={1280}
        widths={[640, 1280]}
        sizes="100vw"
        priority
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[45%_center]"
      />
      <div className="absolute inset-0 -z-10 bg-ink-deep/40" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-deep via-transparent to-ink-deep/60" />

      <Logo className="w-64 drop-shadow-[0_4px_18px_rgba(0,0,0,0.7)] sm:w-80" sizes="(min-width: 640px) 320px, 256px" />

      <form
        onSubmit={handleSubmit}
        className="relative mt-8 w-full max-w-sm space-y-5 overflow-hidden rounded-2xl border border-white/10 bg-ink-deep/75 p-6 shadow-2xl shadow-black/60 backdrop-blur-md sm:mt-10 sm:p-8"
      >
        {/* Filete dorado en el borde superior de la tarjeta */}
        <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent" aria-hidden="true" />

        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-500/40 bg-brand-500/10 text-brand-400">
            <Icon d={icon.lock} />
          </span>
          <div>
            <h1 className="text-xl font-bold leading-tight text-white">Panel de administración</h1>
            <p className="text-sm text-zinc-400">Acceso exclusivo para el dueño</p>
          </div>
        </div>

        <Field label="Contraseña">
          <span className="relative block">
            <input
              type={showPassword ? 'text' : 'password'}
              autoFocus
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-md text-zinc-400 transition-colors hover:text-brand-400 focus-visible:outline-2 focus-visible:outline-brand-500"
            >
              <Icon d={showPassword ? icon.eyeOff : icon.eye} className="h-5 w-5" />
            </button>
          </span>
        </Field>

        <ErrorNotice error={error} />

        <Button type="submit" disabled={busy} className="w-full disabled:opacity-60">
          {busy ? 'Ingresando…' : 'Ingresar'}
        </Button>
      </form>

      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-md border border-white/15 bg-ink-deep/50 px-4 py-2 text-sm font-semibold text-zinc-200 backdrop-blur transition-colors hover:border-brand-500 hover:text-brand-400"
      >
        <Icon d={icon.back} className="h-4 w-4" />
        Volver al sitio
      </Link>
    </div>
  )
}
