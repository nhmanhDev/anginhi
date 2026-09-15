import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export function Donate({ label, hint, closeLabel }: { label: string; hint: string; closeLabel: string }) {
  const [open, setOpen] = useState(false)
  const [qr, setQr] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function close() {
    setOpen(false)
    setQr(false)
  }

  return (
    <>
      <button
        type="button"
        id="btn-open-coffee-modal"
        className="btn-donate"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setOpen(true)
          setQr(false)
        }}
      >
        <span className="donate-heart-wrapper">
          <span className="donate-heart-ring" />
          <svg className="donate-heart-icon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path
              d="M12 20.4S4.4 15.2 3.8 9.7A4.2 4.2 0 0 1 12 7.2a4.2 4.2 0 0 1 8.2 2.5c0 5.5-8.2 10.7-8.2 10.7Z"
              fill="currentColor"
            />
          </svg>
        </span>
        <span>{label}</span>
      </button>
      {open
        ? createPortal(
            <div className="modal" onClick={close}>
              <div
                className="modal-content glass-panel coffee-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="coffee-title"
                onClick={(event) => event.stopPropagation()}
              >
                <button type="button" className="btn-close-coffee-modal" aria-label={closeLabel} onClick={close}>
                  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                    <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                </button>
                {qr ? (
                  <>
                    <div className="coffee-header">
                      <CoffeeMug />
                      <h3 id="coffee-title">Buy me a coffee!</h3>
                    </div>
                    <div className="coffee-qr-frame">
                      <img src="/QR_code.jpg" alt="Donate QR Code" />
                    </div>
                  </>
                ) : (
                  <>
                    <button type="button" className="coffee-trigger" onClick={() => setQr(true)}>
                      <span className="coffee-icon-wrap">
                        <span className="coffee-steam coffee-steam-1" />
                        <span className="coffee-steam coffee-steam-2" />
                        <CoffeeMug />
                      </span>
                      <h3 id="coffee-title">Buy me a coffee!</h3>
                    </button>
                    <p className="coffee-contact-hint">{hint}</p>
                  </>
                )}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}

function CoffeeMug() {
  return (
    <svg className="coffee-icon" viewBox="0 0 24 24" width="44" height="44" aria-hidden="true">
      <path
        d="M5 8h10v6.2A4.2 4.2 0 0 1 10.8 18.4 4.2 4.2 0 0 1 6.6 14.2V8h10.6a2.8 2.8 0 0 1 0 5.6H16"
        fill="none"
        stroke="url(#coffee-grad)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="coffee-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
    </svg>
  )
}
