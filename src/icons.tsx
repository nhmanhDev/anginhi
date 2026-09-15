import type { Course, ThemeId } from './types.ts'

export function BowlMark() {
  return (
    <svg className="mark" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <ellipse cx="12" cy="8" rx="8" ry="3.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M4 8.2c0 5.2 3.4 8.8 8 8.8s8-3.6 8-8.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  )
}

export function SunMark() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6.1 6.1l1.6 1.6M16.3 16.3l1.6 1.6M17.9 6.1l-1.6 1.6M7.7 16.3l-1.6 1.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function MoonMark() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M15.2 4.2A8.2 8.2 0 1 0 19.8 14 6.4 6.4 0 0 1 15.2 4.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function GlobeMark() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <circle cx="12" cy="12" r="8.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M3.8 12h16.4M12 3.8c2.4 2.2 3.8 5.1 3.8 8.2S14.4 18 12 20.2C9.6 18 8.2 15.1 8.2 12S9.6 6 12 3.8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  )
}

export function VolumeMark({ on }: { on: boolean }) {
  return on ? (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M5 9.2h3.1L12.4 6v12L8.1 14.8H5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M15.2 9.2a3.4 3.4 0 0 1 0 5.6M17.6 7a6 6 0 0 1 0 10" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M5 9.2h3.1L12.4 6v12L8.1 14.8H5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="m16 9 5 6m0-6-5 6" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

export function ChevronMark() {
  return (
    <svg className="chevron" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function ThemeMark({ id }: { id: ThemeId }) {
  if (id === 'ket') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path d="M5 8h14v11H5zM8 8V6.4A4 4 0 0 1 16 6.4V8" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="M12 13v3" fill="none" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    )
  }
  if (id === 'duyen') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path d="M12 4.5 13.2 9l4.8.3-3.7 3 1.3 4.6L12 14.6 8.4 16.9 9.7 12.3 6 9.3 10.8 9z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    )
  }
  if (id === 'khui') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path d="M9 8.5h6l1.2 11H7.8zM10 8.5V6.2A2 2 0 0 1 14 6.2V8.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    )
  }
  if (id === 'meo') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path d="M5 10 8 5l2.2 3.6h3.6L16 5l3 5v5.5a6 6 0 0 1-12 0z" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="9.4" cy="12.2" r=".7" fill="currentColor" />
        <circle cx="14.6" cy="12.2" r=".7" fill="currentColor" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <ellipse cx="12" cy="6.2" rx="7" ry="2.4" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 6.2v11.2a7 2.4 0 0 0 14 0V6.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

export function CourseMark({ id }: { id: Course }) {
  if (id === 'uong') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path d="M6 8h10v6a4 4 0 0 1-8 0V8h8a3 3 0 0 1 0 6h-1" fill="none" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    )
  }
  if (id === 'vat') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="9.5" cy="10.5" r=".7" fill="currentColor" />
        <circle cx="14" cy="13.5" r=".7" fill="currentColor" />
      </svg>
    )
  }
  if (id === 'nhau') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path d="M4 16h16M6 16l2-8h8l2 8M9 8V5m6 3V5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M8 3v8a2 2 0 0 0 4 0V3M10 3v18M16 8v7h3V8a3 3 0 0 0-3-3" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}
