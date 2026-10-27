import { useSyncExternalStore } from 'react'

type Theme = 'light' | 'dark'

// initial value is set in index.html before paint (no flash).
// one shared store, so the menu toggle and the map tiles stay in sync
const listeners = new Set<() => void>()
const getTheme = () => (document.documentElement.dataset.theme as Theme) ?? 'light'
const subscribe = (fn: () => void) => {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

const setTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem('theme', theme)
  } catch {}
  listeners.forEach((fn) => fn())
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme)
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  return { theme, toggleTheme }
}
