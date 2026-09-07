import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '@/lib/utils'

/** Soft pill. Non-interactive, so depth alone can carry it without a border. */
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6875rem] font-medium whitespace-nowrap [&>svg]:pointer-events-none [&>svg:not([class*='size-'])]:size-3",
  {
    variants: {
      variant: {
        default: 'neu-pressed-sm text-muted-foreground',
        raised: 'neu-raised-sm text-foreground',
        brand: 'bg-brand-soft text-brand',
        success: 'neu-pressed-sm text-success',
        muted: 'bg-muted text-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span'

  return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
