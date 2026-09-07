import { iconMap } from '@/components/icons'
import { Container, Section, SectionHead } from '@/components/section'
import { howItWorks } from '@/content/copy'

export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <Container>
        <SectionHead eyebrow={howItWorks.eyebrow} title={howItWorks.title} lead={howItWorks.lead} />

        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5" data-reveal-stagger>
          {howItWorks.steps.map((step) => {
            const Icon = iconMap[step.icon]
            return (
              <li key={step.n} className="group rounded-xl p-6 neu-raised" data-reveal>
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg neu-pressed">
                    <Icon
                      className="size-4.5 text-muted-foreground transition-colors duration-200 group-hover:text-brand"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="tnum text-[0.8125rem] text-muted-foreground">{step.n}</span>
                </div>
                <h3 className="mt-6 text-[1.0625rem] font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-pretty text-muted-foreground">
                  {step.body}
                </p>
              </li>
            )
          })}
        </ol>
      </Container>
    </Section>
  )
}
