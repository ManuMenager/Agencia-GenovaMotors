import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Logo } from '@/components/ui/Logo'

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/vehiculos', label: 'Vehículos' },
  { to: '/clientes', label: 'Clientes' },
  { to: '/contacto', label: 'Contacto' },
]

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink-deep/90 backdrop-blur">
      <div className="flex h-16 items-center sm:h-24 justify-between px-4 sm:px-8 lg:px-16 xl:grid xl:grid-cols-[1fr_auto_1fr]">
        <Link to="/" aria-label="Génova Motors, inicio" className="flex items-center">
          <Logo />
        </Link>

        <button
          className="-mr-2 flex h-11 w-11 items-center justify-center rounded-md text-white xl:hidden"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-6 w-6" aria-hidden="true">
            <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} />
          </svg>
        </button>

        <nav
          className={`${open ? 'flex' : 'hidden'} absolute inset-x-0 top-16 flex-col sm:top-24 gap-1 border-b border-line bg-ink-deep p-4 xl:static xl:flex xl:flex-row xl:justify-center xl:gap-2 xl:border-0 xl:bg-transparent xl:p-0`}
        >
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-md px-4 py-3 text-base font-medium transition-colors xl:py-2 xl:text-sm ${isActive ? 'text-brand-400' : 'text-zinc-300 hover:text-white'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Columna vacía que equilibra el logo para centrar el menú */}
        <div className="hidden xl:block" aria-hidden="true" />
      </div>
    </header>
  )
}
