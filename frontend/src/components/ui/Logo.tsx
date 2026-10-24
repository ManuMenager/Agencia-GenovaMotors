interface LogoProps {
  /** Clases de Tailwind con el ancho (por defecto, el del header del sitio). */
  className?: string
  /** Ancho real en pantalla, para que el navegador pida la versión del logo más chica que se vea bien. */
  sizes?: string
  /** Para logos que no se ven al abrir la página (por ejemplo, el del pie): se cargan cuando hacen falta. */
  lazy?: boolean
}

export function Logo({
  className = 'w-40 sm:w-52 md:w-72 lg:w-[21.5rem]',
  sizes = '(min-width: 1024px) 344px, (min-width: 768px) 288px, (min-width: 640px) 208px, 160px',
  lazy = false,
}: LogoProps) {
  return (
    <img
      src="/images/logo-header.webp"
      srcSet="/images/logo-header-256.webp 256w, /images/logo-header-384.webp 384w, /images/logo-header.webp 523w"
      sizes={sizes}
      alt="Génova Motors Automotores"
      width={523}
      height={87}
      loading={lazy ? 'lazy' : 'eager'}
      decoding="async"
      className={`h-auto ${className}`}
    />
  )
}
