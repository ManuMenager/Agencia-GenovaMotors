import { Link } from 'react-router-dom'
import { SectionTitle } from '@/components/ui/SectionTitle'

function Icon({ d, className = 'h-6 w-6' }: { d: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  )
}

const icons = {
  exchange: 'M7 7h13m0 0l-4-4m4 4l-4 4M17 17H4m0 0l4-4m-4 4l4 4',
  search: 'M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z',
  card: 'M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7zM3 10h18M7 15h4',
  document:
    'M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5zM14 3v5h5M9 13h6M9 17h6',
}

const secondary = [
  {
    icon: icons.search,
    title: 'Búsqueda personalizada',
    text: 'Nos decís qué auto querés y lo buscamos por vos, según tu presupuesto y tus necesidades.',
  },
  {
    icon: icons.card,
    title: 'Financiación y permutas',
    text: 'Opciones a tu medida y toma de tu usado como parte de pago.',
  },
  {
    icon: icons.document,
    title: 'Gestoría propia',
    text: 'Procedimientos rápidos y confiables, con la documentación en orden.',
  },
  {
    icon: icons.exchange,
    title: 'Consignaciones',
    text: 'Dejanos tu vehículo y nos encargamos de la venta de punta a punta.',
  },
]

export function Services() {
  return (
    <section className="px-4 py-12 sm:px-8 sm:py-20 lg:px-16">
      <SectionTitle subtitle="Acompañamos cada operación de principio a fin, con atención personalizada.">
        Nuestros servicios
      </SectionTitle>

      <div className="grid gap-3 sm:gap-6 lg:grid-cols-3">
        <article className="relative flex flex-col overflow-hidden rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-500/15 via-panel to-panel p-5 sm:p-8 lg:row-span-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-ink sm:h-14 sm:w-14">
            <Icon d={icons.exchange} className="h-6 w-6 sm:h-7 sm:w-7" />
          </span>
          <h3 className="mt-4 text-xl font-bold text-white sm:mt-6 sm:text-2xl">Compra y venta</h3>
          <p className="mt-2 text-sm text-zinc-300 sm:mt-3 sm:text-base">
            Gestión y asesoramiento en cada paso. Compramos tu vehículo con cotización rápida y
            carpeta completa, o nos encargamos de venderlo en menos de 30 días.
          </p>
          <ul className="mt-4 space-y-1.5 text-sm text-zinc-200 sm:mt-6 sm:space-y-2">
            {['Sin cobrarte comisión', 'Cotización rápida', 'Múltiples formas de pago'].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                {t}
              </li>
            ))}
          </ul>
          <Link
            to="/contacto"
            className="mt-auto pt-5 text-sm font-semibold sm:pt-8 uppercase tracking-wide text-brand-400 hover:text-brand-500"
          >
            Quiero consultar →
          </Link>
        </article>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:col-span-2 lg:row-span-2 lg:grid-rows-2">
          {secondary.map((s) => (
            <article
              key={s.title}
              className="group rounded-2xl border border-line bg-panel p-4 transition-colors hover:border-brand-500/60 sm:p-6"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-500/40 bg-brand-500/10 text-brand-400 transition-colors group-hover:bg-brand-500 group-hover:text-ink sm:h-11 sm:w-11">
                <Icon d={s.icon} className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
              <h3 className="mt-3 text-sm font-bold leading-snug text-white sm:mt-5 sm:text-lg">{s.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-400 sm:mt-2 sm:text-sm">{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
