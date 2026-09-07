import { Container, Section, SectionHead } from '@/components/section'
import { SpecList } from '@/components/spec-list'
import { Badge } from '@/components/ui/badge'
import { strategySource } from '@/content/copy'

export function StrategySource() {
  const { featured } = strategySource

  return (
    <Section id="sources">
      <Container>
        <SectionHead
          eyebrow={strategySource.eyebrow}
          title={strategySource.title}
          lead={strategySource.lead}
        />

        <article
          className="mt-14 grid gap-8 rounded-2xl p-6 neu-raised-lg md:grid-cols-[1.1fr_0.9fr] md:gap-12 md:p-10"
          data-reveal
        >
          <div>
            <Badge variant="brand">
              <span className="size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
              {featured.badge}
            </Badge>
            <h3 className="mt-5 text-xl font-semibold tracking-tight">{featured.name}</h3>
            <p className="mt-4 max-w-[56ch] leading-relaxed text-pretty text-muted-foreground">
              {featured.body}
            </p>
          </div>

          <div className="self-start rounded-xl p-4 neu-pressed">
            <SpecList items={featured.spec} />
          </div>
        </article>

        <p className="mt-6 max-w-[68ch] text-[0.8125rem] leading-relaxed text-pretty text-muted-foreground">
          {strategySource.footnote}
        </p>
      </Container>
    </Section>
  )
}
