/**
 * CRYSTAL — Produtos em Destaque
 * React + CSS Modules + GSAP useGSAP + ScrollTrigger
 *
 * npm install gsap @gsap/react
 *
 * Fonts (index.html):
 * <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@200;300;400&display=swap" rel="stylesheet">
 */

import React, { useRef, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ProdutosDestaque.module.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ═══════════════════════════════════════════════════════════
   ILUSTRAÇÕES SVG — PRODUTOS
   ═══════════════════════════════════════════════════════════ */

const IluProdutoPrincipal = () => (
  <svg viewBox="0 0 420 560" xmlns="http://www.w3.org/2000/svg" className={styles.produtoIlu}>
    <defs>
      <radialGradient id="pp-bg" cx="50%" cy="38%" r="72%">
        <stop offset="0%" stopColor="#1e1408" />
        <stop offset="55%" stopColor="#0d0b07" />
        <stop offset="100%" stopColor="#060504" />
      </radialGradient>
      <radialGradient id="pp-glow" cx="50%" cy="52%" r="52%">
        <stop offset="0%" stopColor="#c9a96e" stopOpacity=".26" />
        <stop offset="60%" stopColor="#c9a96e" stopOpacity=".06" />
        <stop offset="100%" stopColor="#c9a96e" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="pp-gem" cx="28%" cy="22%" r="72%">
        <stop offset="0%" stopColor="#323232" />
        <stop offset="40%" stopColor="#141414" />
        <stop offset="100%" stopColor="#030303" />
      </radialGradient>
      <linearGradient id="pp-metal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#6a4a1e" />
        <stop offset="30%"  stopColor="#c9a96e" />
        <stop offset="60%"  stopColor="#e8d090" />
        <stop offset="85%"  stopColor="#c9a96e" />
        <stop offset="100%" stopColor="#8a6a30" />
      </linearGradient>
      <linearGradient id="pp-metal2" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="#8a6a30" />
        <stop offset="50%"  stopColor="#d4b070" />
        <stop offset="100%" stopColor="#6a4a1e" />
      </linearGradient>
      <filter id="pp-soft">
        <feGaussianBlur stdDeviation="3" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="pp-shadow">
        <feDropShadow dx="0" dy="20" stdDeviation="24" floodColor="#000" floodOpacity=".8"/>
      </filter>
      <filter id="pp-glow-filter">
        <feGaussianBlur stdDeviation="6" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    <rect width="420" height="560" fill="url(#pp-bg)"/>
    <ellipse cx="210" cy="300" rx="180" ry="150" fill="url(#pp-glow)"/>

    {/* Reflexo dramático de luz no topo */}
    <ellipse cx="210" cy="80" rx="140" ry="55" fill="white" opacity=".018" filter="url(#pp-soft)"/>

    <g filter="url(#pp-shadow)">
      {/* === COLAR ELABORADO === */}

      {/* Corrente principal esquerda */}
      <path d="M 210 55 Q 148 75 105 120 Q 72 155 58 200 Q 48 235 46 270"
        fill="none" stroke="url(#pp-metal2)" strokeWidth="2.2" opacity=".85"/>
      {/* Corrente principal direita */}
      <path d="M 210 55 Q 272 75 315 120 Q 348 155 362 200 Q 372 235 374 270"
        fill="none" stroke="url(#pp-metal2)" strokeWidth="2.2" opacity=".85"/>

      {/* Elos corrente esquerda */}
      {[
        [197,62],[184,72],[170,84],[156,97],[143,112],
        [131,128],[120,146],[110,165],[101,185],[94,206],
        [88,228],[83,250],[79,270]
      ].map(([x,y],i) => (
        <ellipse key={`el-${i}`} cx={x} cy={y} rx="4" ry="2.8"
          fill="none" stroke="#c9a96e" strokeWidth=".85" opacity=".6"
          transform={`rotate(${-50+i*5},${x},${y})`}/>
      ))}

      {/* Elos corrente direita */}
      {[
        [223,62],[236,72],[250,84],[264,97],[277,112],
        [289,128],[300,146],[310,165],[319,185],[326,206],
        [332,228],[337,250],[341,270]
      ].map(([x,y],i) => (
        <ellipse key={`er-${i}`} cx={x} cy={y} rx="4" ry="2.8"
          fill="none" stroke="#c9a96e" strokeWidth=".85" opacity=".6"
          transform={`rotate(${50-i*5},${x},${y})`}/>
      ))}

      {/* Fecho do colar no topo */}
      <rect x="198" y="44" width="24" height="16" rx="4"
        fill="#0d0b07" stroke="url(#pp-metal)" strokeWidth="1.4"/>
      <line x1="204" y1="50" x2="216" y2="50" stroke="#c9a96e" strokeWidth=".7" opacity=".5"/>
      <line x1="204" y1="55" x2="216" y2="55" stroke="#c9a96e" strokeWidth=".7" opacity=".5"/>
      <circle cx="210" cy="52" r="3.5" fill="none" stroke="#c9a96e" strokeWidth=".9" opacity=".75"/>

      {/* === PENDENTE CENTRAL ELABORADO === */}

      {/* Haste */}
      <line x1="210" y1="270" x2="210" y2="300" stroke="#c9a96e" strokeWidth="2.5" strokeLinecap="round"/>

      {/* Anel de conexão */}
      <circle cx="210" cy="273" r="6"
        fill="#0d0b07" stroke="url(#pp-metal)" strokeWidth="1.2"/>
      <circle cx="210" cy="273" r="3"
        fill="#c9a96e" opacity=".7"/>

      {/* Armação externa do pendente */}
      <circle cx="210" cy="390" r="88"
        fill="none" stroke="url(#pp-metal)" strokeWidth="2" opacity=".55"/>
      <circle cx="210" cy="390" r="84"
        fill="none" stroke="#c9a96e" strokeWidth=".5" opacity=".18" strokeDasharray="2 6"/>

      {/* Pétalas decorativas (6) */}
      {[0,60,120,180,240,300].map((ang,i) => {
        const rad = (ang - 90) * Math.PI / 180;
        const cx = 210 + Math.cos(rad)*76;
        const cy = 390 + Math.sin(rad)*76;
        return (
          <ellipse key={`pet-${i}`} cx={cx} cy={cy} rx="12" ry="20"
            fill="#0c0a06" stroke="url(#pp-metal)" strokeWidth=".9"
            transform={`rotate(${ang},${cx},${cy})`} opacity=".88"/>
        );
      })}

      {/* Anel médio */}
      <circle cx="210" cy="390" r="68"
        fill="none" stroke="url(#pp-metal)" strokeWidth="1.5" opacity=".45"/>

      {/* Pedrinhas na armação (12) */}
      {Array.from({length:12},(_,i) => {
        const a = (i/12)*2*Math.PI - Math.PI/2;
        const x = 210 + Math.cos(a)*72;
        const y = 390 + Math.sin(a)*72;
        return (
          <circle key={`ps-${i}`} cx={x} cy={y} r="5.5"
            fill="#0c0a06" stroke="#c9a96e" strokeWidth=".8" opacity=".75"/>
        );
      })}

      {/* Plataforma interna */}
      <circle cx="210" cy="390" r="56"
        fill="#080605" stroke="url(#pp-metal)" strokeWidth="1.8"/>

      {/* Anel de pedras pequenas interno */}
      {Array.from({length:16},(_,i) => {
        const a = (i/16)*2*Math.PI - Math.PI/2;
        const x = 210 + Math.cos(a)*46;
        const y = 390 + Math.sin(a)*46;
        return (
          <ellipse key={`pi-${i}`} cx={x} cy={y} rx="4" ry="3"
            fill="url(#pp-gem)" stroke="#c9a96e" strokeWidth=".6"
            transform={`rotate(${(i/16)*360-90},${x},${y})`}
            opacity=".72"/>
        );
      })}

      {/* Gema central */}
      <circle cx="210" cy="390" r="34"
        fill="url(#pp-gem)" stroke="#c9a96e" strokeWidth="1"/>
      {/* Facetas */}
      {[0,45,90,135].map((a,i) => (
        <line key={`fc-${i}`}
          x1={210+Math.cos(a*Math.PI/180)*34}
          y1={390+Math.sin(a*Math.PI/180)*34}
          x2={210+Math.cos((a+180)*Math.PI/180)*34}
          y2={390+Math.sin((a+180)*Math.PI/180)*34}
          stroke="#c9a96e" strokeWidth=".4" opacity=".2"/>
      ))}
      {[0,60,120,180,240,300].map((a,i) => (
        <line key={`fcr-${i}`}
          x1="210" y1="390"
          x2={210+Math.cos((a-90)*Math.PI/180)*34}
          y2={390+Math.sin((a-90)*Math.PI/180)*34}
          stroke="#c9a96e" strokeWidth=".35" opacity=".18"/>
      ))}
      {/* Reflexo gema */}
      <ellipse cx="198" cy="376" rx="10" ry="6"
        fill="#2e2e2e" opacity=".45" transform="rotate(-25,198,376)"/>
      <ellipse cx="195" cy="373" rx="4" ry="2.5"
        fill="#4a4a4a" opacity=".55" transform="rotate(-25,195,373)"/>
    </g>

    {/* Sparkles */}
    {[
      [96,188,5.5],[334,195,5],[210,50,5.5],
      [160,340,4],[262,345,3.5],[210,480,4],
      [130,420,3],[292,418,3.5]
    ].map(([x,y,s],i) => (
      <g key={`sp-${i}`} opacity={.72-i*.07}>
        <line x1={x-s} y1={y} x2={x+s} y2={y} stroke="#e8d090" strokeWidth=".85"/>
        <line x1={x} y1={y-s} x2={x} y2={y+s} stroke="#e8d090" strokeWidth=".85"/>
        <line x1={x-s*.7} y1={y-s*.7} x2={x+s*.7} y2={y+s*.7} stroke="#e8d090" strokeWidth=".55"/>
        <line x1={x+s*.7} y1={y-s*.7} x2={x-s*.7} y2={y+s*.7} stroke="#e8d090" strokeWidth=".55"/>
        <circle cx={x} cy={y} r={s*.24} fill="#fff" opacity=".95"/>
      </g>
    ))}
  </svg>
);

const IluAnel = () => (
  <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" className={styles.produtoIlu}>
    <defs>
      <radialGradient id="ra-bg" cx="50%" cy="42%" r="72%">
        <stop offset="0%" stopColor="#1a1208"/>
        <stop offset="100%" stopColor="#060504"/>
      </radialGradient>
      <radialGradient id="ra-glow" cx="50%" cy="55%" r="50%">
        <stop offset="0%" stopColor="#c9a96e" stopOpacity=".22"/>
        <stop offset="100%" stopColor="#c9a96e" stopOpacity="0"/>
      </radialGradient>
      <radialGradient id="ra-gem" cx="30%" cy="25%" r="68%">
        <stop offset="0%" stopColor="#2e2e2e"/>
        <stop offset="55%" stopColor="#0c0c0c"/>
        <stop offset="100%" stopColor="#030303"/>
      </radialGradient>
      <linearGradient id="ra-metal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#8a6a30"/>
        <stop offset="40%"  stopColor="#d4b070"/>
        <stop offset="75%"  stopColor="#c9a96e"/>
        <stop offset="100%" stopColor="#6a4a1e"/>
      </linearGradient>
      <filter id="ra-shadow">
        <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#000" floodOpacity=".75"/>
      </filter>
    </defs>
    <rect width="300" height="300" fill="url(#ra-bg)"/>
    <ellipse cx="150" cy="175" rx="120" ry="95" fill="url(#ra-glow)"/>
    <g filter="url(#ra-shadow)">
      <ellipse cx="150" cy="210" rx="105" ry="32" fill="none" stroke="url(#ra-metal)" strokeWidth="22" opacity=".92"/>
      <ellipse cx="150" cy="210" rx="105" ry="32" fill="none" stroke="#c9a96e" strokeWidth=".8" strokeDasharray="3 5" opacity=".28"/>
      {[[-16,9],[16,9],[-25,20],[25,20]].map(([dx,dy],i)=>(
        <line key={i} x1="150" y1="115" x2={150+dx} y2={178+dy}
          stroke="url(#ra-metal)" strokeWidth={i<2?4:2.5} strokeLinecap="round" opacity={i<2?1:.72}/>
      ))}
      <ellipse cx="150" cy="107" rx="48" ry="42" fill="url(#ra-gem)" stroke="#c9a96e" strokeWidth="1.1"/>
      <polygon points="150,67 194,89 186,136 114,136 106,89" fill="none" stroke="#c9a96e" strokeWidth=".5" opacity=".28"/>
      <line x1="150" y1="67" x2="150" y2="136" stroke="#c9a96e" strokeWidth=".4" opacity=".18"/>
      <line x1="106" y1="89" x2="194" y2="112" stroke="#c9a96e" strokeWidth=".4" opacity=".18"/>
      <ellipse cx="135" cy="90" rx="11" ry="7" fill="#282828" opacity=".45" transform="rotate(-22,135,90)"/>
      <ellipse cx="133" cy="88" rx="4" ry="2.5" fill="#484848" opacity=".6" transform="rotate(-22,133,88)"/>
    </g>
    {[[-64,2],[64,2],[-52,20],[52,20]].map(([dx,dy],i)=>(
      <ellipse key={i} cx={150+dx} cy={210+dy} rx="5.5" ry="4"
        fill="#0d0d0d" stroke="#c9a96e" strokeWidth=".75" opacity=".72"/>
    ))}
    {[[110,75,5],[192,84,4],[150,55,4.5],[210,135,3.5]].map(([x,y,s],i)=>(
      <g key={i} opacity={.7-i*.1}>
        <line x1={x-s} y1={y} x2={x+s} y2={y} stroke="#e8d090" strokeWidth=".8"/>
        <line x1={x} y1={y-s} x2={x} y2={y+s} stroke="#e8d090" strokeWidth=".8"/>
        <circle cx={x} cy={y} r={s*.22} fill="#fff" opacity=".95"/>
      </g>
    ))}
  </svg>
);

const IluRelogio = () => (
  <svg viewBox="0 0 300 380" xmlns="http://www.w3.org/2000/svg" className={styles.produtoIlu}>
    <defs>
      <radialGradient id="rr-bg" cx="50%" cy="45%" r="70%">
        <stop offset="0%" stopColor="#0e0d0b"/><stop offset="100%" stopColor="#050505"/>
      </radialGradient>
      <radialGradient id="rr-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#c9a96e" stopOpacity=".18"/><stop offset="100%" stopColor="#c9a96e" stopOpacity="0"/>
      </radialGradient>
      <linearGradient id="rr-metal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8a6a30"/>
        <stop offset="40%" stopColor="#d4b070"/>
        <stop offset="75%" stopColor="#c9a96e"/>
        <stop offset="100%" stopColor="#6a4a1e"/>
      </linearGradient>
      <radialGradient id="rr-dial" cx="38%" cy="32%" r="72%">
        <stop offset="0%" stopColor="#1a1a18"/><stop offset="100%" stopColor="#080808"/>
      </radialGradient>
      <filter id="rr-shadow">
        <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="#000" floodOpacity=".75"/>
      </filter>
    </defs>
    <rect width="300" height="380" fill="url(#rr-bg)"/>
    <ellipse cx="150" cy="190" rx="125" ry="115" fill="url(#rr-glow)"/>
    <g filter="url(#rr-shadow)">
      <rect x="118" y="38"  width="64" height="80" rx="8" fill="none" stroke="url(#rr-metal)" strokeWidth="2.2"/>
      {[52,66,80,95,108].map((y,i)=><line key={i} x1="118" y1={y} x2="182" y2={y} stroke="#c9a96e" strokeWidth=".55" opacity=".28"/>)}
      <rect x="118" y="262" width="64" height="80" rx="8" fill="none" stroke="url(#rr-metal)" strokeWidth="2.2"/>
      {[272,286,300,314,328].map((y,i)=><line key={i} x1="118" y1={y} x2="182" y2={y} stroke="#c9a96e" strokeWidth=".55" opacity=".28"/>)}
      <rect x="226" y="176" width="20" height="28" rx="5" fill="none" stroke="url(#rr-metal)" strokeWidth="1.6" opacity=".82"/>
      <rect x="72"  y="116" width="156" height="148" rx="28" fill="url(#rr-dial)" stroke="url(#rr-metal)" strokeWidth="3.5"/>
      <rect x="77"  y="121" width="146" height="138" rx="24" fill="none" stroke="#c9a96e" strokeWidth=".7" opacity=".28"/>
      <rect x="88"  y="132" width="124" height="116" rx="20" fill="#070707"/>
      {Array.from({length:12},(_,i)=>{
        const a=(i*30-90)*Math.PI/180,r1=48,r2=i%3===0?40:45;
        return <line key={i}
          x1={150+Math.cos(a)*r1} y1={190+Math.sin(a)*r1}
          x2={150+Math.cos(a)*r2} y2={190+Math.sin(a)*r2}
          stroke="#c9a96e" strokeWidth={i%3===0?1.8:.9} opacity={i%3===0?.85:.4}/>
      })}
      <line x1="150" y1="190" x2="150" y2="155" stroke="#c9a96e" strokeWidth="2.8" strokeLinecap="round" opacity=".92"/>
      <line x1="150" y1="190" x2="178" y2="198" stroke="#c9a96e" strokeWidth="2"   strokeLinecap="round" opacity=".92"/>
      <line x1="150" y1="190" x2="143" y2="218" stroke="#c9a96e" strokeWidth=".9"  strokeLinecap="round" opacity=".5"/>
      <circle cx="150" cy="190" r="4.5" fill="#c9a96e" opacity=".92"/>
      <circle cx="150" cy="190" r="1.8" fill="#e8d090"/>
      <ellipse cx="122" cy="148" rx="16" ry="9" fill="white" opacity=".022" transform="rotate(-28,122,148)"/>
    </g>
    {[[88,128,3.5],[212,140,3],[218,244,3]].map(([x,y,s],i)=>(
      <g key={i} opacity={.58-i*.08}>
        <line x1={x-s} y1={y} x2={x+s} y2={y} stroke="#e8d090" strokeWidth=".8"/>
        <line x1={x} y1={y-s} x2={x} y2={y+s} stroke="#e8d090" strokeWidth=".8"/>
        <circle cx={x} cy={y} r={s*.22} fill="#fff" opacity=".92"/>
      </g>
    ))}
  </svg>
);

const IluBrincos = () => (
  <svg viewBox="0 0 300 260" xmlns="http://www.w3.org/2000/svg" className={styles.produtoIlu}>
    <defs>
      <radialGradient id="rb-bg" cx="50%" cy="40%" r="75%">
        <stop offset="0%" stopColor="#180f05"/><stop offset="100%" stopColor="#060504"/>
      </radialGradient>
      <radialGradient id="rb-glow" cx="50%" cy="52%" r="50%">
        <stop offset="0%" stopColor="#c9a96e" stopOpacity=".2"/><stop offset="100%" stopColor="#c9a96e" stopOpacity="0"/>
      </radialGradient>
      <radialGradient id="rb-gem" cx="30%" cy="24%" r="68%">
        <stop offset="0%" stopColor="#2a2a2a"/><stop offset="100%" stopColor="#040404"/>
      </radialGradient>
      <linearGradient id="rb-metal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#8a6a30"/>
        <stop offset="45%"  stopColor="#d4b070"/>
        <stop offset="100%" stopColor="#6a4a1e"/>
      </linearGradient>
      <filter id="rb-shadow">
        <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#000" floodOpacity=".72"/>
      </filter>
    </defs>
    <rect width="300" height="260" fill="url(#rb-bg)"/>
    <ellipse cx="150" cy="145" rx="130" ry="95" fill="url(#rb-glow)"/>

    {/* Par de brincos */}
    {[78, 222].map((cx,side) => (
      <g key={side} filter="url(#rb-shadow)">
        {/* Gancho do brinco */}
        <path d={`M ${cx} 32 Q ${cx+(side===0?18:-18)} 20 ${cx+(side===0?22:-22)} 38 Q ${cx+(side===0?20:-20)} 58 ${cx} 64`}
          fill="none" stroke="url(#rb-metal)" strokeWidth="2.8" strokeLinecap="round"/>
        {/* Haste */}
        <line x1={cx} y1="64" x2={cx} y2="85" stroke="#c9a96e" strokeWidth="1.8" strokeLinecap="round"/>
        {/* Anel de conexão */}
        <circle cx={cx} cy="67" r="5" fill="#0a0806" stroke="url(#rb-metal)" strokeWidth="1"/>
        {/* Armação da gema */}
        <circle cx={cx} cy="145" r="52" fill="none" stroke="url(#rb-metal)" strokeWidth="1.5" opacity=".5"/>
        {[0,60,120,180,240,300].map((a,i)=>(
          <circle key={i}
            cx={cx+Math.cos((a-90)*Math.PI/180)*46}
            cy={145+Math.sin((a-90)*Math.PI/180)*46}
            r="4.5" fill="#0a0806" stroke="#c9a96e" strokeWidth=".75" opacity=".68"/>
        ))}
        {/* Gema */}
        <circle cx={cx} cy="145" r="36"
          fill="url(#rb-gem)" stroke="#c9a96e" strokeWidth=".9"/>
        {[0,45,90,135].map((a,i)=>(
          <line key={i}
            x1={cx+Math.cos(a*Math.PI/180)*36} y1={145+Math.sin(a*Math.PI/180)*36}
            x2={cx+Math.cos((a+180)*Math.PI/180)*36} y2={145+Math.sin((a+180)*Math.PI/180)*36}
            stroke="#c9a96e" strokeWidth=".4" opacity=".2"/>
        ))}
        <ellipse cx={cx-9} cy={133} rx="8" ry="5" fill="#2a2a2a" opacity=".45" transform={`rotate(-22,${cx-9},133)`}/>
        <ellipse cx={cx-11} cy={131} rx="3" ry="1.8" fill="#454545" opacity=".6" transform={`rotate(-22,${cx-11},131)`}/>
        {/* Haste inferior */}
        <line x1={cx} y1="85" x2={cx} y2="109" stroke="#c9a96e" strokeWidth="1.4"/>
      </g>
    ))}

    {/* Sparkles */}
    {[[36,95,4],[264,95,3.5],[150,28,4],[36,195,3],[264,195,3.5]].map(([x,y,s],i)=>(
      <g key={i} opacity={.65-i*.08}>
        <line x1={x-s} y1={y} x2={x+s} y2={y} stroke="#e8d090" strokeWidth=".8"/>
        <line x1={x} y1={y-s} x2={x} y2={y+s} stroke="#e8d090" strokeWidth=".8"/>
        <circle cx={x} cy={y} r={s*.22} fill="#fff" opacity=".95"/>
      </g>
    ))}
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   DADOS DOS PRODUTOS
   ═══════════════════════════════════════════════════════════ */
const PRODUTOS = [
  {
    id:        'colar-noir',
    nome:      'Noir Élégance',
    colecao:   'Signature Collection',
    material:  '18k Gold · Black Diamond',
    preco:     'R$ 48.900',
    badge:     'Édition Limitée',
    descricao: 'A statement pendant forged in 18-karat gold, centered by a 4-carat black diamond of unparalleled depth.',
    destaque:  true,
    Ilu:       IluProdutoPrincipal,
  },
  {
    id:        'anel-eternity',
    nome:      'Eternity Band',
    colecao:   'Essentials',
    material:  '18k Rose Gold · Diamonds',
    preco:     'R$ 22.400',
    badge:     null,
    Ilu:       IluAnel,
  },
  {
    id:        'relogio-empire',
    nome:      'Empire Automatique',
    colecao:   'Haute Horlogerie',
    material:  '18k Gold · Sapphire Crystal',
    preco:     'R$ 86.000',
    badge:     'New Arrival',
    Ilu:       IluRelogio,
  },
  {
    id:        'brincos-lumiere',
    nome:      'Lumière Drops',
    colecao:   'Signature Collection',
    material:  'Platinum · Onyx',
    preco:     'R$ 19.200',
    badge:     null,
    Ilu:       IluBrincos,
  },
];

/* ═══════════════════════════════════════════════════════════
   CARD COMPONENTE
   ═══════════════════════════════════════════════════════════ */
const CardProduto = ({ produto, refCard }) => {
  const { nome, colecao, material, preco, badge, descricao, destaque, Ilu } = produto;
  const refIlu = useRef(null);

  /* Zoom na imagem no hover — GSAP */
  const aoEntrar = () => {
    gsap.to(refIlu.current, {
      scale:    1.06,
      duration: 0.9,
      ease:     'power2.out',
    });
  };

  const aoSair = () => {
    gsap.to(refIlu.current, {
      scale:    1,
      duration: 0.85,
      ease:     'power2.out',
    });
  };

  return (
    <article
      ref={refCard}
      className={`${styles.card} ${destaque ? styles.cardDestaque : styles.cardSecundario}`}
      onMouseEnter={aoEntrar}
      onMouseLeave={aoSair}
    >
      {/* Borda glow animada */}
      <div className={styles.cardBordaGlow} aria-hidden="true"/>

      {/* Shine efeito */}
      <div className={styles.cardShine} aria-hidden="true"/>

      {/* Imagem */}
      <div className={styles.cardImagem}>
        <div ref={refIlu} className={styles.cardIluWrapper}>
          <Ilu/>
        </div>

        {/* Overlay gradiente */}
        <div className={styles.cardOverlay} aria-hidden="true"/>
      </div>

      {/* Badge */}
      {badge && <span className={styles.cardBadge}>{badge}</span>}

      {/* Número decorativo de fundo */}
      <span className={styles.cardNumeroFundo} aria-hidden="true">
        {String(PRODUTOS.indexOf(produto) + 1).padStart(2,'0')}
      </span>

      {/* Conteúdo */}
      <div className={styles.cardConteudo}>
        {destaque && (
          <p className={styles.cardDescricao}>{descricao}</p>
        )}

        <div className={styles.cardMeta}>
          <p className={styles.cardColecao}>{colecao}</p>
          <h3 className={styles.cardNome}>{nome}</h3>
          <p className={styles.cardMaterial}>{material}</p>
        </div>

        <div className={styles.cardRodape}>
          <span className={styles.cardPreco}>{preco}</span>
          <a href={`#${produto.id}`} className={styles.cardCta} aria-label={`Ver ${nome}`}>
            <span>View</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7H12M8 3L12 7L8 11"
                stroke="currentColor" strokeWidth="1.1"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
};

/* ═══════════════════════════════════════════════════════════
   SEÇÃO PRINCIPAL
   ═══════════════════════════════════════════════════════════ */
export default function ProdutosDestaque() {
  const refSecao    = useRef(null);
  const refCabecalho = useRef(null);
  const refLinhaH   = useRef(null);
  const refGrid     = useRef(null);
  const refsCards   = useRef([]);
  const refSpotlight = useRef({ x: 50, y: 50 });

  /* ─── Spotlight acompanha o mouse ─── */
  const aoMoverMouse = useCallback((e) => {
    const rect = refSecao.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    refSpotlight.current = { x, y };
    refSecao.current.style.setProperty('--spot-x', `${x}%`);
    refSecao.current.style.setProperty('--spot-y', `${y}%`);
  }, []);

  /* ─── GSAP Animations ─── */
  useGSAP(() => {
    /* Cabeçalho fade-up */
    gsap.fromTo(refCabecalho.current,
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1.3, ease: 'power3.out',
        scrollTrigger: { trigger: refCabecalho.current, start: 'top 80%', once: true },
      }
    );

    /* Linha decorativa se expande */
    gsap.fromTo(refLinhaH.current,
      { scaleX: 0, transformOrigin: 'left center' },
      {
        scaleX: 1, duration: 1.5, ease: 'power2.inOut',
        scrollTrigger: { trigger: refLinhaH.current, start: 'top 85%', once: true },
      }
    );

    /* Cards — stagger suave */
    gsap.fromTo(
      refsCards.current.filter(Boolean),
      { y: 90, opacity: 0, scale: 0.96 },
      {
        y: 0, opacity: 1, scale: 1,
        duration: 1.15,
        ease:     'power3.out',
        stagger:  { amount: 0.7, from: 'start' },
        scrollTrigger: {
          trigger: refGrid.current,
          start:   'top 78%',
          once:    true,
        },
      }
    );

    /* Paralaxe suave nas imagens ao scroll */
    refsCards.current.forEach((card) => {
      if (!card) return;
      const wrapper = card.querySelector('[class*="cardIluWrapper"]');
      if (!wrapper) return;
      gsap.to(wrapper, {
        yPercent:  -7,
        ease:      'none',
        scrollTrigger: {
          trigger: card,
          start:   'top bottom',
          end:     'bottom top',
          scrub:   1.8,
        },
      });
    });

  }, { scope: refSecao });

  const produtoDestaque    = PRODUTOS.find(p => p.destaque);
  const produtosSecundarios = PRODUTOS.filter(p => !p.destaque);

  return (
    <section
      ref={refSecao}
      className={styles.secao}
      onMouseMove={aoMoverMouse}
      style={{ '--spot-x': '50%', '--spot-y': '50%' }}
    >
      {/* ─── Atmosfera ─── */}
      <div className={styles.atm1} aria-hidden="true"/>
      <div className={styles.atm2} aria-hidden="true"/>
      <div className={styles.grain} aria-hidden="true"/>
      <div className={styles.spotlight} aria-hidden="true"/>
      <div className={styles.vinheta} aria-hidden="true"/>

      {/* ─── Texto ghost de fundo ─── */}
      <p className={styles.ghostText} aria-hidden="true">CRYSTAL</p>

      {/* ─── Cabeçalho ─── */}
      <header ref={refCabecalho} className={styles.cabecalho}>
        <div className={styles.cabEsquerda}>
          <p className={styles.cabSupra}>
            <span className={styles.cabSupraLinha}/>
            Curated Selection · 2024
          </p>
          <h2 className={styles.cabTitulo}>
            Featured<br/>
            <em className={styles.cabItalico}>Pieces</em>
          </h2>
        </div>

        <div className={styles.cabDireita}>
          <p className={styles.cabDescricao}>
            Each piece selected for its rarity,<br/>
            craftsmanship, and silent power.
          </p>
          <a href="#colecao" className={styles.cabVerTudo}>
            <span>View all pieces</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1.5 6H10.5M7 2.5L10.5 6L7 9.5"
                stroke="#c9a96e" strokeWidth="1"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </header>

      {/* ─── Linha decorativa ─── */}
      <div ref={refLinhaH} className={styles.linhaH}/>

      {/* ─── Grid editorial ─── */}
      <div ref={refGrid} className={styles.grid}>

        {/* Card principal */}
        <CardProduto
          produto={produtoDestaque}
          refCard={el => refsCards.current[0] = el}
        />

        {/* Coluna de cards secundários */}
        <div className={styles.colunaSecundaria}>
          {produtosSecundarios.map((prod, i) => (
            <CardProduto
              key={prod.id}
              produto={prod}
              refCard={el => refsCards.current[i + 1] = el}
            />
          ))}
        </div>
      </div>

      {/* ─── Rodapé da seção ─── */}
      <footer className={styles.rodape}>
        <span className={styles.rodapeTexto}>Handcrafted in Europe</span>
        <div className={styles.rodapeDot}/>
        <span className={styles.rodapeTexto}>Free worldwide shipping</span>
        <div className={styles.rodapeDot}/>
        <span className={styles.rodapeTexto}>Lifetime warranty</span>
      </footer>

    </section>
  );
}
