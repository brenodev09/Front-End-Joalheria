/**
 * CRYSTAL — Hero Section Premium
 * React + CSS Modules + GSAP useGSAP
 *
 * Dependências:
 *   npm install gsap @gsap/react
 *
 * Fonts (adicionar no index.html ou _document.jsx):
 *   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@200;300;400&display=swap" rel="stylesheet">
 */

import React, { useRef, useMemo } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import styles from './styles.module.css';

// Registrar o hook do GSAP
gsap.registerPlugin(useGSAP);

/* ─── Componente: Logo SVG ─── */
const LogoCristal = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <polygon points="15,2 27,9 27,21 15,28 3,21 3,9"
      stroke="#c9a96e" strokeWidth="1" fill="none" opacity="0.85" />
    <polygon points="15,7 22,11 22,19 15,23 8,19 8,11"
      stroke="#c9a96e" strokeWidth="0.5" fill="none" opacity="0.35" />
    <line x1="15" y1="2" x2="15" y2="7" stroke="#c9a96e" strokeWidth="0.5" opacity="0.5" />
    <line x1="27" y1="9" x2="22" y2="11" stroke="#c9a96e" strokeWidth="0.5" opacity="0.5" />
    <line x1="27" y1="21" x2="22" y2="19" stroke="#c9a96e" strokeWidth="0.5" opacity="0.5" />
    <line x1="15" y1="28" x2="15" y2="23" stroke="#c9a96e" strokeWidth="0.5" opacity="0.5" />
    <line x1="3" y1="21" x2="8" y2="19" stroke="#c9a96e" strokeWidth="0.5" opacity="0.5" />
    <line x1="3" y1="9" x2="8" y2="11" stroke="#c9a96e" strokeWidth="0.5" opacity="0.5" />
    <circle cx="15" cy="15" r="2.2" fill="#c9a96e" opacity="0.65" />
    <circle cx="15" cy="15" r="1" fill="#e8c97a" opacity="0.9" />
  </svg>
);

