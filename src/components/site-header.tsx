import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'

import { BrandMark } from '@/components/icons'
import { SmartLink } from '@/components/smart-link'
import { Container } from '@/components/section'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { brand } from '@/content/brand'
import { nav } from '@/content/copy'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // The bar lifts off the surface once the page moves, rather than gaining the
  // hairline the Swiss version used.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="sticky top-0 z-50 pt-3 pb-1">
      <Container>
        <div
          className={cn(
            'flex h-16 items-center justify-between gap-6 rounded-2xl px-4 transition-shadow duration-300 md:px-5',
            // `neu-raised` paints an opaque gradient, so a translucent
            // background and backdrop blur underneath it would do nothing.
            scrolled ? 'neu-raised' : 'bg-transparent',
          )}
        >
          <SmartLink
            href="#top"
            className="flex items-center gap-3 rounded-md font-semibold tracking-tight"
          >
            <BrandMark className="size-9" />
            {brand.name}
          </SmartLink>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.items.map((item) => (
                <li key={item.href}>
                  <SmartLink
                    href={item.href}
                    className="rounded-md px-3 py-2 text-[0.8125rem] text-muted-foreground transition-colors duration-200 hover:text-brand"
                  >
                    {item.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-2.5 lg:flex">
            <ThemeToggle />
            <Button asChild variant="brand" size="sm">
              <SmartLink href={nav.primaryCta.href}>{nav.primaryCta.label}</SmartLink>
            </Button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="default" size="icon-sm" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-sm border-none bg-background">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-3 text-left font-semibold">
                    <BrandMark className="size-9" />
                    {brand.name}
                  </SheetTitle>
                </SheetHeader>

                <nav aria-label="Mobile" className="px-4">
                  <ul className="grid gap-2.5">
                    {nav.items.map((item) => (
                      <li key={item.href}>
                        <SheetClose asChild>
                          <SmartLink
                            href={item.href}
                            className="block rounded-lg px-4 py-3.5 text-[1.0625rem] neu-raised-sm transition-colors hover:text-brand"
                          >
                            {item.label}
                          </SmartLink>
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="mt-auto p-4">
                  <Button asChild variant="brand" size="lg" className="w-full">
                    <SmartLink href={nav.primaryCta.href}>{nav.primaryCta.label}</SmartLink>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </header>
  )
}
