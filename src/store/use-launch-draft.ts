import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { ADDRESS_PATTERN } from '@/lib/env'
import { economics } from '@/content/brand'

/**
 * The launch form draft.
 *
 * This is the one piece of state that genuinely belongs in a store rather than
 * in the chain cache: it is the user's unsubmitted work, it spans three steps,
 * and losing it to a refresh would be infuriating, so it persists.
 */

export type StrategyMode = 'source' | 'custom'

export interface LaunchDraft {
  name: string
  ticker: string
  description: string
  assetSymbol: string
  strategyMode: StrategyMode
  strategyAddress: string
  custodyCeilingPct: number
  performanceFeePct: number
}

export const EMPTY_DRAFT: LaunchDraft = {
  name: '',
  ticker: '',
  description: '',
  assetSymbol: 'USDG',
  strategyMode: 'source',
  strategyAddress: '',
  custodyCeilingPct: 80,
  performanceFeePct: 10,
}

export type DraftErrors = Partial<Record<keyof LaunchDraft, string>>

/** Fields belonging to each step, so a step can be validated on its own. */
export const STEP_FIELDS: Array<Array<keyof LaunchDraft>> = [
  ['name', 'ticker', 'description'],
  ['assetSymbol', 'strategyMode', 'strategyAddress', 'custodyCeilingPct', 'performanceFeePct'],
  [],
]

export function validateDraft(draft: LaunchDraft): DraftErrors {
  const errors: DraftErrors = {}

  if (draft.name.trim().length < 3) {
    errors.name = 'Give the market a name of at least 3 characters.'
  } else if (draft.name.trim().length > 48) {
    errors.name = 'Keep the name under 48 characters.'
  }

  const ticker = draft.ticker.trim()
  if (!/^[A-Z0-9]{2,11}$/.test(ticker)) {
    errors.ticker = 'Two to eleven characters, uppercase letters and digits only.'
  }

  if (draft.description.trim().length < 20) {
    errors.description = 'Say where the return comes from, in at least 20 characters.'
  } else if (draft.description.trim().length > 280) {
    errors.description = 'Keep it under 280 characters.'
  }

  if (draft.assetSymbol.trim() === '') {
    errors.assetSymbol = 'Name the asset the market settles in.'
  }

  if (draft.strategyMode === 'custom' && !ADDRESS_PATTERN.test(draft.strategyAddress.trim())) {
    errors.strategyAddress = 'Enter a valid 20-byte address, starting 0x.'
  }

  if (draft.custodyCeilingPct < 0 || draft.custodyCeilingPct > 100) {
    errors.custodyCeilingPct = 'The ceiling is a percentage between 0 and 100.'
  }

  if (draft.performanceFeePct < 0 || draft.performanceFeePct > economics.maxPerformanceFeePct) {
    errors.performanceFeePct = `The fee is capped at ${economics.maxPerformanceFee} of yield.`
  }

  return errors
}

export function stepErrors(draft: LaunchDraft, step: number): DraftErrors {
  const all = validateDraft(draft)
  const fields = STEP_FIELDS[step] ?? []
  const scoped: DraftErrors = {}
  for (const field of fields) {
    if (all[field]) scoped[field] = all[field]
  }
  return scoped
}

interface LaunchDraftStore {
  draft: LaunchDraft
  step: number
  /** Fields the user has left, so errors appear on blur rather than on load. */
  touched: Partial<Record<keyof LaunchDraft, boolean>>
  set: <K extends keyof LaunchDraft>(field: K, value: LaunchDraft[K]) => void
  touch: (field: keyof LaunchDraft) => void
  goTo: (step: number) => void
  next: () => void
  back: () => void
  reset: () => void
}

export const useLaunchDraft = create<LaunchDraftStore>()(
  persist(
    (setState) => ({
      draft: EMPTY_DRAFT,
      step: 0,
      touched: {},
      set: (field, value) => setState((state) => ({ draft: { ...state.draft, [field]: value } })),
      touch: (field) => setState((state) => ({ touched: { ...state.touched, [field]: true } })),
      goTo: (step) => setState({ step: Math.max(0, Math.min(step, STEP_FIELDS.length - 1)) }),
      next: () => setState((state) => ({ step: Math.min(state.step + 1, STEP_FIELDS.length - 1) })),
      back: () => setState((state) => ({ step: Math.max(state.step - 1, 0) })),
      reset: () => setState({ draft: EMPTY_DRAFT, step: 0, touched: {} }),
    }),
    {
      name: 'harvestpad.launch-draft',
      // The step and the touched map are session noise; only the work persists.
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
)
