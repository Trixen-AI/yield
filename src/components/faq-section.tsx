import { Container, Section, SectionHead } from '@/components/section'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { faq } from '@/content/copy'

export function FaqSection() {
  return (
    <Section id="faq">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHead eyebrow={faq.eyebrow} title={faq.title} className="lg:sticky lg:top-28" />

          <Accordion type="single" collapsible className="grid gap-4" data-reveal-stagger>
            {faq.items.map((item) => (
              <AccordionItem
                key={item.q}
                value={item.q}
                className="rounded-xl border-none px-6 neu-raised last:border-b-0"
                data-reveal
              >
                <AccordionTrigger className="py-5 text-left text-[1.0625rem] font-medium tracking-tight hover:no-underline [&[data-state=open]]:text-brand">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="max-w-[68ch] pb-6 text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </Section>
  )
}
