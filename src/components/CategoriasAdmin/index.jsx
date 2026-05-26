import { useState, useEffect, useRef } from "react";

const CATEGORIES = [
  {
    id: 1,
    name: "Anéis de Diamante",
    slug: "aneis-diamante",
    products: 48,
    description: "Coleção exclusiva de anéis com diamantes lapidados à mão por mestres ourives.",
    status: "active",
    featured: true,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
  },
  {
    id: 2,
    name: "Colares & Correntes",
    slug: "colares-correntes",
    products: 35,
    description: "Elegância em ouro 18k e platina, com pedras preciosas de origem certificada.",
    status: "active",
    featured: true,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80",
  },
  {
    id: 3,
    name: "Brincos de Luxo",
    slug: "brincos-luxo",
    products: 62,
    description: "Peças únicas que combinam design contemporâneo com gemas raras selecionadas.",
    status: "active",
    featured: false,
    image: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=600&q=80",
  },
  {
    id: 4,
    name: "Pulseiras & Braceletes",
    slug: "pulseiras-braceletes",
    products: 27,
    description: "Braceletes artesanais com incrustações de safiras, rubis e esmeraldas.",
    status: "active",
    featured: false,
    image: "https://images.unsplash.com/photo-1573408301185-9519f94f0e8f?w=600&q=80",
  },
  {
    id: 5,
    name: "Alta Joalheria",
    slug: "alta-joalheria",
    products: 14,
    description: "Peças de haute joaillerie criadas em edições limitadíssimas para colecionadores.",
    status: "active",
    featured: true,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
  },
  {
    id: 6,
    name: "Relógios Premium",
    slug: "relogios-premium",
    products: 0,
    description: "Categoria em desenvolvimento para nossa futura linha de relógios de luxo.",
    status: "inactive",
    featured: false,
    image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=600&q=80",
  },
];

const GSAP_CDN = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";

function loadGSAP() {
  return new Promise((resolve) => {
    if (window.gsap) return resolve(window.gsap);
    const s = document.createElement("script");
    s.src = GSAP_CDN;
    s.onload = () => resolve(window.gsap);
    document.head.appendChild(s);
  });
}

const goldPalette = {
  gold: "#C9A84C",
  goldLight: "#E8C96B",
  goldDim: "#8B6914",
  bg: "#0A0A0B",
  surface: "#111114",
  surfaceHover: "#18181C",
  border: "#1E1E24",
  borderGold: "#2A2416",
  text: "#F2EEE6",
  textMuted: "#8A8480",
  textDim: "#4A4640",
  success: "#2A6B3C",
  successText: "#5DD88A",
  danger: "#6B2A2A",
  dangerText: "#E06060",
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.jlx-root {
  font-family: 'Inter', sans-serif;
  background: ${goldPalette.bg};
  color: ${goldPalette.text};
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.jlx-root::before {
  content: '';
  position: fixed;
  top: -30%;
  right: -20%;
  width: 60vw;
  height: 60vw;
  background: radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.jlx-root::after {
  content: '';
  position: fixed;
  bottom: -20%;
  left: -10%;
  width: 40vw;
  height: 40vw;
  background: radial-gradient(circle, rgba(201,168,76,0.025) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.jlx-content { position: relative; z-index: 1; }

/* TOPBAR */
.jlx-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 40px;
  border-bottom: 1px solid ${goldPalette.border};
  background: rgba(10,10,11,0.85);
  backdrop-filter: blur(20px);
  position: sticky;
  top: 0;
  z-index: 100;
}

.jlx-logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  font-weight: 500;
  letter-spacing: 0.12em;
  color: ${goldPalette.goldLight};
  text-transform: uppercase;
}

.jlx-logo span {
  color: ${goldPalette.textMuted};
  font-weight: 300;
  font-size: 11px;
  letter-spacing: 0.3em;
  display: block;
  text-transform: uppercase;
  margin-top: 1px;
}

.jlx-nav {
  display: flex;
  gap: 32px;
  align-items: center;
}

.jlx-nav a {
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${goldPalette.textMuted};
  text-decoration: none;
  transition: color 0.2s;
  cursor: pointer;
}

.jlx-nav a.active, .jlx-nav a:hover { color: ${goldPalette.goldLight}; }

.jlx-nav-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${goldPalette.goldDim}, ${goldPalette.gold});
  border: 1px solid ${goldPalette.gold};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: ${goldPalette.bg};
  cursor: pointer;
  letter-spacing: 0.05em;
}

/* HERO */
.jlx-hero {
  padding: 64px 40px 48px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}

.jlx-hero-eyebrow {
  font-size: 10px;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: ${goldPalette.gold};
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.jlx-hero-eyebrow::before {
  content: '';
  display: inline-block;
  width: 24px;
  height: 1px;
  background: ${goldPalette.gold};
}

.jlx-hero h1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 52px;
  font-weight: 300;
  line-height: 1.05;
  letter-spacing: -0.01em;
  color: ${goldPalette.text};
  margin-bottom: 12px;
}

.jlx-hero h1 em {
  font-style: italic;
  color: ${goldPalette.goldLight};
}

.jlx-hero-sub {
  font-size: 14px;
  color: ${goldPalette.textMuted};
  font-weight: 300;
  letter-spacing: 0.02em;
  max-width: 380px;
  line-height: 1.7;
}

.jlx-btn-primary {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: linear-gradient(135deg, ${goldPalette.gold}, ${goldPalette.goldDim});
  border: none;
  border-radius: 2px;
  color: ${goldPalette.bg};
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.jlx-btn-primary::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, ${goldPalette.goldLight}, ${goldPalette.gold});
  opacity: 0;
  transition: opacity 0.3s;
}

