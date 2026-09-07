import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/use-theme'

export function ThemeToggle({ className }: { className?: string }) {
  const { toggle, isDark } = useTheme()

  return (
    <Button
      variant="default"
      size="icon-sm"
      onClick={toggle}
      className={className}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <Sun className="size-4 dark:hidden" />
      <Moon className="hidden size-4 dark:block" />
    </Button>
  )
}
