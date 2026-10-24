import type { ReactNode } from 'react'

interface SectionTitleProps {
  children: ReactNode
  subtitle?: string
  as?: 'h1' | 'h2'
}

export function SectionTitle({ children, subtitle, as: Tag = 'h2' }: SectionTitleProps) {
  return (
    <div className="mb-6 text-center sm:mb-10">
      <Tag className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">{children}</Tag>
      <div className="mx-auto mt-3 h-0.5 w-14 bg-brand-500" />
      {subtitle && <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400 sm:mt-4 sm:text-base">{subtitle}</p>}
    </div>
  )
}
