import { useEffect, useRef, useState } from 'react'
import { ChevronMark } from './icons.tsx'

export type SelectOption<T extends string> = { id: T; label: string }

export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string
  value: T
  options: readonly SelectOption<T>[]
  onChange: (id: T) => void
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const current = options.find((item) => item.id === value) ?? options[0]

  useEffect(() => {
    if (!open) return
    const onDoc = (event: MouseEvent) => {
      if (!box.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="select-wrap field-pick" ref={box}>
      <button
        type="button"
        className={open ? 'select-btn is-open' : 'select-btn'}
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={() => setOpen((next) => !next)}
      >
        <span>{current?.label}</span>
        <ChevronMark />
      </button>
      {open ? (
        <ul className="menu" role="listbox" aria-label={label}>
          {options.map((item) => (
            <li key={item.id || 'any'}>
              <button
                type="button"
                role="option"
                aria-selected={item.id === value}
                className={item.id === value ? 'is-selected' : undefined}
                onClick={() => {
                  onChange(item.id)
                  setOpen(false)
                }}
              >
                <span>{item.label}</span>
                {item.id === value ? (
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="menu-check">
                    <path d="M3.5 8.5L6.5 11.5L12.5 4.5" />
                  </svg>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
