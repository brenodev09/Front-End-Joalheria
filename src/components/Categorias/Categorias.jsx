/**
 * CRYSTAL — Seção de Categorias · Fan Carousel
 * React + CSS Modules + GSAP useGSAP + ScrollTrigger
 *
 * npm install gsap @gsap/react
 *
 * Fonts (index.html):
 * <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Bebas+Neue&family=Montserrat:wght@200;300;400&display=swap" rel="stylesheet">
 */

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Categorias.module.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ═══════════════════════════════════════════════════════════
   CONFIGURAÇÃO DO FAN
   5 slots: -2  -1   0  +1  +2
   ═══════════════════════════════════════════════════════════ */
const FAN = [
  { x: -410, y: 80,  rot: -20, scale: 0.58, opacity: 0.35, z: 1  },
  { x: -220, y: 36,  rot: -10, scale: 0.78, opacity: 0.68, z: 3  },
  { x:    0, y: -20, rot:   0, scale: 1.00, opacity: 1.00, z: 10 },
  { x:  220, y: 36,  rot:  10, scale: 0.78, opacity: 0.68, z: 3  },
  { x:  410, y: 80,  rot:  20, scale: 0.58, opacity: 0.35, z: 1  },
];

/* ═══════════════════════════════════════════════════════════
   ILUSTRAÇÕES SVG
   ═══════════════════════════════════════════════════════════ */
const IluAnel = () => (
  <svg viewBox="0 0 260 400" xmlns="http://www.w3.org/2000/svg" className={styles.ilu}>
    <defs>
      <radialGradient id="ia-bg" cx="50%" cy="38%" r="75%">
        <stop offset="0%" stopColor="#1e1508"/>
        <stop offset="100%" stopColor="#060504"/>
      </radialGradient>
      <radialGradient id="ia-glow" cx="50%" cy="55%" r="50%">
        <stop offset="0%" stopColor="#c9a96e" stopOpacity=".22"/>
        <stop offset="100%" stopColor="#c9a96e" stopOpacity="0"/>
      </radialGradient>
      <radialGradient id="ia-gem" cx="32%" cy="28%" r="68%">
        <stop offset="0%" stopColor="#2e2e2e"/>
        <stop offset="55%" stopColor="#0c0c0c"/>
        <stop offset="100%" stopColor="#030303"/>
      </radialGradient>
      <linearGradient id="ia-metal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#8a6a30"/>
        <stop offset="40%"  stopColor="#d4b070"/>
        <stop offset="75%"  stopColor="#c9a96e"/>
        <stop offset="100%" stopColor="#6a4a1e"/>
      </linearGradient>
      <filter id="ia-drop">
        <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="#000" floodOpacity=".72"/>
      </filter>
    </defs>
    <rect width="260" height="400" fill="url(#ia-bg)"/>
    <ellipse cx="130" cy="230" rx="110" ry="90" fill="url(#ia-glow)"/>
    <g filter="url(#ia-drop)">
      <ellipse cx="130" cy="272" rx="90" ry="30" fill="none" stroke="url(#ia-metal)" strokeWidth="20" opacity=".93"/>
      <ellipse cx="130" cy="272" rx="90" ry="30" fill="none" stroke="url(#ia-metal)" strokeWidth=".8" strokeDasharray="3 5" opacity=".3"/>
      {[[-16,8],[16,8],[-24,18],[24,18]].map(([dx,dy],i)=>(
        <line key={i} x1="130" y1="178" x2={130+dx} y2={242+dy}
          stroke="url(#ia-metal)" strokeWidth={i<2?3.5:2} strokeLinecap="round" opacity={i<2?1:.7}/>
      ))}
      <ellipse cx="130" cy="170" rx="42" ry="36" fill="url(#ia-gem)" stroke="#c9a96e" strokeWidth="1"/>
      <polygon points="130,136 170,156 162,196 98,196 90,156" fill="none" stroke="#c9a96e" strokeWidth=".5" opacity=".3"/>
      <line x1="130" y1="136" x2="130" y2="196" stroke="#c9a96e" strokeWidth=".4" opacity=".2"/>
      <line x1="90"  y1="156" x2="170" y2="176" stroke="#c9a96e" strokeWidth=".4" opacity=".2"/>
      <ellipse cx="116" cy="153" rx="9" ry="5.5" fill="#2a2a2a" opacity=".45" transform="rotate(-22,116,153)"/>
      <ellipse cx="114" cy="151" rx="3.5" ry="2"  fill="#4a4a4a" opacity=".6"  transform="rotate(-22,114,151)"/>
    </g>
    {[[-58,0],[58,0],[-45,16],[45,16]].map(([dx,dy],i)=>(
      <ellipse key={i} cx={130+dx} cy={272+dy} rx="5" ry="3.8"
        fill="#0d0d0d" stroke="#c9a96e" strokeWidth=".7" opacity=".72"/>
    ))}
    {[[98,120,4.5],[164,130,3.5],[138,96,4],[188,165,3]].map(([x,y,s],i)=>(
      <g key={i} opacity={.7-i*.1}>
        <line x1={x-s} y1={y} x2={x+s} y2={y} stroke="#e8d090" strokeWidth=".75"/>
        <line x1={x} y1={y-s} x2={x} y2={y+s} stroke="#e8d090" strokeWidth=".75"/>
        <circle cx={x} cy={y} r={s*.22} fill="#fff" opacity=".95"/>
      </g>
    ))}
  </svg>
);

