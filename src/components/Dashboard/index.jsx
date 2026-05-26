import { useState, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// ─── TOKENS ───────────────────────────────────────────────────────────────────
const T = {
  gold: "#C9A84C",
  goldLight: "#E8C96A",
  goldDim: "#E8C96A",
  champagne: "#F5E6C8",
  carbon: "#0D0D0D",
  charcoal: "#141414",
  surface: "#1A1A1A",
  surfaceHigh: "#222222",
  border: "rgba(201,168,76,0.15)",
  borderMid: "rgba(201,168,76,0.3)",
  glass: "rgba(255,255,255,0.03)",
  text: "#E8E0D4",
  textMuted: "#7A7268",
  textSub: "#9E9488",
  danger: "#C94C4C",
  success: "#4CAF7A",
};

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const metrics = [
  { label: "Produtos Ativos", value: "1.284", delta: "+12", deltaUp: true, icon: "◈", sub: "em catálogo" },
  { label: "Receita Mensal", value: "R$ 847K", delta: "+23%", deltaUp: true, icon: "◆", sub: "vs mês anterior" },
  { label: "Vendas Hoje", value: "34", delta: "+8", deltaUp: true, icon: "◇", sub: "transações" },
  { label: "Estoque Crítico", value: "17", delta: "-3", deltaUp: false, icon: "⬡", sub: "itens abaixo do mínimo" },
];

const salesData = [
  { month: "Jan", v: 62 }, { month: "Fev", v: 78 }, { month: "Mar", v: 55 },
  { month: "Abr", v: 91 }, { month: "Mai", v: 84 }, { month: "Jun", v: 110 },
  { month: "Jul", v: 96 }, { month: "Ago", v: 120 }, { month: "Set", v: 105 },
  { month: "Out", v: 138 }, { month: "Nov", v: 152 }, { month: "Dez", v: 167 },
];

const movements = [
  { id: "#JW-8841", item: "Anel Solitário Ouro 18k", type: "Saída", qty: 1, date: "Hoje, 14:22", status: "Vendido" },
  { id: "#JW-8840", item: "Colar Veneziana Diamante", type: "Entrada", qty: 3, date: "Hoje, 11:05", status: "Recebido" },
  { id: "#JW-8838", item: "Brinco Argola Ouro Rose", type: "Saída", qty: 2, date: "Hoje, 09:47", status: "Vendido" },
  { id: "#JW-8835", item: "Pulseira Tennis Brilhantes", type: "Saída", qty: 1, date: "Ontem, 18:30", status: "Reservado" },
  { id: "#JW-8833", item: "Relógio Skeleton Ouro", type: "Entrada", qty: 1, date: "Ontem, 15:12", status: "Recebido" },
];

const topProducts = [
  { name: "Anel Solitário Ouro 18k", cat: "Anéis", sold: 48, revenue: "R$ 96.000", stock: 12, img: "◈" },
  { name: "Colar Veneziana Diamante", cat: "Colares", sold: 31, revenue: "R$ 77.500", stock: 7, img: "◆" },
  { name: "Pulseira Tennis Brilhantes", cat: "Pulseiras", sold: 27, revenue: "R$ 67.500", stock: 4, img: "◇" },
  { name: "Brinco Argola Ouro Rose", cat: "Brincos", sold: 22, revenue: "R$ 33.000", stock: 19, img: "⬡" },
];

const lowStock = [
  { name: "Anel Esmeralda 14k", qty: 2, min: 5, cat: "Anéis" },
  { name: "Colar Rubi Pave", qty: 1, min: 3, cat: "Colares" },
  { name: "Bracelete Safira", qty: 3, min: 5, cat: "Pulseiras" },
];

const activity = [
  { msg: "Inventário sincronizado com ERP", time: "2 min atrás", icon: "↺" },
  { msg: "Nova venda — Anel Solitário #JW-8841", time: "28 min atrás", icon: "◆" },
  { msg: "Alerta: Colar Rubi abaixo do mínimo", time: "1h atrás", icon: "⚠" },
  { msg: "Relatório mensal gerado", time: "3h atrás", icon: "≡" },
  { msg: "Usuário sofia@luxe.com fez login", time: "5h atrás", icon: "◎" },
];

// ─── SPARKLINE ─────────────────────────────────────────────────────────────────
function Sparkline({ data, color = T.gold }) {
  const max = Math.max(...data.map(d => d.v));
  const min = Math.min(...data.map(d => d.v));
  const W = 260, H = 80, PAD = 4;
  const pts = data.map((d, i) => {
    const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((d.v - min) / (max - min)) * (H - PAD * 2);
    return `${x},${y}`;
  }).join(" ");
  const area = `M${PAD},${H} ` + data.map((d, i) => {
    const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((d.v - min) / (max - min)) * (H - PAD * 2);
    return `L${x},${y}`;
  }).join(" ") + ` L${W - PAD},${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 80, display: "block" }}>
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sparkGrad)" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      {data.map((d, i) => {
        const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
        const y = H - PAD - ((d.v - min) / (max - min)) * (H - PAD * 2);
        return i === data.length - 1
          ? <circle key={i} cx={x} cy={y} r={3} fill={color} />
          : null;
      })}
    </svg>
  );
}

// ─── BAR CHART ─────────────────────────────────────────────────────────────────
function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.v));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120, padding: "0 4px" }}>
      {data.map((d, i) => {
        const pct = (d.v / max) * 100;
        const isLast = i === data.length - 1;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: "100%", height: `${pct}%`, minHeight: 4,
              background: isLast
                ? `linear-gradient(180deg, ${T.goldLight}, ${T.gold})`
                : `linear-gradient(180deg, rgba(201, 76, 76, 0.4), rgba(201,168,76,0.15))`,
              borderRadius: "3px 3px 0 0",
              boxShadow: isLast ? `0 0 12px ${T.gold}55` : "none",
              transition: "height 0.6s ease",
            }} />
            <span style={{ fontSize: 9, color: T.textMuted, letterSpacing: "0.02em" }}>{d.month}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── SIDEBAR ───────────────────────────────────────────────────────────────────
const navItems = [
  { icon: "⬡", label: "Dashboard", active: true },
  { icon: "◈", label: "Produtos" },
  { icon: "◆", label: "Estoque" },
  { icon: "◇", label: "Vendas" },
  { icon: "≡", label: "Relatórios" },
  { icon: "↺", label: "Fornecedores" },
  { icon: "◎", label: "Clientes" },
];

function Sidebar() {
  return (
    <aside style={{
      width: 72, minHeight: "100vh", background: T.charcoal,
      borderRight: `1px solid ${T.border}`,
      display: "flex", flexDirection: "column", alignItems: "center",
      paddingTop: 28, paddingBottom: 24, gap: 0, position: "fixed", top: 0, left: 0, zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{
        width: 40, height: 40, borderRadius: "50%",
        background: `linear-gradient(135deg, ${T.gold}, ${T.goldDim})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16, color: T.carbon, fontWeight: 700, marginBottom: 36,
        boxShadow: `0 0 20px ${T.gold}44`,
      }}>◆</div>

      {/* Nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%", padding: "0 8px" }}>
        {navItems.map((item, i) => (
          <div key={i} title={item.label} style={{
            width: "100%", height: 44, borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            background: item.active ? `linear-gradient(135deg, ${T.gold}22, ${T.gold}08)` : "transparent",
            border: item.active ? `1px solid ${T.borderMid}` : "1px solid transparent",
            color: item.active ? T.gold : T.textMuted,
            fontSize: 16, transition: "all 0.2s ease",
          }}
            onMouseEnter={e => { if (!item.active) { e.currentTarget.style.color = T.champagne; e.currentTarget.style.background = T.glass; } }}
            onMouseLeave={e => { if (!item.active) { e.currentTarget.style.color = T.textMuted; e.currentTarget.style.background = "transparent"; } }}
          >
            {item.icon}
          </div>
        ))}
      </nav>

      {/* Bottom user */}
      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: `linear-gradient(135deg, ${T.surfaceHigh}, ${T.surface})`,
          border: `1px solid ${T.borderMid}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: T.gold, fontSize: 14, cursor: "pointer",
        }}>◎</div>
      </div>
    </aside>
  );
}

// ─── METRIC CARD ───────────────────────────────────────────────────────────────
function MetricCard({ data, delay }) {
  const ref = useRef();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("mouseenter", () => {
      gsap.to(el, { y: -3, boxShadow: `0 12px 40px ${T.gold}22`, duration: 0.3, ease: "power2.out" });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(el, { y: 0, boxShadow: `0 2px 16px rgba(0,0,0,0.4)`, duration: 0.3, ease: "power2.out" });
    });
  }, []);

  return (
    <div ref={ref} style={{
      background: `linear-gradient(145deg, ${T.surfaceHigh}, ${T.surface})`,
      border: `1px solid ${T.border}`,
      borderRadius: 16, padding: "22px 24px",
      boxShadow: `0 2px 16px rgba(0,0,0,0.4)`,
      cursor: "default", position: "relative", overflow: "hidden",
    }}>
      {/* Shimmer corner */}
      <div style={{
        position: "absolute", top: 0, right: 0, width: 80, height: 80,
        background: `radial-gradient(circle at top right, ${T.gold}0D, transparent 70%)`,
        pointerEvents: "none",
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <span style={{ fontSize: 10, color: T.textMuted, letterSpacing: "0.12em", textTransform: "uppercase" }}>{data.label}</span>
        <span style={{
          fontSize: 18, color: T.gold, opacity: 0.7,
          width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
          background: `${T.gold}11`, borderRadius: 8, border: `1px solid ${T.border}`,
        }}>{data.icon}</span>
      </div>
      <div style={{ fontSize: 28, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: T.champagne, lineHeight: 1, marginBottom: 8 }}>
        {data.value}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{
          fontSize: 11, fontWeight: 600, color: data.deltaUp ? T.success : T.danger,
          background: data.deltaUp ? `${T.success}18` : `${T.danger}18`,
          padding: "2px 7px", borderRadius: 6,
        }}>{data.delta}</span>
        <span style={{ fontSize: 11, color: T.textMuted }}>{data.sub}</span>
      </div>
    </div>
  );
}

// ─── GLASS CARD ────────────────────────────────────────────────────────────────
function GlassCard({ title, children, style = {}, action }) {
  return (
    <div style={{
      background: `linear-gradient(145deg, ${T.surfaceHigh}, ${T.surface})`,
      border: `1px solid ${T.border}`,
      borderRadius: 16, padding: 24,
      boxShadow: `0 2px 24px rgba(0,0,0,0.3)`,
      ...style,
    }}>
      {title && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textSub, fontWeight: 500, margin: 0 }}>
            {title}
          </h3>
          {action && <button onClick={action.fn} style={{
            fontSize: 10, color: T.gold, background: "transparent", border: `1px solid ${T.border}`,
            borderRadius: 6, padding: "4px 10px", cursor: "pointer", letterSpacing: "0.08em",
          }}>{action.label}</button>}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── MOVEMENTS TABLE ───────────────────────────────────────────────────────────
function MovementsTable() {
  const statusColor = (s) => ({ Vendido: T.success, Recebido: T.gold, Reservado: "#7B9ECC" }[s] || T.textMuted);
  const typeColor = (t) => t === "Saída" ? T.danger : T.success;

  return (
    <GlassCard title="Movimentações Recentes" action={{ label: "Ver Todas →", fn: () => {} }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr>
              {["ID", "Item", "Tipo", "Qtd", "Data", "Status"].map(h => (
                <th key={h} style={{
                  textAlign: "left", padding: "0 12px 12px 0",
                  color: T.textMuted, fontWeight: 400, letterSpacing: "0.08em",
                  fontSize: 10, textTransform: "uppercase",
                  borderBottom: `1px solid ${T.border}`,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {movements.map((m, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${T.border}88` }}
                onMouseEnter={e => e.currentTarget.style.background = T.glass}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "13px 12px 13px 0", color: T.gold, fontFamily: "monospace", fontSize: 11 }}>{m.id}</td>
                <td style={{ padding: "13px 12px 13px 0", color: T.text, maxWidth: 180, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.item}</td>
                <td style={{ padding: "13px 12px 13px 0" }}>
                  <span style={{ color: typeColor(m.type), fontSize: 11 }}>{m.type}</span>
                </td>
                <td style={{ padding: "13px 12px 13px 0", color: T.textSub }}>{m.qty}</td>
                <td style={{ padding: "13px 12px 13px 0", color: T.textMuted, fontSize: 11 }}>{m.date}</td>
                <td style={{ padding: "13px 0 13px 0" }}>
                  <span style={{
                    fontSize: 10, color: statusColor(m.status),
                    background: `${statusColor(m.status)}18`,
                    padding: "3px 9px", borderRadius: 20, letterSpacing: "0.05em",
                  }}>{m.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}

// ─── TOP PRODUCTS ──────────────────────────────────────────────────────────────
function TopProducts() {
  return (
    <GlassCard title="Produtos Premium — Top Vendas">
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {topProducts.map((p, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "12px 14px", borderRadius: 10,
            background: T.glass, border: `1px solid ${T.border}88`,
            cursor: "default", transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderMid; e.currentTarget.style.background = `${T.gold}08`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${T.border}88`; e.currentTarget.style.background = T.glass; }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: `linear-gradient(135deg, ${T.gold}22, ${T.gold}08)`,
              border: `1px solid ${T.borderMid}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, color: T.gold,
            }}>{p.img}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
              <div style={{ fontSize: 10, color: T.textMuted, marginTop: 2 }}>{p.cat}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 12, color: T.champagne, fontFamily: "'Cormorant Garamond', serif" }}>{p.revenue}</div>
              <div style={{ fontSize: 10, color: T.textMuted, marginTop: 1 }}>{p.sold} vendas</div>
            </div>
            <div style={{
              fontSize: 10, color: p.stock <= 5 ? T.danger : T.success,
              background: p.stock <= 5 ? `${T.danger}18` : `${T.success}18`,
              padding: "3px 8px", borderRadius: 6, flexShrink: 0,
            }}>
              {p.stock} estq.
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

// ─── LOW STOCK ALERT ───────────────────────────────────────────────────────────
function LowStockAlert() {
  return (
    <div style={{
      background: `linear-gradient(145deg, #1F1010, #1A0D0D)`,
      border: `1px solid ${T.danger}33`,
      borderRadius: 16, padding: 24,
      boxShadow: `0 0 30px ${T.danger}0A`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <span style={{ color: T.danger, fontSize: 14 }}>⚠</span>
        <h3 style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: `${T.danger}CC`, fontWeight: 500, margin: 0 }}>
          Alertas de Estoque
        </h3>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {lowStock.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8, background: `${T.danger}08`, border: `1px solid ${T.danger}22` }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: T.text }}>{item.name}</div>
              <div style={{ fontSize: 10, color: T.textMuted, marginTop: 1 }}>{item.cat}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.danger, fontFamily: "'Cormorant Garamond', serif" }}>{item.qty}</div>
              <div style={{ fontSize: 9, color: T.textMuted }}>mín: {item.min}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── QUICK ACTIONS ─────────────────────────────────────────────────────────────
