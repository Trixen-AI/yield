/**
 * Runtime configuration, read once from Vite's env.
 *
 * Nothing here throws. The app is expected to run before the chain exists, so
 * each area reports whether it is configured and the UI degrades honestly
 * rather than pretending a transaction can be built.
 */

const text = (value: string | undefined) => (typeof value === 'string' ? value.trim() : '')

const number = (value: string | undefined, fallback: number) => {
  const parsed = Number(text(value))
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export const ADDRESS_PATTERN = /^0x[0-9a-fA-F]{40}$/

/**
 * Robinhood Chain mainnet.
 *
 * These are public, fixed network parameters, not configuration, so they live
 * in code where they are version controlled and cannot be forgotten on a new
 * deploy. An environment variable still overrides any of them, which is what
 * you would use to point a preview build at the testnet.
 */
const CHAIN = {
  id: 4663,
  name: 'Robinhood Chain',
  rpcUrl: 'https://rpc.mainnet.chain.robinhood.com',
  explorerUrl: 'https://robinhoodchain.blockscout.com',
  currencyName: 'Ether',
  currencySymbol: 'ETH',
  currencyDecimals: 18,
} as const

const DEFAULT_SITE_URL = 'https://harvestpad.org'

export const env = {
  /** The one value that has to come from the environment. */
  reownProjectId: text(import.meta.env.VITE_REOWN_PROJECT_ID),

  chainId: Number(text(import.meta.env.VITE_CHAIN_ID)) || CHAIN.id,
  chainName: text(import.meta.env.VITE_CHAIN_NAME) || CHAIN.name,
  rpcUrl: text(import.meta.env.VITE_CHAIN_RPC_URL) || CHAIN.rpcUrl,
  explorerUrl: text(import.meta.env.VITE_CHAIN_EXPLORER_URL) || CHAIN.explorerUrl,
  currency: {
    name: text(import.meta.env.VITE_CHAIN_CURRENCY_NAME) || CHAIN.currencyName,
    symbol: text(import.meta.env.VITE_CHAIN_CURRENCY_SYMBOL) || CHAIN.currencySymbol,
    decimals: number(import.meta.env.VITE_CHAIN_CURRENCY_DECIMALS, CHAIN.currencyDecimals),
  },

  /** Empty until the factory is deployed. */
  factoryAddress: text(import.meta.env.VITE_FACTORY_ADDRESS),

  siteUrl:
    text(import.meta.env.VITE_SITE_URL) ||
    (typeof window === 'undefined' ? DEFAULT_SITE_URL : window.location.origin),
} as const

/**
 * A wallet can be connected. The chain is always defined now, so this is the
 * only thing standing between a fresh deploy and a working connect button.
 */
export const walletReady = env.reownProjectId !== ''

/** A transaction can be built: the factory is deployed at a real address. */
export const factoryReady = ADDRESS_PATTERN.test(env.factoryAddress)

export function explorerAddressUrl(address: string) {
  if (env.explorerUrl === '') return undefined
  return `${env.explorerUrl.replace(/\/$/, '')}/address/${address}`
}

export function shortenAddress(address: string, lead = 6, tail = 4) {
  if (address.length <= lead + tail + 2) return address
  return `${address.slice(0, lead)}…${address.slice(-tail)}`
}
