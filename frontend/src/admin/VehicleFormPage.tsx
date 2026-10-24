import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useSiteData } from '@/context/SiteDataContext'
import { api, type VehicleInput } from '@/lib/api'
import type { Vehicle } from '@/types/vehicle'
import { ErrorNotice, Field, inputClass } from './fields'
import { ImageManager } from './ImageManager'

interface FormState {
  brand: string
  model: string
  version: string
  year: string
  price: string
  currency: Vehicle['currency']
  condition: Vehicle['condition']
  mileage: string
  fuel: Vehicle['fuel']
  transmission: Vehicle['transmission']
  color: string
  description: string
  featured: boolean
  images: string[]
}

const empty: FormState = {
  brand: '',
  model: '',
  version: '',
  year: String(new Date().getFullYear()),
  price: '',
  currency: 'USD',
  condition: 'usado',
  mileage: '0',
  fuel: 'nafta',
  transmission: 'manual',
  color: '',
  description: '',
  featured: false,
  images: [],
}

const fromVehicle = (v: Vehicle): FormState => ({
  brand: v.brand,
  model: v.model,
  version: v.version,
  year: String(v.year),
  price: String(v.price),
  currency: v.currency,
  condition: v.condition,
  mileage: String(v.mileage),
  fuel: v.fuel,
  transmission: v.transmission,
  color: v.color,
  description: v.description,
  featured: Boolean(v.featured),
  images: v.images,
})

export default function VehicleFormPage() {
  const { id } = useParams()
  const { vehicles } = useSiteData()
  const existing = id ? vehicles.find((v) => v.id === id) : undefined

  if (id && !existing) return <Navigate to="/admin" replace />
  // `key` reinicia el formulario si se navega de un vehículo a otro.
  return <VehicleForm key={id ?? 'new'} existing={existing} />
}

function VehicleForm({ existing }: { existing?: Vehicle }) {
  const navigate = useNavigate()
  const { reload } = useSiteData()
  const [form, setForm] = useState<FormState>(existing ? fromVehicle(existing) : empty)
  const [error, setError] = useState<unknown>(null)
  const [saving, setSaving] = useState(false)

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }))

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const data: VehicleInput = {
        brand: form.brand,
        model: form.model,
        version: form.version,
        year: Number(form.year),
        price: Number(form.price),
        currency: form.currency,
        condition: form.condition,
        mileage: Number(form.mileage),
        fuel: form.fuel,
        transmission: form.transmission,
        color: form.color,
        description: form.description,
        featured: form.featured,
        images: form.images,
      }
      if (existing) await api.admin.updateVehicle(existing.id, data)
      else await api.admin.createVehicle(data)
      await reload()
      navigate('/admin')
    } catch (err) {
      setError(err)
      setSaving(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 rounded-md border border-line bg-panel px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-brand-500 hover:text-brand-400"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver a vehículos
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-white">
          {existing ? `Editar ${existing.brand} ${existing.model}` : 'Nuevo vehículo'}
        </h1>
      </div>

      <ErrorNotice error={error} />

      <section className="space-y-4 rounded-xl border border-line bg-panel p-5 sm:p-6">
        <h2 className="font-bold text-white">Datos del vehículo</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Marca">
            <input required value={form.brand} onChange={(e) => set('brand', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Modelo">
            <input required value={form.model} onChange={(e) => set('model', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Versión">
            <input required value={form.version} onChange={(e) => set('version', e.target.value)} className={inputClass} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Año">
            <input required type="number" min={1950} max={new Date().getFullYear() + 1} value={form.year} onChange={(e) => set('year', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Precio">
            <input required type="number" min={0} value={form.price} onChange={(e) => set('price', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Moneda">
            <select value={form.currency} onChange={(e) => set('currency', e.target.value as FormState['currency'])} className={inputClass}>
              <option value="USD">USD (US$)</option>
              <option value="ARS">ARS ($)</option>
            </select>
          </Field>
          <Field label="Kilometraje">
            <input required type="number" min={0} value={form.mileage} onChange={(e) => set('mileage', e.target.value)} className={inputClass} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Condición">
            <select value={form.condition} onChange={(e) => set('condition', e.target.value as FormState['condition'])} className={inputClass}>
              <option value="nuevo">Nuevo</option>
              <option value="usado">Usado</option>
            </select>
          </Field>
          <Field label="Combustible">
            <select value={form.fuel} onChange={(e) => set('fuel', e.target.value as FormState['fuel'])} className={inputClass}>
              <option value="nafta">Nafta</option>
              <option value="diesel">Diésel</option>
              <option value="hibrido">Híbrido</option>
              <option value="electrico">Eléctrico</option>
              <option value="gnc">GNC</option>
            </select>
          </Field>
          <Field label="Transmisión">
            <select value={form.transmission} onChange={(e) => set('transmission', e.target.value as FormState['transmission'])} className={inputClass}>
              <option value="manual">Manual</option>
              <option value="automatica">Automática</option>
            </select>
          </Field>
          <Field label="Color">
            <input required value={form.color} onChange={(e) => set('color', e.target.value)} className={inputClass} />
          </Field>
        </div>

        <Field label="Descripción" hint="Se muestra en la ficha del vehículo. Máximo 1000 caracteres.">
          <textarea rows={4} maxLength={1000} value={form.description} onChange={(e) => set('description', e.target.value)} className={inputClass} />
        </Field>

        <label className="flex items-center gap-3 text-sm text-zinc-200">
          <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="h-4 w-4 accent-brand-500" />
          Mostrar en "Destacados" de la página de inicio
        </label>
      </section>

      <section className="space-y-4 rounded-xl border border-line bg-panel p-5 sm:p-6">
        <h2 className="font-bold text-white">Fotos</h2>
        <ImageManager images={form.images} onChange={(images) => set('images', images)} showMain />
      </section>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={saving} className="disabled:opacity-60">
          {saving ? 'Guardando…' : existing ? 'Guardar cambios' : 'Crear vehículo'}
        </Button>
        <Link to="/admin" className="inline-flex items-center rounded-md border border-line px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:border-brand-500">
          Cancelar
        </Link>
      </div>
    </form>
  )
}
