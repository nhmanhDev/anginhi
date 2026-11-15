import type { Lang } from './types.ts'

type FooterProps = {
  brand: string
  lang?: Lang
  onOpenMine?: () => void
  onToggleSound?: () => void
}

export function Footer({ brand, lang = 'vi', onOpenMine }: FooterProps) {
  const isVi = lang === 'vi'

  return (
    <footer className="mega-footer" role="contentinfo">
      <div className="mega-footer-inner">
        {/* Top 4-Column Grid */}
        <div className="mega-footer-grid">
          {/* Cột 1: Brand & Sứ mệnh */}
          <div className="footer-col footer-col-brand">
            <div className="footer-brand-header">
              <span className="footer-brand-mark" aria-hidden="true">
                🍜
              </span>
              <span className="footer-brand-title">{brand}</span>
            </div>
            <p className="footer-brand-desc">
              {isVi
                ? 'Ứng dụng rút quẻ ẩm thực thông minh, giải phóng bạn khỏi câu hỏi muôn thuở "Trưa nay ăn gì?". Tự nhiên, vui vẻ và hoàn toàn miễn phí.'
                : 'Smart culinary fortune picker solving the eternal "What should we eat today?" dilemma. Playful, instant, and 100% free.'}
            </p>
            <div className="footer-badges-list">
              <span className="footer-pill-badge">
                <span className="badge-dot-green" />
                {isVi ? 'Không cần tạo tài khoản' : 'No account needed'}
              </span>
              <span className="footer-pill-badge">
                <span className="badge-dot-blue" />
                {isVi ? 'Zero tracking · Riêng tư 100%' : 'Zero tracking · 100% private'}
              </span>
            </div>
          </div>

          {/* Cột 2: Trải nghiệm & Tính năng */}
          <div className="footer-col">
            <h4 className="footer-col-title">{isVi ? 'Trải nghiệm' : 'Experience'}</h4>
            <ul className="footer-links-list">
              <li>
                <a href="#chon" className="footer-nav-link">
                  {isVi ? 'Rút quẻ trưa hôm nay' : 'Pick today fortune'}
                </a>
              </li>
              <li>
                <a href="#kho" className="footer-nav-link">
                  {isVi ? 'Bảo tàng 77 món ngon' : 'Archive of 77 dishes'}
                </a>
              </li>
              <li>
                <a href="#tinh-nang" className="footer-nav-link">
                  {isVi ? 'Tính năng nổi bật' : 'Key features'}
                </a>
              </li>
              <li>
                <a href="#bo-loc" className="footer-nav-link">
                  {isVi ? 'Bộ lọc ngân sách & món' : 'Budget & diet filters'}
                </a>
              </li>
              {onOpenMine && (
                <li>
                  <button type="button" onClick={onOpenMine} className="footer-nav-link footer-btn-link">
                    {isVi ? 'Kho món tự tạo của bạn' : 'Your custom dishes'}
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Cột 3: Tiện ích & Hỗ trợ */}
          <div className="footer-col">
            <h4 className="footer-col-title">{isVi ? 'Tiện ích' : 'Utilities'}</h4>
            <ul className="footer-links-list">
              <li>
                <a href="#quy-trinh" className="footer-nav-link">
                  {isVi ? 'Quy trình chọn món 4 bước' : '4-Step decision flow'}
                </a>
              </li>
              <li>
                <a
                  href="https://www.google.com/maps/search/qu%C3%A1n+%C4%83n+g%E1%BA%A7n+%C4%91%C3%A2y"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-nav-link external-link"
                >
                  <span>{isVi ? 'Tìm quán ăn gần đây' : 'Find nearby restaurants'}</span>
                  <span className="arrow-icon" aria-hidden="true">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/nhmanhDev/anginhi/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-nav-link external-link"
                >
                  <span>{isVi ? 'Góp ý món mới & báo lỗi' : 'Suggest dish / Bug report'}</span>
                  <span className="arrow-icon" aria-hidden="true">↗</span>
                </a>
              </li>
              <li>
                <span className="footer-offline-note">
                  {isVi ? '⚡ Hoạt động offline sau khi tải trang' : '⚡ Works offline once loaded'}
                </span>
              </li>
            </ul>
          </div>

          {/* Cột 4: Tác giả & Kết nối */}
          <div className="footer-col footer-col-author">
            <h4 className="footer-col-title">{isVi ? 'Tác giả & Kết nối' : 'Author & Community'}</h4>
            <p className="footer-author-intro">
              {isVi ? 'Phát triển bởi ' : 'Crafted with care by '}
              <a
                href="https://github.com/nhmanhDev"
                target="_blank"
                rel="noopener noreferrer"
                className="author-name-highlight"
              >
                Nguyễn Hữu Mạnh (AI42E)
              </a>
            </p>
            <div className="footer-social-chips">
              <a
                className="social-chip youtube"
                href="https://www.youtube.com/@nhmanhAI42E"
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube @nhmanhAI42E"
              >
                <YoutubeIcon />
                <span>YouTube</span>
              </a>
              <a
                className="social-chip facebook"
                href="https://www.facebook.com/nhmanhAI4E/"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook nhmanhAI4E"
              >
                <FacebookIcon />
                <span>Facebook</span>
              </a>
              <a
                className="social-chip telegram"
                href="https://t.me/AI42E"
                target="_blank"
                rel="noopener noreferrer"
                title="Telegram @AI42E"
              >
                <TelegramIcon />
                <span>Telegram</span>
              </a>
              <a
                className="social-chip github"
                href="https://github.com/nhmanhDev"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub nhmanhDev"
              >
                <GithubIcon />
                <span>GitHub</span>
              </a>
              <a
                className="social-chip mail"
                href="mailto:nhmanh.dev@gmail.com"
                title="Email nhmanh.dev@gmail.com"
              >
                <MailIcon />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Fine Print */}
        <div className="mega-footer-bottom">
          <div className="footer-copy-text">
            <span>© {new Date().getFullYear()} {brand} — Made for Vietnamese Food Lovers.</span>
            <span className="bottom-divider">·</span>
            <span>Mã nguồn mở theo giấy phép Apache-2.0.</span>
          </div>
          <div className="footer-back-to-top">
            <a href="#chon" className="back-top-link">
              <span>{isVi ? 'Lên đầu trang' : 'Back to top'}</span>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                <path d="M8 12V4M4 8l4-4 4 4" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className="chip-icon">
      <path fill="#FF0033" d="M23 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C19.2 5.4 12 5.4 12 5.4s-7.2 0-8.8.4c-.9.2-1.6.9-1.8 1.8C1 9 1 12.2 1 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 8.8.4 8.8.4s7.2 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6z" />
      <path fill="#fff" d="m10 15.2 5.2-3-5.2-3z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className="chip-icon">
      <path fill="#1877F2" d="M14.5 8.5V6.8c0-.7.5-1 1.1-1H17V3h-2.1C12.2 3 11 4.4 11 6.6v1.9H9v2.8h2V21h3.5v-9.7h2.3l.4-2.8h-2.7z" />
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className="chip-icon">
      <path fill="#2AABEE" d="M21.5 4.4 2.7 11.6c-1.3.5-1.3 1.2-.2 1.5l4.8 1.5 1.9 5.8c.2.7.1.9.8.9.5 0 .7-.2 1-.5l2.7-2.6 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.2-.4-1.8-1.8-1.4z" />
      <path fill="#fff" d="m8.8 14.2 8.6-5.4c.4-.3.8-.1.5.2l-7.1 6.4-.3 3.2z" />
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className="chip-icon">
      <path fill="currentColor" d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.6.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.6s.8-.3 2.8 1a9.7 9.7 0 0 1 5 0c2-1.3 2.8-1 2.8-1a3.6 3.6 0 0 1 .1 2.6 3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className="chip-icon">
      <path fill="#EA4335" d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z" />
      <path fill="#fff" d="m4.2 7.2 7.8 5.4 7.8-5.4" />
      <path fill="none" stroke="#B31412" strokeWidth="1.4" d="m4.2 7.2 7.8 5.4 7.8-5.4" />
    </svg>
  )
}
