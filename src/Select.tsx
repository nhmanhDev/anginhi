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
    <div className="field-pick" ref={box}>
      <button
        type="button"
        className="field-select"
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
        <ul className="field-menu" role="listbox" aria-label={label}>
          {options.map((item) => (
            <li key={item.id || 'any'}>
              <button
                type="button"
                role="option"
                aria-selected={item.id === value}
                onClick={() => {
                  onChange(item.id)
                  setOpen(false)
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