const IluColar = () => (
  <svg viewBox="0 0 260 400" xmlns="http://www.w3.org/2000/svg" className={styles.ilu}>
    <defs>
      <radialGradient id="ic-bg" cx="50%" cy="35%" r="75%">
        <stop offset="0%" stopColor="#160f04"/><stop offset="100%" stopColor="#050505"/>
      </radialGradient>
      <radialGradient id="ic-glow" cx="50%" cy="60%" r="48%">
        <stop offset="0%" stopColor="#c9a96e" stopOpacity=".2"/><stop offset="100%" stopColor="#c9a96e" stopOpacity="0"/>
      </radialGradient>
      <radialGradient id="ic-gem" cx="30%" cy="24%" r="66%">
        <stop offset="0%" stopColor="#282828"/><stop offset="100%" stopColor="#050505"/>
      </radialGradient>
      <linearGradient id="ic-metal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7a5c28" stopOpacity=".6"/>
        <stop offset="50%" stopColor="#c9a96e"/>
        <stop offset="100%" stopColor="#7a5c28" stopOpacity=".5"/>
      </linearGradient>
      <filter id="ic-drop">
        <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="#000" floodOpacity=".75"/>
      </filter>
    </defs>
    <rect width="260" height="400" fill="url(#ic-bg)"/>
    <ellipse cx="130" cy="250" rx="105" ry="88" fill="url(#ic-glow)"/>
    <g filter="url(#ic-drop)">
      <path d="M 42 70 Q 130 22 218 70 Q 198 158 130 192 Q 62 158 42 70"
        fill="none" stroke="url(#ic-metal)" strokeWidth="1.8"/>
      {Array.from({length:20},(_,i)=>{
        const t=i/19, angle=(t-.5)*Math.PI*.72, r=95;
        const cx=130+Math.sin(angle)*r, cy=70-Math.cos(angle)*r+r;
        return <ellipse key={i} cx={cx} cy={cy} rx="3" ry="2"
          fill="none" stroke="#c9a96e" strokeWidth=".7" opacity=".58"
          transform={`rotate(${angle*180/Math.PI},${cx},${cy})`}/>
      })}
      <line x1="130" y1="192" x2="130" y2="214" stroke="#c9a96e" strokeWidth="2"/>
      <circle cx="130" cy="270" r="52" fill="none" stroke="#c9a96e" strokeWidth="1.2" opacity=".48"/>
      <circle cx="130" cy="270" r="47" fill="none" stroke="#c9a96e" strokeWidth=".4" opacity=".2"/>
      {[0,45,90,135,180,225,270,315].map((a,i)=>(
        <circle key={i} cx={130+Math.cos((a-90)*Math.PI/180)*41} cy={270+Math.sin((a-90)*Math.PI/180)*41}
          r="4" fill="#090909" stroke="#c9a96e" strokeWidth=".7" opacity=".65"/>
      ))}
      <ellipse cx="130" cy="270" rx="30" ry="34" fill="url(#ic-gem)" stroke="#c9a96e" strokeWidth=".9"/>
      <polygon points="130,238 158,253 158,287 130,302 102,287 102,253"
        fill="none" stroke="#c9a96e" strokeWidth=".4" opacity=".22"/>
      <ellipse cx="119" cy="250" rx="7" ry="4" fill="#1e1e1e" opacity=".5" transform="rotate(-22,119,250)"/>
      <ellipse cx="117" cy="248" rx="2.5" ry="1.5" fill="#3a3a3a" opacity=".6" transform="rotate(-22,117,248)"/>
    </g>
    {[[105,228,4],[158,240,3.5],[132,205,4]].map(([x,y,s],i)=>(
      <g key={i} opacity={.65-i*.1}>
        <line x1={x-s} y1={y} x2={x+s} y2={y} stroke="#e8d090" strokeWidth=".75"/>
        <line x1={x} y1={y-s} x2={x} y2={y+s} stroke="#e8d090" strokeWidth=".75"/>
        <circle cx={x} cy={y} r={s*.2} fill="#fff" opacity=".95"/>
      </g>
    ))}
  </svg>
);

