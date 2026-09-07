import { AlertTriangle, LogOut, Wallet } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { env, shortenAddress } from '@/lib/env'
import { useWallet } from '@/wallet/use-wallet'

export function ConnectButton({ size = 'sm' }: { size?: 'sm' | 'default' | 'lg' }) {
  const {
    address,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    canConnect,
    onWrongChain,
    switchToAppChain,
    isSwitching,
  } = useWallet()

  // Nothing to connect to yet. Say so rather than opening a modal that fails.
  if (!canConnect) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span tabIndex={0} className="inline-flex rounded-lg">
            <Button size={size} disabled>
              <Wallet className="size-4" />
              Connect wallet
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          Wallet connection is not available yet.
        </TooltipContent>
      </Tooltip>
    )
  }

  if (onWrongChain) {
    return (
      <Button size={size} variant="brand" onClick={switchToAppChain} disabled={isSwitching}>
        <AlertTriangle className="size-4" />
        {isSwitching ? 'Switching…' : `Switch to ${env.chainName}`}
      </Button>
    )
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <Button size={size} onClick={connect} className="tnum">
          <Wallet className="size-4" />
          {shortenAddress(address)}
        </Button>
        <Button
          size={size === 'lg' ? 'icon' : 'icon-sm'}
          variant="ghost"
          onClick={() => disconnect()}
          aria-label="Disconnect wallet"
        >
          <LogOut className="size-4" />
        </Button>
      </div>
    )
  }

  return (
    <Button size={size} variant="brand" onClick={connect} disabled={isConnecting}>
      <Wallet className="size-4" />
      {isConnecting ? 'Connecting…' : 'Connect wallet'}
    </Button>
  )
}
