import { create } from 'zustand'

/**
 * Wallet state, published by the lazily mounted runtime.
 *
 * The point of routing it through a store is that pages can read wallet state
 * without importing wagmi. Only `wallet-runtime.tsx` touches wagmi and AppKit,
 * and that module is not fetched until someone actually asks to connect.
 */

export interface WalletActions {
  openModal: () => void
  disconnect: () => void
  switchChain: () => void
}

interface WalletStore {
  /** The runtime has been asked for; the chunk is loading or loaded. */
  activated: boolean
  /** The runtime is mounted and its actions are usable. */
  ready: boolean
  /** Open the modal the moment the runtime becomes ready. */
  pendingOpen: boolean

  address?: string
  isConnected: boolean
  isConnecting: boolean
  isSwitching: boolean
  chainId?: number

  actions?: WalletActions

  activate: (openModal: boolean) => void
  setReady: (actions: WalletActions) => void
  clearPendingOpen: () => void
  setAccount: (next: {
    address?: string
    isConnected: boolean
    isConnecting: boolean
    isSwitching: boolean
    chainId?: number
  }) => void
}

export const useWalletStore = create<WalletStore>()((set) => ({
  activated: false,
  ready: false,
  pendingOpen: false,
  isConnected: false,
  isConnecting: false,
  isSwitching: false,

  activate: (openModal) =>
    set((state) => ({
      activated: true,
      // Already running: open straight away rather than queueing.
      pendingOpen: openModal && !state.ready,
      isConnecting: openModal && !state.ready,
    })),
  setReady: (actions) => set({ ready: true, actions }),
  clearPendingOpen: () => set({ pendingOpen: false }),
  setAccount: (next) => set(next),
}))

const RECONNECT_KEY = 'harvestpad.wallet-connected'

/** True when this browser connected before, so the runtime loads on its own. */
export function shouldAutoActivate() {
  try {
    return localStorage.getItem(RECONNECT_KEY) === '1'
  } catch {
    return false
  }
}

export function rememberConnection(connected: boolean) {
  try {
    if (connected) localStorage.setItem(RECONNECT_KEY, '1')
    else localStorage.removeItem(RECONNECT_KEY)
  } catch {
    /* storage blocked; the only cost is no auto-reconnect next visit */
  }
}