const IluRelogio = () => (
  <svg viewBox="0 0 260 400" xmlns="http://www.w3.org/2000/svg" className={styles.ilu}>
    <defs>
      <radialGradient id="ir-bg" cx="50%" cy="45%" r="70%">
        <stop offset="0%" stopColor="#0e0d0b"/><stop offset="100%" stopColor="#050505"/>
      </radialGradient>
      <radialGradient id="ir-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#c9a96e" stopOpacity=".16"/><stop offset="100%" stopColor="#c9a96e" stopOpacity="0"/>
      </radialGradient>
      <linearGradient id="ir-metal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#8a6a30"/>
        <stop offset="42%"  stopColor="#d4b070"/>
        <stop offset="72%"  stopColor="#c9a96e"/>
        <stop offset="100%" stopColor="#6a4a1e"/>
      </linearGradient>
      <radialGradient id="ir-dial" cx="38%" cy="32%" r="72%">
        <stop offset="0%" stopColor="#1a1a18"/><stop offset="100%" stopColor="#080808"/>
      </radialGradient>
      <filter id="ir-drop">
        <feDropShadow dx="0" dy="12" stdDeviation="18" floodColor="#000" floodOpacity=".72"/>
      </filter>
    </defs>
    <rect width="260" height="400" fill="url(#ir-bg)"/>
    <ellipse cx="130" cy="200" rx="110" ry="100" fill="url(#ir-glow)"/>
    <g filter="url(#ir-drop)">
      <rect x="108" y="42"  width="44" height="76" rx="6" fill="none" stroke="url(#ir-metal)" strokeWidth="2"/>
      {[57,70,83,96,109].map((y,i)=><line key={i} x1="108" y1={y} x2="152" y2={y} stroke="#c9a96e" strokeWidth=".5" opacity=".28"/>)}
      <rect x="108" y="282" width="44" height="76" rx="6" fill="none" stroke="url(#ir-metal)" strokeWidth="2"/>
      {[295,308,321,334,347].map((y,i)=><line key={i} x1="108" y1={y} x2="152" y2={y} stroke="#c9a96e" strokeWidth=".5" opacity=".28"/>)}
      <rect x="196" y="186" width="16" height="22" rx="4" fill="none" stroke="url(#ir-metal)" strokeWidth="1.4" opacity=".8"/>
      <rect x="68"  y="118" width="124" height="164" rx="24" fill="url(#ir-dial)" stroke="url(#ir-metal)" strokeWidth="3"/>
      <rect x="72"  y="122" width="116" height="156" rx="21" fill="none" stroke="#c9a96e" strokeWidth=".6" opacity=".28"/>
      <rect x="80"  y="130" width="100" height="140" rx="18" fill="#070707"/>
      {Array.from({length:12},(_,i)=>{
        const a=(i*30-90)*Math.PI/180, r1=42, r2=i%3===0?36:40;
        return <line key={i}
          x1={130+Math.cos(a)*r1} y1={200+Math.sin(a)*r1}
          x2={130+Math.cos(a)*r2} y2={200+Math.sin(a)*r2}
          stroke="#c9a96e" strokeWidth={i%3===0?1.5:.75} opacity={i%3===0?.8:.38}/>
      })}
      <line x1="130" y1="200" x2="130" y2="168" stroke="#c9a96e" strokeWidth="2.5" strokeLinecap="round" opacity=".9"/>
      <line x1="130" y1="200" x2="154" y2="207" stroke="#c9a96e" strokeWidth="1.8" strokeLinecap="round" opacity=".9"/>
      <line x1="130" y1="200" x2="124" y2="225" stroke="#c9a96e" strokeWidth=".8"  strokeLinecap="round" opacity=".5"/>
      <circle cx="130" cy="200" r="3.5" fill="#c9a96e" opacity=".9"/>
      <circle cx="130" cy="200" r="1.4" fill="#e8d090"/>
    </g>
    {[[84,134,3],[196,148,2.5],[200,250,2.5]].map(([x,y,s],i)=>(
      <g key={i} opacity={.55-i*.08}>
        <line x1={x-s} y1={y} x2={x+s} y2={y} stroke="#e8d090" strokeWidth=".75"/>
        <line x1={x} y1={y-s} x2={x} y2={y+s} stroke="#e8d090" strokeWidth=".75"/>
        <circle cx={x} cy={y} r={s*.2} fill="#fff" opacity=".92"/>
      </g>
    ))}
  </svg>
);

