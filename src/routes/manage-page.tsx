import { Link } from 'react-router'
import { Wallet } from 'lucide-react'

import { Container } from '@/components/section'
import { Button } from '@/components/ui/button'
import { env, shortenAddress } from '@/lib/env'
import { useWallet } from '@/wallet/use-wallet'

export function ManagePage() {
  const { address, isConnected, connect, canConnect, onWrongChain, switchToAppChain } = useWallet()

  return (
    <Container>
      <header className="max-w-2xl">
        <p className="eyebrow inline-block rounded-full px-3.5 py-1.5 neu-pressed-sm">
          Manage a market
        </p>
        <h1 className="mt-5 text-title font-semibold text-balance">
          The markets you created, and the capital in them.
        </h1>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground">
          A creator can move capital to the strategy declared at launch, up to the custody ceiling
          fixed at launch. Nothing else. There is no admin key to use here.
        </p>
      </header>

      <div className="mt-10 rounded-2xl p-10 text-center neu-pressed md:p-14">
        {!isConnected ? (
          <>
            <Wallet className="mx-auto size-6 text-muted-foreground" aria-hidden="true" />
            <h2 className="mt-5 text-lg font-semibold tracking-tight">
              Connect a wallet to see your markets
            </h2>
            <p className="mx-auto mt-3 max-w-[52ch] text-[0.9375rem] text-muted-foreground">
              {canConnect
                ? 'Markets are looked up by the address that deployed them, so nothing can be shown until a wallet is connected.'
                : 'Wallet connection is not available yet.'}
            </p>
            {canConnect ? (
              <Button variant="brand" size="lg" className="mt-7" onClick={connect}>
                Connect wallet
              </Button>
            ) : null}
          </>
        ) : onWrongChain ? (
          <>
            <h2 className="text-lg font-semibold tracking-tight">Wrong network</h2>
            <p className="mx-auto mt-3 max-w-[52ch] text-[0.9375rem] text-muted-foreground">
              Your wallet is on a different chain. Markets live on {env.chainName}.
            </p>
            <Button variant="brand" size="lg" className="mt-7" onClick={switchToAppChain}>
              Switch to {env.chainName}
            </Button>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold tracking-tight">No markets yet</h2>
            <p className="mx-auto mt-3 max-w-[56ch] text-[0.9375rem] text-muted-foreground">
              <span className="tnum">{address ? shortenAddress(address) : ''}</span> has not
              deployed a market. Whatever you launch will appear here.
            </p>
            <Button asChild variant="brand" size="lg" className="mt-7">
              <Link to="/launch">Launch your first market</Link>
            </Button>
          </>
        )}
      </div>
    </Container>
  )
}
