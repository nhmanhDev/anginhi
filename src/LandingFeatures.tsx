import { t } from './copy.ts'
import type { Lang } from './types.ts'

export function LandingFeatures({ lang }: { lang: Lang }) {
  const copy = t(lang)
  const isVi = lang === 'vi'

  return (
    <section className="features-section" id="tinh-nang">
      <div className="section-head">
        <h2 className="section-title">
          {copy.featuresTitle} <span className="section-title-quiet">{copy.featuresSubtitle}</span>
        </h2>
      </div>

      <div className="features-bento-grid">
        {/* Card 1: Quẻ trưa 5 ô - có visual 3 lá bài ẩm thực lật quạt */}
        <div className="bento-card group bento-card-1">
          <div className="bento-media">
            <div className="bento-visual-cards-fan">
              <div className="fan-card fan-left">
                <img src="/food/bun-cha.jpg" alt="Bún chả" />
                <span>Bún chả</span>
              </div>
              <div className="fan-card fan-center">
                <img src="/food/pho-bo.jpg" alt="Phở bò" />
                <span className="font-bold text-warm-pepper">Quẻ may mắn</span>
              </div>
              <div className="fan-card fan-right">
                <img src="/food/nem-nuong.jpg" alt="Nem nướng" />
                <span>Nem nướng</span>
              </div>
            </div>
            <div className="bento-tag-badge orange">5 LOTS</div>
          </div>
          <div className="bento-content">
            <h3 className="bento-title">{copy.feature1Title}</h3>
            <p className="bento-desc">{copy.feature1Desc}</p>
          </div>
        </div>

        {/* Card 2: Bộ lọc đa chiều - có visual pills filter */}
        <div className="bento-card group bento-card-2">
          <div className="bento-media">
            <div className="bento-visual-filter-chips">
              <div className="bento-chip active-orange">
                <span>🍜 Món chính</span>
                <span className="chip-dot" />
              </div>
              <div className="bento-chip active-green">
                <span>🌱 Món chay</span>
                <span className="chip-dot" />
              </div>
              <div className="bento-chip">
                <span>💰 35k – 55k</span>
              </div>
              <div className="bento-chip">
                <span>🏮 Miền Trung</span>
              </div>
            </div>
            <div className="bento-tag-badge emerald">SMART FILTER</div>
          </div>
          <div className="bento-content">
            <h3 className="bento-title">{copy.feature2Title}</h3>
            <p className="bento-desc">{copy.feature2Desc}</p>
          </div>
        </div>

        {/* Card 3: Tìm quán 1 chạm - có visual restaurant card */}
        <div className="bento-card group bento-card-3">
          <div className="bento-media">
            <div className="bento-visual-restaurant">
              <img src="/food/com-tam.jpg" alt="Cơm tấm" className="bento-rest-thumb" />
              <div className="bento-rest-meta">
                <span className="bento-rest-name">Cơm Tấm Ba Ghiền</span>
                <span className="bento-rest-dist">📍 450m · ⭐ 4.8 (2.8k)</span>
              </div>
              <div className="bento-rest-pills">
                <span className="rest-pill maps">Google Maps</span>
                <span className="rest-pill grab">GrabFood</span>
              </div>
            </div>
            <div className="bento-tag-badge blue">MAPS & GRAB</div>
          </div>
          <div className="bento-content">
            <h3 className="bento-title">{copy.feature3Title}</h3>
            <p className="bento-desc">{copy.feature3Desc}</p>
          </div>
        </div>

        {/* Card 4: Món của tôi - có visual list món riêng kèm toggle */}
        <div className="bento-card group bento-card-4">
          <div className="bento-media">
            <div className="bento-visual-custom-dish">
              <div className="bento-custom-item">
                <img src="/food/banh-mi-chao.jpg" alt="Bánh mì chảo" className="bento-custom-img" />
                <div className="bento-custom-info">
                  <span className="bento-custom-title">Bánh mì chảo Cột Điện</span>
                  <span className="bento-custom-sub">{isVi ? 'Đã thêm vào kho riêng' : 'Custom dish'}</span>
                </div>
                <div className="bento-custom-toggle on" />
              </div>
            </div>
            <div className="bento-tag-badge purple">PERSONALIZED</div>
          </div>
          <div className="bento-content">
            <h3 className="bento-title">{copy.feature4Title}</h3>
            <p className="bento-desc">{copy.feature4Desc}</p>
          </div>
        </div>

        {/* Card 5: Zero Account - có visual bảo mật offline */}
        <div className="bento-card group bento-card-5">
          <div className="bento-media">
            <div className="bento-visual-privacy">
              <div className="privacy-shield-icon">🛡️</div>
              <div className="privacy-status-box">
                <span className="status-label">Client-Side Only</span>
                <span className="status-sub">Zero Tracking · Zero Server Log</span>
              </div>
            </div>
            <div className="bento-tag-badge amber">ZERO ACCOUNT</div>
          </div>
          <div className="bento-content">
            <h3 className="bento-title">{copy.feature5Title}</h3>
            <p className="bento-desc">{copy.feature5Desc}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