.jlx-btn-primary:hover::before { opacity: 1; }

.jlx-btn-primary > * { position: relative; z-index: 1; }

/* KPIs */
.jlx-kpis {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  margin: 0 40px;
  background: ${goldPalette.border};
  border: 1px solid ${goldPalette.border};
  border-radius: 4px;
  overflow: hidden;
}

.jlx-kpi {
  background: ${goldPalette.surface};
  padding: 28px 32px;
  position: relative;
  overflow: hidden;
  transition: background 0.3s;
}

.jlx-kpi:hover { background: ${goldPalette.surfaceHover}; }

.jlx-kpi::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, ${goldPalette.gold}, transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.jlx-kpi:hover::before { opacity: 1; }

.jlx-kpi-label {
  font-size: 10px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: ${goldPalette.textMuted};
  margin-bottom: 10px;
}

.jlx-kpi-value {
  font-family: 'Cormorant Garamond', serif;
  font-size: 48px;
  font-weight: 300;
  line-height: 1;
  color: ${goldPalette.text};
  margin-bottom: 6px;
}

.jlx-kpi-sub {
  font-size: 11px;
  color: ${goldPalette.textDim};
  letter-spacing: 0.05em;
}

.jlx-kpi-icon {
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(201,168,76,0.06);
  border: 1px solid rgba(201,168,76,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: ${goldPalette.goldDim};
}

/* TOOLBAR */
.jlx-toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 32px 40px 20px;
  flex-wrap: wrap;
}

.jlx-search {
  flex: 1;
  min-width: 240px;
  max-width: 360px;
  position: relative;
}

.jlx-search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: ${goldPalette.textDim};
  font-size: 14px;
  pointer-events: none;
}

.jlx-search input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  background: ${goldPalette.surface};
  border: 1px solid ${goldPalette.border};
  border-radius: 2px;
  color: ${goldPalette.text};
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  outline: none;
  transition: all 0.2s;
  letter-spacing: 0.02em;
}

.jlx-search input::placeholder { color: ${goldPalette.textDim}; }

.jlx-search input:focus {
  border-color: ${goldPalette.goldDim};
  background: ${goldPalette.surfaceHover};
}

.jlx-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.jlx-filter-label {
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${goldPalette.textDim};
  margin-right: 4px;
}

.jlx-chip {
  padding: 8px 18px;
  background: transparent;
  border: 1px solid ${goldPalette.border};
  border-radius: 2px;
  color: ${goldPalette.textMuted};
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
}

.jlx-chip:hover {
  border-color: ${goldPalette.goldDim};
  color: ${goldPalette.goldLight};
}

.jlx-chip.active {
  background: rgba(201,168,76,0.08);
  border-color: ${goldPalette.gold};
  color: ${goldPalette.goldLight};
}

