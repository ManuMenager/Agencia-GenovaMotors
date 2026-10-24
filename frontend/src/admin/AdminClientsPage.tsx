import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useSiteData } from '@/context/SiteDataContext'
import { api } from '@/lib/api'
import { ErrorNotice, SuccessNotice } from './fields'
import { ImageManager } from './ImageManager'

export default function AdminClientsPage() {
  const { clients, reload } = useSiteData()
  const [photos, setPhotos] = useState(clients)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<unknown>(null)
  const [saved, setSaved] = useState(false)

  const dirty = JSON.stringify(photos) !== JSON.stringify(clients)

  async function handleSave() {
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      await api.admin.saveClients(photos)
      await reload()
      setSaved(true)
    } catch (err) {
      setError(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Fotos de clientes</h1>
        <p className="text-sm text-zinc-400">
          Se muestran en la sección "Clientes" del sitio, en este mismo orden. Los cambios se publican al guardar.
        </p>
      </div>

      <div className="rounded-xl border border-line bg-panel p-5 sm:p-6">
        <ImageManager
          images={photos}
          onChange={(next) => {
            setSaved(false)
            setPhotos(next)
          }}
          max={60}
        />
      </div>

      <ErrorNotice error={error} />
      {saved && !dirty && <SuccessNotice>Cambios guardados. Ya se ven en el sitio.</SuccessNotice>}

      <div className="flex flex-wrap items-center gap-3">
        <Button disabled={!dirty || saving} onClick={() => void handleSave()} className="disabled:opacity-50">
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </Button>
        {dirty && <span className="text-sm text-brand-400">Tenés cambios sin guardar.</span>}
      </div>
    </div>
  )
}
