import { Container, Section, SectionHead } from '@/components/section'
import { roles } from '@/content/copy'

export function Roles() {
  return (
    <Section>
      <Container>
        <SectionHead eyebrow={roles.eyebrow} title={roles.title} />

        <ul className="mt-14 grid gap-5 md:grid-cols-3" data-reveal-stagger>
          {roles.items.map((item, i) => (
            <li key={item.role} className="rounded-xl p-6 neu-raised md:p-7" data-reveal>
              <span
                className="tnum grid size-9 place-items-center rounded-lg text-[0.75rem] text-muted-foreground neu-pressed"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-6 text-xl leading-snug font-semibold tracking-tight">
                <span className="text-foreground">{item.role}</span>{' '}
                <span className="text-muted-foreground">{item.title}</span>
              </h3>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
