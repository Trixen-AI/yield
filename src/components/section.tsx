import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn('mx-auto w-full max-w-[1200px] px-5 md:px-8', className)}>{children}</div>
  )
}

/**
 * Sections are separated by space alone. Neumorphism has no hard lines, so the
 * hairline rules that divided the Swiss layout are gone; rhythm now comes from
 * generous vertical padding and from panels floating off the surface.
 */
export function Section({
  id,
  className,
  children,
}: {
  id?: string
  className?: string
  children: ReactNode
}) {
  return (
    <section id={id} className={cn('py-16 md:py-24 lg:py-28', className)}>
      {children}
    </section>
  )
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  className,
  align = 'left',
}: {
  eyebrow?: string
  title: string
  lead?: string
  className?: string
  align?: 'left' | 'center'
}) {
  return (
    <div
      className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}
      data-reveal-stagger
    >
      {eyebrow ? (
        <p
          className={cn(
            'eyebrow inline-block rounded-full px-3.5 py-1.5 neu-pressed-sm',
            align === 'center' && 'mx-auto',
          )}
          data-reveal
        >
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-5 text-title font-semibold text-balance" data-reveal>
        {title}
      </h2>
      {lead ? (
        <p
          className="mt-5 text-[1.0625rem] leading-relaxed text-pretty text-muted-foreground"
          data-reveal
        >
          {lead}
        </p>
      ) : null}
    </div>
  )
}
