import { Suspense, lazy, useEffect, type ReactNode } from 'react'

import { walletReady } from '@/lib/env'
import { shouldAutoActivate, useWalletStore } from '@/store/use-wallet-store'

/**
 * Mounts the wallet runtime as a sibling of the app rather than a wrapper, so
 * activating it never remounts the page the user is on.
 *
 * The runtime chunk is fetched when someone clicks connect, or immediately for
 * a browser that has connected before, so returning users still reconnect on
 * their own.
 */
const WalletRuntime = lazy(() => import('@/wallet/wallet-runtime'))

export function WalletGate({ children }: { children: ReactNode }) {
  const activated = useWalletStore((state) => state.activated)
  const activate = useWalletStore((state) => state.activate)

  useEffect(() => {
    if (walletReady && shouldAutoActivate()) activate(false)
  }, [activate])

  return (
    <>
      {activated && walletReady ? (
        <Suspense fallback={null}>
          <WalletRuntime />
        </Suspense>
      ) : null}
      {children}
    </>
  )
}