.jlx-count {
  margin-left: auto;
  font-size: 11px;
  color: ${goldPalette.textDim};
  letter-spacing: 0.05em;
}

/* GRID */
.jlx-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1px;
  margin: 8px 40px 40px;
  background: ${goldPalette.border};
}

/* CARD */
.jlx-card {
  background: ${goldPalette.surface};
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: background 0.3s;
}

.jlx-card:hover { background: ${goldPalette.surfaceHover}; }

.jlx-card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
  z-index: 1;
}

.jlx-card:hover .jlx-card-glow { opacity: 1; }

.jlx-card-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
  filter: brightness(0.7) saturate(0.8);
  transition: all 0.5s ease;
}

.jlx-card:hover .jlx-card-img {
  filter: brightness(0.85) saturate(0.9);
  transform: scale(1.03);
}

.jlx-card-img-wrap {
  overflow: hidden;
  position: relative;
}

.jlx-card-img-wrap::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(to bottom, transparent, ${goldPalette.surface});
  transition: background 0.3s;
  z-index: 1;
}

.jlx-card:hover .jlx-card-img-wrap::after {
  background: linear-gradient(to bottom, transparent, ${goldPalette.surfaceHover});
}

.jlx-card-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  padding: 4px 12px;
  border-radius: 2px;
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-weight: 600;
}

.jlx-badge-active {
  background: rgba(42,107,60,0.8);
  color: ${goldPalette.successText};
  border: 1px solid rgba(93,216,138,0.2);
}

.jlx-badge-inactive {
  background: rgba(107,42,42,0.8);
  color: ${goldPalette.dangerText};
  border: 1px solid rgba(224,96,96,0.2);
}

.jlx-badge-featured {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  padding: 4px 10px;
  background: rgba(201,168,76,0.15);
  border: 1px solid rgba(201,168,76,0.4);
  color: ${goldPalette.goldLight};
  border-radius: 2px;
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-weight: 600;
}

.jlx-card-body {
  padding: 20px 24px 24px;
  position: relative;
  z-index: 2;
}

.jlx-card-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  font-weight: 400;
  color: ${goldPalette.text};
  letter-spacing: 0.02em;
  margin-bottom: 6px;
  transition: color 0.2s;
}

.jlx-card:hover .jlx-card-name { color: ${goldPalette.goldLight}; }

.jlx-card-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.jlx-card-products {
  font-size: 11px;
  color: ${goldPalette.gold};
  letter-spacing: 0.08em;
  font-weight: 500;
}

.jlx-card-products span {
  color: ${goldPalette.textMuted};
  font-weight: 300;
}

.jlx-card-desc {
  font-size: 13px;
  color: ${goldPalette.textMuted};
  line-height: 1.65;
  font-weight: 300;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.jlx-card-divider {
  height: 1px;
  background: linear-gradient(90deg, ${goldPalette.borderGold}, transparent);
  margin-bottom: 16px;
}

.jlx-card-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.jlx-btn-icon {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 16px;
  background: transparent;
  border: 1px solid ${goldPalette.border};
  border-radius: 2px;
  color: ${goldPalette.textMuted};
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
}

.jlx-btn-icon:hover {
  border-color: ${goldPalette.gold};
  color: ${goldPalette.goldLight};
}

.jlx-btn-icon.danger:hover {
  border-color: ${goldPalette.dangerText};
  color: ${goldPalette.dangerText};
  background: rgba(224,96,96,0.05);
}

.jlx-btn-icon svg { width: 13px; height: 13px; }

.jlx-card-top-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, ${goldPalette.gold}, transparent);
  opacity: 0;
  transition: opacity 0.4s;
}

.jlx-card:hover .jlx-card-top-line { opacity: 0.5; }

/* MODAL OVERLAY */
.jlx-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(8px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.jlx-modal {
  background: ${goldPalette.surface};
  border: 1px solid ${goldPalette.border};
  border-radius: 4px;
  width: 100%;
  max-width: 600px;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
}

.jlx-modal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, ${goldPalette.gold}, transparent);
}

