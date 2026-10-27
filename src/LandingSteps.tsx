import { t } from './copy.ts'
import type { Lang } from './types.ts'

export function LandingSteps({ lang }: { lang: Lang }) {
  const copy = t(lang)
  const isVi = lang === 'vi'

  const steps = [
    {
      num: '01',
      title: copy.step1,
      desc: isVi
        ? 'Chọn suất ăn, mức ngân sách và khẩu vị ưa thích.'
        : 'Choose your course, budget cap and cravings.',
      badge: isVi ? 'Khẩu vị' : 'Filter',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="step-svg">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
    },
    {
      num: '02',
      title: isVi ? 'Chia 5 quẻ' : 'Deal 5 lots',
      desc: isVi
        ? 'Hệ thống chọn ngẫu nhiên 5 món phù hợp từ kho ẩm thực.'
        : 'System deals 5 matching dishes into 5 mystery cards.',
      badge: isVi ? 'Năm ô' : '5 Lots',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="step-svg">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M7 15h0M12 15h0M17 15h0" />
        </svg>
      ),
    },
    {
      num: '03',
      title: copy.step2,
      desc: isVi
        ? 'Lật mở 1 ô bạn chọn hoặc để thần may mắn khui ngẫu nhiên.'
        : 'Flip your favorite card or let chance reveal the dish.',
      badge: isVi ? 'Lật mở' : 'Flip',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="step-svg">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      num: '04',
      title: copy.step3,
      desc: isVi
        ? 'Chạm nút mở Maps, Grab hoặc ShopeeFood để ghé quán ngay.'
        : 'Open Google Maps, Grab or ShopeeFood to order right away.',
      badge: isVi ? 'Lên đường' : 'Go',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="step-svg">
          <polygon points="3 11 22 2 13 21 11 13 3 11" />
        </svg>
      ),
    },
  ]

  return (
    <section className="steps-section" id="quy-trinh">
      <div className="section-head text-center">
        <h2 className="section-title">
          {isVi ? '4 bước đơn giản.' : '4 simple steps.'}{' '}
          <span className="section-title-quiet">{copy.stepsHeading}</span>
        </h2>
      </div>

      <div className="steps-flow-container">
        {steps.map((step, index) => (
          <div key={step.num} className="step-wrapper">
            <div className="step-card">
              <div className="step-card-top">
                <span className="step-number">{step.num}</span>
                <span className="step-badge">{step.badge}</span>
              </div>
              <div className="step-icon-box">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>

            {index < steps.length - 1 && (
              <div className="step-arrow-container" aria-hidden="true">
                <svg
                  viewBox="0 0 160 80"
                  fill="none"
                  className={index % 2 === 0 ? 'step-curve-arrow down' : 'step-curve-arrow up'}
                >
                  <path
                    d={
                      index % 2 === 0
                        ? 'M 10 20 C 50 80, 110 80, 150 30'
                        : 'M 10 60 C 50 10, 110 10, 150 50'
                    }
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="5 6"
                    strokeLinecap="round"
                  />
                  <polygon
                    points={index % 2 === 0 ? '146,24 154,32 144,35' : '146,56 154,48 144,45'}
                    fill="currentColor"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
