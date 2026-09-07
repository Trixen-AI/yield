import { useMemo } from 'react'
import { Link } from 'react-router'
import { ArrowUpRight, LayoutGrid, Rows3, Search } from 'lucide-react'

import { Container } from '@/components/section'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { markets as marketsCopy } from '@/content/copy'
import {
  marketPair,
  formatApy,
  formatAmount,
  custodyLabel,
  marketRows,
  type Market,
} from '@/content/markets'
import { useMarketView, type SortKey } from '@/store/use-market-view'
import { cn } from '@/lib/utils'

const SORTS: Array<{ value: SortKey; label: string }> = [
  { value: 'newest', label: 'Newest' },
  { value: 'tvl', label: 'TVL' },
  { value: 'apy', label: 'APY' },
  { value: 'depositors', label: 'Depositors' },
]

function MarketIdentity({ market }: { market: Market }) {
  return (
    <span className="flex min-w-0 items-center gap-3">
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
    </span>
  )
}

export function MarketsPage() {
  const { query, strategy, sort, view, setQuery, setStrategy, setSort, setView, clear } =
    useMarketView()

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const filtered = marketRows.filter((market) => {
      const matchesStrategy = strategy === 'all' || market.strategy === strategy
      const matchesQuery =
        needle === '' ||
        market.name.toLowerCase().includes(needle) ||
        marketPair(market).toLowerCase().includes(needle)
      return matchesStrategy && matchesQuery
    })

    // `newest` is deployment order, which is the order the factory produced them.
    if (sort === 'newest') return filtered
    return [...filtered].sort((a, b) => {
      if (sort === 'tvl') return b.tvl - a.tvl
      if (sort === 'apy') return (b.apy ?? -1) - (a.apy ?? -1)
      return b.depositors - a.depositors
    })
  }, [query, strategy, sort])

  return (
    <Container>
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="eyebrow inline-block rounded-full px-3.5 py-1.5 neu-pressed-sm">
            {marketsCopy.eyebrow}
          </p>
          <h1 className="mt-5 text-title font-semibold text-balance">{marketsCopy.title}</h1>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground">
            {marketsCopy.lead}
          </p>
        </div>
        <Button asChild variant="brand">
          <Link to="/launch">Launch a market</Link>
        </Button>
      </header>

      {/* One column on small screens: as a single wrapping row the search box
          was squeezed to its icon and overlapped the sort buttons. */}
      <div className="mt-10 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative w-full lg:max-w-xs lg:flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search markets"
            aria-label="Search markets"
            className="h-11 rounded-lg border-none pl-10 neu-pressed"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {SORTS.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant={sort === option.value ? 'secondary' : 'ghost'}
              onClick={() => setSort(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>

        <div className="flex w-fit gap-1 rounded-lg p-1 neu-pressed lg:ml-auto">
          <Button
            size="icon-sm"
            variant={view === 'table' ? 'secondary' : 'ghost'}
            onClick={() => setView('table')}
            aria-label="Table view"
            aria-pressed={view === 'table'}
          >
            <Rows3 className="size-4" />
          </Button>
          <Button
            size="icon-sm"
            variant={view === 'grid' ? 'secondary' : 'ghost'}
            onClick={() => setView('grid')}
            aria-label="Grid view"
            aria-pressed={view === 'grid'}
          >
            <LayoutGrid className="size-4" />
          </Button>
        </div>
      </div>

      <Tabs value={strategy} onValueChange={setStrategy} className="mt-5">
        <div className="-mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
          <TabsList className="h-auto w-fit gap-1 rounded-full p-1.5 neu-pressed">
            {marketsCopy.filters.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-full px-4 py-2 text-[0.8125rem] text-muted-foreground data-[state=active]:text-foreground data-[state=active]:neu-raised-sm"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

      {rows.length === 0 ? (
        <div className="mt-8 rounded-2xl p-12 text-center neu-pressed">
          <p className="text-sm text-muted-foreground">
            Nothing matches that. The factory has deployed {marketRows.length} markets in total.
          </p>
          <Button size="sm" variant="secondary" className="mt-5" onClick={clear}>
            Clear filters
          </Button>
        </div>
      ) : view === 'table' ? (
        <div
          className="mt-8 overflow-x-auto rounded-2xl p-3 neu-raised"
          tabIndex={0}
          role="region"
          aria-label="Markets"
        >
          <Table className="min-w-[56rem] border-separate border-spacing-y-1">
            <TableHeader className="[&_tr]:border-b-0">
              <TableRow className="border-b-0 hover:bg-transparent">
                {['Market', 'Strategy', 'APY', 'TVL', 'Depositors', 'Custody', ''].map(
                  (column, i) => (
                    <TableHead
                      key={column || 'action'}
                      className={cn(
                        'eyebrow h-10 text-muted-foreground',
                        i >= 2 && i <= 4 && 'text-right',
                      )}
                    >
                      {column}
                    </TableHead>
                  ),
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((market) => (
                <TableRow
                  key={market.mark}
                  className="border-b-0 transition-colors hover:bg-muted/70 [&>td:first-child]:rounded-l-lg [&>td:last-child]:rounded-r-lg"
                >
                  <TableCell className="py-4">
                    <MarketIdentity market={market} />
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge>{market.strategy}</Badge>
                  </TableCell>
                  <TableCell className="tnum py-4 text-right">{formatApy(market.apy)}</TableCell>
                  <TableCell className="tnum py-4 text-right">
                    {formatAmount(market.tvl, market.symbol)}
                  </TableCell>
                  <TableCell className="tnum py-4 text-right">{market.depositors}</TableCell>
                  <TableCell className="py-4">
                    <Badge variant={market.custody === 'locked' ? 'muted' : 'brand'}>
                      {custodyLabel[market.custody]}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <Button asChild size="sm" variant="secondary">
                      <Link to={`/markets/${market.mark}`}>
                        Open
                        <ArrowUpRight className="size-3.5" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((market) => (
            <li key={market.mark}>
              <Link
                to={`/markets/${market.mark}`}
                className="block rounded-xl p-6 neu-raised transition-shadow duration-300 hover:neu-raised-lg"
              >
                <MarketIdentity market={market} />
                <div className="mt-5 flex flex-wrap gap-2">
                  <Badge>{market.strategy}</Badge>
                  <Badge variant={market.custody === 'locked' ? 'muted' : 'brand'}>
                    {custodyLabel[market.custody]}
                  </Badge>
                </div>
                <dl className="mt-5 grid grid-cols-2 gap-4 rounded-lg p-4 neu-pressed">
                  <div>
                    <dt className="eyebrow">APY</dt>
                    <dd className="tnum mt-0.5 font-medium">{formatApy(market.apy)}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow">TVL</dt>
                    <dd className="tnum mt-0.5 font-medium">
                      {formatAmount(market.tvl, market.symbol)}
                    </dd>
                  </div>
                </dl>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-5 max-w-[60ch] text-[0.8125rem] text-muted-foreground">
        {marketsCopy.emptyNote}
      </p>
    </Container>
  )
}
