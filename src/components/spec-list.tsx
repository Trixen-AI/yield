import { cn } from '@/lib/utils'

export interface SpecItem {
  term: string
  value: string
  mono?: boolean
}

/**
 * Term/value rows. The Swiss version separated them with hairlines; here the
 * rows sit in shallow grooves so the list reads as pressed into the panel.
 */
export function SpecList({ items, className }: { items: readonly SpecItem[]; className?: string }) {
  return (
    <dl className={cn('grid gap-1', className)}>
      {items.map((item) => (
        <div
          key={item.term}
          className="flex flex-wrap items-baseline justify-between gap-3 rounded-md px-3 py-2.5 transition-colors duration-200 hover:bg-muted/60"
        >
          <dt className="text-[0.8125rem] text-muted-foreground">{item.term}</dt>
          <dd className={cn('text-right text-[0.8125rem] font-medium', item.mono && 'tnum')}>
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
