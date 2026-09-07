import { Suspense, lazy } from 'react'

import { FaqSection } from '@/components/faq-section'
import { FinalCta } from '@/components/final-cta'
import { Hero } from '@/components/hero'
import { HowItWorks } from '@/components/how-it-works'
import { MarketTypes } from '@/components/market-types'
import { MarketsSection } from '@/components/markets-section'
import { Roles } from '@/components/roles'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { MarketsMarquee } from '@/components/markets-marquee'
import { StrategySource } from '@/components/strategy-source'
import { VaultSection } from '@/components/vault-section'
import { useMotion } from '@/hooks/use-motion'

/** Chart.js is ~57 kB gzipped and sits well below the fold, so it loads on demand. */
const MechanicsSection = lazy(() => import('@/components/mechanics-section'))

/** Reserves the section's height so the lazy chunk cannot shift the page. */
function MechanicsFallback() {
  return <div aria-hidden="true" className="h-[42rem]" />
}

export function MarketingPage() {
  useMotion()

  return (
    <>
      <a
        className="absolute -top-40 left-4 z-100 rounded-lg px-4 py-3 text-sm font-medium neu-raised focus:top-4"
        href="#main"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <Hero />
        <MarketsMarquee />
        <MarketsSection />
        <HowItWorks />
        <MarketTypes />
        <VaultSection />
        <Suspense fallback={<MechanicsFallback />}>
          <MechanicsSection />
        </Suspense>
        <StrategySource />
        <Roles />
        <FaqSection />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  )
}
