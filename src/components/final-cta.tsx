import { ArrowRight } from 'lucide-react'

import { Container, Section } from '@/components/section'
import { SmartLink } from '@/components/smart-link'
import { Button } from '@/components/ui/button'
import { finalCta } from '@/content/copy'

/**
 * The Swiss version used a full-bleed dark band. That breaks the single-surface
 * illusion neumorphism depends on, so the CTA is now the most raised object on
 * the page instead of a different-coloured one.
 */
export function FinalCta() {
  return (
    <Section>
      <Container>
        <div
          className="relative overflow-hidden rounded-2xl px-6 py-14 neu-raised-lg md:px-12 md:py-20"
          data-reveal-stagger
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-brand/10 blur-3xl"
          />
          <div className="relative">
            <h2 className="max-w-[18ch] text-display font-semibold text-balance" data-reveal>
              {finalCta.title}
            </h2>
            <p
              className="mt-6 max-w-[52ch] text-[1.0625rem] leading-relaxed text-pretty text-muted-foreground"
              data-reveal
            >
              {finalCta.lead}
            </p>
            <div className="mt-9 flex flex-wrap gap-4" data-reveal>
              <Button asChild variant="brand" size="lg">
                <SmartLink href={finalCta.ctas.primary.href}>
                  {finalCta.ctas.primary.label}
                  <ArrowRight className="size-4" />
                </SmartLink>
              </Button>
              <Button asChild size="lg">
                <SmartLink href={finalCta.ctas.secondary.href}>
                  {finalCta.ctas.secondary.label}
                </SmartLink>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
