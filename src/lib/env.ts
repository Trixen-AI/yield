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

export const env = {
  reownProjectId: text(import.meta.env.VITE_REOWN_PROJECT_ID),
  chainId: Number(text(import.meta.env.VITE_CHAIN_ID)) || 0,
  chainName: text(import.meta.env.VITE_CHAIN_NAME) || 'Robinhood Chain',
  rpcUrl: text(import.meta.env.VITE_CHAIN_RPC_URL),
  explorerUrl: text(import.meta.env.VITE_CHAIN_EXPLORER_URL),
  currency: {
    name: text(import.meta.env.VITE_CHAIN_CURRENCY_NAME) || 'Ether',
    symbol: text(import.meta.env.VITE_CHAIN_CURRENCY_SYMBOL) || 'ETH',
    decimals: number(import.meta.env.VITE_CHAIN_CURRENCY_DECIMALS, 18),
  },
  factoryAddress: text(import.meta.env.VITE_FACTORY_ADDRESS),
  siteUrl:
    text(import.meta.env.VITE_SITE_URL) ||
    (typeof window === 'undefined' ? '' : window.location.origin),
} as const

/**
 * A wallet can be connected. This needs the Reown project id and nothing else:
 * connecting is about the wallet, not about our chain, so someone can sign in
 * and see their address long before the protocol chain is defined.
 */
export const walletReady = env.reownProjectId !== ''

/**
 * The chain id alone is enough to name our network in the wallet modal, so the
 * modal stops offering Ethereum as soon as VITE_CHAIN_ID is set. Adding the
 * network to a wallet still needs an RPC URL, which is why `chainReady` below
 * asks for both.
 */
export const networkDefined = env.chainId > 0

/** Our chain can actually be read from, so reads and switching are meaningful. */
export const chainReady = networkDefined && env.rpcUrl !== ''

/** A transaction can be built: the factory is deployed on a chain we know. */
export const factoryReady = chainReady && ADDRESS_PATTERN.test(env.factoryAddress)

/** What is still missing, in the order a person would fix it. */
export function missingConfig(): string[] {
  const missing: string[] = []
  if (!walletReady) missing.push('VITE_REOWN_PROJECT_ID')
  if (env.chainId <= 0) missing.push('VITE_CHAIN_ID')
  if (env.rpcUrl === '') missing.push('VITE_CHAIN_RPC_URL')
  if (!ADDRESS_PATTERN.test(env.factoryAddress)) missing.push('VITE_FACTORY_ADDRESS')
  return missing
}

export function explorerAddressUrl(address: string) {
  if (env.explorerUrl === '') return undefined
  return `${env.explorerUrl.replace(/\/$/, '')}/address/${address}`
}

export function shortenAddress(address: string, lead = 6, tail = 4) {
  if (address.length <= lead + tail + 2) return address
  return `${address.slice(0, lead)}…${address.slice(-tail)}`
}
