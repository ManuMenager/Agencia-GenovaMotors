import { Services } from '@/components/home/Services'
import { ButtonLink } from '@/components/ui/Button'
import { DataGate } from '@/components/ui/DataGate'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { VehicleGrid } from '@/components/vehicles/VehicleGrid'
import { useSiteData } from '@/context/SiteDataContext'
import { useContact } from '@/hooks/useContact'

export default function HomePage() {
  return (
    <>
      {/* El inicio muestra el hero y los servicios al instante; solo lo que viene de la API espera los datos. */}
      <Hero />
      <Services />
      <DataGate>
        <FeaturedAndSell />
      </DataGate>
    </>
  )
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-line">
      {/* Foto: Audi RS6 Avant por Jiawei Zhao (Unsplash, licencia gratuita). Es la imagen más grande de la
          página, así que va como <img> real (visible desde el HTML y precargada en index.html). */}
      <picture>
        <source
          type="image/webp"
          srcSet="/images/hero-800.webp 800w, /images/hero-1600.webp 1600w"
          sizes="100vw"
        />
        <img
          src="/images/hero.jpg"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />
      </picture>
      {/* Sombra suave para que el texto se lea y para fundir con el resto de la página */}
      <div className="absolute inset-0 -z-10 bg-ink/55" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-ink to-transparent" />

      <div className="flex min-h-[28rem] flex-col items-center justify-center px-4 py-16 text-center drop-shadow-lg sm:min-h-[40rem] sm:px-8 sm:py-32 md:min-h-[46rem]">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-500 sm:text-sm sm:tracking-[0.3em]">
            Usados seleccionados &amp; 0 km
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:mt-4 sm:text-4xl md:text-6xl">
            Encontrá el auto que va con vos
          </h1>
          <p className="mt-4 text-base text-zinc-200 sm:mt-5 sm:text-lg">
            Compra, venta, permutas y financiación, con gestoría propia y sin cobrarte comisión.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3 sm:mt-10 sm:gap-4">
            <ButtonLink to="/vehiculos">Ver catálogo</ButtonLink>
            <ButtonLink to="/contacto" variant="secondary">
              Contactanos
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturedAndSell() {
  const { vehicles } = useSiteData()
  const { whatsappLink } = useContact()
  const featured = vehicles.filter((v) => v.featured)

  return (
    <>
      <section className="px-3 pb-12 sm:px-8 sm:pb-20 lg:px-16">
        <SectionTitle subtitle="Una selección de las unidades más buscadas.">Destacados</SectionTitle>
        <VehicleGrid vehicles={featured} />
        <div className="mt-8 text-center sm:mt-10">
          <ButtonLink to="/vehiculos">Ver catálogo completo</ButtonLink>
        </div>
      </section>

      <section className="border-t border-line bg-surface px-4 py-12 text-center sm:px-8 sm:py-20 lg:px-16">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
          ¿Querés vender tu vehículo?
        </h2>
        <div className="mx-auto mt-3 h-0.5 w-14 bg-brand-500" />
        <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-300 sm:mt-5 sm:text-lg">
          Contactate con nosotros y nos encargamos de venderlo en menos de 30 días. Sin cobrarte
          comisión.
        </p>
        <p className="mt-3 text-sm text-zinc-400">
          También compramos tu vehículo: cotización rápida, carpeta completa y múltiples formas de
          pago.
        </p>
        <a
          href={whatsappLink('Hola! Quiero vender mi vehículo.')}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex rounded-md bg-brand-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-brand-400 sm:mt-8 sm:px-8"
        >
          Escribinos por WhatsApp
        </a>
      </section>
    </>
  )
}
