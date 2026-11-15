import type { UiTheme } from './types.ts'

export function resolveTheme(stored: UiTheme | null, prefersDark: boolean): UiTheme {
  return stored ?? (prefersDark ? 'dark' : 'light')
}
