/**
 * ---------------------------------------------------------------------------
 * NAMES AND ADDRESSES: edit this file only.
 * ---------------------------------------------------------------------------
 * Every name, symbol, address and URL used anywhere on the marketing site is
 * declared here. Change a value and the whole site follows; no component
 * hard-codes a brand name.
 *
 * Several values below are best guesses that were never confirmed. They are
 * marked GUESS and listed in PLACEHOLDERS.md. Check each before launch.
 */

export const brand = {
  /** Product name. Appears in nav, hero, footer and the meta title. */
  name: 'HarvestPad',
  /** Short form used inside sentences where the full name reads heavy. */
  shortName: 'HarvestPad',
  /** One-line positioning statement, used in the footer and meta description. */
  tagline: 'Launch a yield market in one transaction',
} as const

export const chain = {
  /** Network the protocol is deployed on, e.g. "Robinhood Chain". */
  name: 'Robinhood Chain',
  /** Robinhood Chain's official explorer runs on Blockscout. */
  explorerName: 'Blockscout',
  /** Native gas token symbol used for the launch fee. */
  gasSymbol: 'ETH',
} as const

export const contracts = {
  /** Name of the vault contract the factory clones for every market. */
  vaultName: 'HarvestVault',
  /** Name of the factory contract. */
  factoryName: 'HarvestPad factory',
  /** Name of the read-only aggregation contract used by the UI. */
  lensName: 'HarvestPad lens',
  /** Deployed factory address, shown truncated in the hero panel. */
  factoryAddress: '0x61C9…9359',
} as const

/**
 * Protocol constants. These are numbers rather than placeholders because the
 * fee-split chart derives its segments from them. Change the two percentages
 * here and both the copy and the chart follow.
 */
const MAX_PERFORMANCE_FEE_PCT = 20
const PROTOCOL_FEE_SHARE_PCT = 20

export const economics = {
  /** Flat fee paid to deploy a market. */
  launchFee: '0.001',
  /** Hard cap on the creator's performance fee, as a percentage of yield. */
  maxPerformanceFeePct: MAX_PERFORMANCE_FEE_PCT,
  /** Protocol's cut of whatever the creator charges. */
  protocolFeeSharePct: PROTOCOL_FEE_SHARE_PCT,
  maxPerformanceFee: `${MAX_PERFORMANCE_FEE_PCT}%`,
  protocolFeeShare: `${PROTOCOL_FEE_SHARE_PCT}%`,
} as const

/** The default settlement asset most markets are denominated in. */
export const assets = {
  primarySymbol: 'USDG',
} as const

/** A single, concrete yield source the site uses as a worked example. */
export const featuredSource = {
  name: 'Steakhouse USDG',
  standard: 'ERC-4626',
  denomination: 'USDG',
  approximateSize: '430 M USDG',
} as const

export const links = {
  launch: '/launch',
  markets: '/markets',
  manage: '/manage',
  /** The explorer domain is confirmed; the two contract addresses are not. */
  explorerFactory: 'https://robinhoodchain.blockscout.com/address/0x61C99359',
  explorerLens: 'https://robinhoodchain.blockscout.com/address/0x61C99360',
  explorerHome: 'https://robinhoodchain.blockscout.com',
  /** GUESS: repository, docs and social handles are unconfirmed. */
  sourceCode: 'https://github.com/harvestpad/contracts',
  docs: 'https://docs.harvestpad.xyz',
  social: 'https://x.com/HarvestPad',
  socialLabel: 'HarvestPad on X',
} as const
