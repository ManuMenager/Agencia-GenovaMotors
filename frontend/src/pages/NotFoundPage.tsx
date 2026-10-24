import { ButtonLink } from '@/components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-6xl font-extrabold text-brand-500">404</h1>
      <p className="mt-4 text-zinc-400">La página que buscás no existe.</p>
      <ButtonLink to="/" className="mt-8">
        Volver al inicio
      </ButtonLink>
    </div>
  )
}
