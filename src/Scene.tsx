import { KhuiPlay } from './KhuiPlay.tsx'

type SlotView = {
  label: string
  open: boolean
  on: boolean
}

export function Scene({
  busy,
  disabled,
  slots,
  onSlot,
}: {
  busy: boolean
  disabled: boolean
  slots: SlotView[]
  onSlot: (index: number) => void
}) {
  return (
    <div className={busy ? 'lots is-busy' : 'lots'}>
      {slots.map((slot, index) => (
        <button
          key={index}
          type="button"
          className={slot.on ? 'lot is-on' : 'lot'}
          disabled={disabled || slot.open}
          aria-pressed={slot.on}
          onClick={() => onSlot(index)}
        >
          <span className="lot-paper" aria-hidden="true" />
          {slot.on && busy ? <KhuiPlay /> : null}
          {slot.open ? <span className="lot-name">{slot.label}</span> : <span className="lot-index">{index + 1}</span>}
        </button>
      ))}
    </div>
  )
}
