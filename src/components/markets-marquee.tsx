import { useEffect, useRef } from 'react'
import gsap from 'gsap'

import { Container } from '@/components/section'
import { Badge } from '@/components/ui/badge'
import { marketsMarquee } from '@/content/copy'
import { marketPair, custodyLabel, marketRows, type Market } from '@/content/markets'

/** Pixels per second. Slow enough to read a card as it passes. */
const SPEED = 46

function MarketChip({ market }: { market: Market }) {
  return (
    <div className="mr-4 w-[16.5rem] shrink-0 rounded-xl p-5 neu-raised">
      <div className="flex items-center gap-3">
        <span
          className="grid size-10 shrink-0 place-items-center rounded-lg font-mono text-[0.6875rem] text-muted-foreground neu-pressed"
          aria-hidden="true"
        >
          {market.mark}
        </span>
        <span className="min-w-0">
          <span className="block truncate font-medium">{market.name}</span>
          <span className="block truncate font-mono text-[0.6875rem] text-muted-foreground">
            {marketPair(market)}
          </span>
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge>{market.strategy}</Badge>
        <Badge variant={market.custody === 'locked' ? 'muted' : 'brand'}>
          {custodyLabel[market.custody]}
        </Badge>
      </div>
    </div>
  )
}

/**
 * A right-to-left ticker of everything the factory has deployed.
 *
 * The track holds two identical copies of the list and is animated to
 * `xPercent: -50`, so the second copy arrives exactly where the first began and
 * the loop is seamless. That only holds if the repeating unit is exactly half
 * the track, which is why spacing is a right margin on each card rather than a
 * `gap` on the flex container: a gap would add one extra space at the seam and
 * the loop would visibly jump.
 */
export function MarketsMarquee() {
  const trackRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    const viewport = viewportRef.current
    if (!track || !viewport) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        xPercent: -50,
        ease: 'none',
        repeat: -1,
        duration: track.scrollWidth / 2 / SPEED,
      })

      // Let people stop it to read a card, and stop burning frames when the
      // ticker is not on screen.
      const pause = () => tween.pause()
      const play = () => tween.play()
      viewport.addEventListener('pointerenter', pause)
      viewport.addEventListener('pointerleave', play)
      viewport.addEventListener('focusin', pause)
      viewport.addEventListener('focusout', play)

      const visibility = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? tween.play() : tween.pause()),
        { threshold: 0 },
      )
      visibility.observe(viewport)

      // Card widths are fixed, but the font can land late and change nothing;
      // recompute anyway so the speed stays constant if the layout shifts.
      const resize = new ResizeObserver(() => {
        tween.duration(track.scrollWidth / 2 / SPEED)
      })
      resize.observe(track)

      return () => {
        viewport.removeEventListener('pointerenter', pause)
        viewport.removeEventListener('pointerleave', play)
        viewport.removeEventListener('focusin', pause)
        viewport.removeEventListener('focusout', play)
        visibility.disconnect()
        resize.disconnect()
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section aria-labelledby="deployed-heading" className="pb-4">
      <Container>
        <h2 id="deployed-heading" className="eyebrow">
          {marketsMarquee.heading}
        </h2>
      </Container>

      <div ref={viewportRef} className="marquee-fade mt-5 overflow-hidden">
        <div ref={trackRef} className="flex w-max">
          {marketRows.map((market) => (
            <MarketChip key={market.mark} market={market} />
          ))}
          {/* The second copy exists only to make the loop seamless. */}
          {marketRows.map((market) => (
            <div key={`echo-${market.mark}`} aria-hidden="true" className="contents">
              <MarketChip market={market} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
