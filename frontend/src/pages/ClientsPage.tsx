import { ButtonLink } from '@/components/ui/Button'
import { DataGate } from '@/components/ui/DataGate'
import { Photo } from '@/components/ui/Photo'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { useSiteData } from '@/context/SiteDataContext'

export default function ClientsPage() {
  return (
    <DataGate>
      <ClientsContent />
    </DataGate>
  )
}

function ClientsContent() {
  const { clients: clientPhotos, clientSizes } = useSiteData()

  return (
    <div className="px-3 py-8 sm:px-8 sm:py-16 lg:px-16">
      <SectionTitle as="h1" subtitle="Personas que ya confiaron en nosotros.">
        Clientes
      </SectionTitle>

      <div className="mx-auto max-w-6xl columns-2 gap-3 sm:gap-6 xl:columns-3">
        {clientPhotos.map((src, i) => {
          // Con el tamaño real de cada foto se reserva su lugar antes de que cargue: las columnas no se reacomodan.
          const size = clientSizes[src]
          return (
            <figure
              key={src}
              className="group mb-3 break-inside-avoid overflow-hidden rounded-lg border border-line bg-panel sm:mb-6 sm:rounded-xl"
            >
              <Photo
                src={src}
                size={640}
                widths={[400, 640]}
                sizes="(min-width: 1280px) 31vw, (min-width: 640px) 47vw, 48vw"
                // Las columnas muestran casi todas las fotos al abrir la página, así que las primeras no van en diferido.
                priority={i < 8}
                width={size?.width}
                height={size?.height}
                style={{ aspectRatio: size ? `${size.width} / ${size.height}` : '4 / 3' }}
                alt={`Cliente con su auto, foto ${i + 1}`}
                className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </figure>
          )
        })}
      </div>

      <div className="mt-4 text-center sm:mt-6">
        <p className="mb-4 text-base text-zinc-300 sm:mb-5 sm:text-lg">¿Querés ser el próximo?</p>
        <ButtonLink to="/vehiculos">Ver catálogo</ButtonLink>
      </div>
    </div>
  )
}
