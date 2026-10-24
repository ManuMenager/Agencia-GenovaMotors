import { useState, type FormEvent, type ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { DataGate } from '@/components/ui/DataGate'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { useContact } from '@/hooks/useContact'

const icons = {
  chat: 'M21 12c0 4.418-4.03 8-9 8a9.9 9.9 0 01-3.9-.78L3 20l1.4-3.7C3.5 15 3 13.55 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  mail: 'M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm0 0l9 6 9-6',
  pin: 'M12 21s-7-5.686-7-11a7 7 0 1114 0c0 5.314-7 11-7 11zm0-8.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  clock: 'M12 7v5l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z',
}

function Icon({ d, className = 'h-5 w-5' }: { d: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  )
}

function InfoCard({ icon, title, children }: { icon: string; title: string; children: ReactNode }) {
  return (
    <div className="flex gap-4 rounded-xl border border-line bg-panel p-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-brand-500/40 bg-brand-500/10 text-brand-400">
        <Icon d={icon} />
      </span>
      <div className="min-w-0 text-sm text-zinc-400">
        <p className="font-semibold text-white">{title}</p>
        {children}
      </div>
    </div>
  )
}

const field =
  'w-full rounded-md border border-line bg-ink px-4 py-2.5 text-white placeholder:text-zinc-500 focus:border-brand-500 focus:outline-none'

export default function ContactPage() {
  return (
    <DataGate>
      <ContactContent />
    </DataGate>
  )
}

function ContactContent() {
  const [sent, setSent] = useState(false)
  const { address, hours, email, whatsappDisplay, whatsappLink, mapsUrl } = useContact()

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // TODO: enviar a un backend / servicio de formularios.
    setSent(true)
  }

  return (
    <div className="px-4 py-8 sm:px-8 sm:py-16 lg:px-16">
      <SectionTitle as="h1" subtitle="Estamos para ayudarte. Elegí cómo preferís comunicarte.">
        Contacto
      </SectionTitle>

      <div className="mx-auto grid max-w-6xl gap-6 sm:gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div className="space-y-4">
          <div className="rounded-xl border border-brand-500/30 bg-gradient-to-br from-brand-500/15 via-panel to-panel p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#25D366] text-ink">
                <Icon d={icons.chat} />
              </span>
              <div>
                <p className="font-semibold text-white">WhatsApp</p>
                <p className="text-sm text-zinc-400">Respuesta rápida · <span className="whitespace-nowrap">{whatsappDisplay}</span></p>
              </div>
            </div>
            <a
              href={whatsappLink('Hola! Quiero hacer una consulta.')}
              target="_blank"
              rel="noreferrer"
              className="mt-5 flex w-full justify-center rounded-md bg-[#25D366] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-[#20bd5a]"
            >
              Escribir por WhatsApp
            </a>
          </div>

          <InfoCard icon={icons.mail} title="Email">
            <a href={`mailto:${email}`} className="break-all hover:text-brand-400">
              {email}
            </a>
          </InfoCard>

          <InfoCard icon={icons.pin} title="Visitanos">
            <p>{address}</p>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block font-semibold text-brand-400 hover:text-brand-500"
            >
              Cómo llegar →
            </a>
          </InfoCard>

          <InfoCard icon={icons.clock} title="Horarios">
            {hours.map((h) => (
              <p key={h}>{h}</p>
            ))}
          </InfoCard>
        </div>

        <div className="rounded-xl border border-line bg-panel p-5 sm:p-8">
          <h2 className="text-xl font-bold text-white">Dejanos tu consulta</h2>
          <p className="mt-1 text-sm text-zinc-400">Te respondemos a la brevedad.</p>

          {sent ? (
            <p className="mt-6 rounded-lg border border-brand-500/40 bg-brand-500/10 p-4 text-center text-brand-400">
              ¡Gracias! Te vamos a responder a la brevedad.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input required name="name" placeholder="Nombre" aria-label="Nombre" className={field} />
                <input type="tel" name="phone" placeholder="Teléfono" aria-label="Teléfono" className={field} />
              </div>
              <input required type="email" name="email" placeholder="Email" aria-label="Email" className={field} />
              <textarea
                required
                name="message"
                rows={6}
                placeholder="¿En qué podemos ayudarte?"
                aria-label="Mensaje"
                className={field}
              />
              <Button type="submit" className="w-full">
                Enviar consulta
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
