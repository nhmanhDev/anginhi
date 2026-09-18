type ManyProps<T extends string> = {
  label: string
  options: readonly { id: T; label: string }[]
  value: readonly T[]
  onToggle: (id: T) => void
  large?: boolean
}

export function StampMany<T extends string>({ label, options, value, onToggle, large }: ManyProps<T>) {
  return (
    <div className={large ? 'filter kinds' : 'filter'} role="group" aria-label={label}>
      <p className="filter-label">{label}</p>
      <div className="stamps">
        {options.map((option) => {
          const on = value.includes(option.id)
          return (
            <label key={option.id} className={on ? 'stamp on' : 'stamp'}>
              <input
                type="checkbox"
                checked={on}
                onChange={() => onToggle(option.id)}
              />
              <span className="stamp-indicator" aria-hidden="true" />
              <span className="stamp-text">{option.label}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