.jlx-modal-header {
  padding: 28px 32px 24px;
  border-bottom: 1px solid ${goldPalette.border};
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.jlx-modal-eyebrow {
  font-size: 9px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: ${goldPalette.gold};
  margin-bottom: 8px;
}

.jlx-modal-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px;
  font-weight: 300;
  color: ${goldPalette.text};
  line-height: 1.1;
}

.jlx-modal-close {
  width: 32px;
  height: 32px;
  background: transparent;
  border: 1px solid ${goldPalette.border};
  border-radius: 2px;
  color: ${goldPalette.textMuted};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 4px;
  transition: all 0.2s;
  font-size: 16px;
  line-height: 1;
}

.jlx-modal-close:hover {
  border-color: ${goldPalette.dangerText};
  color: ${goldPalette.dangerText};
}

.jlx-modal-body {
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.jlx-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.jlx-field label {
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${goldPalette.textMuted};
}

.jlx-field input,
.jlx-field textarea,
.jlx-field select {
  background: rgba(255,255,255,0.03);
  border: 1px solid ${goldPalette.border};
  border-radius: 2px;
  padding: 12px 16px;
  color: ${goldPalette.text};
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  outline: none;
  transition: all 0.2s;
  width: 100%;
  letter-spacing: 0.02em;
}

.jlx-field input::placeholder,
.jlx-field textarea::placeholder { color: ${goldPalette.textDim}; }

.jlx-field input:focus,
.jlx-field textarea:focus,
.jlx-field select:focus {
  border-color: ${goldPalette.goldDim};
  background: rgba(201,168,76,0.03);
}

.jlx-field textarea { resize: vertical; min-height: 90px; line-height: 1.6; }

.jlx-field select {
  appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238A8480' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;
}

.jlx-field select option { background: ${goldPalette.surface}; }

.jlx-upload-area {
  border: 1px dashed ${goldPalette.border};
  border-radius: 4px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s;
  background: rgba(255,255,255,0.015);
}

.jlx-upload-area:hover {
  border-color: ${goldPalette.goldDim};
  background: rgba(201,168,76,0.03);
}

.jlx-upload-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(201,168,76,0.07);
  border: 1px solid rgba(201,168,76,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${goldPalette.goldDim};
  font-size: 18px;
}

.jlx-upload-text {
  font-size: 13px;
  color: ${goldPalette.textMuted};
  text-align: center;
  line-height: 1.5;
}

.jlx-upload-text strong {
  color: ${goldPalette.gold};
  font-weight: 500;
}

.jlx-upload-hint {
  font-size: 11px;
  color: ${goldPalette.textDim};
  text-align: center;
}

.jlx-toggle-group {
  display: flex;
  gap: 8px;
}

.jlx-toggle-btn {
  flex: 1;
  padding: 11px;
  background: transparent;
  border: 1px solid ${goldPalette.border};
  border-radius: 2px;
  color: ${goldPalette.textMuted};
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
}

.jlx-toggle-btn.sel-active {
  background: rgba(42,107,60,0.15);
  border-color: rgba(93,216,138,0.3);
  color: ${goldPalette.successText};
}

.jlx-toggle-btn.sel-inactive {
  background: rgba(107,42,42,0.15);
  border-color: rgba(224,96,96,0.3);
  color: ${goldPalette.dangerText};
}

.jlx-modal-footer {
  padding: 20px 32px 28px;
  border-top: 1px solid ${goldPalette.border};
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.jlx-btn-ghost {
  padding: 11px 24px;
  background: transparent;
  border: 1px solid ${goldPalette.border};
  border-radius: 2px;
  color: ${goldPalette.textMuted};
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
}

.jlx-btn-ghost:hover {
  border-color: ${goldPalette.textMuted};
  color: ${goldPalette.text};
}

/* EMPTY STATE */
.jlx-empty {
  grid-column: 1/-1;
  padding: 80px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: ${goldPalette.textDim};
}

.jlx-empty-icon {
  font-size: 48px;
  color: rgba(201,168,76,0.15);
  margin-bottom: 8px;
}

.jlx-empty-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  font-weight: 300;
  color: ${goldPalette.textMuted};
}

.jlx-empty-sub {
  font-size: 13px;
  color: ${goldPalette.textDim};
  letter-spacing: 0.05em;
}

@media (max-width: 768px) {
  .jlx-topbar { padding: 14px 20px; }
  .jlx-nav { display: none; }
  .jlx-hero { padding: 40px 20px 32px; flex-direction: column; align-items: flex-start; }
  .jlx-hero h1 { font-size: 38px; }
  .jlx-kpis { margin: 0 20px; grid-template-columns: 1fr; }
  .jlx-toolbar { padding: 24px 20px 16px; }
  .jlx-grid { margin: 8px 20px 40px; grid-template-columns: 1fr; }
}
`;

const ICONS = {
  plus: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 3v10M3 8h10" strokeLinecap="round"/>
    </svg>
  ),
  edit: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M11 2.5l2.5 2.5L5 13.5H2.5V11L11 2.5z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  trash: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M2.5 4.5h11M6 4.5V3h4v1.5M5 4.5l.7 8h4.6l.7-8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  search: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="7" cy="7" r="4.5"/>
      <path d="M10.5 10.5l2.5 2.5" strokeLinecap="round"/>
    </svg>
  ),
  upload: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  grid: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="2" y="2" width="5" height="5" rx="1"/>
      <rect x="9" y="2" width="5" height="5" rx="1"/>
      <rect x="2" y="9" width="5" height="5" rx="1"/>
      <rect x="9" y="9" width="5" height="5" rx="1"/>
    </svg>
  ),
  gem: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M12 2l9 7-9 13L3 9l9-7z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 9h18" strokeLinecap="round"/>
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  box: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M21 8v13a1 1 0 01-1 1H4a1 1 0 01-1-1V8" strokeLinecap="round"/>
      <path d="M23 3H1l3 5h16l3-5z" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="12" y1="3" x2="12" y2="13" strokeLinecap="round"/>
    </svg>
  ),
  check: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

function Modal({ mode, category, onClose, onSave }) {
  const [form, setForm] = useState(() =>
    category
      ? { name: category.name, description: category.description, status: category.status, featured: category.featured }
      : { name: "", description: "", status: "active", featured: false }
  );

  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    loadGSAP().then((gsap) => {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, y: 30, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power2.out" }
      );
    });
  }, []);

  function handleClose() {
    loadGSAP().then((gsap) => {
      gsap.to(modalRef.current, { opacity: 0, y: 20, duration: 0.2, ease: "power2.in" });
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, onComplete: onClose });
    });
  }

  return (
    <div className="jlx-overlay" ref={overlayRef} onClick={(e) => e.target === overlayRef.current && handleClose()}>
      <div className="jlx-modal" ref={modalRef}>
        <div className="jlx-modal-header">
          <div>
            <div className="jlx-modal-eyebrow">{mode === "edit" ? "Editar Registro" : "Novo Registro"}</div>
            <div className="jlx-modal-title">
              {mode === "edit" ? "Editar Categoria" : "Nova Categoria"}
            </div>
          </div>
          <button className="jlx-modal-close" onClick={handleClose}>✕</button>
        </div>

        <div className="jlx-modal-body">
          <div className="jlx-field">
            <label>Nome da Categoria</label>
            <input
              type="text"
              placeholder="Ex: Anéis de Diamante"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="jlx-field">
            <label>Descrição</label>
            <textarea
              placeholder="Descreva brevemente esta categoria..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="jlx-field">
            <label>Imagem / Banner da Categoria</label>
            <div className="jlx-upload-area">
              <div className="jlx-upload-icon">{ICONS.upload}</div>
              <div className="jlx-upload-text">
                <strong>Clique para enviar</strong> ou arraste e solte
              </div>
              <div className="jlx-upload-hint">PNG, JPG, WEBP · Máx. 4 MB · Recomendado 1200 × 600 px</div>
            </div>
          </div>

          <div className="jlx-field">
            <label>Status da Categoria</label>
            <div className="jlx-toggle-group">
              <button
                className={`jlx-toggle-btn ${form.status === "active" ? "sel-active" : ""}`}
                onClick={() => setForm({ ...form, status: "active" })}
              >
                {form.status === "active" && ICONS.check}
                Ativa
              </button>
              <button
                className={`jlx-toggle-btn ${form.status === "inactive" ? "sel-inactive" : ""}`}
                onClick={() => setForm({ ...form, status: "inactive" })}
              >
                Inativa
              </button>
            </div>
          </div>

          <div className="jlx-field">
            <label>Destaque</label>
            <div className="jlx-toggle-group">
              <button
                className={`jlx-toggle-btn ${form.featured ? "sel-active" : ""}`}
                onClick={() => setForm({ ...form, featured: true })}
              >
                {form.featured && ICONS.check}
                Categoria em Destaque
              </button>
              <button
                className={`jlx-toggle-btn ${!form.featured ? "sel-inactive" : ""}`}
                onClick={() => setForm({ ...form, featured: false })}
              >
                Sem Destaque
              </button>
            </div>
          </div>
        </div>

        <div className="jlx-modal-footer">
          <button className="jlx-btn-ghost" onClick={handleClose}>Cancelar</button>
          <button className="jlx-btn-primary" onClick={() => { onSave(form); handleClose(); }}>
            <span>{ICONS.check}</span>
            <span>{mode === "edit" ? "Salvar Alterações" : "Criar Categoria"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ cat, onEdit, onDelete, index }) {
  const cardRef = useRef(null);

  useEffect(() => {
    loadGSAP().then((gsap) => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.5, delay: index * 0.07, ease: "power2.out" }
      );
    });
  }, [index]);

  return (
    <div className="jlx-card" ref={cardRef}>
      <div className="jlx-card-top-line" />
      <div className="jlx-card-glow" />
      <div className="jlx-card-img-wrap">
        <img className="jlx-card-img" src={cat.image} alt={cat.name} loading="lazy" />
        {cat.featured && <div className="jlx-badge-featured">★ Destaque</div>}
        <div className={`jlx-card-badge ${cat.status === "active" ? "jlx-badge-active" : "jlx-badge-inactive"}`}>
          {cat.status === "active" ? "Ativa" : "Inativa"}
        </div>
      </div>
      <div className="jlx-card-body">
        <div className="jlx-card-name">{cat.name}</div>
        <div className="jlx-card-meta">
          <div className="jlx-card-products">
            {cat.products} <span>produtos</span>
          </div>
        </div>
        <div className="jlx-card-desc">{cat.description}</div>
        <div className="jlx-card-divider" />
        <div className="jlx-card-actions">
          <button className="jlx-btn-icon" onClick={() => onEdit(cat)}>
            {ICONS.edit}
            <span>Editar</span>
          </button>
          <button className="jlx-btn-icon danger" onClick={() => onDelete(cat.id)}>
            {ICONS.trash}
            <span>Excluir</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState(CATEGORIES);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState(null);
  const heroRef = useRef(null);
  const kpiRefs = useRef([]);

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
    return () => styleEl.remove();
  }, []);

  useEffect(() => {
    loadGSAP().then((gsap) => {
      gsap.fromTo(
        heroRef.current?.querySelectorAll(".jlx-hero-eyebrow, .jlx-hero h1, .jlx-hero-sub, .jlx-btn-primary"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out", delay: 0.1 }
      );
      kpiRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, delay: 0.3 + i * 0.1, ease: "power2.out" }
        );
        const val = el.querySelector(".jlx-kpi-value");
        if (val) {
          const target = parseInt(val.dataset.target, 10);
          gsap.fromTo(
            { v: 0 },
            { v: target, duration: 1.2, delay: 0.4 + i * 0.1, ease: "power2.out",
              onUpdate: function () { val.textContent = Math.round(this.targets()[0].v); }
            }
          );
        }
      });
    });
  }, []);

  const filtered = categories.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchSearch;
    if (filter === "active") return matchSearch && c.status === "active";
    if (filter === "inactive") return matchSearch && c.status === "inactive";
    if (filter === "featured") return matchSearch && c.featured;
    if (filter === "empty") return matchSearch && c.products === 0;
    return matchSearch;
  });

  const totalFeatured = categories.filter((c) => c.featured).length;
  const totalEmpty = categories.filter((c) => c.products === 0).length;

  function handleSave(formData) {
    if (modal.mode === "edit") {
      setCategories((prev) =>
        prev.map((c) => (c.id === modal.category.id ? { ...c, ...formData } : c))
      );
    } else {
      const newCat = {
        id: Date.now(),
        ...formData,
        products: 0,
        slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
      };
      setCategories((prev) => [newCat, ...prev]);
    }
  }

  function handleDelete(id) {
    loadGSAP().then((gsap) => {
      const el = document.querySelector(`[data-cat-id="${id}"]`);
      if (el) {
        gsap.to(el, {
          opacity: 0, scale: 0.95, duration: 0.25, ease: "power2.in",
          onComplete: () => setCategories((prev) => prev.filter((c) => c.id !== id)),
        });
      } else {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      }
    });
  }

  const chips = [
    { id: "all", label: "Todas" },
    { id: "active", label: "Ativas" },
    { id: "inactive", label: "Inativas" },
    { id: "featured", label: "Destaque" },
    { id: "empty", label: "Sem Produtos" },
  ];

  return (
    <div className="jlx-root">
      <div className="jlx-content">
        {/* TOPBAR */}
        <header className="jlx-topbar">
          <div className="jlx-logo">
            Lumière
            <span>Joalheria de Luxo</span>
          </div>
          <nav className="jlx-nav">
            <a href="#">Dashboard</a>
            <a href="#" className="active">Categorias</a>
            <a href="#">Produtos</a>
            <a href="#">Pedidos</a>
            <a href="#">Analytics</a>
            <div className="jlx-nav-avatar">AD</div>
          </nav>
        </header>

        {/* HERO */}
        <section className="jlx-hero" ref={heroRef}>
          <div>
            <div className="jlx-hero-eyebrow">Gestão de Catálogo</div>
            <h1>
              Gerenciar <em>Categorias</em>
            </h1>
            <p className="jlx-hero-sub">
              Organize o catálogo da sua joalheria com precisão. Cada categoria é uma vitrine cuidadosamente curada para sua clientela.
            </p>
          </div>
          <button className="jlx-btn-primary" onClick={() => setModal({ mode: "create", category: null })}>
            <span>{ICONS.plus}</span>
            <span>Nova Categoria</span>
          </button>
        </section>

        {/* KPIs */}
        <div className="jlx-kpis">
          {[
            { label: "Total de Categorias", target: categories.length, sub: "registros ativos no sistema", icon: ICONS.grid },
            { label: "Em Destaque", target: totalFeatured, sub: "exibidas na página inicial", icon: ICONS.star },
            { label: "Sem Produtos", target: totalEmpty, sub: "aguardando vinculação", icon: ICONS.box },
          ].map((kpi, i) => (
            <div className="jlx-kpi" key={i} ref={(el) => (kpiRefs.current[i] = el)}>
              <div className="jlx-kpi-label">{kpi.label}</div>
              <div className="jlx-kpi-value" data-target={kpi.target}>0</div>
              <div className="jlx-kpi-sub">{kpi.sub}</div>
              <div className="jlx-kpi-icon">{kpi.icon}</div>
            </div>
          ))}
        </div>

        {/* TOOLBAR */}
        <div className="jlx-toolbar">
          <div className="jlx-search">
            <span className="jlx-search-icon">{ICONS.search}</span>
            <input
              type="text"
              placeholder="Buscar categoria..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="jlx-filters">
            <span className="jlx-filter-label">Filtrar</span>
            {chips.map((c) => (
              <button
                key={c.id}
                className={`jlx-chip ${filter === c.id ? "active" : ""}`}
                onClick={() => setFilter(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="jlx-count">{filtered.length} resultado{filtered.length !== 1 ? "s" : ""}</div>
        </div>

        {/* GRID */}
        <div className="jlx-grid">
          {filtered.length === 0 ? (
            <div className="jlx-empty">
              <div className="jlx-empty-icon">{ICONS.gem}</div>
              <div className="jlx-empty-title">Nenhuma categoria encontrada</div>
              <div className="jlx-empty-sub">Tente ajustar os filtros ou criar uma nova categoria</div>
            </div>
          ) : (
            filtered.map((cat, i) => (
              <div key={cat.id} data-cat-id={cat.id}>
                <CategoryCard
                  cat={cat}
                  index={i}
                  onEdit={(c) => setModal({ mode: "edit", category: c })}
                  onDelete={handleDelete}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL */}
      {modal && (
        <Modal
          mode={modal.mode}
          category={modal.category}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}