import { Check, Info, RotateCcw } from 'lucide-react'

import { Container } from '@/components/section'
import { SpecList } from '@/components/spec-list'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { brand, chain, economics, featuredSource } from '@/content/brand'
import { chainReady, env, factoryReady } from '@/lib/env'
import { cn } from '@/lib/utils'
import {
  stepErrors,
  useLaunchDraft,
  validateDraft,
  type LaunchDraft,
} from '@/store/use-launch-draft'
import { useWallet } from '@/wallet/use-wallet'

const STEPS = [
  { title: 'Describe the yield', hint: 'What it is called and where the return comes from.' },
  { title: 'Set the terms', hint: 'The strategy, the custody ceiling and your fee.' },
  { title: 'Review and deploy', hint: 'One transaction to the factory.' },
]

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id} className="eyebrow">
        {label}
      </Label>
      {children}
      {error ? (
        <p className="text-[0.8125rem] text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-[0.8125rem] text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}

const inputClass = 'neu-pressed h-12 rounded-lg border-none'

export function LaunchPage() {
  const { draft, step, touched, set, touch, next, back, goTo, reset } = useLaunchDraft()
  const { isConnected, onWrongChain, switchToAppChain, canConnect, connect } = useWallet()

  const errors = stepErrors(draft, step)
  const allErrors = validateDraft(draft)
  const stepClean = Object.keys(errors).length === 0
  const draftClean = Object.keys(allErrors).length === 0

  const show = (field: keyof LaunchDraft) => (touched[field] ? errors[field] : undefined)

  const protocolCut = (draft.performanceFeePct * economics.protocolFeeSharePct) / 100
  const creatorCut = draft.performanceFeePct - protocolCut

  const blocker = !canConnect
    ? 'Wallet connection is not available yet.'
    : !chainReady
      ? 'This market is not open for transactions yet.'
      : !factoryReady
        ? 'This market is not open for transactions yet.'
        : !draftClean
          ? 'Some fields still need fixing.'
          : null

  return (
    <Container>
      <header className="max-w-2xl">
        <p className="eyebrow inline-block rounded-full px-3.5 py-1.5 neu-pressed-sm">
          Launch a market
        </p>
        <h1 className="mt-5 text-title font-semibold text-balance">
          Name the yield, set the terms, deploy the vault.
        </h1>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground">
          {brand.name} deploys the same vault every time. Nothing here is reviewed by anyone, and
          the contract has no owner once it exists.
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.7fr] lg:gap-12">
        <ol className="grid h-fit gap-3">
          {STEPS.map((entry, index) => {
            const state = index === step ? 'current' : index < step ? 'done' : 'todo'
            return (
              <li key={entry.title}>
                <button
                  type="button"
                  onClick={() => goTo(index)}
                  className={cn(
                    'w-full rounded-xl p-5 text-left transition-shadow',
                    state === 'current' ? 'neu-raised' : 'neu-pressed',
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        'tnum grid size-8 shrink-0 place-items-center rounded-lg text-[0.75rem]',
                        state === 'todo'
                          ? 'text-muted-foreground neu-pressed-sm'
                          : 'bg-brand text-brand-foreground',
                      )}
                      aria-hidden="true"
                    >
                      {state === 'done' ? <Check className="size-4" /> : index + 1}
                    </span>
                    <span className="font-medium">{entry.title}</span>
                  </span>
                  <span className="mt-2 block text-[0.8125rem] text-muted-foreground">
                    {entry.hint}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>

        <div className="rounded-2xl p-6 neu-raised md:p-8">
          {step === 0 ? (
            <div className="grid gap-6">
              <Field
                id="name"
                label="Market name"
                hint="How it appears in the market list."
                error={show('name')}
              >
                <Input
                  id="name"
                  value={draft.name}
                  onChange={(event) => set('name', event.target.value)}
                  onBlur={() => touch('name')}
                  placeholder="Stable Yield Core"
                  className={inputClass}
                />
              </Field>

              <Field
                id="ticker"
                label="Share ticker"
                hint="Uppercase, 2 to 11 characters. Depositors hold these."
                error={show('ticker')}
              >
                <Input
                  id="ticker"
                  value={draft.ticker}
                  onChange={(event) => set('ticker', event.target.value.toUpperCase())}
                  onBlur={() => touch('ticker')}
                  placeholder="SYC"
                  className={cn(inputClass, 'tnum')}
                />
              </Field>

              <Field
                id="description"
                label="Where the return comes from"
                hint="One honest sentence. Depositors read this before anything else."
                error={show('description')}
              >
                <Textarea
                  id="description"
                  rows={4}
                  value={draft.description}
                  onChange={(event) => set('description', event.target.value)}
                  onBlur={() => touch('description')}
                  placeholder="Supplies USDG into a lending venue and passes the borrow rate through to depositors."
                  className="rounded-lg border-none neu-pressed"
                />
              </Field>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-6">
              <Field
                id="assetSymbol"
                label="Settlement asset"
                hint="The token depositors send and get back."
                error={show('assetSymbol')}
              >
                <Input
                  id="assetSymbol"
                  value={draft.assetSymbol}
                  onChange={(event) => set('assetSymbol', event.target.value.toUpperCase())}
                  onBlur={() => touch('assetSymbol')}
                  className={cn(inputClass, 'tnum')}
                />
              </Field>

              <div className="grid gap-2">
                <span className="eyebrow">Strategy</span>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      {
                        value: 'source',
                        title: featuredSource.name,
                        body: `A live ${featuredSource.standard} vault on ${chain.name}.`,
                      },
                      {
                        value: 'custom',
                        title: 'Your own address',
                        body: 'A desk, a contract or a multisig that you name.',
                      },
                    ] as const
                  ).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => set('strategyMode', option.value)}
                      aria-pressed={draft.strategyMode === option.value}
                      className={cn(
                        'rounded-xl p-5 text-left transition-shadow',
                        draft.strategyMode === option.value ? 'neu-raised' : 'neu-pressed',
                      )}
                    >
                      <span className="block font-medium">{option.title}</span>
                      <span className="mt-1.5 block text-[0.8125rem] text-muted-foreground">
                        {option.body}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {draft.strategyMode === 'custom' ? (
                <Field
                  id="strategyAddress"
                  label="Strategy address"
                  hint="Capital can only ever move here. It cannot be changed after launch."
                  error={show('strategyAddress')}
                >
                  <Input
                    id="strategyAddress"
                    value={draft.strategyAddress}
                    onChange={(event) => set('strategyAddress', event.target.value)}
                    onBlur={() => touch('strategyAddress')}
                    placeholder="0x…"
                    className={cn(inputClass, 'tnum')}
                  />
                </Field>
              ) : null}

              <Field
                id="custodyCeilingPct"
                label={`Custody ceiling: ${draft.custodyCeilingPct}%`}
                hint="The most of the vault that can sit at the strategy. Fixed at launch."
                error={show('custodyCeilingPct')}
              >
                <input
                  id="custodyCeilingPct"
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={draft.custodyCeilingPct}
                  onChange={(event) => set('custodyCeilingPct', Number(event.target.value))}
                  className="w-full accent-brand"
                />
              </Field>

              <Field
                id="performanceFeePct"
                label={`Performance fee: ${draft.performanceFeePct}%`}
                hint={`Charged on yield only, never on principal. Capped at ${economics.maxPerformanceFee}.`}
                error={show('performanceFeePct')}
              >
                <input
                  id="performanceFeePct"
                  type="range"
                  min={0}
                  max={economics.maxPerformanceFeePct}
                  step={1}
                  value={draft.performanceFeePct}
                  onChange={(event) => set('performanceFeePct', Number(event.target.value))}
                  className="w-full accent-brand"
                />
              </Field>

              <p className="rounded-lg p-4 text-[0.8125rem] text-muted-foreground neu-pressed">
                Of every 100 units of yield:{' '}
                <span className="tnum text-foreground">{100 - draft.performanceFeePct}</span> to
                depositors, <span className="tnum text-foreground">{creatorCut}</span> to you,{' '}
                <span className="tnum text-foreground">{protocolCut}</span> to the protocol.
              </p>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-6">
              <div>
                <p className="eyebrow mb-4">What gets deployed</p>
                <SpecList
                  items={[
                    { term: 'Market name', value: draft.name || 'not set' },
                    { term: 'Share ticker', value: draft.ticker || 'not set', mono: true },
                    { term: 'Settlement asset', value: draft.assetSymbol, mono: true },
                    {
                      term: 'Strategy',
                      value:
                        draft.strategyMode === 'source'
                          ? featuredSource.name
                          : draft.strategyAddress || 'not set',
                      mono: draft.strategyMode === 'custom',
                    },
                    { term: 'Custody ceiling', value: `${draft.custodyCeilingPct}%`, mono: true },
                    { term: 'Performance fee', value: `${draft.performanceFeePct}%`, mono: true },
                    {
                      term: 'Launch fee',
                      value: `${economics.launchFee} ${chain.gasSymbol}`,
                      mono: true,
                    },
                    { term: 'Vault owner', value: 'none; no admin key exists' },
                  ]}
                />
              </div>

              {draft.description ? (
                <div className="rounded-lg p-4 neu-pressed">
                  <p className="eyebrow mb-2">Description</p>
                  <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
                    {draft.description}
                  </p>
                </div>
              ) : null}

              <div className="grid gap-3">
                {!canConnect || isConnected ? null : (
                  <Button variant="brand" size="lg" onClick={connect}>
                    Connect wallet to deploy
                  </Button>
                )}

                {isConnected && onWrongChain ? (
                  <Button variant="brand" size="lg" onClick={switchToAppChain}>
                    Switch to {env.chainName}
                  </Button>
                ) : null}

                {(isConnected && !onWrongChain) || !canConnect ? (
                  <Button variant="brand" size="lg" disabled={blocker !== null}>
                    Deploy market for {economics.launchFee} {chain.gasSymbol}
                  </Button>
                ) : null}

                {blocker ? (
                  <p className="flex items-start gap-2 text-[0.8125rem] text-muted-foreground">
                    <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                    {blocker}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <Button variant="ghost" size="sm" onClick={reset}>
              <RotateCcw className="size-4" />
              Start over
            </Button>
            <div className="flex gap-3">
              {step > 0 ? (
                <Button variant="secondary" onClick={back}>
                  Back
                </Button>
              ) : null}
              {step < STEPS.length - 1 ? (
                <Button
                  onClick={() => {
                    for (const field of Object.keys(errors) as Array<keyof LaunchDraft>) {
                      touch(field)
                    }
                    if (stepClean) next()
                  }}
                >
                  Continue
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-8 max-w-[70ch] text-[0.8125rem] leading-relaxed text-muted-foreground">
        Your draft is saved in this browser as you type, so a refresh will not lose it. It never
        leaves your device until you sign the deployment.
      </p>
    </Container>
  )
}
