import type { ReactNode } from 'react'
import { Logo } from '@/components/ui/Logo'
import { useContact } from '@/hooks/useContact'

/**
 * Columna de datos de contacto. Hasta que llegan los datos reales queda invisible (pero ocupando lugar),
 * para no mostrar un número equivocado ni mover la página.
 */
function Column({
  title,
  ready,
  className = '',
  children,
}: {
  title: string
  ready: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <div className={`text-sm ${ready ? '' : 'invisible'} ${className}`} aria-hidden={!ready}>
      <p className="font-semibold text-white">{title}</p>
      <div className="mt-3 space-y-1.5">{children}</div>
    </div>
  )
}

export function Footer() {
  const { ready, address, hours, email, whatsappDisplay, whatsappLink, mapsUrl } = useContact()

  return (
    <footer className="border-t border-line bg-surface text-zinc-400">
      {/* Marca a la izquierda y tres columnas de igual peso: así ninguna queda mucho más alta que otra. */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 px-4 py-6 text-center sm:px-8 md:grid-cols-3 md:text-left lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10 lg:px-16 lg:py-8">
        <div className="col-span-2 md:col-span-3 lg:col-span-1">
          <Logo className="mx-auto w-56 md:mx-0" sizes="224px" lazy />
          <p className="mx-auto mt-4 max-w-xs text-sm md:mx-0">
            Usados seleccionados &amp; 0 km. Gestoría propia. Financiación, permutas, compra y
            consignaciones.
          </p>
        </div>

        <Column title="Dirección" ready={ready}>
          <p>{address}</p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block font-semibold text-brand-400 hover:text-brand-500"
          >
            Cómo llegar →
          </a>
        </Column>

        <Column title="Horarios" ready={ready}>
          {hours.map((h) => (
            <p key={h}>{h}</p>
          ))}
        </Column>

        <Column title="Contacto" ready={ready} className="col-span-2 md:col-span-1">
          <p>
            <a
              href={whatsappLink('Hola! Quiero hacer una consulta.')}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-brand-400 hover:text-brand-500"
            >
              {whatsappDisplay}
            </a>{' '}
            <span className="whitespace-nowrap">(WhatsApp)</span>
          </p>
          <p>
            <a href={`mailto:${email}`} className="break-all hover:text-white">
              {email}
            </a>
          </p>
        </Column>
      </div>

      <p className="border-t border-line py-3 text-center text-xs">
        © {new Date().getFullYear()} Génova Motors. Todos los derechos reservados.
      </p>
    </footer>
  )
}
