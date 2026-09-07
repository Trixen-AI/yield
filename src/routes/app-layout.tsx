import { NavLink, Outlet, ScrollRestoration } from 'react-router'
import { ArrowLeft } from 'lucide-react'

import { BrandMark } from '@/components/icons'
import { Container } from '@/components/section'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { brand } from '@/content/brand'
import { cn } from '@/lib/utils'
import { ConnectButton } from '@/wallet/connect-button'
import { WalletGate } from '@/wallet/wallet-gate'

const NAV = [
  { to: '/markets', label: 'Markets' },
  { to: '/launch', label: 'Launch' },
  { to: '/manage', label: 'Manage' },
]

/**
 * `WalletGate` does not load wagmi or AppKit. It fetches them the first time
 * someone clicks connect, so neither the landing page nor a browse of the
 * market list pays for the wallet stack.
 */
export function AppLayout() {
  return (
    <WalletGate>
      <ScrollRestoration />
      <div className="flex min-h-dvh flex-col">
        <header className="sticky top-0 z-50 pt-3 pb-1">
          <Container>
            <div className="flex h-16 items-center justify-between gap-4 rounded-2xl px-4 neu-raised md:px-5">
              <div className="flex items-center gap-6">
                <NavLink
                  to="/"
                  className="flex items-center gap-3 rounded-md font-semibold tracking-tight"
                >
                  <BrandMark className="size-9" />
                  <span className="hidden sm:inline">{brand.name}</span>
                </NavLink>

                <nav aria-label="App" className="hidden md:block">
                  <ul className="flex items-center gap-1">
                    {NAV.map((item) => (
                      <li key={item.to}>
                        <NavLink
                          to={item.to}
                          className={({ isActive }) =>
                            cn(
                              'inline-block rounded-lg px-3.5 py-2 text-[0.8125rem] transition-colors',
                              isActive
                                ? 'font-medium text-foreground neu-pressed'
                                : 'text-muted-foreground hover:text-brand',
                            )
                          }
                        >
                          {item.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              <div className="flex items-center gap-2">
                <ThemeToggle />
                <ConnectButton />
              </div>
            </div>

            {/* Mobile nav sits under the bar rather than behind a menu: there are
              only three destinations and they are the whole app. */}
            <nav aria-label="App sections" className="mt-3 md:hidden">
              <ul className="grid grid-cols-3 gap-1 rounded-xl p-1.5 neu-pressed">
                {NAV.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          'block rounded-lg py-2 text-center text-[0.8125rem] transition-colors',
                          isActive
                            ? 'font-medium text-foreground neu-raised-sm'
                            : 'text-muted-foreground',
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </Container>
        </header>

        <main className="flex-1 py-10 md:py-14">
          <Outlet />
        </main>

        <footer className="pb-10">
          <Container>
            <Button asChild variant="ghost" size="sm">
              <NavLink to="/">
                <ArrowLeft className="size-4" />
                Back to the site
              </NavLink>
            </Button>
          </Container>
        </footer>
      </div>
    </WalletGate>
  )
}
