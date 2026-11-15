import { t } from './copy.ts'
import { BowlMark } from './icons.tsx'
import type { Lang } from './types.ts'

export function LandingCta({
  lang,
  onPickNow,
}: {
  lang: Lang
  onPickNow: () => void
}) {
  const copy = t(lang)
  const isVi = lang === 'vi'

  return (
    <section className="landing-cta-section">
      <div className="landing-cta-card">
        <div className="cta-icon-pill">
          <BowlMark />
        </div>
        <h2 className="cta-heading">{copy.ctaHeading}</h2>
        <p className="cta-subtext">{copy.ctaSub}</p>
        <div className="cta-actions">
          <button
            type="button"
            className="cta-primary-btn"
            onClick={() => {
              const el = document.getElementById('chon')
              el?.scrollIntoView({ behavior: 'smooth' })
              onPickNow()
            }}
          >
            <span>{isVi ? 'Rút quẻ trưa ngay' : 'Pick a dish now'}</span>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="cta-btn-arrow">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </button>
          <a href="#kho" className="cta-secondary-link">
            <span>{isVi ? 'Xem toàn bộ kho món' : 'Browse full catalog'}</span>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="cta-link-arrow">
              <path d="M6 12l4-4-4-4" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
