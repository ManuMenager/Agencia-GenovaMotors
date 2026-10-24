import { Logo } from '@/components/ui/Logo'
import { useContact } from '@/hooks/useContact'

export function Footer() {
  const { ready, address, hours, email, whatsappDisplay, whatsappLink } = useContact()

  return (
    <footer className="border-t border-line bg-surface text-zinc-400">
      <div className="grid gap-6 px-4 py-8 text-center sm:gap-8 sm:py-12 sm:px-8 md:grid-cols-3 md:text-left lg:px-16">
        <div>
          <Logo className="mx-auto w-56 md:mx-0" sizes="224px" lazy />
          <p className="mt-4 text-sm">
            Usados seleccionados &amp; 0 km. Gestoría propia. Financiación, permutas, compra y
            consignaciones.
          </p>
        </div>
        {/* Invisible (pero ocupando lugar) hasta que llegan los datos reales, para no mostrar un número equivocado ni mover la página. */}
        <div className={ready ? 'text-sm' : 'invisible text-sm'} aria-hidden={!ready}>
          <p className="font-semibold text-white">Visitanos</p>
          <p className="mt-2">{address}</p>
          {hours.map((h, i) => (
            <p key={h} className={i === 0 ? 'mt-2' : ''}>
              {h}
            </p>
          ))}
        </div>
        {/* Invisible (pero ocupando lugar) hasta que llegan los datos reales, para no mostrar un número equivocado ni mover la página. */}
        <div className={ready ? 'text-sm' : 'invisible text-sm'} aria-hidden={!ready}>
          <p className="font-semibold text-white">Contacto</p>
          <p className="mt-2">
            WhatsApp:{' '}
            <a
              href={whatsappLink('Hola! Quiero hacer una consulta.')}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-brand-400 hover:text-brand-500"
            >
              {whatsappDisplay}
            </a>
          </p>
          <p className="mt-1">
            <a href={`mailto:${email}`} className="hover:text-white">
              {email}
            </a>
          </p>
        </div>
      </div>
      <p className="border-t border-line py-4 text-center text-xs">
        © {new Date().getFullYear()} Génova Motors. Todos los derechos reservados.
      </p>
    </footer>
  )
}
