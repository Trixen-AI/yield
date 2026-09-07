import { useCallback, useEffect, useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'theme'

/**
 * Module-level store rather than component state: the toggle is rendered twice
 * (desktop header and mobile header), and two independent useState copies would
 * drift apart the moment one of them was clicked.
 */
const listeners = new Set<() => void>()
let theme: Theme = readStoredTheme()

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  } catch {
    /* private mode or blocked storage, so fall through to system */
  }
  return 'system'
}

function systemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function resolvesToDark(value: Theme) {
  return value === 'dark' || (value === 'system' && systemPrefersDark())
}

export function applyTheme(value: Theme) {
  const dark = resolvesToDark(value)
  document.documentElement.classList.toggle('dark', dark)
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
}

function setTheme(value: Theme) {
  theme = value
  applyTheme(value)
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    /* nothing to do, the class is applied either way */
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot() {
  return theme
}

export function useTheme() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  // index.html applies the theme before first paint. This is the fallback for
  // when that inline script could not read storage and bailed out.
  useEffect(() => {
    applyTheme(theme)
  }, [])

  // Follow the OS while the visitor has not made an explicit choice.
  useEffect(() => {
    if (current !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      applyTheme('system')
      listeners.forEach((listener) => listener())
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [current])

  const toggle = useCallback(() => {
    setTheme(resolvesToDark(theme) ? 'light' : 'dark')
  }, [])

  return {
    theme: current,
    setTheme,
    toggle,
    isDark: typeof window !== 'undefined' && resolvesToDark(current),
  }
}
