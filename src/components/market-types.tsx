import { iconMap } from '@/components/icons'
import { Container, Section, SectionHead } from '@/components/section'
import { marketTypes } from '@/content/copy'

export function MarketTypes() {
  return (
    <Section id="strategies">
      <Container>
        <SectionHead
          eyebrow={marketTypes.eyebrow}
          title={marketTypes.title}
          lead={marketTypes.lead}
        />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-reveal-stagger>
          {marketTypes.items.map((item) => {
            const Icon = iconMap[item.icon]
            return (
              <li
                key={item.tag}
                className="group rounded-xl p-6 neu-raised transition-shadow duration-300 hover:neu-raised-lg"
                data-reveal
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-lg neu-pressed">
                    <Icon
                      className="size-5 text-muted-foreground transition-colors duration-200 group-hover:text-brand"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="font-mono text-[0.6875rem] text-muted-foreground">
                    {item.tag}
                  </span>
                </div>
                <h3 className="mt-7 text-[1.0625rem] font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-3 text-[0.8125rem] leading-relaxed text-pretty text-muted-foreground">
                  {item.body}
                </p>
              </li>
            )
          })}
        </ul>
      </Container>
    </Section>
  )
}
