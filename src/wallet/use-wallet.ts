import { useCallback } from 'react'

import { chainReady, env, walletReady } from '@/lib/env'
import { useWalletStore } from '@/store/use-wallet-store'

/**
 * Everything a page needs to know about the wallet, with no wagmi import.
 * Reading this does not pull the wallet bundle; only calling `connect` does.
 */
export function useWallet() {
  const { address, isConnected, isConnecting, isSwitching, chainId, actions, ready, activate } =
    useWalletStore()

  const connect = useCallback(() => {
    if (!walletReady) return
    // Loads the runtime on the first click, then opens the modal.
    activate(true)
    actions?.openModal()
  }, [activate, actions])

  const disconnect = useCallback(() => actions?.disconnect(), [actions])
  const switchToAppChain = useCallback(() => actions?.switchChain(), [actions])

  return {
    address,
    isConnected,
    isConnecting,
    isSwitching,
    connect,
    disconnect,
    switchToAppChain,
    // Only meaningful once our own chain is defined; before that the modal
    // connects on a stand-in network and there is nothing to switch to.
    onWrongChain: chainReady && isConnected && ready && chainId !== env.chainId,
    /** False when Reown or the chain is not configured yet. */
    canConnect: walletReady,
  }
}
