import { createAppKit } from '@reown/appkit/react'
import { defineChain } from '@reown/appkit/networks'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { createConfig, http, type Config } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { mainnet } from 'viem/chains'

import { env, networkDefined, walletReady } from '@/lib/env'

/**
 * Wallet wiring.
 *
 * Connecting only needs the Reown project id. When our own chain is defined as
 * well, AppKit is bound to it; when it is not, the modal still opens on Ethereum
 * mainnet so someone can connect, see their address and look around. Reads and
 * transactions stay gated on `chainReady` and `factoryReady` separately.
 *
 * With no project id at all this returns a plain wagmi config, so every hook in
 * the app keeps working and nothing crashes.
 */

export const appChain = networkDefined
  ? defineChain({
      id: env.chainId,
      caipNetworkId: `eip155:${env.chainId}`,
      chainNamespace: 'eip155',
      name: env.chainName,
      nativeCurrency: env.currency,
      // Empty until VITE_CHAIN_RPC_URL is set. The network is still named
      // correctly in the modal; adding it to a wallet needs the URL.
      rpcUrls: { default: { http: env.rpcUrl ? [env.rpcUrl] : [] } },
      ...(env.explorerUrl
        ? { blockExplorers: { default: { name: 'Explorer', url: env.explorerUrl } } }
        : {}),
    })
  : undefined

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

  // Mainnet stands in only while VITE_CHAIN_ID is empty. It is there so the
  // modal has a network to work with; nothing is ever read from it. This is why
  // an unconfigured app shows "Ethereum" in the network switcher.
  const networks: [AppKitNetwork, ...AppKitNetwork[]] = appChain ? [appChain] : [mainnet]

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
