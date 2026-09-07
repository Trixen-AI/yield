import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, Info } from 'lucide-react'

import { Container } from '@/components/section'
import { SpecList } from '@/components/spec-list'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { economics } from '@/content/brand'
import { marketPair, formatApy, formatAmount, custodyLabel, marketRows } from '@/content/markets'
import { env, factoryReady } from '@/lib/env'
import { useWallet } from '@/wallet/use-wallet'

function ActionPanel({ symbol }: { symbol: string }) {
  const [mode, setMode] = useState('deposit')
  const [amount, setAmount] = useState('')
  const { isConnected, onWrongChain, switchToAppChain, canConnect, connect } = useWallet()

  const parsed = Number(amount)
  const amountValid = amount !== '' && Number.isFinite(parsed) && parsed > 0

  // Every reason the button cannot be pressed, in the order a person hits them.
  const blocker = !canConnect
    ? 'Wallet connection is not available yet.'
    : !isConnected
      ? null
      : onWrongChain
        ? null
        : !factoryReady
          ? 'This market is not open for transactions yet.'
          : !amountValid
            ? 'Enter an amount above zero.'
            : null

  return (
    <div className="rounded-2xl p-6 neu-raised md:p-7">
      <Tabs value={mode} onValueChange={setMode}>
        <TabsList className="h-auto w-full gap-1 rounded-full p-1.5 neu-pressed">
          {['deposit', 'withdraw'].map((value) => (
            <TabsTrigger
              key={value}
              value={value}
              className="flex-1 rounded-full px-4 py-2 text-[0.8125rem] text-muted-foreground capitalize data-[state=active]:text-foreground data-[state=active]:neu-raised-sm"
            >
              {value}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-6">
        <Label htmlFor="amount" className="eyebrow">
          Amount
        </Label>
        <div className="relative mt-2">
          <Input
            id="amount"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0.00"
            className="tnum h-13 rounded-lg border-none pr-20 text-lg neu-pressed"
          />
          <span className="absolute top-1/2 right-4 -translate-y-1/2 font-mono text-[0.8125rem] text-muted-foreground">
            {symbol}
          </span>
        </div>
      </div>

      <dl className="mt-6 grid gap-1">
        {[
          {
            term: 'You receive',
            value: mode === 'deposit' ? 'shares, at the current price' : symbol,
          },
          {
            term: 'Performance fee',
            value: `on yield only, capped at ${economics.maxPerformanceFee}`,
          },
          {
            term: mode === 'deposit' ? 'Deposit limit' : 'Withdrawable now',
            value: 'read from the vault at submit time',
          },
        ].map((row) => (
          <div key={row.term} className="flex items-baseline justify-between gap-3 py-1.5">
            <dt className="text-[0.8125rem] text-muted-foreground">{row.term}</dt>
            <dd className="text-right text-[0.8125rem] font-medium">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6">
        {!canConnect || isConnected ? null : (
          <Button variant="brand" size="lg" className="w-full" onClick={connect}>
            Connect wallet to {mode}
          </Button>
        )}

        {isConnected && onWrongChain ? (
          <Button variant="brand" size="lg" className="w-full" onClick={switchToAppChain}>
            Switch to {env.chainName}
          </Button>
        ) : null}

        {(isConnected && !onWrongChain) || !canConnect ? (
          <Button size="lg" className="w-full capitalize" disabled={blocker !== null}>
            {mode}
          </Button>
        ) : null}

        {blocker ? (
          <p className="mt-3 flex items-start gap-2 text-[0.8125rem] text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            {blocker}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export function MarketDetailPage() {
  const { marketId } = useParams()
  const market = marketRows.find((row) => row.mark === marketId)

  if (!market) {
    return (
      <Container>
        <div className="rounded-2xl p-12 text-center neu-pressed">
          <h1 className="text-xl font-semibold tracking-tight">No such market</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            The factory has not deployed a market with that id.
          </p>
          <Button asChild variant="secondary" size="sm" className="mt-6">
            <Link to="/markets">Back to all markets</Link>
          </Button>
        </div>
      </Container>
    )
  }

  const symbol = market.symbol

  return (
    <Container>
      <Button asChild variant="ghost" size="sm">
        <Link to="/markets">
          <ArrowLeft className="size-4" />
          All markets
        </Link>
      </Button>

      <header className="mt-6 flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-center gap-4">
          <span
            className="grid size-14 shrink-0 place-items-center rounded-xl font-mono text-sm text-muted-foreground neu-pressed"
            aria-hidden="true"
          >
            {market.mark}
          </span>
          <div>
            <h1 className="text-title font-semibold tracking-tight">{market.name}</h1>
            <p className="mt-1 font-mono text-[0.8125rem] text-muted-foreground">
              {marketPair(market)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>{market.strategy}</Badge>
          <Badge variant={market.custody === 'locked' ? 'muted' : 'brand'}>
            {custodyLabel[market.custody]}
          </Badge>
        </div>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-8">
        <div className="grid gap-6">
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'APY', value: formatApy(market.apy) },
              { label: 'TVL', value: formatAmount(market.tvl, market.symbol) },
              { label: 'Yield paid', value: formatAmount(market.yieldPaid, market.symbol) },
              { label: 'Depositors', value: String(market.depositors) },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl p-5 neu-raised">
                <dt className="eyebrow">{stat.label}</dt>
                <dd className="tnum mt-2 text-xl font-medium">{stat.value}</dd>
              </div>
            ))}
          </dl>

          <div className="rounded-2xl p-6 neu-raised md:p-7">
            <p className="eyebrow mb-5">Terms</p>
            <SpecList
              items={[
                { term: 'Settlement asset', value: symbol },
                { term: 'Strategy', value: market.strategy },
                { term: 'Custody', value: custodyLabel[market.custody] },
                { term: 'Age', value: market.age, mono: true },
                {
                  term: 'Performance fee',
                  value: `on yield only, capped at ${economics.maxPerformanceFee}`,
                },
                { term: 'Protocol share of that fee', value: economics.protocolFeeShare },
              ]}
            />
          </div>
        </div>

        <ActionPanel symbol={symbol} />
      </div>
    </Container>
  )
}
