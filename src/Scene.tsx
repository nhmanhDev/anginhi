import { useEffect, useState } from 'react'
import type { ThemeId } from './types.ts'

type SlotView = {
  label: string
  open: boolean
  on: boolean
}

export function Scene({
  mode,
  busy,
  disabled,
  actLabel,
  liveName,
  slots,
  clockLine,
  seenLabel,
  onAct,
  onSlot,
  onCollection,
}: {
  mode: ThemeId
  busy: boolean
  disabled: boolean
  actLabel: string
  liveName: string
  slots: SlotView[]
  clockLine: string
  seenLabel: string
  onAct: () => void
  onSlot: (index: number) => void
  onCollection: () => void
}) {
  const [clock, setClock] = useState(() => nowClock())

  useEffect(() => {
    if (mode !== 'meo') return
    const tick = window.setInterval(() => setClock(nowClock()), 15_000)
    return () => window.clearInterval(tick)
  }, [mode])

  if (mode === 'ket') {
    return (
      <button
        type="button"
        className={busy ? 'prop vault is-busy' : 'prop vault'}
        disabled={disabled}
        aria-label={actLabel}
        onClick={onAct}
      >
        <span className="vault-frame">
          <span className="vault-door" />
          <span className="vault-lock" />
          <span className="vault-name">{busy ? '' : liveName}</span>
        </span>
      </button>
    )
  }

  if (mode === 'khui') {
    return (
      <button
        type="button"
        className={busy ? 'prop jar is-busy' : 'prop jar'}
        disabled={disabled}
        aria-label={actLabel}
        onClick={onAct}
      >
        <span className="jar-lid" />
        <span className="jar-body">
          <span className="jar-name">{busy ? '' : liveName}</span>
        </span>
      </button>
    )
  }

  if (mode === 'meo') {
    return (
      <button
        type="button"
        className={busy ? 'prop catdesk is-busy' : 'prop catdesk'}
        disabled={disabled}
        aria-label={actLabel}
        onClick={onAct}
      >
        <span className="cat-clock">
          {clock} · {clockLine}
        </span>
        <span className="cat-figure">
          <span className="cat-ear left" />
          <span className="cat-ear right" />
          <span className="cat-head" />
        </span>
      </button>
    )
  }

  if (mode === 'duyen') {
    return (
      <div className={busy ? 'prop meet is-busy' : 'prop meet'}>
        <button type="button" className="meet-album" onClick={onCollection}>
          {seenLabel}
        </button>
        <button
          type="button"
          className="meet-stack"
          disabled={disabled}
          aria-label={actLabel}
          onClick={onAct}
        >
          <span className="meet-card back" />
          <span className="meet-card">
            <span className="meet-name">{busy ? '' : liveName}</span>
          </span>
        </button>
      </div>
    )
  }

  return (
    <div className={busy ? 'scene is-busy' : 'scene'} aria-hidden={false}>
      <img className="scene-photo" src="/scene.png" alt="" />
      <div className="lot-slots" role="group" aria-label={actLabel}>
        {slots.map((slot, index) => (
          <button
            key={index}
            type="button"
            disabled={disabled}
            aria-pressed={slot.on}
            className={slot.on ? 'on' : undefined}
            onClick={() => onSlot(index)}
          >
            {slot.open ? slot.label : String(index + 1)}
          </button>
        ))}
      </div>
    </div>
  )
}

function nowClock() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
