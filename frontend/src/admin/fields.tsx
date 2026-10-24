import type { ReactNode } from 'react'
import { ApiError } from '@/lib/api'

export const inputClass =
  'w-full rounded-md border border-line bg-ink px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-brand-500 focus:outline-none'

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-zinc-400">{hint}</span>}
    </label>
  )
}

export function ErrorNotice({ error }: { error: unknown }) {
  if (!error) return null
  const message = error instanceof Error ? error.message : 'Ocurrió un error inesperado'
  const details = error instanceof ApiError ? error.details : []
  return (
    <div role="alert" className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
      <p className="font-semibold">{message}</p>
      {details.length > 0 && (
        <ul className="mt-1 list-inside list-disc">
          {details.map((d, i) => (
            <li key={i}>
              {d.field ? `${d.field}: ` : ''}
              {d.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function SuccessNotice({ children }: { children: ReactNode }) {
  return (
    <div role="status" className="rounded-md border border-green-500/40 bg-green-500/10 p-3 text-sm text-green-300">
      {children}
    </div>
  )
}