const IluPulseira = () => (
  <svg viewBox="0 0 260 400" xmlns="http://www.w3.org/2000/svg" className={styles.ilu}>
    <defs>
      <radialGradient id="ip-bg" cx="50%" cy="45%" r="70%">
        <stop offset="0%" stopColor="#130d04"/><stop offset="100%" stopColor="#060606"/>
      </radialGradient>
      <radialGradient id="ip-glow" cx="50%" cy="52%" r="50%">
        <stop offset="0%" stopColor="#c9a96e" stopOpacity=".22"/><stop offset="100%" stopColor="#c9a96e" stopOpacity="0"/>
      </radialGradient>
      <linearGradient id="ip-metal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#8a6a30"/>
        <stop offset="45%"  stopColor="#d4b070"/>
        <stop offset="80%"  stopColor="#c9a96e"/>
        <stop offset="100%" stopColor="#6a4a1e"/>
      </linearGradient>
      <filter id="ip-drop">
        <feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="#000" floodOpacity=".7"/>
      </filter>
    </defs>
    <rect width="260" height="400" fill="url(#ip-bg)"/>
    <ellipse cx="130" cy="210" rx="110" ry="95" fill="url(#ip-glow)"/>
    <g filter="url(#ip-drop)">
      <ellipse cx="130" cy="215" rx="100" ry="58" fill="none" stroke="url(#ip-metal)" strokeWidth="16" opacity=".92"/>
      <ellipse cx="130" cy="215" rx="100" ry="58" fill="none" stroke="url(#ip-metal)" strokeWidth=".75" strokeDasharray="3 5" opacity=".3"/>
      {Array.from({length:15},(_,i)=>{
        const a=(i/15)*2*Math.PI-Math.PI/2;
        const rx=100, ry=58;
        const x=130+Math.cos(a)*rx, y=215+Math.sin(a)*ry;
        const ang=(Math.atan2(ry*Math.cos(a),-rx*Math.sin(a))*180/Math.PI);
        return <ellipse key={i} cx={x} cy={y} rx="5.5" ry="4"
          fill={i%3===0?"#1a1209":"#0d0d0d"}
          stroke="#c9a96e" strokeWidth={i%3===0?.9:.6}
          transform={`rotate(${ang},${x},${y})`}
          opacity={i%3===0?.9:.62}/>
      })}
      <rect x="118" y="152" width="24" height="14" rx="3" fill="#0a0a0a" stroke="url(#ip-metal)" strokeWidth="1.2"/>
      <line x1="123" y1="157" x2="137" y2="157" stroke="#c9a96e" strokeWidth=".6" opacity=".4"/>
      <line x1="123" y1="161" x2="137" y2="161" stroke="#c9a96e" strokeWidth=".6" opacity=".4"/>
      <circle cx="130" cy="159" r="3" fill="none" stroke="#c9a96e" strokeWidth=".8" opacity=".72"/>
    </g>
    {[[42,192,4.5],[218,200,4],[130,268,3.5],[176,158,3]].map(([x,y,s],i)=>(
      <g key={i} opacity={.65-i*.1}>
        <line x1={x-s} y1={y} x2={x+s} y2={y} stroke="#e8d090" strokeWidth=".78"/>
        <line x1={x} y1={y-s} x2={x} y2={y+s} stroke="#e8d090" strokeWidth=".78"/>
        <circle cx={x} cy={y} r={s*.22} fill="#fff" opacity=".95"/>
      </g>
    ))}
  </svg>
);

