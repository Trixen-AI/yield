import {
  ArrowUpRight,
  Banknote,
  Blocks,
  CandlestickChart,
  Coins,
  Landmark,
  PenLine,
  Rocket,
  ShieldHalf,
  SlidersHorizontal,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'

/** Maps the icon keys used in `content/copy.ts` to lucide components. */
export const iconMap: Record<string, LucideIcon> = {
  // How it works
  pen: PenLine,
  sliders: SlidersHorizontal,
  rocket: Rocket,
  wallet: Wallet,
  trending: TrendingUp,
  // Market types
  lending: Banknote,
  tokenised: CandlestickChart,
  lpFees: Coins,
  backstop: ShieldHalf,
  rwa: Landmark,
  custom: Blocks,
}

export { ArrowUpRight }

/**
 * HarvestPad mark.
 *
 * The name has two halves and so does the logo: a rounded platform (the pad)
 * with three stalks growing off it (the harvest), the tallest bearing a single
 * grain. The stalks ascend left to right, which also reads as yield accruing.
 *
 * Geometry is on a 32x32 grid so it stays on whole pixels at favicon sizes; the
 * same shape is in `public/favicon.svg`. Change one, change both.
 */
export function LogoGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      {/* the grain */}
      <circle cx="22.25" cy="5" r="2.25" className="fill-brand" />
      {/* three stalks, ascending */}
      <rect x="8" y="17" width="3.5" height="5.5" rx="1.75" className="fill-muted-foreground" />
      <rect x="14.25" y="13" width="3.5" height="9.5" rx="1.75" className="fill-muted-foreground" />
      <rect x="20.5" y="8.5" width="3.5" height="14" rx="1.75" className="fill-brand" />
      {/* the pad */}
      <rect x="6" y="24" width="20" height="3.5" rx="1.75" className="fill-foreground" />
    </svg>
  )
}

/** The glyph on its own embossed tile, as used in the header and footer. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center rounded-[10px] neu-raised-sm',
        className ?? 'size-9',
      )}
      aria-hidden="true"
    >
      <LogoGlyph className="size-[72%]" />
    </span>
  )
}
