import { createAppKit } from '@reown/appkit/react'
import { defineChain } from '@reown/appkit/networks'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { createConfig, http, type Config } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { mainnet } from 'viem/chains'

import { env, walletReady } from '@/lib/env'

/**
 * Wallet wiring.
 *
 * The chain is fixed in `lib/env.ts`, so the only thing a deploy has to supply
 * is the Reown project id. With it, AppKit is bound to Robinhood Chain and the
 * modal detects wallets and offers WalletConnect for mobile.
 *
 * Without it this returns a plain wagmi config on an inert chain, so every hook
 * in the app keeps working and nothing crashes; the connect button says it is
 * unavailable rather than opening a modal that cannot work.
 */

export const appChain = defineChain({
  id: env.chainId,
  caipNetworkId: `eip155:${env.chainId}`,
  chainNamespace: 'eip155',
  name: env.chainName,
  nativeCurrency: env.currency,
  rpcUrls: { default: { http: [env.rpcUrl] } },
  blockExplorers: { default: { name: 'Blockscout', url: env.explorerUrl } },
})

function buildConfig(): { wagmiConfig: Config; appKitReady: boolean } {
  if (!walletReady) {
    // No project id, so there is no modal to open. This inert config exists only
    // so the wagmi hooks used throughout the app have a provider.
    return {
      wagmiConfig: createConfig({
        chains: [mainnet],
        connectors: [injected()],
        transports: { [mainnet.id]: http() },
      }),
      appKitReady: false,
    }
  }

  const networks: [AppKitNetwork, ...AppKitNetwork[]] = [appChain]

  const adapter = new WagmiAdapter({
    networks,
    projectId: env.reownProjectId,
  })

  createAppKit({
    adapters: [adapter],
    networks,
    projectId: env.reownProjectId,
    metadata: {
      name: 'HarvestPad',
      description: 'Launch a yield market in one transaction.',
      url: env.siteUrl,
      icons: [`${env.siteUrl.replace(/\/$/, '')}/favicon.svg`],
    },
    features: { analytics: false, email: false, socials: false },
    // Square-ish corners and the brand accent, so the modal belongs to the app.
    themeVariables: {
      '--w3m-accent': '#1d4fd8',
      '--w3m-border-radius-master': '2px',
      '--w3m-font-family': "'Inter', ui-sans-serif, system-ui, sans-serif",
    },
  })

  return { wagmiConfig: adapter.wagmiConfig, appKitReady: true }
}

const built = buildConfig()

export const wagmiConfig = built.wagmiConfig
/** True when the Reown modal actually exists and can be opened. */
export const appKitReady = built.appKitReady
