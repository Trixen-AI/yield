export type Custody = 'locked' | 'partial' | 'deployed'

export interface Market {
  /** Two- or three-letter mark drawn in the row avatar. */
  mark: string
  name: string
  /** Share ticker holders receive. */
  ticker: string
  /** Settlement asset symbol. */
  symbol: string
  strategy: string
  /** Annualised yield, or null for a market that has taken no deposits. */
  apy: number | null
  /** Total value locked, in units of `symbol`. */
  tvl: number
  /** Yield paid out so far, in units of `symbol`. */
  yieldPaid: number
  depositors: number
  custody: Custody
  age: string
}

/**
 * Illustrative market rows.
 *
 * These are example figures, not a live read. They are stored as numbers rather
 * than pre-formatted strings so that sorting and compact formatting both work
 * off the same source. Replace this module with a lens-contract read once the
 * frontend has a chain client; the table renders against this shape.
 *
 * The rates sit in the range each strategy plausibly earns: stablecoin lending
 * in the mid single digits, LP fees and real-world credit higher, and the
 * liquidation backstop highest because it carries the most risk. The balances
 * are deliberately tiny, matching a protocol in its first days rather than
 * implying volume that does not exist.
 */
export const marketRows: Market[] = [
  {
    mark: 'SYC',
    name: 'Stable Yield Core',
    ticker: 'SYC',
    symbol: 'USDG',
    strategy: 'Stablecoin lending',
    apy: 6.82,
    tvl: 428,
    yieldPaid: 6.24,
    depositors: 7,
    custody: 'partial',
    age: '2d',
  },
  {
    mark: 'CBR',
    name: 'Cabal Reserve',
    ticker: 'CBR',
    symbol: 'USDG',
    strategy: 'Stablecoin lending',
    apy: 5.47,
    tvl: 315,
    yieldPaid: 3.41,
    depositors: 5,
    custody: 'locked',
    age: '2d',
  },
  {
    mark: 'DLP',
    name: 'Deep Liquidity Pool',
    ticker: 'DLP',
    symbol: 'USDG',
    strategy: 'Liquidity provision',
    apy: 11.35,
    tvl: 196,
    yieldPaid: 4.08,
    depositors: 4,
    custody: 'deployed',
    age: '1d',
  },
  {
    mark: 'TEB',
    name: 'Tokenised Equity Basket',
    ticker: 'TEB',
    symbol: 'NVDA',
    strategy: 'Tokenised assets',
    apy: 4.18,
    tvl: 142,
    yieldPaid: 0.87,
    depositors: 3,
    custody: 'locked',
    age: '1d',
  },
  {
    mark: 'RCV',
    name: 'Receivables Note',
    ticker: 'RCV',
    symbol: 'USDG',
    strategy: 'Real-world credit',
    apy: 9.6,
    tvl: 274,
    yieldPaid: 3.76,
    depositors: 4,
    custody: 'partial',
    age: '8h',
  },
  {
    mark: 'BSR',
    name: 'Backstop Reserve',
    ticker: 'BSR',
    symbol: 'USDG',
    strategy: 'Liquidation backstop',
    apy: 14.2,
    tvl: 88,
    yieldPaid: 2.15,
    depositors: 2,
    custody: 'locked',
    age: '5h',
  },
]

export const custodyLabel: Record<Custody, string> = {
  locked: 'idle in vault',
  partial: 'partly deployed',
  deployed: 'fully deployed',
}

/** "SYC · USDG", as shown under every market name. */
export const marketPair = (market: Market) => `${market.ticker} · ${market.symbol}`

export const formatApy = (apy: number | null) => (apy === null ? 'n/a' : `${apy.toFixed(2)}%`)

/** Compact amounts, so a wide column never forces the table sideways. */
export function formatAmount(value: number, symbol: string) {
  if (value === 0) return `0 ${symbol}`
  for (const [size, suffix] of [
    [1e9, 'B'],
    [1e6, 'M'],
    [1e3, 'K'],
  ] as const) {
    if (value >= size) return `${(value / size).toFixed(2)}${suffix} ${symbol}`
  }
  return `${value.toLocaleString('en-US')} ${symbol}`
}
