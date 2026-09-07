import { Container, Section, SectionHead } from '@/components/section'
import { SpecList } from '@/components/spec-list'
import { vault } from '@/content/copy'

export function VaultSection() {
  return (
    <Section id="the-vault">
      <Container>
        <SectionHead eyebrow={vault.eyebrow} title={vault.title} lead={vault.lead} />

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
          <div className="rounded-2xl p-6 neu-raised md:p-7" data-reveal>
            <p className="eyebrow mb-5">{vault.specTitle}</p>
            <SpecList items={vault.spec} />
          </div>

          <div data-reveal-stagger>
            <h3 className="eyebrow mb-5">{vault.guaranteesTitle}</h3>
            <ul className="grid gap-4">
              {vault.guarantees.map((item, i) => (
                <li key={item.title} className="rounded-xl p-6 neu-raised" data-reveal>
                  <div className="flex items-start gap-4">
                    <span
                      className="tnum grid size-9 shrink-0 place-items-center rounded-lg text-[0.8125rem] text-brand neu-pressed"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <div>
                      <h4 className="text-[1.0625rem] font-semibold tracking-tight">
                        {item.title}
                      </h4>
                      <p className="mt-3 max-w-[56ch] text-[0.8125rem] leading-relaxed text-pretty text-muted-foreground">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  )
}
