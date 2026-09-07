import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SortKey = 'newest' | 'tvl' | 'apy' | 'depositors'
export type ViewMode = 'table' | 'grid'

interface MarketViewStore {
  query: string
  strategy: string
  sort: SortKey
  view: ViewMode
  setQuery: (query: string) => void
  setStrategy: (strategy: string) => void
  setSort: (sort: SortKey) => void
  setView: (view: ViewMode) => void
  clear: () => void
}

/**
 * How the market list is being looked at. Persisted because a filter someone
 * chose should survive a reload, and deliberately separate from the market data
 * itself, which belongs to the chain cache rather than to a store.
 */
export const useMarketView = create<MarketViewStore>()(
  persist(
    (set) => ({
      query: '',
      strategy: 'all',
      sort: 'newest',
      view: 'table',
      setQuery: (query) => set({ query }),
      setStrategy: (strategy) => set({ strategy }),
      setSort: (sort) => set({ sort }),
      setView: (view) => set({ view }),
      clear: () => set({ query: '', strategy: 'all', sort: 'newest' }),
    }),
    {
      name: 'harvestpad.market-view',
      partialize: (state) => ({ sort: state.sort, view: state.view }),
    },
  ),
)