const actions = [
  { label: "Novo Produto", icon: "◈" },
  { label: "Registrar Venda", icon: "◆" },
  { label: "Entrada Estoque", icon: "↑" },
  { label: "Gerar Relatório", icon: "≡" },
];

function QuickActions() {
  return (
    <GlassCard title="Ações Rápidas">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {actions.map((a, i) => (
          <button key={i} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "13px 14px",
            background: T.glass, border: `1px solid ${T.border}`,
            borderRadius: 10, cursor: "pointer", color: T.text, fontSize: 12,
            transition: "all 0.25s ease", fontFamily: "inherit",
          }}
            onMouseEnter={e => {
              e.currentTarget.style.background = `linear-gradient(135deg, ${T.gold}18, ${T.gold}06)`;
              e.currentTarget.style.borderColor = T.borderMid;
              e.currentTarget.style.color = T.champagne;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = T.glass;
              e.currentTarget.style.borderColor = T.border;
              e.currentTarget.style.color = T.text;
            }}>
            <span style={{ fontSize: 14, color: T.gold }}>{a.icon}</span>
            {a.label}
          </button>
        ))}
      </div>
    </GlassCard>
  );
}

// ─── ACTIVITY FEED ─────────────────────────────────────────────────────────────
function ActivityFeed() {
  return (
    <GlassCard title="Atividade do Sistema">
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {activity.map((a, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0",
            borderBottom: i < activity.length - 1 ? `1px solid ${T.border}66` : "none",
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, flexShrink: 0,
              background: `${T.gold}11`, border: `1px solid ${T.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, color: T.gold, marginTop: 1,
            }}>{a.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: T.text, lineHeight: 1.4 }}>{a.msg}</div>
              <div style={{ fontSize: 10, color: T.textMuted, marginTop: 3 }}>{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

// ─── HERO ──────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <div style={{
      position: "relative", padding: "32px 36px 28px",
      background: `linear-gradient(135deg, ${T.surfaceHigh} 0%, ${T.surface} 60%, #1A1510 100%)`,
      borderRadius: 20, border: `1px solid ${T.border}`,
      overflow: "hidden", marginBottom: 28,
    }}>
      {/* BG decorative */}
      <div style={{
        position: "absolute", top: -40, right: -40, width: 220, height: 220,
        borderRadius: "50%", background: `radial-gradient(circle, ${T.gold}09 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -20, left: 200, width: 120, height: 120,
        borderRadius: "50%", background: `radial-gradient(circle, ${T.gold}06 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20 }}>
        <div>
          <div style={{ fontSize: 11, color: T.gold, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, opacity: 0.8 }}>
            PAINEL DE CONTROLE · LUXE JOIAS
          </div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 600,
            color: T.champagne, margin: "0 0 8px", lineHeight: 1.1, letterSpacing: "-0.01em",
          }}>
            Bom dia, Sofia.
          </h1>
          <p style={{ fontSize: 13, color: T.textSub, margin: 0, lineHeight: 1.6 }}>
            Sua coleção premium está performando <span style={{ color: T.gold }}>23% acima</span> da meta mensal.
          </p>
        </div>

        {/* Mini KPIs */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { l: "Hoje", v: "R$ 28.400", c: T.gold },
            { l: "Esta semana", v: "R$ 142K", c: T.champagne },
            { l: "NPS", v: "9.4", c: T.success },
          ].map((k, i) => (
            <div key={i} style={{
              padding: "12px 18px", borderRadius: 12, textAlign: "center",
              background: T.glass, border: `1px solid ${T.border}`,
              backdropFilter: "blur(10px)",
            }}>
              <div style={{ fontSize: 10, color: T.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{k.l}</div>
              <div style={{ fontSize: 18, fontFamily: "'Cormorant Garamond', serif", color: k.c, fontWeight: 600 }}>{k.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ────────────────────────────────────────────────────────────
export default function JewelryDashboard() {
  const containerRef = useRef();

  useGSAP(() => {
    // Hero fade in
    gsap.fromTo(".hero-section",
      { opacity: 0, y: -16, filter: "blur(6px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power3.out" }
    );

    // Metrics stagger
    gsap.fromTo(".metric-card",
      { opacity: 0, y: 24, filter: "blur(4px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, stagger: 0.1, ease: "power2.out", delay: 0.3 }
    );

    // Content cards
    gsap.fromTo(".content-card",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power2.out", delay: 0.6 }
    );
  }, { scope: containerRef });

  return (
    <>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <div ref={containerRef} style={{
        minHeight: "100vh", background: T.carbon,
        fontFamily: "'Outfit', sans-serif", color: T.text,
        display: "flex",
      }}>
        <Sidebar />

        {/* Main content */}
        <main style={{ marginLeft: 72, flex: 1, padding: "28px 28px 28px 32px", minHeight: "100vh" }}>

          {/* Header row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 11, color: T.textMuted, letterSpacing: "0.1em" }}>
                {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{
                padding: "8px 16px", borderRadius: 10,
                background: T.glass, border: `1px solid ${T.border}`,
                fontSize: 11, color: T.textSub, display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ color: T.success, fontSize: 8 }}>●</span> Sistema Operacional
              </div>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: T.glass,
                border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center",
                color: T.gold, fontSize: 14, cursor: "pointer",
                position: "relative",
              }}>
                ◇
                <span style={{
                  position: "absolute", top: 6, right: 6, width: 8, height: 8,
                  borderRadius: "50%", background: T.danger, border: `2px solid ${T.carbon}`,
                }} />
              </div>
            </div>
          </div>

          {/* Hero */}
          <div className="hero-section"><HeroSection /></div>

          {/* Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
            {metrics.map((m, i) => (
              <div key={i} className="metric-card"><MetricCard data={m} /></div>
            ))}
          </div>

          {/* Main grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 340px", gap: 16, marginBottom: 16 }}>

            {/* Sales chart */}
            <div className="content-card">
              <GlassCard title="Evolução de Vendas — 2024" action={{ label: "Exportar →", fn: () => {} }}>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 28, fontFamily: "'Cormorant Garamond', serif", color: T.champagne, fontWeight: 600 }}>R$ 847K</span>
                  <span style={{ fontSize: 11, color: T.success, marginLeft: 10, background: `${T.success}18`, padding: "2px 8px", borderRadius: 6 }}>+23%</span>
                </div>
                <BarChart data={salesData} />
              </GlassCard>
            </div>

            {/* Sparkline card */}
            <div className="content-card">
              <GlassCard title="Ticket Médio — Tendência">
                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 28, fontFamily: "'Cormorant Garamond', serif", color: T.champagne, fontWeight: 600 }}>R$ 3.240</span>
                  <span style={{ fontSize: 11, color: T.gold, marginLeft: 10, background: `${T.gold}18`, padding: "2px 8px", borderRadius: 6 }}>+8%</span>
                </div>
                <Sparkline data={salesData} color={T.gold} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 16 }}>
                  {[
                    { l: "Anéis", v: "42%" }, { l: "Colares", v: "31%" }, { l: "Outros", v: "27%" }
                  ].map((s, i) => (
                    <div key={i} style={{ textAlign: "center", padding: "10px 0", background: T.glass, borderRadius: 8, border: `1px solid ${T.border}` }}>
                      <div style={{ fontSize: 16, fontFamily: "'Cormorant Garamond', serif", color: T.gold, fontWeight: 600 }}>{s.v}</div>
                      <div style={{ fontSize: 10, color: T.textMuted, marginTop: 2 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Right column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="content-card"><LowStockAlert /></div>
              <div className="content-card"><QuickActions /></div>
            </div>
          </div>

          {/* Bottom grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16 }}>
            <div className="content-card"><MovementsTable /></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="content-card"><TopProducts /></div>
              <div className="content-card"><ActivityFeed /></div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: 28, paddingTop: 20, borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 10, color: T.textMuted, letterSpacing: "0.08em" }}>LUXE JOIAS © 2024 — Sistema de Gestão Premium v2.4.1</span>
            <span style={{ fontSize: 10, color: T.gold, opacity: 0.6 }}>◆ Todos os dados sincronizados</span>
          </div>
        </main>
      </div>
    </>
  );
}