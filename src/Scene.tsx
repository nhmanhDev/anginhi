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
      <div className={busy ? 'artifact-stage vault-mode is-busy' : 'artifact-stage vault-mode'}>
        <div className="artifact-spotlight" />
        <button
          type="button"
          className="prop vault-machine"
          disabled={disabled}
          aria-label={actLabel}
          onClick={onAct}
        >
          {/* 4 Hex Screws */}
          <span className="hex-screw screw-tl" />
          <span className="hex-screw screw-tr" />
          <span className="hex-screw screw-bl" />
          <span className="hex-screw screw-br" />

          {/* Machine Outer Bezel */}
          <div className="vault-bezel">
            {/* Precision Mechanical Dial */}
            <div className="vault-dial-housing">
              {/* Dial Tick Marks */}
              <div className="dial-ticks">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} className="dial-tick" style={{ transform: `rotate(${i * 30}deg)` }} />
                ))}
              </div>

              {/* Central Concentric Brushed Rotor */}
              <div className="vault-rotator">
                <div className="concentric-sheen" />
                <div className="vault-knob">
                  <div className="knurled-grip" />
                  <div className="knob-cap">
                    <span className="rotor-indicator" />
                  </div>
                </div>
              </div>

              {/* Status Needle */}
              <div className="vault-needle" />
            </div>

            {/* Micro LED indicator & Digital Plaque */}
            <div className="vault-readout">
              <span className="indicator-led" />
              <span className="readout-label">{busy ? 'ROTATING...' : liveName || 'LOCKED'}</span>
            </div>
          </div>
        </button>
      </div>
    )
  }

  if (mode === 'khui') {
    return (
      <div className={busy ? 'artifact-stage jar-mode is-busy' : 'artifact-stage jar-mode'}>
        <div className="artifact-spotlight" />
        <button
          type="button"
          className="prop jar-vessel"
          disabled={disabled}
          aria-label={actLabel}
          onClick={onAct}
        >
          {/* Volumetric Steam Cloud */}
          <div className="steam-canopy">
            <span className="steam-cloud c1" />
            <span className="steam-cloud c2" />
            <span className="steam-cloud c3" />
          </div>

          {/* Pedestal Base */}
          <div className="urn-plinth">
            {/* Porcelain Body */}
            <div className="urn-body">
              <div className="kintsugi-gold-vein" />
              <div className="urn-belly-shadow" />

              {/* Gilded Silk Ribbon & Seal */}
              <div className="urn-ribbon">
                <span className="silk-knot" />
                <span className="silk-tassel left" />
                <span className="silk-tassel right" />
              </div>

              {/* Porcelain Neck & Lip */}
              <div className="urn-neck">
                <div className="urn-lip" />
              </div>

              {/* Lifting Ceramic & Cloche Lid */}
              <div className="urn-lid-cloche">
                <div className="lid-finial" />
                <div className="lid-dome" />
                <div className="lid-rim" />
              </div>

              {/* Reveal Plaque inside */}
              <div className="urn-plaque">
                <span className="urn-dish-text">{busy ? '' : liveName}</span>
              </div>
            </div>
          </div>
        </button>
      </div>
    )
  }

  if (mode === 'meo') {
    return (
      <div className={busy ? 'artifact-stage cat-mode is-busy' : 'artifact-stage cat-mode'}>
        <div className="artifact-spotlight" />
        <button
          type="button"
          className="prop cat-sculpture"
          disabled={disabled}
          aria-label={actLabel}
          onClick={onAct}
        >
          {/* Precision Quartz Clock Badge */}
          <div className="quartz-clock-badge">
            <span className="quartz-pulse-dot" />
            <span className="quartz-time">{clock}</span>
            <span className="quartz-divider">/</span>
            <span className="quartz-label">{clockLine}</span>
          </div>

          {/* Minimalist Marble & Porcelain Cat */}
          <div className="cat-stand">
            <div className="cat-pedestal-base" />
            <div className="cat-art-figure">
              {/* Torso & Collar */}
              <div className="cat-torso">
                <div className="gold-choker">
                  <div className="brass-bell" />
                </div>
              </div>

              {/* Head & Features */}
              <div className="cat-head-sculpture">
                <span className="ear ear-l" />
                <span className="ear ear-r" />
                <div className="face-minimal">
                  <span className="eye eye-l" />
                  <span className="eye eye-r" />
                  <span className="gold-whisker left" />
                  <span className="gold-whisker right" />
                </div>
              </div>

              {/* Kinetic Pendulum Paw */}
              <div className="kinetic-paw">
                <div className="paw-arm" />
                <div className="paw-cushion" />
                <div className="gold-coin-token">福</div>
              </div>
            </div>
          </div>

          {/* Floating Speech Plaque */}
          {liveName && !busy && (
            <div className="cat-oracle-plaque">
              <span className="oracle-kicker">MÈO GỢI Ý</span>
              <span className="oracle-title">{liveName}</span>
            </div>
          )}
        </button>
      </div>
    )
  }

  if (mode === 'duyen') {
    return (
      <div className={busy ? 'artifact-stage tarot-mode is-busy' : 'artifact-stage tarot-mode'}>
        <div className="artifact-spotlight" />
        <div className="tarot-shelf">
          {/* Collection Status Pill */}
          <button type="button" className="archive-counter-pill" onClick={onCollection}>
            <span className="pill-dot" />
            <span className="pill-text">{seenLabel}</span>
          </button>

          {/* 3D Gilded Card Deck Fan */}
          <button
            type="button"
            className="prop tarot-fan"
            disabled={disabled}
            aria-label={actLabel}
            onClick={onAct}
          >
            {/* Card Left */}
            <div className="tarot-card card-left">
              <div className="card-face back">
                <div className="foil-border" />
                <div className="foil-emblem" />
              </div>
            </div>

            {/* Card Right */}
            <div className="tarot-card card-right">
              <div className="card-face back">
                <div className="foil-border" />
                <div className="foil-emblem" />
              </div>
            </div>

            {/* Card Center (The Chosen Oracle) */}
            <div className="tarot-card card-center">
              <div className="card-face back">
                <div className="foil-border" />
                <div className="foil-emblem" />
                <span className="deck-tag">DUYÊN</span>
              </div>
              <div className="card-face front">
                <div className="foil-border" />
                <div className="card-inner-frame">
                  <span className="card-dish-type">ĐỊNH MỆNH</span>
                  <span className="card-dish-name">{busy ? '' : liveName}</span>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    )
  }

  /* Mode Quẻ trưa ('que') */
  return (
    <div className={busy ? 'artifact-stage shrine-mode is-busy' : 'artifact-stage shrine-mode'}>
      <div className="artifact-spotlight" />
      <div className="prop shrine-box">
        {/* Ebony & Brass Case Header */}
        <div className="shrine-case-rim">
          <span className="corner-bracket top-left" />
          <span className="corner-bracket top-right" />
          <div className="shrine-plaque">
            <span className="shrine-mark">QUẺ TRƯA</span>
          </div>
        </div>

        {/* 5 Lacquered Bamboo Slips (Thẻ Quẻ Sơn Mài) */}
        <div className="bamboo-slips-rack" role="group" aria-label={actLabel}>
          {slots.map((slot, index) => (
            <button
              key={index}
              type="button"
              disabled={disabled}
              aria-pressed={slot.on}
              className={slot.on ? 'bamboo-slip is-drawn' : 'bamboo-slip'}
              onClick={() => onSlot(index)}
            >
              <div className="slip-brass-cap top" />
              <div className="slip-body">
                <span className="slip-index">{`0${index + 1}`}</span>
                <span className="slip-divider" />
                <span className="slip-title">
                  {slot.open ? slot.label : `Quẻ ${index + 1}`}
                </span>
              </div>
              <div className="slip-brass-cap bottom" />
              <div className="slip-aura" />
            </button>
          ))}
        </div>

        {/* Bottom Ebony Base */}
        <div className="shrine-pedestal-base">
          <span className="corner-bracket bottom-left" />
          <span className="corner-bracket bottom-right" />
        </div>
      </div>
    </div>
  )
}

function nowClock() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