/* ─── Componente: Joia SVG ─── */
const JoiaSVG = () => (
  <svg
    viewBox="0 0 380 520"
    xmlns="http://www.w3.org/2000/svg"
    className={styles.joiaSvg}
    aria-label="Crystal luxury necklace"
  >
    <defs>
      <radialGradient id="gradGema" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#2a2a2a" />
        <stop offset="50%" stopColor="#0d0d0d" />
        <stop offset="100%" stopColor="#050505" />
      </radialGradient>
      <radialGradient id="gradGemaClara" cx="30%" cy="25%" r="60%">
        <stop offset="0%" stopColor="#3a3a3a" />
        <stop offset="100%" stopColor="#0d0d0d" />
      </radialGradient>
      <radialGradient id="gradMetal" cx="30%" cy="20%" r="80%">
        <stop offset="0%" stopColor="#d4b070" />
        <stop offset="50%" stopColor="#c9a96e" />
        <stop offset="100%" stopColor="#7a5c28" />
      </radialGradient>
      <filter id="brilhoGema" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <filter id="sombraFunda" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000000" floodOpacity="0.7" />
      </filter>
      <filter id="brilhoOuro" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <linearGradient id="corrente" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8a6a30" stopOpacity="0.4" />
        <stop offset="50%" stopColor="#c9a96e" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#8a6a30" stopOpacity="0.3" />
      </linearGradient>
    </defs>

    {/* ─── Corrente esquerda ─── */}
    <path
      d="M 190 30 Q 140 55 100 95 Q 70 125 52 162 Q 42 188 38 215"
      stroke="url(#corrente)" strokeWidth="1.8" fill="none" />
    {/* Elos da corrente esquerda */}
    {[
      [175, 38], [160, 48], [145, 60], [130, 73],
      [116, 88], [103, 104], [91, 121], [80, 139],
      [70, 157], [60, 175], [50, 194], [43, 213]
    ].map(([cx, cy], i) => (
      <ellipse key={`el-${i}`} cx={cx} cy={cy} rx="3.5" ry="2"
        fill="none" stroke="#c9a96e" strokeWidth="0.7" opacity="0.55"
        transform={`rotate(${-35 + i * 3}, ${cx}, ${cy})`} />
    ))}

    {/* ─── Corrente direita ─── */}
    <path
      d="M 190 30 Q 240 55 280 95 Q 310 125 328 162 Q 338 188 342 215"
      stroke="url(#corrente)" strokeWidth="1.8" fill="none" />
    {/* Elos da corrente direita */}
    {[
      [205, 38], [220, 48], [235, 60], [250, 73],
      [264, 88], [277, 104], [289, 121], [300, 139],
      [310, 157], [320, 175], [330, 194], [337, 213]
    ].map(([cx, cy], i) => (
      <ellipse key={`er-${i}`} cx={cx} cy={cy} rx="3.5" ry="2"
        fill="none" stroke="#c9a96e" strokeWidth="0.7" opacity="0.55"
        transform={`rotate(${35 - i * 3}, ${cx}, ${cy})`} />
    ))}

    {/* ─── Ponto de encaixe no topo ─── */}
    <circle cx="190" cy="30" r="5" fill="#1a1209" stroke="#c9a96e" strokeWidth="1" />
    <circle cx="190" cy="30" r="2.5" fill="#c9a96e" opacity="0.8" />

    {/* ─── Base do pendente (armação externa) ─── */}
    <g filter="url(#sombraFunda)">
      {/* Pétalas ornamentais externas */}
      {[0, 60, 120, 180, 240, 300].map((ang, i) => (
        <ellipse key={`pet-${i}`}
          cx={190 + Math.cos((ang - 90) * Math.PI / 180) * 68}
          cy={330 + Math.sin((ang - 90) * Math.PI / 180) * 68}
          rx="14" ry="24"
          fill="#111107"
          stroke="url(#gradMetal)"
          strokeWidth="0.8"
          transform={`rotate(${ang}, ${190 + Math.cos((ang - 90) * Math.PI / 180) * 68}, ${330 + Math.sin((ang - 90) * Math.PI / 180) * 68})`}
          opacity="0.9"
        />
      ))}

      {/* Anel exterior do pendente */}
      <circle cx="190" cy="330" r="90"
        fill="none" stroke="url(#gradMetal)" strokeWidth="2" opacity="0.5" />
      <circle cx="190" cy="330" r="86"
        fill="none" stroke="#c9a96e" strokeWidth="0.4" opacity="0.25" />

      {/* Armação principal do pendente */}
      <circle cx="190" cy="330" r="76"
        fill="#0d0d0d" stroke="url(#gradMetal)" strokeWidth="1.5" />

      {/* Detalhes de filigrana circulares */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => (
        <circle key={`fil-${i}`}
          cx={190 + Math.cos((ang - 90) * Math.PI / 180) * 62}
          cy={330 + Math.sin((ang - 90) * Math.PI / 180) * 62}
          r="5"
          fill="#0d0d0d"
          stroke="#c9a96e"
          strokeWidth="0.8"
          opacity="0.7"
        />
      ))}

      {/* Pedras pequenas na armação */}
      {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((ang, i) => (
        <ellipse key={`ps-${i}`}
          cx={190 + Math.cos((ang - 90) * Math.PI / 180) * 62}
          cy={330 + Math.sin((ang - 90) * Math.PI / 180) * 62}
          rx="4" ry="3"
          fill="url(#gradGemaClara)"
          stroke="#c9a96e" strokeWidth="0.5"
          transform={`rotate(${ang}, ${190 + Math.cos((ang - 90) * Math.PI / 180) * 62}, ${330 + Math.sin((ang - 90) * Math.PI / 180) * 62})`}
          opacity="0.8"
        />
      ))}
    </g>

    {/* ─── Gema central principal ─── */}
    <ellipse cx="190" cy="330" rx="48" ry="56"
      fill="url(#gradGema)"
      stroke="#c9a96e" strokeWidth="0.8"
      filter="url(#brilhoGema)" />

    {/* Facetas da gema */}
    <polygon points="190,276 238,302 238,358 190,384 142,358 142,302"
      fill="none" stroke="#c9a96e" strokeWidth="0.4" opacity="0.3" />
    <line x1="190" y1="276" x2="190" y2="384" stroke="#c9a96e" strokeWidth="0.3" opacity="0.2" />
    <line x1="142" y1="302" x2="238" y2="358" stroke="#c9a96e" strokeWidth="0.3" opacity="0.2" />
    <line x1="238" y1="302" x2="142" y2="358" stroke="#c9a96e" strokeWidth="0.3" opacity="0.2" />

    {/* Brilho interno da gema */}
    <ellipse cx="175" cy="308" rx="10" ry="6"
      fill="#3a3a3a" opacity="0.35"
      transform="rotate(-25, 175, 308)" />
    <ellipse cx="172" cy="305" rx="4" ry="2.5"
      fill="#5a5a5a" opacity="0.5"
      transform="rotate(-25, 172, 305)" />

    {/* ─── Haste de conexão corrente → pendente ─── */}
    <rect x="185" y="215" width="10" height="35"
      fill="#1a1209" stroke="#c9a96e" strokeWidth="0.8" rx="2" />
    <circle cx="190" cy="218" r="5"
      fill="#1a1209" stroke="#c9a96e" strokeWidth="0.8" />

    {/* ─── Brilhinhos / sparkles ─── */}
    {[
      [155, 290, 5], [228, 315, 4], [165, 365, 3.5],
      [217, 285, 3], [170, 328, 2.5]
    ].map(([x, y, size], i) => (
      <g key={`sp-${i}`} opacity={0.6 - i * 0.08}>
        <line x1={x - size} y1={y} x2={x + size} y2={y} stroke="#e8d090" strokeWidth="0.6" />
        <line x1={x} y1={y - size} x2={x} y2={y + size} stroke="#e8d090" strokeWidth="0.6" />
        <line x1={x - size * 0.7} y1={y - size * 0.7} x2={x + size * 0.7} y2={y + size * 0.7}
          stroke="#e8d090" strokeWidth="0.4" />
        <line x1={x + size * 0.7} y1={y - size * 0.7} x2={x - size * 0.7} y2={y + size * 0.7}
          stroke="#e8d090" strokeWidth="0.4" />
        <circle cx={x} cy={y} r={size * 0.2} fill="#fff" opacity="0.9" />
      </g>
    ))}
  </svg>
);

