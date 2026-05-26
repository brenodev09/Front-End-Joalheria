/**
 * AzoryAccount — Página de Conta Administrativa
 * Azory Luxury Jewelry Management System
 *
 * Stack: React · CSS Modules · GSAP + useGSAP
 * Deps:  npm install gsap @gsap/react
 */

import { useState, useRef, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import s from "./styles.module.css";

// ─── SIDEBAR DATA ─────────────────────────────────────────────────────────────

const NAV = [
  { icon: "⬡", label: "Dashboard" },
  { icon: "◈", label: "Produtos" },
  { icon: "◆", label: "Estoque" },
  { icon: "◇", label: "Vendas" },
  { icon: "≡", label: "Relatórios" },
  { icon: "↺", label: "Fornecedores" },
  { icon: "◎", label: "Conta", active: true },
];

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const ADMIN = {
  initials:    "SA",
  name:        "Sofia Andrade",
  role:        "Administradora Geral",
  email:       "sofia.andrade@azory.com.br",
  phone:       "+55 (11) 99874-3210",
  username:    "@sofia.azory",
  lastAccess:  "Hoje às 09:14",
  memberSince: "Mar 2022",
  stats: [
    { label: "Produtos Cadastrados", value: "1.284", sub: "+12 este mês" },
    { label: "Atividades Recentes",  value: "347",   sub: "últimos 30 dias" },
    { label: "Tempo no Sistema",     value: "2a 3m",  sub: "desde o ingresso" },
  ],
};

const SESSIONS = [
  { device: "MacBook Pro 16", os: "macOS Sonoma", ip: "177.92.14.33", current: true },
  { device: "iPhone 15 Pro",   os: "iOS 17.4",    ip: "177.92.14.33", current: false },
  { device: "Chrome — Win 11", os: "Windows 11",  ip: "200.143.7.12",  current: false },
];

const LOGIN_HISTORY = [
  { event: "Login bem-sucedido",  time: "Hoje, 09:14", ip: "177.92.14.33", ok: true },
  { event: "Login bem-sucedido",  time: "Ontem, 18:42", ip: "177.92.14.33", ok: true },
  { event: "Tentativa bloqueada", time: "22 mai, 03:17", ip: "45.80.114.9",  ok: false },
  { event: "Login bem-sucedido",  time: "21 mai, 11:05", ip: "177.92.14.33", ok: true },
  { event: "Login bem-sucedido",  time: "20 mai, 08:50", ip: "177.92.14.33", ok: true },
];

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────

function Sidebar() {
  const ref = useRef();

  useGSAP(() => {
    gsap.from(ref.current.querySelectorAll("[data-nav]"), {
      opacity: 0, x: -14,
      duration: 0.5, stagger: 0.06, ease: "power2.out", delay: 0.1,
    });
  }, { scope: ref });

  return (
    <aside ref={ref} className={s.sidebar}>
      <div className={s.sidebarLogo} title="Azory">Az</div>

      <nav className={s.sidebarNav}>
        {NAV.map((item, i) => (
          <div
            key={i}
            data-nav
            className={`${s.navItem} ${item.active ? s.navItemActive : ""}`}
          >
            <span>{item.icon}</span>
            <span className={s.navTooltip}>{item.label}</span>
          </div>
        ))}
      </nav>

      <div className={s.sidebarBottom}>
        <div className={s.sidebarAva} title="Sofia Andrade">S</div>
      </div>
    </aside>
  );
}

// ─── PROFILE HERO ─────────────────────────────────────────────────────────────

function ProfileHero() {
  return (
    <div className={s.profileHero} data-hero>
      <div className={s.profileHeroBg} />
      <div className={s.profileHeroBg2} />

      <div className={s.profileHeroInner}>
        {/* Avatar */}
        <div className={s.profileAvaWrap}>
          <div className={s.profileAva}>
            {ADMIN.initials}
            <div className={s.profileAvaRing} />
          </div>
          <div className={s.profileOnline} title="Online" />
        </div>

        {/* Info */}
        <div className={s.profileInfo}>
          <div className={s.profileName}>{ADMIN.name}</div>
          <div className={s.profileRole}>{ADMIN.role}</div>
          <div className={s.profileMeta}>
            <div className={s.profileMetaItem}>
              <span style={{ color: "var(--gold)", fontSize: 11 }}>✉</span>
              <span>{ADMIN.email}</span>
            </div>
            <div className={s.profileMetaItem}>
              <span style={{ color: "var(--gold)", fontSize: 11 }}>◎</span>
              <span>Último acesso: <span>{ADMIN.lastAccess}</span></span>
            </div>
            <div className={s.profileMetaItem}>
              <span style={{ color: "var(--gold)", fontSize: 11 }}>◆</span>
              <span>Membro desde <span>{ADMIN.memberSince}</span></span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={s.profileActions}>
          <button className={s.btnEditProfile}>
            <span>✎</span> Editar Perfil
          </button>
          <div className={s.profileStatusChip}>Conta Ativa</div>
        </div>
      </div>

      {/* Stats strip */}
      <div className={s.statsRow}>
        {ADMIN.stats.map((st, i) => (
          <div key={i} className={s.statChip} data-stat>
            <span className={s.statChipLabel}>{st.label}</span>
            <span className={s.statChipValue}>{st.value}</span>
            <span className={s.statChipSub}>{st.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PERSONAL INFO SECTION ────────────────────────────────────────────────────

function PersonalInfo() {
  const [form, setForm] = useState({
    nome:     ADMIN.name,
    email:    ADMIN.email,
    telefone: ADMIN.phone,
    usuario:  ADMIN.username,
    cargo:    ADMIN.role,
  });

  const field = (key) => ({
    value: form[key],
    onChange: e => setForm(p => ({ ...p, [key]: e.target.value })),
  });

  return (
    <div className={s.sectionCard} data-card>
      <div className={s.sectionHeader}>
        <div className={s.sectionHeaderLeft}>
          <div className={s.sectionIconWrap}>◈</div>
          <div>
            <div className={s.sectionTitle}>Informações Pessoais</div>
            <div className={s.sectionSubtitle}>Dados do perfil administrativo</div>
          </div>
        </div>
        <button className={s.btnSave}>Salvar</button>
      </div>

      <div className={s.sectionBody}>
        <div className={s.formRow}>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Nome Completo</label>
            <div className={s.inputWrap}>
              <span className={s.inputIcon}>◎</span>
              <input className={s.formInput} {...field("nome")} />
            </div>
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Nome de Usuário</label>
            <div className={s.inputWrap}>
              <span className={s.inputIcon}>@</span>
              <input className={s.formInput} {...field("usuario")} />
              <span className={s.inputBadge}>único</span>
            </div>
          </div>
        </div>

        <div className={s.formRow}>
          <div className={s.formGroup}>
            <label className={s.formLabel}>E-mail</label>
            <div className={s.inputWrap}>
              <span className={s.inputIcon}>✉</span>
              <input className={s.formInput} type="email" {...field("email")} />
            </div>
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Telefone</label>
            <div className={s.inputWrap}>
              <span className={s.inputIcon}>◇</span>
              <input className={s.formInput} {...field("telefone")} />
            </div>
          </div>
        </div>

        <div className={`${s.formGroup}`}>
          <label className={s.formLabel}>Cargo / Função</label>
          <div className={s.inputWrap}>
            <span className={s.inputIcon}>◆</span>
            <input className={s.formInput} {...field("cargo")} />
          </div>
        </div>

        <div className={s.formRow}>
          <div className={s.formGroup}>
            <label className={s.formLabel}>ID da Conta</label>
            <div className={s.inputWrap}>
              <span className={s.inputIcon}>⬡</span>
              <input className={`${s.formInput} ${s.formInputReadonly}`} readOnly value="ADM-00142" />
            </div>
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Nível de Acesso</label>
            <div className={s.inputWrap}>
              <span className={s.inputIcon}>◈</span>
              <input className={`${s.formInput} ${s.formInputReadonly}`} readOnly value="Super Admin" />
              <span className={s.inputBadge}>máximo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SECURITY SECTION ─────────────────────────────────────────────────────────

function SecuritySection() {
  const [pwd, setPwd] = useState({ current: "", nova: "", confirm: "" });
  const [strength, setStrength] = useState(0);

  const calcStrength = (v) => {
    let sc = 0;
    if (v.length >= 8) sc++;
    if (/[A-Z]/.test(v)) sc++;
    if (/[0-9]/.test(v)) sc++;
    if (/[^A-Za-z0-9]/.test(v)) sc++;
    setStrength(sc);
  };

  const strengthColor = ["var(--rim)", "var(--danger)", "var(--warn)", "#6BA368", "var(--success)"];
  const strengthLabel = ["", "Fraca", "Razoável", "Boa", "Excelente"];

  return (
    <div className={s.sectionCard} data-card>
      <div className={s.sectionHeader}>
        <div className={s.sectionHeaderLeft}>
          <div className={s.sectionIconWrap}>⬡</div>
          <div>
            <div className={s.sectionTitle}>Segurança da Conta</div>
            <div className={s.sectionSubtitle}>Senha, 2FA e acessos ativos</div>
          </div>
        </div>
        <button className={s.btnSave}>Atualizar</button>
      </div>

      <div className={s.sectionBody}>
        {/* Change password */}
        <div className={s.formGroup}>
          <label className={s.formLabel}>Senha Atual</label>
          <div className={s.inputWrap}>
            <span className={s.inputIcon}>◆</span>
            <input
              className={s.formInput} type="password" placeholder="••••••••"
              value={pwd.current} onChange={e => setPwd(p => ({ ...p, current: e.target.value }))}
            />
          </div>
        </div>

        <div className={s.formRow}>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Nova Senha</label>
            <div className={s.inputWrap}>
              <span className={s.inputIcon}>◆</span>
              <input
                className={s.formInput} type="password" placeholder="Mínimo 8 caracteres"
                value={pwd.nova}
                onChange={e => { setPwd(p => ({ ...p, nova: e.target.value })); calcStrength(e.target.value); }}
              />
            </div>
            {pwd.nova && (
              <div className={s.pwdStrength}>
                <div className={s.pwdStrengthBar}>
                  {[1,2,3,4].map(i => (
                    <div
                      key={i}
                      className={s.pwdStrengthSeg}
                      style={{ background: strength >= i ? strengthColor[strength] : undefined }}
                    />
                  ))}
                </div>
                <span className={s.pwdStrengthLabel} style={{ color: strengthColor[strength] }}>
                  {strengthLabel[strength]}
                </span>
              </div>
            )}
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Confirmar Senha</label>
            <div className={s.inputWrap}>
              <span className={s.inputIcon}>◆</span>
              <input
                className={s.formInput} type="password" placeholder="Repita a nova senha"
                value={pwd.confirm} onChange={e => setPwd(p => ({ ...p, confirm: e.target.value }))}
                style={pwd.confirm && pwd.nova !== pwd.confirm ? { borderColor: "var(--danger)" } : {}}
              />
            </div>
          </div>
        </div>

        <div className={s.divider} />

        {/* 2FA & security settings */}
        {[
          {
            icon: "◈", iconBg: "var(--gold-ghost)", iconColor: "var(--gold)",
            title: "Autenticação em 2 Fatores",
            desc: "Camada extra de segurança via aplicativo autenticador",
            badge: "Ativado", badgeCls: s.securityBadgeGreen,
          },
          {
            icon: "◇", iconBg: "var(--info-bg)", iconColor: "var(--info)",
            title: "Chave de Recuperação",
            desc: "Gerar novos códigos de recuperação de emergência",
            badge: "3 restantes", badgeCls: s.securityBadgeOrange,
          },
          {
            icon: "⬡", iconBg: "var(--danger-bg)", iconColor: "var(--danger)",
            title: "Encerrar Todas as Sessões",
            desc: "Desconectar todos os dispositivos imediatamente",
            badge: "3 sessões", badgeCls: s.securityBadgeRed,
          },
        ].map((item, i) => (
          <div key={i} className={s.securityItem}>
            <div className={s.securityItemLeft}>
              <div
                className={s.securityItemIcon}
                style={{ background: item.iconBg, color: item.iconColor, border: "1px solid " + item.iconBg.replace("0.10", "0.3") }}
              >
                {item.icon}
              </div>
              <div>
                <div className={s.securityItemTitle}>{item.title}</div>
                <div className={s.securityItemDesc}>{item.desc}</div>
              </div>
            </div>
            <span className={`${s.securityBadge} ${item.badgeCls}`}>{item.badge}</span>
            <span className={s.securityItemArrow}>›</span>
          </div>
        ))}

        <div className={s.divider} />

        {/* Active sessions */}
        <div>
          <label className={s.formLabel} style={{ display: "block", marginBottom: 10 }}>Sessões Ativas</label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SESSIONS.map((session, i) => (
              <div key={i} className={s.sessionItem}>
                <div className={s.sessionDeviceIcon}>
                  {session.os.startsWith("iOS") ? "◎" : session.os.startsWith("macOS") ? "◈" : "◆"}
                </div>
                <div className={s.sessionInfo}>
                  <div className={s.sessionDevice}>{session.device}</div>
                  <div className={s.sessionMeta}>{session.os} · {session.ip}</div>
                </div>
                {session.current
                  ? <span className={s.sessionCurrent}>Esta sessão</span>
                  : <button className={s.btnRevoke}>Revogar</button>
                }
              </div>
            ))}
          </div>
        </div>

        <div className={s.divider} />

        {/* Login history */}
        <div>
          <label className={s.formLabel} style={{ display: "block", marginBottom: 10 }}>Histórico de Login</label>
          <div className={s.historyList}>
            {LOGIN_HISTORY.map((h, i) => (
              <div key={i} className={s.historyItem}>
                <div
                  className={s.historyDot}
                  style={{
                    background: h.ok ? "var(--success)" : "var(--danger)",
                    boxShadow: `0 0 6px ${h.ok ? "var(--success)" : "var(--danger)"}`,
                  }}
                />
                <div className={s.historyInfo}>
                  <div className={s.historyEvent}>{h.event}</div>
                  <div className={s.historyTime}>{h.time}</div>
                </div>
                <span className={s.historyIp}>{h.ip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PREFERENCES SECTION ──────────────────────────────────────────────────────

function PreferencesSection() {
  const [theme, setTheme]     = useState("dark");
  const [language, setLang]   = useState("pt-BR");
  const [toggles, setToggles] = useState({
    email_vendas:    true,
    email_estoque:   true,
    email_sistema:   false,
    push_alerts:     true,
    digest_semanal:  false,
    relatorio_mensal: true,
  });

  const toggle = (key) => setToggles(p => ({ ...p, [key]: !p[key] }));

  const THEMES = [
    { key: "dark",    label: "Escuro",    preview: "linear-gradient(135deg,#0B0B0F,#1C1C23)" },
    { key: "darker",  label: "Midnight",  preview: "linear-gradient(135deg,#060608,#111117)" },
    { key: "light",   label: "Claro",     preview: "linear-gradient(135deg,#F8F6F2,#EDE8DF)" },
  ];

  return (
    <div className={s.sectionCard} data-card style={{ gridColumn: "1 / -1" }}>
      <div className={s.sectionHeader}>
        <div className={s.sectionHeaderLeft}>
          <div className={s.sectionIconWrap}>◇</div>
          <div>
            <div className={s.sectionTitle}>Preferências do Sistema</div>
            <div className={s.sectionSubtitle}>Tema, notificações e idioma</div>
          </div>
        </div>
        <button className={s.btnSave}>Salvar</button>
      </div>

      <div className={s.sectionBody}>
        <div className={s.formRow}>
          {/* Theme */}
          <div className={s.formGroup}>
            <label className={s.formLabel}>Tema da Interface</label>
            <div className={s.themeOptions}>
              {THEMES.map(t => (
                <div
                  key={t.key}
                  className={`${s.themeOption} ${theme === t.key ? s.themeOptionActive : ""}`}
                  onClick={() => setTheme(t.key)}
                >
                  <div
                    className={s.themePreview}
                    style={{ background: t.preview }}
                  />
                  <span className={s.themeLabel}>{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className={s.formGroup}>
            <label className={s.formLabel}>Idioma</label>
            <div className={s.inputWrap}>
              <span className={s.inputIcon}>◆</span>
              <select
                className={s.formSelect}
                value={language}
                onChange={e => setLang(e.target.value)}
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>

            <label className={s.formLabel} style={{ marginTop: 14 }}>Formato de Data</label>
            <div className={s.inputWrap}>
              <span className={s.inputIcon}>◈</span>
              <select className={s.formSelect} defaultValue="dd/mm/yyyy">
                <option>DD/MM/AAAA</option>
                <option>MM/DD/AAAA</option>
                <option>AAAA-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        <div className={s.divider} />

        {/* Notifications */}
        <div>
          <label className={s.formLabel} style={{ display: "block", marginBottom: 14 }}>Notificações</label>
          <div className={s.notifGrid}>
            {[
              { key: "email_vendas",    label: "E-mail: Novas Vendas" },
              { key: "email_estoque",   label: "E-mail: Estoque Baixo" },
              { key: "email_sistema",   label: "E-mail: Atualizações do Sistema" },
              { key: "push_alerts",     label: "Push: Alertas Críticos" },
              { key: "digest_semanal",  label: "Digest Semanal" },
              { key: "relatorio_mensal",label: "Relatório Mensal" },
            ].map(n => (
              <div key={n.key} className={s.notifItem}>
                <span className={s.notifItemName}>{n.label}</span>
                <label className={s.toggle}>
                  <input
                    type="checkbox"
                    className={s.toggleInput}
                    checked={toggles[n.key]}
                    onChange={() => toggle(n.key)}
                  />
                  <span className={s.toggleSlider} />
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className={s.divider} />

        {/* More toggles */}
        <div>
          <label className={s.formLabel} style={{ display: "block", marginBottom: 12 }}>Comportamento</label>
          {[
            { label: "Confirmação antes de exclusões",    desc: "Exibir modal de confirmação ao excluir itens", key: "confirm_delete",  defaultChecked: true  },
            { label: "Modo compacto de listagem",         desc: "Reduzir espaçamento nas tabelas de produtos",  key: "compact_mode",    defaultChecked: false },
            { label: "Autosalvar rascunhos",              desc: "Salvar automaticamente formulários em edição", key: "autosave",        defaultChecked: true  },
          ].map((item, i) => (
            <div key={i} className={s.toggleRow}>
              <div className={s.toggleInfo}>
                <span className={s.toggleName}>{item.label}</span>
                <span className={s.toggleDesc}>{item.desc}</span>
              </div>
              <label className={s.toggle}>
                <input type="checkbox" className={s.toggleInput} defaultChecked={item.defaultChecked} />
                <span className={s.toggleSlider} />
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── DANGER ZONE ─────────────────────────────────────────────────────────────

function DangerZone() {
  return (
    <div className={`${s.dangerZone} ${s.contentGridFull}`} data-card>
      <div className={s.dangerZoneText}>
        <div className={s.dangerZoneTitle}>Zona de Perigo</div>
        <div className={s.dangerZoneDesc}>
          Ações irreversíveis. A desativação da conta remove todos os acessos imediatamente.
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
        <button className={s.btnDanger}>Exportar Dados</button>
        <button className={s.btnDanger}>Desativar Conta</button>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function AzoryAccount() {
  const mainRef = useRef();

  useGSAP(() => {
    // Topbar
    gsap.from("[data-topbar]", {
      opacity: 0, y: -10, filter: "blur(4px)",
      duration: 0.7, ease: "power3.out",
    });

    // Hero
    gsap.from("[data-hero]", {
      opacity: 0, y: 20, filter: "blur(6px)",
      duration: 0.8, ease: "power2.out", delay: 0.15,
    });

    // Stat chips stagger
    gsap.from("[data-stat]", {
      opacity: 0, y: 10,
      duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.45,
    });

    // Section cards stagger
    gsap.from("[data-card]", {
      opacity: 0, y: 24, filter: "blur(4px)",
      duration: 0.65, stagger: 0.12, ease: "power2.out", delay: 0.55,
    });
  }, { scope: mainRef });

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Jost:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div className={s.root}>
        <Sidebar />

        <main ref={mainRef} className={s.main}>
          {/* Topbar */}
          <div className={s.topbar} data-topbar>
            <div className={s.topbarLeft}>
              <div className={s.topbarCrumb}>AZORY · SISTEMA DE JOALHERIA</div>
              <h1 className={s.topbarTitle}>Minha Conta</h1>
            </div>
            <div className={s.topbarRight}>
              <div className={s.topbarBadge}>
                <span className={s.topbarBadgeDot} />
                Sistema Operacional
              </div>
              <div className={s.topbarBadge}>◆ v2.4.1</div>
            </div>
          </div>

          {/* Profile hero */}
          <ProfileHero />

          {/* Main content */}
          <div className={s.contentGrid}>
            <PersonalInfo />
            <SecuritySection />
            <PreferencesSection />
            <DangerZone />
          </div>
        </main>
      </div>
    </>
  );
}
