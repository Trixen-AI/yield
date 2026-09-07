import { useMemo, useState } from 'react'
import { ArrowUpRight, Info } from 'lucide-react'

import { Container, Section, SectionHead } from '@/components/section'
import { Badge } from '@/components/ui/badge'
import { SmartLink } from '@/components/smart-link'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { links } from '@/content/brand'
import { markets } from '@/content/copy'
import {
  marketPair,
  formatApy,
  formatAmount,
  custodyLabel,
  marketRows,
  type Market,
} from '@/content/markets'
import { cn } from '@/lib/utils'

const NUMERIC_COLUMNS = new Set(['APY', 'TVL', 'Yield paid', 'Depositors', 'Age'])

function MarketIdentity({ market }: { market: Market }) {
  return (
    <div className="flex min-w-0 items-center gap-3 md:min-w-[13rem]">
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
  )
}

function ColumnLabel({ label }: { label: string }) {
  const hint = markets.columnHints[label]
  if (!hint) return <>{label}</>

  return (
    <Tooltip>
      <TooltipTrigger className="inline-flex items-center gap-1.5 rounded-sm underline-offset-4 hover:underline">
        {label}
        <Info className="size-3 opacity-60" aria-hidden="true" />
        <span className="sr-only">What this column means</span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">{hint}</TooltipContent>
    </Tooltip>
  )
}

export function MarketsSection() {
  const [filter, setFilter] = useState('all')

  const rows = useMemo(
    () => (filter === 'all' ? marketRows : marketRows.filter((m) => m.strategy === filter)),
    [filter],
  )

  return (
    <Section id="markets">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead eyebrow={markets.eyebrow} title={markets.title} lead={markets.lead} />
          <Button asChild variant="secondary" size="sm" data-reveal>
            <SmartLink href={links.markets}>
              {markets.linkLabel}
              <ArrowUpRight className="size-3.5" />
            </SmartLink>
          </Button>
        </div>

        <Tabs value={filter} onValueChange={setFilter} className="mt-10 gap-6">
          <div className="-mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
            {/* A sunken track holding raised pills, the canonical soft-UI
                switch, and it makes the selected state read by depth as well
                as by colour. */}
            <TabsList className="h-auto w-fit gap-1 rounded-full p-1.5 neu-pressed">
              {markets.filters.map((tab) => (
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

          {/* One panel, re-keyed to the active filter: the trigger's
              aria-controls always points at a panel that exists. */}
          <TabsContent value={filter} className="mt-0 focus-visible:outline-none">
            {rows.length === 0 ? (
              <p className="rounded-2xl p-12 text-center text-sm text-muted-foreground neu-pressed">
                No market has been deployed with this strategy yet.
              </p>
            ) : (
              <>
                {/* Desktop: a scrollable table that never widens the page. */}
                <div
                  className="hidden overflow-x-auto rounded-2xl p-3 neu-raised md:block"
                  tabIndex={0}
                  role="region"
                  aria-label={markets.title}
                >
                  <Table className="min-w-[62rem] border-separate border-spacing-y-1">
                    <TableHeader className="[&_tr]:border-b-0">
                      <TableRow className="border-b-0 hover:bg-transparent">
                        {markets.columns.map((column) => (
                          <TableHead
                            key={column}
                            className={cn(
                              'eyebrow h-10 text-muted-foreground',
                              NUMERIC_COLUMNS.has(column) && 'text-right',
                            )}
                          >
                            <ColumnLabel label={column} />
                          </TableHead>
                        ))}
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
                          <TableCell className="tnum py-4 text-right">
                            {formatApy(market.apy)}
                          </TableCell>
                          <TableCell className="tnum py-4 text-right">
                            {formatAmount(market.tvl, market.symbol)}
                          </TableCell>
                          <TableCell className="tnum py-4 text-right">
                            {formatAmount(market.yieldPaid, market.symbol)}
                          </TableCell>
                          <TableCell className="tnum py-4 text-right">
                            {market.depositors}
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge variant={market.custody === 'locked' ? 'default' : 'brand'}>
                              {custodyLabel[market.custody]}
                            </Badge>
                          </TableCell>
                          <TableCell className="tnum py-4 text-right text-muted-foreground">
                            {market.age}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile: the same rows as stacked cards. */}
                <ul className="grid gap-4 md:hidden">
                  {rows.map((market) => (
                    <li key={market.mark} className="rounded-xl p-5 neu-raised">
                      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                        <MarketIdentity market={market} />
                        <Badge variant={market.custody === 'locked' ? 'default' : 'brand'}>
                          {custodyLabel[market.custody]}
                        </Badge>
                      </div>
                      <dl className="mt-5 grid grid-cols-2 gap-4 rounded-lg p-4 neu-pressed">
                        {[
                          { label: 'APY', value: formatApy(market.apy) },
                          { label: 'TVL', value: formatAmount(market.tvl, market.symbol) },
                          {
                            label: 'Yield paid',
                            value: formatAmount(market.yieldPaid, market.symbol),
                          },
                          { label: 'Depositors', value: String(market.depositors) },
                        ].map((cell) => (
                          <div key={cell.label}>
                            <dt className="eyebrow">{cell.label}</dt>
                            <dd className="tnum mt-0.5 font-medium">{cell.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </TabsContent>
        </Tabs>

        <p className="mt-5 max-w-[60ch] text-[0.8125rem] text-muted-foreground">
          {markets.emptyNote}
        </p>
      </Container>
    </Section>
  )
}
