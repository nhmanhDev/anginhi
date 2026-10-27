import { t } from './copy.ts'
import type { Lang } from './types.ts'

export function LandingFeatures({ lang }: { lang: Lang }) {
  const copy = t(lang)

  const items = [
    {
      id: 'fortune',
      title: copy.feature1Title,
      desc: copy.feature1Desc,
      tag: '5 Lots',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="bento-svg">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
        </svg>
      ),
      color: '#ff6f42',
      bg: '#fff3ec',
    },
    {
      id: 'filter',
      title: copy.feature2Title,
      desc: copy.feature2Desc,
      tag: 'Smart Filter',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="bento-svg">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
      ),
      color: '#10b981',
      bg: '#ecfdf5',
    },
    {
      id: 'places',
      title: copy.feature3Title,
      desc: copy.feature3Desc,
      tag: 'Maps & Grab',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="bento-svg">
          <circle cx="12" cy="10" r="3" />
          <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
        </svg>
      ),
      color: '#3b82f6',
      bg: '#eff6ff',
    },
    {
      id: 'custom',
      title: copy.feature4Title,
      desc: copy.feature4Desc,
      tag: 'Personalized',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="bento-svg">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
      color: '#8b5cf6',
      bg: '#f5f3ff',
    },
    {
      id: 'privacy',
      title: copy.feature5Title,
      desc: copy.feature5Desc,
      tag: 'Zero Account',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="bento-svg">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
      color: '#f59e0b',
      bg: '#fffbeb',
    },
  ]

  return (
    <section className="features-section" id="tinh-nang">
      <div className="section-head">
        <h2 className="section-title">
          {copy.featuresTitle} <span className="section-title-quiet">{copy.featuresSubtitle}</span>
        </h2>
      </div>

      <div className="features-bento-grid">
        {items.map((item) => (
          <div key={item.id} className="bento-card group">
            <div className="bento-media" style={{ backgroundColor: item.bg }}>
              <div className="bento-icon-wrapper" style={{ color: item.color }}>
                {item.icon}
                <span className="bento-tag">{item.tag}</span>
              </div>
              <div className="bento-hover-overlay">
                <p className="bento-hover-text">{item.desc}</p>
              </div>
            </div>
            <div className="bento-content">
              <h3 className="bento-title">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
