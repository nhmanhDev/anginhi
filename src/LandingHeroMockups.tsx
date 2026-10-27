import type { Lang } from './types.ts'

export function LandingHeroMockups({
  lang,
  areaQuery,
  onPickThisOrThat,
}: {
  lang: Lang
  areaQuery: string
  onPickThisOrThat?: (dishName: string) => void
}) {
  const isVi = lang === 'vi'

  return (
    <>
      {/* Top Left Floating Card: Bữa trưa kinh điển (-rotate-6) */}
      <div className="floating-card float-top-left" aria-hidden="true">
        <p className="float-card-header">
          <span className="dot-green" />
          <span>{isVi ? 'Bữa trưa văn phòng' : 'Classic Lunch'}</span>
        </p>
        <div className="float-mini-bars">
          <div className="mini-col">
            <div className="bar-cap" />
            <div className="bar-block" />
            <div className="bar-block" />
          </div>
          <div className="mini-col">
            <div className="bar-cap" />
            <div className="bar-block" />
            <div className="bar-block" />
          </div>
          <div className="mini-col">
            <div className="bar-cap" />
            <div className="bar-block" />
            <div className="bar-block" />
          </div>
        </div>
        <p className="float-card-sub">
          {isVi ? '35k – 55k · Nhanh gọn' : '35k – 55k · Fast & fresh'}
        </p>
      </div>

      {/* Bottom Left Floating Card: This or That (rotate-3) */}
      <div className="floating-card float-bottom-left" aria-hidden="true">
        <p className="float-card-tag">{isVi ? 'Hôm nay chọn gì?' : 'This or That'}</p>
        <div className="this-that-grid">
          <button
            type="button"
            className="this-that-pill"
            tabIndex={-1}
            onClick={() => onPickThisOrThat?.('Bún bò Huế')}
          >
            <span>Bún bò 🍜</span>
          </button>
          <button
            type="button"
            className="this-that-pill active"
            tabIndex={-1}
            onClick={() => onPickThisOrThat?.('Cơm tấm')}
          >
            <span>Cơm tấm 🍛</span>
          </button>
        </div>
        <p className="this-that-vote">
          {isVi ? 'Cơm tấm · 5/7 người chọn' : 'Broken rice · 5 of 7 voted'}
        </p>
      </div>

      {/* Top Right Floating Card: Maps & Grab (rotate-6) */}
      <div className="floating-card float-top-right" aria-hidden="true">
        <p className="float-card-header">
          <span className="app-badge-grab">G</span>
          <span>Google Maps & Grab</span>
        </p>
        <p className="float-card-subtext">
          {isVi
            ? `Tìm quán gần ${areaQuery ? areaQuery : 'vị trí của bạn'}.`
            : `Find food spots near ${areaQuery ? areaQuery : 'your location'}.`}
        </p>
        <div className="float-card-action">
          <span>{isVi ? 'Mở quán ngay' : 'Open nearby'}</span>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="mini-arrow">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </div>
      </div>

      {/* Bottom Right Floating Card: Zero Account / Client-side (-rotate-3) */}
      <div className="floating-card float-bottom-right" aria-hidden="true">
        <p className="float-card-header dark-text">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="bot-icon">
            <path d="M12 2a2 2 0 0 1 2 2v2h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4V4a2 2 0 0 1 2-2z" />
            <circle cx="9" cy="13" r="1.5" />
            <circle cx="15" cy="13" r="1.5" />
          </svg>
          <span>100% Client-side</span>
        </p>
        <div className="float-code-row">
          <code>localStorage · 0 tracking</code>
          <span className="badge-done">✓ done</span>
        </div>
        <p className="float-card-subtext-dark">
          {isVi ? 'Không cần tạo tài khoản.' : 'No login required.'}
        </p>
      </div>
    </>
  )
}
