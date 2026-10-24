import type { ComponentProps } from 'react'
import { Link } from 'react-router-dom'

const base =
  'inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm sm:px-6 sm:py-3 font-semibold uppercase tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500'

const variants = {
  primary: 'bg-brand-500 text-ink hover:bg-brand-400',
  secondary: 'border border-white/30 text-white hover:border-brand-500 hover:text-brand-400',
} as const

type Variant = keyof typeof variants

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ComponentProps<'button'> & { variant?: Variant }) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />
}

export function ButtonLink({
  variant = 'primary',
  className = '',
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={`${base} ${variants[variant]} ${className}`} {...props} />
}
