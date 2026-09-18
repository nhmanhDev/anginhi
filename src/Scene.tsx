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
        <span className="vault-pedestal">
          <span className="vault-frame">
            <span className="vault-door">
              <span className="vault-rivets" />
              <span className="vault-wheel">
                <span className="vault-spoke" />
                <span className="vault-spoke" />
              </span>
              <span className="vault-handle" />
            </span>
            <span className="vault-glow" />
            <span className="vault-name">{busy ? '' : liveName}</span>
          </span>
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
        <span className="jar-steam">
          <span className="steam-puff puff-1" />
          <span className="steam-puff puff-2" />
        </span>
        <span className="jar-lid">
          <span className="jar-knot" />
        </span>
        <span className="jar-neck" />
        <span className="jar-body">
          <span className="jar-pattern" />
          <span className="jar-seal">
            <span className="jar-name">{busy ? '' : liveName}</span>
          </span>
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
        <div className="cat-clock-badge">
          <span className="cat-clock-time">{clock}</span>
          <span className="cat-clock-sep">·</span>
          <span className="cat-clock-label">{clockLine}</span>
        </div>
        <div className="cat-podium">
          <span className="cat-figure">
            <span className="cat-ear left" />
            <span className="cat-ear right" />
            <span className="cat-head">
              <span className="cat-eye left" />
              <span className="cat-eye right" />
              <span className="cat-nose" />
            </span>
            <span className="cat-paw" />
            <span className="cat-collar">
              <span className="cat-bell" />
            </span>
          </span>
        </div>
        {liveName && !busy && <div className="cat-speech">{liveName}</div>}
      </button>
    )
  }

  if (mode === 'duyen') {
    return (
      <div className={busy ? 'prop meet is-busy' : 'prop meet'}>
        <button type="button" className="meet-album-pill" onClick={onCollection}>
          <span className="meet-album-dot" />
          {seenLabel}
        </button>
        <button
          type="button"
          className="meet-stack"
          disabled={disabled}
          aria-label={actLabel}
          onClick={onAct}
        >
          <span className="meet-card back back-2" />
          <span className="meet-card back back-1" />
          <span className="meet-card front">
            <span className="meet-card-border" />
            <span className="meet-seal" />
            <span className="meet-name">{busy ? '' : liveName}</span>
          </span>
        </button>
      </div>
    )
  }

  return (
    <div className={busy ? 'scene is-busy' : 'scene'} aria-hidden={false}>
      <div className="scene-visual-wrap">
        <img className="scene-photo" src="/scene.png" alt="" />
        <div className="scene-vignette" />
      </div>
      <div className="lot-slots" role="group" aria-label={actLabel}>
        {slots.map((slot, index) => (
          <button
            key={index}
            type="button"
            disabled={disabled}
            aria-pressed={slot.on}
            className={slot.on ? 'lot-slot on' : 'lot-slot'}
            onClick={() => onSlot(index)}
          >
            <span className="lot-num">{`0${index + 1}`}</span>
            <span className="lot-content">
              <span className="lot-label">{slot.open ? slot.label : `Quẻ ${index + 1}`}</span>
            </span>
            <span className="lot-shine" />
          </button>
        ))}
      </div>
    </div>
  )
}

function nowClock() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
