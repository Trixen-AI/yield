import { Suspense, lazy, useRef } from 'react'
import { ArrowRight } from 'lucide-react'

import { SmartLink } from '@/components/smart-link'
import { Container } from '@/components/section'
import { SpecList } from '@/components/spec-list'
import { Button } from '@/components/ui/button'
import { factoryPanel, hero } from '@/content/copy'
import { useParallax } from '@/hooks/use-motion'

/** three.js is ~170 kB gzipped, and the object is decorative, so it loads late. */
const HeroScene = lazy(() => import('@/components/hero-scene'))

const SCENE_SIZE = 'h-[16rem] w-full sm:h-[19rem] lg:h-[21rem]'

export function Hero() {
  const backdropRef = useRef<HTMLDivElement>(null)
  useParallax(backdropRef, 40)

  return (
    <section id="top" className="relative overflow-hidden">
      {/* Diffuse light rather than the Swiss grid: neumorphism admits no lines. */}
      <div
        ref={backdropRef}
        aria-hidden="true"
        className="soft-backdrop pointer-events-none absolute inset-x-0 -top-32 h-[130%]"
      />

      <Container className="relative">
        <div
          className="grid items-center gap-12 py-16 md:py-20 lg:grid-cols-[1.45fr_1fr] lg:gap-14 lg:py-24"
          data-hero-intro
        >
          <div>
            <p
              className="eyebrow inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 neu-pressed-sm"
              data-reveal
            >
              <span className="size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
              {hero.eyebrow}
            </p>

            <h1 className="mt-7 max-w-[16ch] text-hero font-semibold text-balance" data-reveal>
              {hero.title}
            </h1>

            <p
              className="mt-6 max-w-[54ch] text-[1.0625rem] leading-relaxed text-pretty text-muted-foreground"
              data-reveal
            >
              {hero.lead}
            </p>

            <div className="mt-9 flex flex-wrap gap-4" data-reveal>
              <Button asChild variant="brand" size="lg">
                <SmartLink href={hero.ctas.primary.href}>
                  {hero.ctas.primary.label}
                  <ArrowRight className="size-4" />
                </SmartLink>
              </Button>
              <Button asChild size="lg">
                <SmartLink href={hero.ctas.secondary.href}>{hero.ctas.secondary.label}</SmartLink>
              </Button>
            </div>
          </div>

          <div className="grid gap-6">
            {/* The fallback holds the same height as the canvas, so the lazy
                chunk landing cannot shift the hero. */}
            <Suspense fallback={<div className={SCENE_SIZE} aria-hidden="true" />}>
              <HeroScene className={SCENE_SIZE} />
            </Suspense>

            <aside className="rounded-2xl p-6 neu-raised-lg md:p-7" aria-label="Factory parameters">
              <div className="flex items-center justify-between gap-3 pb-5">
                <span className="eyebrow font-mono">{factoryPanel.label}</span>
                <span className="flex items-center gap-2 rounded-full px-2.5 py-1 text-[0.6875rem] text-muted-foreground neu-pressed-sm">
                  <span
                    className="size-1.5 animate-pulse rounded-full bg-brand"
                    aria-hidden="true"
                  />
                  {factoryPanel.status}
                </span>
              </div>
              <SpecList items={factoryPanel.terms} />
            </aside>
          </div>
        </div>
      </Container>
    </section>
  )
}
