import styles from './styles.module.css';
import logo from '../../img/logo.svg';

const NAV_LINKS = [
  { label: 'Início', href: '/' },
  { label: 'Coleções', href: '/colecoes' },
  { label: 'Novidades', href: '/novidades' },
  { label: 'Sobre Nós', href: '/sobre' },
  { label: 'Contato', href: '/contato' },
];

const INSTITUTIONAL_LINKS = [
  { label: 'Política de Privacidade', href: '/privacidade' },
  { label: 'Termos de Uso', href: '/termos' },
  { label: 'Trocas e Devoluções', href: '/trocas-devolucoes' },
  { label: 'Segurança', href: '/seguranca' },
];

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M14 3v10.6a3.4 3.4 0 1 1-2.6-3.3" />
        <path d="M14 3c.4 2.4 2.1 4.2 4.5 4.5" />
      </svg>
    ),
  },
  {
    label: 'Pinterest',
    href: 'https://pinterest.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 18c1-3.4 1.6-6 2-8.2M12.2 6.4c3 0 4.6 1.7 4.6 4 0 3-1.5 5.2-3.8 5.2-1 0-1.7-.5-2-1.2" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M14.5 21v-7h2.4l.4-3H14.5V9c0-.9.3-1.5 1.7-1.5h1.4V4.8c-.2 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6V11H9.8v3h2.2v7h2.5z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* assinatura: corrente de ouro suspensa */}
      {/* <div className={styles.chainLine} aria-hidden="true">
        <svg viewBox="0 0 1200 34" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chainGoldGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="12%" stopColor="#D4AF37" stopOpacity="0.9" />
              <stop offset="88%" stopColor="#D4AF37" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path className={styles.chainStrand} d="M0,17 Q300,34 600,17 T1200,17" />
          <g>
            <circle className={styles.chainLink} cx="80" cy="20.6" r="4" />
            <circle className={styles.chainLink} cx="220" cy="26.4" r="4" />
            <circle className={styles.chainLink} cx="360" cy="29.6" r="4" />
            <circle className={styles.chainLink} cx="500" cy="28.6" r="4" />
            <circle className={styles.chainLink} cx="640" cy="25" r="4" />
            <circle className={styles.chainLink} cx="780" cy="19.4" r="4" />
            <circle className={styles.chainLink} cx="920" cy="13.6" r="4" />
            <circle className={styles.chainLink} cx="1060" cy="10.4" r="4" />
            <circle className={styles.chainLink} cx="1160" cy="10" r="4" />
          </g>
        </svg>
      </div> */}

      <div className={styles.footerMain}>
        <div className={styles.brandCol}>
          <img className={styles.logoMark} src={logo} alt="Logo da joalheria" />
          <p className={styles.brandDesc}>
            Peças atemporais lapidadas à mão, criadas para acompanhar histórias
            que merecem durar gerações.
          </p>
          <div className={styles.socials}>
            {SOCIAL_LINKS.map(({ label, href, icon }) => (
              <div className={styles.circuloIcone}>
                 <a
                key={label}
                className={styles.socialIcon}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noreferrer"
              >
                {icon}
              </a>
              </div>
             
            ))}
          </div>
        </div>

        <nav className={styles.navCol} aria-label="Navegação">
          <p className={styles.colTitle}>Navegação</p>
          <ul>
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.serviceCol}>
          <p className={styles.colTitle}>Atendimento</p>
          <ul>
            <li>
              <a href="https://wa.me/5500000000000" target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </li>
            <li>
              <a href="mailto:contato@joalheria.com">E-mail</a>
            </li>
            <li className={styles.contactItem}>
              <span className={styles.label}>Horário</span>
              Seg a Sáb, 9h às 19h
            </li>
            <li>
              <a href="/faq">Perguntas Frequentes</a>
            </li>
          </ul>
        </div>

        <div className={styles.institutionalCol}>
          <p className={styles.colTitle}>Institucional</p>
          <ul>
            {INSTITUTIONAL_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>&copy; {year} Todos os direitos reservados.</p>
        <div className={styles.crest}>
          <span className={styles.dot} />
          Lapidação artesanal desde sempre
        </div>
      </div>
    </footer>
  );
}