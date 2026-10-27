export function Footer({ brand }: { brand: string }) {
  return (
    <footer className="foot">
      <div className="foot-inner">
        <p className="foot-brand">{brand}</p>
        <div className="footer-social-grid">
          <a className="social-card" href="https://www.youtube.com/@nhmanhAI42E" target="_blank" rel="noopener noreferrer">
            <YoutubeIcon />
            <span>
              <strong>YouTube</strong>
              <small>@nhmanhAI42E</small>
            </span>
          </a>
          <a className="social-card" href="https://www.facebook.com/nhmanhAI4E/" target="_blank" rel="noopener noreferrer">
            <FacebookIcon />
            <span>
              <strong>Facebook</strong>
              <small>nhmanhAI4E</small>
            </span>
          </a>
          <a className="social-card" href="https://t.me/AI42E" target="_blank" rel="noopener noreferrer">
            <TelegramIcon />
            <span>
              <strong>Telegram</strong>
              <small>@AI42E</small>
            </span>
          </a>
          <a className="social-card" href="https://github.com/nhmanhDev" target="_blank" rel="noopener noreferrer">
            <GithubIcon />
            <span>
              <strong>GitHub</strong>
              <small>nhmanhDev</small>
            </span>
          </a>
          <a className="social-card" href="mailto:nhmanh.dev@gmail.com">
            <MailIcon />
            <span>
              <strong>Email</strong>
              <small>nhmanh.dev@gmail.com</small>
            </span>
          </a>
        </div>
      </div>
    </footer>
  )
}

function YoutubeIcon() {
  return (
    <svg className="social-icon youtube" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path fill="#FF0033" d="M23 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C19.2 5.4 12 5.4 12 5.4s-7.2 0-8.8.4c-.9.2-1.6.9-1.8 1.8C1 9 1 12.2 1 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 8.8.4 8.8.4s7.2 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6z" />
      <path fill="#fff" d="m10 15.2 5.2-3-5.2-3z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg className="social-icon facebook" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path fill="#1877F2" d="M14.5 8.5V6.8c0-.7.5-1 1.1-1H17V3h-2.1C12.2 3 11 4.4 11 6.6v1.9H9v2.8h2V21h3.5v-9.7h2.3l.4-2.8h-2.7z" />
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg className="social-icon telegram" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path fill="#2AABEE" d="M21.5 4.4 2.7 11.6c-1.3.5-1.3 1.2-.2 1.5l4.8 1.5 1.9 5.8c.2.7.1.9.8.9.5 0 .7-.2 1-.5l2.7-2.6 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.2-.4-1.8-1.8-1.4z" />
      <path fill="#fff" d="m8.8 14.2 8.6-5.4c.4-.3.8-.1.5.2l-7.1 6.4-.3 3.2z" />
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg className="social-icon github" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path fill="currentColor" d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.6.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.6s.8-.3 2.8 1a9.7 9.7 0 0 1 5 0c2-1.3 2.8-1 2.8-1a3.6 3.6 0 0 1 .1 2.6 3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg className="social-icon mail" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path fill="#EA4335" d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z" />
      <path fill="#fff" d="m4.2 7.2 7.8 5.4 7.8-5.4" />
      <path fill="none" stroke="#B31412" strokeWidth="1.4" d="m4.2 7.2 7.8 5.4 7.8-5.4" />
    </svg>
  )
}