const IluDiamante = () => (
  <svg viewBox="0 0 260 400" xmlns="http://www.w3.org/2000/svg" className={styles.ilu}>
    <defs>
      <radialGradient id="id-bg" cx="50%" cy="42%" r="70%">
        <stop offset="0%" stopColor="#0e0d0b"/><stop offset="100%" stopColor="#040404"/>
      </radialGradient>
      <radialGradient id="id-glow" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stopColor="#c9a96e" stopOpacity=".28"/><stop offset="100%" stopColor="#c9a96e" stopOpacity="0"/>
      </radialGradient>
      <radialGradient id="id-gem" cx="30%" cy="20%" r="75%">
        <stop offset="0%" stopColor="#303030"/>
        <stop offset="40%" stopColor="#141414"/>
        <stop offset="100%" stopColor="#040404"/>
      </radialGradient>
      <filter id="id-drop">
        <feDropShadow dx="0" dy="16" stdDeviation="20" floodColor="#000" floodOpacity=".75"/>
      </filter>
    </defs>
    <rect width="260" height="400" fill="url(#id-bg)"/>
    <ellipse cx="130" cy="205" rx="125" ry="115" fill="url(#id-glow)"/>
    <g filter="url(#id-drop)" transform="translate(0,10)">
      <polygon points="130,72 202,138 174,138 130,106 86,138 58,138"
        fill="url(#id-gem)" stroke="#c9a96e" strokeWidth=".8" opacity=".95"/>
      <polygon points="58,138 86,138 130,106 174,138 202,138 216,154 130,154 44,154"
        fill="#080808" stroke="#c9a96e" strokeWidth=".7" opacity=".7"/>
      <polygon points="44,154 216,154 174,256 86,256"
        fill="url(#id-gem)" stroke="#c9a96e" strokeWidth=".8" opacity=".9"/>
      <polygon points="86,256 174,256 130,292"
        fill="#1a1a1a" stroke="#c9a96e" strokeWidth=".6" opacity=".8"/>
      <line x1="130" y1="72"  x2="130" y2="138" stroke="#c9a96e" strokeWidth=".5" opacity=".22"/>
      <line x1="58"  y1="138" x2="202" y2="138" stroke="#c9a96e" strokeWidth=".5" opacity=".22"/>
      <line x1="86"  y1="138" x2="130" y2="72"  stroke="#c9a96e" strokeWidth=".4" opacity=".18"/>
      <line x1="174" y1="138" x2="130" y2="72"  stroke="#c9a96e" strokeWidth=".4" opacity=".18"/>
      <line x1="44"  y1="154" x2="130" y2="292" stroke="#c9a96e" strokeWidth=".5" opacity=".18"/>
      <line x1="216" y1="154" x2="130" y2="292" stroke="#c9a96e" strokeWidth=".5" opacity=".18"/>
      <line x1="44"  y1="154" x2="174" y2="256" stroke="#c9a96e" strokeWidth=".4" opacity=".14"/>
      <line x1="216" y1="154" x2="86"  y2="256" stroke="#c9a96e" strokeWidth=".4" opacity=".14"/>
      <polygon points="102,78 130,72 116,110" fill="#3a3a3a" opacity=".25"/>
    </g>
    {[[52,128,5],[212,132,4.5],[130,58,5.5],[52,178,3.5],[214,178,3.5],[130,308,4]].map(([x,y,s],i)=>(
      <g key={i} opacity={.72-i*.08}>
        <line x1={x-s} y1={y} x2={x+s} y2={y} stroke="#e8d090" strokeWidth=".8"/>
        <line x1={x} y1={y-s} x2={x} y2={y+s} stroke="#e8d090" strokeWidth=".8"/>
        <line x1={x-s*.7} y1={y-s*.7} x2={x+s*.7} y2={y+s*.7} stroke="#e8d090" strokeWidth=".5"/>
        <line x1={x+s*.7} y1={y-s*.7} x2={x-s*.7} y2={y+s*.7} stroke="#e8d090" strokeWidth=".5"/>
        <circle cx={x} cy={y} r={s*.22} fill="#fff" opacity=".95"/>
      </g>
    ))}
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   DADOS
   ═══════════════════════════════════════════════════════════ */
const CATEGORIAS = [
  { id:'aneis',     titulo:'The Ring',      sub:'Solitaires & Bands',   badge:'New',   Ilu: IluAnel      },
  { id:'colares',   titulo:'The Necklace',  sub:'Pendants & Chains',    badge:null,    Ilu: IluColar     },
  { id:'relogios',  titulo:'The Watch',     sub:'Haute Horlogerie',     badge:'Icon',  Ilu: IluRelogio   },
  { id:'pulseiras', titulo:'The Bracelet',  sub:'Cuffs & Tennis',       badge:null,    Ilu: IluPulseira  },
  { id:'diamantes', titulo:'The Diamond',   sub:'Loose Stones',         badge:'Rare',  Ilu: IluDiamante  },
];

/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ═══════════════════════════════════════════════════════════ */
export default function Categorias() {
  const [ativo,    setAtivo]    = useState(2);
  const [animando, setAnimando] = useState(false);

  const refSecao     = useRef(null);
  const refCabecalho = useRef(null);
  const refFan       = useRef(null);
  const refNav       = useRef(null);
  const refsCards    = useRef([]);
  const refsDots     = useRef([]);

  const total = CATEGORIAS.length;

  /* ─── Aplica posições do fan ─── */
  const aplicarFan = useCallback((indiceAtivo, animate = true) => {
    refsCards.current.forEach((card, i) => {
      if (!card) return;
      let offset = i - indiceAtivo;
      if (offset >  2) offset -= total;
      if (offset < -2) offset += total;
      const slot    = FAN[offset + 2];
      const visivel = Math.abs(offset) <= 2;
      gsap.to(card, {
        x:         visivel ? slot.x       : (offset > 0 ? 700 : -700),
        y:         visivel ? slot.y       : 100,
        rotation:  visivel ? slot.rot     : (offset > 0 ? 28 : -28),
        scale:     visivel ? slot.scale   : 0.38,
        opacity:   visivel ? slot.opacity : 0,
        zIndex:    visivel ? slot.z       : 0,
        duration:  animate ? 0.75 : 0,
        ease:      'power3.inOut',
        overwrite: 'auto',
      });
    });
  }, [total]);

  /* ─── Navegação ─── */
  const irPara = useCallback((novoIdx) => {
    if (animando) return;
    setAnimando(true);
    const idx = ((novoIdx % total) + total) % total;
    aplicarFan(idx, true);
    setAtivo(idx);
    setTimeout(() => setAnimando(false), 800);
  }, [animando, aplicarFan, total]);

  /* ─── Posição inicial ─── */
  useEffect(() => { aplicarFan(ativo, false); }, []); // eslint-disable-line

  /* ─── Dots de progresso ─── */
  useEffect(() => {
    refsDots.current.forEach((dot, i) => {
      if (!dot) return;
      gsap.to(dot, {
        scaleX:  i === ativo ? 2.8 : 1,
        opacity: i === ativo ? 1   : 0.32,
        duration: 0.42,
        ease:    'power2.out',
      });
    });
  }, [ativo]);

  /* ─── Entrada com ScrollTrigger ─── */
  useGSAP(() => {
    gsap.fromTo(refCabecalho.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: refCabecalho.current, start: 'top 80%', once: true } }
    );
    gsap.fromTo(refsCards.current,
      { y: 130, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.3, ease: 'power3.out', stagger: .08,
        scrollTrigger: { trigger: refFan.current, start: 'top 82%', once: true },
        onComplete: () => aplicarFan(ativo, false),
      }
    );
    gsap.fromTo(refNav.current,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: .9, ease: 'power2.out', delay: .5,
        scrollTrigger: { trigger: refNav.current, start: 'top 92%', once: true } }
    );
  }, { scope: refSecao });

  const catAtiva = CATEGORIAS[ativo];

  return (
    <section ref={refSecao} className={styles.secao}>

      {/* Atmosfera */}
      <div className={styles.atm1} aria-hidden="true"/>
      <div className={styles.atm2} aria-hidden="true"/>
      <div className={styles.grain} aria-hidden="true"/>

      {/* ─── Layout lado a lado ─── */}
      <div className={styles.layout}>

        {/* ── Coluna esquerda: texto ── */}
        <div ref={refCabecalho} className={styles.cabecalho}>

          <p className={styles.cabSupra}>
            <span className={styles.cabSupraLinha}/>
            Haute Joaillerie
          </p>

          <h2 className={styles.cabTitulo}>
            OUR<br/>
            <em className={styles.cabItalico}>PIECEs</em>
          </h2>

          <p className={styles.cabDescricao}>
            Rare combinations of statement<br/>
            and simplicity, crafted to be<br/>
            as unique as you are.
          </p>

          {/* Label da categoria ativa */}
          <div className={styles.labelAtiva}>
            <span className={styles.labelAtivaNum}>
              {String(ativo + 1).padStart(2,'0')} / {String(total).padStart(2,'0')}
            </span>
            <div className={styles.labelAtivaBar}/>
            <div className={styles.labelAtivaTextos}>
              <p className={styles.labelAtivaSub}>{catAtiva.sub}</p>
              <p className={styles.labelAtivaNome}>{catAtiva.titulo}</p>
            </div>
          </div>

          {/* CTA */}
          <a href={`#${catAtiva.id}`} className={styles.cabCta}>
            <span>Explore Collection</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7H12M8 3L12 7L8 11" stroke="#c9a96e" strokeWidth="1.1"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        {/* ── Coluna direita: fan ── */}
        <div ref={refFan} className={styles.fanArea} aria-label="Categorias de joias">
          {CATEGORIAS.map((cat, i) => {
            const { Ilu, titulo, sub, badge } = cat;
            const ehAtivo = i === ativo;
            return (
              <article
                key={cat.id}
                ref={el => refsCards.current[i] = el}
                className={`${styles.card} ${ehAtivo ? styles.cardAtivo : ''}`}
                onClick={() => i !== ativo && irPara(i)}
                role="button"
                tabIndex={0}
                aria-label={`Ver ${titulo}`}
                onKeyDown={e => e.key === 'Enter' && i !== ativo && irPara(i)}
              >
                {/* Ilustração */}
                <div className={styles.cardIlu}>
                  <Ilu/>
                  <div className={styles.cardShine} aria-hidden="true"/>
                </div>

                {/* Badge */}
                {badge && <span className={styles.cardBadge}>{badge}</span>}

                {/* Overlay */}
                <div className={styles.cardOverlay} aria-hidden="true"/>

                {/* Borda glow ativo */}
                {ehAtivo && <div className={styles.cardGlowBorda} aria-hidden="true"/>}

                {/* Texto inferior */}
                <div className={styles.cardTexto}>
                  <p className={styles.cardSub}>{sub}</p>
                  <h3 className={styles.cardTitulo}>{titulo}</h3>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* ─── Navegação ─── */}
      <div ref={refNav} className={styles.nav}>
        <button className={styles.navBtn} onClick={() => irPara(ativo - 1)}
          aria-label="Anterior" disabled={animando}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.1"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className={styles.navDots}>
          {CATEGORIAS.map((_, i) => (
            <button key={i}
              ref={el => refsDots.current[i] = el}
              className={styles.navDot}
              onClick={() => irPara(i)}
              aria-label={`Ir para ${CATEGORIAS[i].titulo}`}
            />
          ))}
        </div>

        <button className={styles.navBtn} onClick={() => irPara(ativo + 1)}
          aria-label="Próxima" disabled={animando}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.1"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

    </section>
  );
}