/* ─── Componente Principal ─── */
const Home = () => {
  const refContainer    = useRef(null);
  const refNav          = useRef(null);
  const refSubtitulo    = useRef(null);
  const refTitulo       = useRef(null);
  const refDescricao    = useRef(null);
  const refCta          = useRef(null);
  const refInfoRodape   = useRef(null);
  const refJoiaWrapper  = useRef(null);
  const refGlow         = useRef(null);
  const refFeixe1       = useRef(null);
  const refFeixe2       = useRef(null);
  const refLinhaDec     = useRef(null);

  /* Gerar partículas com useMemo para evitar recriação a cada render */
  const particulas = useMemo(() =>
    Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left:     `${Math.random() * 100}%`,
      top:      `${Math.random() * 110}%`,
      tamanho:  Math.random() * 2 + 0.5,
      atraso:   Math.random() * 8,
      duracao:  Math.random() * 5 + 4,
      opacidade: Math.random() * 0.5 + 0.1,
    })),
  []);

  /* ─── GSAP Animations ─── */
  useGSAP(() => {
    /* Timeline de entrada cinematográfica */
    const tlEntrada = gsap.timeline({
      defaults: { ease: 'power3.out' },
    });

    /* 1. Navbar desliza para baixo */
    tlEntrada.fromTo(
      refNav.current,
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.4 }
    );

    /* 2. Joia sobe com escala */
    tlEntrada.fromTo(
      refJoiaWrapper.current,
      { y: 70, opacity: 0, scale: 0.88 },
      { y: 0, opacity: 1, scale: 1, duration: 2, ease: 'power2.out' },
      '-=0.9'
    );

    /* 3. Glow aparece */
    tlEntrada.fromTo(
      [refGlow.current, refFeixe1.current, refFeixe2.current],
      { opacity: 0, scale: 0.7 },
      { opacity: 1, scale: 1, duration: 1.8, stagger: 0.15 },
      '-=1.6'
    );

    /* 4. Linha decorativa se desenha */
    tlEntrada.fromTo(
      refLinhaDec.current,
      { scaleY: 0, transformOrigin: 'top center' },
      { scaleY: 1, duration: 1.2, ease: 'power2.inOut' },
      '-=1.2'
    );

    /* 5. Textos sobem com stagger */
    tlEntrada.fromTo(
      [
        refSubtitulo.current,
        refTitulo.current,
        refDescricao.current,
        refCta.current,
      ],
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, stagger: 0.18 },
      '-=1.4'
    );

    /* 6. Info rodapé */
    tlEntrada.fromTo(
      refInfoRodape.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.8 },
      '-=0.4'
    );

    /* ─── Animação contínua: joia flutuando ─── */
    gsap.to(refJoiaWrapper.current, {
      y: '-=20',
      duration: 3.8,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    });

    /* ─── Leve rotação pendular ─── */
    gsap.to(refJoiaWrapper.current, {
      rotationZ: 1.8,
      duration: 5.5,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    });

    /* ─── Glow pulsando ─── */
    gsap.to(refGlow.current, {
      opacity: 0.55,
      scale: 1.18,
      duration: 3,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    });

    /* ─── Feixes de luz oscilando ─── */
    gsap.to(refFeixe1.current, {
      opacity: 0.25,
      scaleY: 0.7,
      duration: 4,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    });

    gsap.to(refFeixe2.current, {
      opacity: 0.15,
      scaleY: 1.3,
      duration: 5.2,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1.5,
    });

    /* ─── Movimento suave no fundo ─── */
    gsap.to('.fundoBlur1', {
      x: '+=25',
      y: '+=15',
      duration: 8,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    });

    gsap.to('.fundoBlur2', {
      x: '-=20',
      y: '-=10',
      duration: 10,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    });

  }, { scope: refContainer });

  return (
    <div ref={refContainer} className={styles.container}>

      {/* ─── Partículas de fundo ─── */}
      <div className={styles.particulas} aria-hidden="true">
        {particulas.map((p) => (
          <span
            key={p.id}
            className={styles.particula}
            style={{
              left:              p.left,
              top:               p.top,
              width:             `${p.tamanho}px`,
              height:            `${p.tamanho}px`,
              animationDelay:    `${p.atraso}s`,
              animationDuration: `${p.duracao}s`,
              opacity:           p.opacidade,
            }}
          />
        ))}
      </div>

      {/* ─── Blurs atmosféricos ─── */}
      <div className={`${styles.fundoBlur1} fundoBlur1`} aria-hidden="true" />
      <div className={`${styles.fundoBlur2} fundoBlur2`} aria-hidden="true" />
      <div className={styles.fundoVinheta} aria-hidden="true" />

      {/* ═══════════════ NAVBAR ═══════════════ */}
      <nav ref={refNav} className={styles.navbar}>
        <div className={styles.logo}>
          <LogoCristal />
          <span className={styles.logoTexto}>CRYSTAL</span>
        </div>

        <ul className={styles.navLinks}>
          <li><a href="#colecao" className={styles.navLink}>Collection</a></li>
          <li><a href="#atelier" className={styles.navLink}>Atelier</a></li>
          <li><a href="#sobre"   className={styles.navLink}>About</a></li>
        </ul>

        <a href="#contato" className={styles.navCta}>Inquire</a>
      </nav>

      {/* ═══════════════ HERO ═══════════════ */}
      <main className={styles.hero}>

        {/* ─── Conteúdo textual ─── */}
        <div className={styles.conteudoTexto}>
          <span ref={refSubtitulo} className={styles.subtitulo}>
            Est. 2024 &nbsp;·&nbsp; Haute Joaillerie
          </span>

          <h1 ref={refTitulo} className={styles.titulo}>
            Crafted<br />
            <em className={styles.tituloItalico}>For Eternity</em>
          </h1>

          <p ref={refDescricao} className={styles.descricao}>
            Each piece is born from silence<br />
            and obsession. Rare stones.<br />
            Worn by the few.
          </p>

          <div ref={refCta} className={styles.ctaWrapper}>
            <a href="#colecao" className={styles.cta}>
              <span className={styles.ctaTexto}>Explore Collection</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8 H13 M9 4 L13 8 L9 12"
                  stroke="#c9a96e" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </a>
          </div>
        </div>

        {/* ─── Joia central ─── */}
        <div className={styles.joiaArea}>
          <div ref={refGlow}   className={styles.joiaGlow}   aria-hidden="true" />
          <div ref={refFeixe1} className={styles.joiaFeixe1} aria-hidden="true" />
          <div ref={refFeixe2} className={styles.joiaFeixe2} aria-hidden="true" />

          <div ref={refJoiaWrapper} className={styles.joiaWrapper}>
            <JoiaSVG />
          </div>
        </div>

        {/* ─── Linha decorativa vertical ─── */}
        <div ref={refLinhaDec} className={styles.linhaDec} aria-hidden="true" />

        {/* ─── Informações rodapé da hero ─── */}
        <footer ref={refInfoRodape} className={styles.infoRodape}>
          <span className={styles.infoData}>17/03 — Exclusive Launch</span>
          <div className={styles.infoSeparador} />
          <span className={styles.infoBadge}>Timeless Elegance</span>
        </footer>

      </main>
    </div>
  );
};

export default Home;