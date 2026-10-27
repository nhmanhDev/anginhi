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
      {/* Top Left Floating Card: Bữa trưa văn phòng (-rotate-6) */}
      <div className="floating-card float-top-left" aria-hidden="true">
        <div className="float-card-header">
          <span className="dot-green" />
          <span className="font-semibold">{isVi ? 'Bữa trưa văn phòng' : 'Office Lunch Picks'}</span>
          <span className="mini-badge-hot">{isVi ? 'Gợi ý' : 'Top'}</span>
        </div>

        {/* Danh sách 3 món trưa với ảnh thật */}
        <div className="float-lunch-list">
          <div className="float-lunch-item">
            <img src="/food/com-tam.jpg" alt="Cơm tấm" className="float-mini-thumb" />
            <div className="float-lunch-meta">
              <span className="float-lunch-name">Cơm tấm sườn</span>
              <span className="float-lunch-price">50.000₫</span>
            </div>
            <span className="float-mini-tag">{isVi ? 'Nhanh' : 'Fast'}</span>
          </div>

          <div className="float-lunch-item">
            <img src="/food/bun-cha.jpg" alt="Bún chả" className="float-mini-thumb" />
            <div className="float-lunch-meta">
              <span className="float-lunch-name">Bún chả Hà Nội</span>
              <span className="float-lunch-price">50.000₫</span>
            </div>
            <span className="float-mini-tag">{isVi ? 'Đậm đà' : 'Rich'}</span>
          </div>

          <div className="float-lunch-item">
            <img src="/food/pho-bo.jpg" alt="Phở bò" className="float-mini-thumb" />
            <div className="float-lunch-meta">
              <span className="float-lunch-name">Phở bò tái lăn</span>
              <span className="float-lunch-price">55.000₫</span>
            </div>
            <span className="float-mini-tag">{isVi ? 'Món nước' : 'Soup'}</span>
          </div>
        </div>

        <p className="float-card-sub">
          {isVi ? '35k – 55k · Gợi ý trưa nay' : '35k – 55k · Today’s suggestions'}
        </p>
      </div>

      {/* Bottom Left Floating Card: This or That (rotate-3) */}
      <div className="floating-card float-bottom-left" aria-hidden="true">
        <div className="float-card-header-between">
          <span className="float-card-tag">{isVi ? 'Kèo trưa nay: Chọn gì?' : 'This or That'}</span>
          <span className="this-that-badge-live">LIVE VOTE</span>
        </div>

        {/* 2 Card ảnh món đối đầu sinh động */}
        <div className="this-that-battle">
          <button
            type="button"
            className="this-that-card"
            tabIndex={-1}
            onClick={() => onPickThisOrThat?.('Bún bò Huế')}
          >
            <div className="this-that-thumb-wrap">
              <img src="/food/bun-bo-hue.jpg" alt="Bún bò" className="this-that-thumb" />
            </div>
            <span className="this-that-dish-title">Bún bò Huế</span>
            <div className="this-that-bar-track">
              <div className="this-that-bar-fill left" style={{ width: '42%' }} />
            </div>
            <span className="this-that-pct">42%</span>
          </button>

          <span className="this-that-vs">VS</span>

          <button
            type="button"
            className="this-that-card winner"
            tabIndex={-1}
            onClick={() => onPickThisOrThat?.('Cơm tấm')}
          >
            <div className="this-that-thumb-wrap">
              <img src="/food/com-tam.jpg" alt="Cơm tấm" className="this-that-thumb" />
              <span className="crown-badge">👑</span>
            </div>
            <span className="this-that-dish-title">Cơm tấm sườn</span>
            <div className="this-that-bar-track">
              <div className="this-that-bar-fill right" style={{ width: '58%' }} />
            </div>
            <span className="this-that-pct winner-text">58%</span>
          </button>
        </div>

        <p className="this-that-vote">
          {isVi ? 'Cơm tấm đang dẫn đầu trưa nay' : 'Broken rice leading today'}
        </p>
      </div>

      {/* Top Right Floating Card: Maps & Grab (rotate-6) */}
      <div className="floating-card float-top-right" aria-hidden="true">
        <div className="float-card-header">
          <div className="app-badge-maps">📍</div>
          <span className="font-semibold">
            {isVi ? `Quán ngon gần ${areaQuery || 'đây'}` : `Spots near ${areaQuery || 'you'}`}
          </span>
        </div>

        <div className="float-restaurant-card">
          <img src="/food/banh-mi.jpg" alt="Bánh mì" className="restaurant-thumb" />
          <div className="restaurant-info">
            <span className="restaurant-name">Bánh Mì Huỳnh Hoa</span>
            <div className="restaurant-rating">
              <span className="star-gold">★ 4.9</span>
              <span className="reviews-count">(3.2k)</span>
              <span className="dist-sep">·</span>
              <span className="restaurant-dist">{isVi ? 'Cách 350m' : '350m away'}</span>
            </div>
            <span className="restaurant-status">{isVi ? '● Đang mở cửa' : '● Open now'}</span>
          </div>
        </div>

        <div className="float-app-buttons">
          <div className="btn-app-chip maps">
            <span>Google Maps</span>
          </div>
          <div className="btn-app-chip grab">
            <span>GrabFood</span>
          </div>
        </div>
      </div>

      {/* Bottom Right Floating Card: Zero Account / Client-side (-rotate-3) */}
      <div className="floating-card float-bottom-right" aria-hidden="true">
        <div className="float-card-header">
          <span className="shield-icon">🛡️</span>
          <span className="font-semibold">{isVi ? 'Món yêu thích đã ghim' : 'Saved Favorites'}</span>
        </div>

        <div className="float-saved-dishes">
          <div className="saved-dish-row">
            <img src="/food/bun-dau.jpg" alt="Bún đậu" className="saved-dish-img" />
            <span className="saved-dish-name">Bún đậu mắm tôm</span>
            <span className="saved-check-badge">✓</span>
          </div>
          <div className="saved-dish-row">
            <img src="/food/pho-ga.jpg" alt="Phở gà" className="saved-dish-img" />
            <span className="saved-dish-name">Phở gà đùi</span>
            <span className="saved-check-badge">✓</span>
          </div>
        </div>

        <div className="float-storage-badge">
          <span className="storage-dot" />
          <span>localStorage · 100% Offline · 0 Tracking</span>
        </div>
      </div>
    </>
  )
}
