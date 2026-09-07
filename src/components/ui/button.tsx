import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '@/lib/utils'

/**
 * Neumorphic button: raised by default, sunk on press (`neu-pressable`).
 *
 * Every variant keeps a real border as well as its shadow. A soft shadow is not
 * a dependable boundary: it disappears on low-quality panels and for anyone
 * with reduced contrast sensitivity. So `--border-strong` carries the 3:1
 * boundary that WCAG 1.4.11 asks for, and the shadow carries the style.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border text-sm font-medium whitespace-nowrap neu-pressable focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'neu-raised border-border-strong/45 text-foreground hover:text-brand',
        brand:
          'border-brand bg-brand text-brand-foreground shadow-[-4px_-4px_10px_var(--neu-light),4px_4px_10px_var(--neu-dark)] hover:bg-brand/92',
        outline: 'border-border-strong text-foreground bg-transparent hover:neu-raised-sm',
        secondary: 'neu-raised-sm border-border-strong/35 text-foreground hover:text-brand',
        ghost:
          'border-transparent text-foreground hover:neu-raised-sm hover:border-border-strong/30',
        link: 'border-transparent text-foreground underline-offset-4 hover:text-brand hover:underline',
        sunken: 'neu-pressed border-border-strong/30 text-muted-foreground hover:text-foreground',
        destructive:
          'border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        default: 'h-11 px-5 has-[>svg]:px-4',
        sm: 'h-9 gap-1.5 rounded-md px-3.5 text-[0.8125rem]',
        lg: 'h-13 px-7 text-[0.9375rem]',
        icon: 'size-11',
        'icon-sm': 'size-9 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
