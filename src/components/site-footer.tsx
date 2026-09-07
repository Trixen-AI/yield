import { ArrowUpRight } from 'lucide-react'

import { BrandMark } from '@/components/icons'
import { SmartLink } from '@/components/smart-link'
import { Container } from '@/components/section'
import { brand } from '@/content/brand'
import { footer } from '@/content/copy'

export function SiteFooter() {
  return (
    <footer className="pt-6 pb-12">
      <Container>
        <div className="rounded-2xl px-6 py-12 neu-pressed md:px-10 md:py-14">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
            <div>
              <SmartLink
                href="#top"
                className="flex items-center gap-3 rounded-md font-semibold tracking-tight"
              >
                <BrandMark className="size-9" />
                {brand.name}
              </SmartLink>
              <p className="mt-5 max-w-[40ch] text-[0.8125rem] leading-relaxed text-pretty text-muted-foreground">
                {footer.blurb}
              </p>
            </div>

            <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {footer.groups.map((group) => (
                <div key={group.title}>
                  <h2 className="eyebrow mb-4">{group.title}</h2>
                  <ul className="grid gap-3">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        {link.href ? (
                          <SmartLink
                            href={link.href}
                            className="inline-flex items-center gap-1 rounded-md text-[0.8125rem] transition-colors hover:text-brand"
                            {...(link.external
                              ? { target: '_blank', rel: 'noreferrer noopener' }
                              : {})}
                          >
                            {link.label}
                            {link.external ? (
                              <ArrowUpRight className="size-3.5" aria-hidden="true" />
                            ) : null}
                          </SmartLink>
                        ) : (
                          <span className="text-[0.8125rem] text-muted-foreground">
                            {link.label}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          <div className="mt-12 grid gap-3">
            {footer.disclaimers.map((line) => (
              <p
                key={line}
                className="max-w-[88ch] text-[0.6875rem] leading-relaxed text-muted-foreground"
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  )
}
