import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAppKit } from '@reown/appkit/react'
import { WagmiProvider, useAccount, useChainId, useDisconnect, useSwitchChain } from 'wagmi'

import { env } from '@/lib/env'
import { rememberConnection, useWalletStore } from '@/store/use-wallet-store'
import { wagmiConfig } from '@/wallet/config'

/**
 * Everything that depends on wagmi and AppKit lives behind this module, which
 * is loaded on demand by `WalletGate`. Nothing here is imported by a page.
 *
 * Chain state is server state, so it sits in TanStack Query by way of wagmi.
 * Zustand only carries the summary the UI needs, which is why there is no
 * Redux in this project.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 15_000, retry: 1, refetchOnWindowFocus: false },
  },
})

/** Publishes wagmi state into the store and registers the actions. */
function Bridge() {
  const { open } = useAppKit()
  const { address, isConnected, isConnecting, isReconnecting } = useAccount()
  const { disconnect } = useDisconnect()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const chainId = useChainId()

  const setAccount = useWalletStore((state) => state.setAccount)
  const setReady = useWalletStore((state) => state.setReady)

  useEffect(() => {
    setReady({
      openModal: () => void open(),
      disconnect: () => disconnect(),
      switchChain: () => switchChain({ chainId: env.chainId }),
    })
  }, [open, disconnect, switchChain, setReady])

  useEffect(() => {
    setAccount({
      address,
      isConnected,
      isConnecting: isConnecting || isReconnecting,
      isSwitching,
      chainId,
    })
  }, [address, isConnected, isConnecting, isReconnecting, isSwitching, chainId, setAccount])

  // Remember only that a connection happened, never which wallet or address.
  useEffect(() => {
    rememberConnection(isConnected)
  }, [isConnected])

  // Honour a connect click that arrived while this chunk was still loading.
  const pendingOpen = useWalletStore((state) => state.pendingOpen)
  const clearPendingOpen = useWalletStore((state) => state.clearPendingOpen)
  useEffect(() => {
    if (!pendingOpen) return
    clearPendingOpen()
    void open()
  }, [pendingOpen, clearPendingOpen, open])

  return null
}

export default function WalletRuntime() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Bridge />
      </QueryClientProvider>
    </WagmiProvider>
  )
}
