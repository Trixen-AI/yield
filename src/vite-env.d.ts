/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REOWN_PROJECT_ID?: string
  readonly VITE_CHAIN_ID?: string
  readonly VITE_CHAIN_NAME?: string
  readonly VITE_CHAIN_RPC_URL?: string
  readonly VITE_CHAIN_EXPLORER_URL?: string
  readonly VITE_CHAIN_CURRENCY_NAME?: string
  readonly VITE_CHAIN_CURRENCY_SYMBOL?: string
  readonly VITE_CHAIN_CURRENCY_DECIMALS?: string
  readonly VITE_FACTORY_ADDRESS?: string
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
