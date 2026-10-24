import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { useSiteData } from '@/context/SiteDataContext'
import { api } from '@/lib/api'
import { defaultSettings, formatPhone } from '@/lib/contact'
import { ErrorNotice, Field, inputClass, SuccessNotice } from './fields'

export default function AdminSettingsPage() {
  const { settings, reload } = useSiteData()
  const current = settings ?? defaultSettings

  const [address, setAddress] = useState(current.address)
  const [whatsapp, setWhatsapp] = useState(current.whatsapp)
  const [email, setEmail] = useState(current.email)
  const [hours, setHours] = useState(current.hours.join('\n'))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<unknown>(null)
  const [saved, setSaved] = useState(false)

  const digits = whatsapp.replace(/\D/g, '')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      await api.admin.saveSettings({
        address,
        whatsapp,
        email,
        hours: hours.split('\n').map((h) => h.trim()).filter(Boolean),
      })
      await reload()
      setSaved(true)
    } catch (err) {
      setError(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Datos del sitio</h1>
        <p className="text-sm text-zinc-400">
          Se usan en el pie de página, en la página de Contacto y en todos los botones de WhatsApp.
        </p>
      </div>

      <section className="grid gap-4 rounded-xl border border-line bg-panel p-5 sm:p-6 lg:grid-cols-2 lg:items-start">
        <Field label="Dirección">
          <input required value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
        </Field>

        <Field
          label="Número de WhatsApp"
          hint={`Con código de país, sin + ni espacios (ej. 5491123456789). Se mostrará como: ${digits ? formatPhone(digits) : '—'}`}
        >
          <input required inputMode="numeric" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={inputClass} />
        </Field>

        <Field label="Email">
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </Field>

        <Field label="Horarios" hint="Una línea por franja. Ej.: Lunes a viernes: 9 a 19 hs">
          <textarea required rows={4} value={hours} onChange={(e) => setHours(e.target.value)} className={inputClass} />
        </Field>
      </section>

      <ErrorNotice error={error} />
      {saved && <SuccessNotice>Cambios guardados. Ya se ven en el sitio.</SuccessNotice>}

      <Button type="submit" disabled={saving} className="disabled:opacity-60">
        {saving ? 'Guardando…' : 'Guardar cambios'}
      </Button>
    </form>
  )
}
