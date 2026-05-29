/**
 * Azory Luxury Jewelry — Minha Conta
 * AccountPage.jsx
 *
 * Stack: React 18 · CSS Modules · useGSAP (via @gsap/react)
 * Install:  npm install gsap @gsap/react
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import styles from "./styles.module.css";

/* ─────────────────────────────────────────
   Mock admin data
───────────────────────────────────────── */
const INITIAL_DATA = {
  firstName: "Isabella",
  lastName: "Monteiro",
  email: "isabella.monteiro@azory.com",
  phone: "+55 (11) 99234-8801",
  username: "isabella.admin",
  role: "Administradora de Estoque",
  lastAccess: "Hoje às 09:14",
  joinedAt: "março de 2021",
  productsCount: 1_847,
  monthsActive: 38,
  initials: "IM",
};

/* ─────────────────────────────────────────
   Icons (inline SVG — zero deps)
───────────────────────────────────────── */
const Icon = {
  Mail: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  ),
  Clock: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Edit: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Eye: ({ off }) => off ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  Upload: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Diamond: () => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth=".6" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="32,4 60,24 32,60 4,24"/>
      <polygon points="32,4 48,24 32,40 16,24"/>
      <line x1="4" y1="24" x2="60" y2="24"/>
    </svg>
  ),
};

/* ─────────────────────────────────────────
   Password strength helper
───────────────────────────────────────── */
function calcStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "transparent" };
  let s = 0;
  if (pw.length >= 8)  s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const map = [
    null,
    { label: "Fraca",    color: "#C0392B", pct: "25%" },
    { label: "Razoável", color: "#D4A017", pct: "50%" },
    { label: "Boa",      color: "#27AE60", pct: "75%" },
    { label: "Forte",    color: "#2ECC71", pct: "100%" },
  ];
  return map[s] || map[1];
}

/* ─────────────────────────────────────────
   Reusable Field
───────────────────────────────────────── */
function Field({ label, value, onChange, disabled, type = "text", placeholder }) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{label}</label>
      <input
        className={styles.fieldInput}
        type={type}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   PasswordField (with eye toggle + strength)
───────────────────────────────────────── */
function PasswordField({ label, value, onChange, disabled, showStrength }) {
  const [show, setShow] = useState(false);
  const strength = showStrength ? calcStrength(value) : null;

  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{label}</label>
      <div className={styles.fieldWrap}>
        <input
          className={styles.fieldInput}
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          disabled={disabled}
          autoComplete="new-password"
          placeholder={disabled ? "••••••••" : ""}
        />
        {!disabled && (
          <button className={styles.eyeBtn} type="button" onClick={() => setShow(v => !v)} aria-label="Mostrar senha">
            <Icon.Eye off={show} />
          </button>
        )}
      </div>
      {showStrength && value && (
        <>
          <div className={styles.strengthBar}>
            <div className={styles.strengthFill} style={{ width: strength.pct, background: strength.color }} />
          </div>
          <span className={styles.strengthLabel} style={{ color: strength.color }}>
            Força da senha: {strength.label}
          </span>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Toast
───────────────────────────────────────── */
function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className={styles.toast}>
      <span className={styles.toastDot} />
      {message}
    </div>
  );
}

/* ─────────────────────────────────────────
   AccountPage
───────────────────────────────────────── */
export default function AccountPage() {
  const data = INITIAL_DATA;

  /* edit states */
  const [editInfo,  setEditInfo]  = useState(false);
  const [editPass,  setEditPass]  = useState(false);
  const [editPhoto, setEditPhoto] = useState(false);

  /* info form */
  const [info, setInfo] = useState({
    firstName: data.firstName,
    lastName:  data.lastName,
    email:     data.email,
    phone:     data.phone,
    username:  data.username,
  });
  const setInfoField = key => val => setInfo(p => ({ ...p, [key]: val }));

  /* password form */
  const [pass, setPass] = useState({ current: "", next: "", confirm: "" });
  const setPassField = key => val => setPass(p => ({ ...p, [key]: val }));

  /* photo */
  const [photoSrc, setPhotoSrc] = useState(null);
  const fileRef   = useRef(null);

  /* toast */
  const [toast, setToast] = useState(null);
  const fireToast = msg => setToast(msg);

  /* save handlers */
  const saveInfo = useCallback(() => {
    setEditInfo(false);
    fireToast("Informações atualizadas com sucesso.");
  }, []);

  const savePass = useCallback(() => {
    if (!pass.current || !pass.next) return fireToast("Preencha todos os campos.");
    if (pass.next !== pass.confirm) return fireToast("As senhas não coincidem.");
    setPass({ current: "", next: "", confirm: "" });
    setEditPass(false);
    fireToast("Senha alterada com sucesso.");
  }, [pass]);

  const handleFileChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setPhotoSrc(ev.target.result); fireToast("Foto atualizada."); };
    reader.readAsDataURL(file);
  };

  /* ── GSAP refs ── */
  const bannerRef = useRef(null);
  const stat0     = useRef(null);
  const stat1     = useRef(null);
  const card0     = useRef(null);
  const card1     = useRef(null);
  const card2     = useRef(null);

  /* ── GSAP entrance ── */
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(bannerRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: .7 }
    )
    .fromTo([stat0.current, stat1.current],
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: .5, stagger: .12 },
      "-=.2"
    )
    .fromTo([card0.current, card1.current, card2.current],
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: .55, stagger: .14 },
      "-=.2"
    );
  }, []);

  /* ── Card glow on edit activate ── */
  const animateCard = (ref) => {
    gsap.fromTo(ref.current,
      { boxShadow: "0 0 0px rgba(212,175,110,0)" },
      { boxShadow: "0 0 28px rgba(212,175,110,0.15), 0 0 0 1px rgba(212,175,110,0.4)", duration: .4, ease: "power2.out" }
    );
  };

  /* ── Number counter for stats ── */
  const numRef0 = useRef(null);
  const numRef1 = useRef(null);
  useGSAP(() => {
    const obj = { v: 0 };
    gsap.to(obj, {
      v: data.productsCount, duration: 1.6, delay: .7, ease: "power2.out",
      onUpdate: () => {
        if (numRef0.current) numRef0.current.textContent = Math.round(obj.v).toLocaleString("pt-BR");
      }
    });
    const obj2 = { v: 0 };
    gsap.to(obj2, {
      v: data.monthsActive, duration: 1.2, delay: .85, ease: "power2.out",
      onUpdate: () => {
        if (numRef1.current) numRef1.current.textContent = Math.round(obj2.v);
      }
    });
  }, []);

  return (
    <div className={styles.page}>

      {/* ── Banner ── */}
      <div className={styles.banner} ref={bannerRef}>
        <div className={styles.bannerLines} />
        <div className={styles.cornerOrnament}><Icon.Diamond /></div>

        <div className={styles.bannerInner}>
          {/* Avatar */}
          <div className={styles.avatarWrap}>
            <div className={styles.avatarRing} onClick={() => fileRef.current?.click()}>
              <div className={styles.avatarInner}>
                {photoSrc ? <img src={photoSrc} alt="Admin" /> : data.initials}
              </div>
            </div>
            <div className={styles.statusDot} title="Online" />
          </div>

          {/* Text */}
          <div className={styles.bannerText}>
            <h1 className={styles.bannerName}>{info.firstName} {info.lastName}</h1>
            <p className={styles.bannerRole}>{data.role}</p>
            <div className={styles.bannerMeta}>
              <div className={styles.metaRow}>
                <Icon.Mail />
                <span>{info.email}</span>
              </div>
              <div className={styles.metaRow}>
                <Icon.Clock />
                Último acesso: <span>{data.lastAccess}</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            className={styles.editProfileBtn}
            onClick={() => { setEditInfo(true); card0.current?.scrollIntoView({ behavior: "smooth", block: "center" }); animateCard(card0); }}
          >
            <Icon.Edit />
            Editar Perfil
          </button>
        </div>

        {/* Stats */}
        <div className={styles.bannerStats}>
          <div className={styles.statItem} ref={stat0}>
            <span className={styles.statNum} ref={numRef0}>0</span>
            <span className={styles.statLabel}>Produtos cadastrados</span>
          </div>
          <div className={styles.statItem} ref={stat1}>
            <span className={styles.statNum}><span ref={numRef1}>0</span> meses</span>
            <span className={styles.statLabel}>No sistema · desde {data.joinedAt}</span>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className={styles.content}>

        {/* ─ Informações Pessoais ─ */}
        <section>
          <p className={styles.sectionLabel}>Informações Pessoais</p>
          <div className={styles.card} ref={card0}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Dados da conta</span>
              <button
                className={`${styles.editBtn} ${editInfo ? styles.active : ""}`}
                onClick={() => { setEditInfo(v => !v); if (!editInfo) animateCard(card0); }}
              >
                <Icon.Edit /> {editInfo ? "Editando" : "Editar"}
              </button>
            </div>

            <div className={styles.formGrid}>
              <Field label="Nome" value={info.firstName} onChange={setInfoField("firstName")} disabled={!editInfo} />
              <Field label="Sobrenome" value={info.lastName} onChange={setInfoField("lastName")} disabled={!editInfo} />
              <Field label="E-mail" value={info.email} onChange={setInfoField("email")} disabled={!editInfo} type="email" />
              <Field label="Telefone" value={info.phone} onChange={setInfoField("phone")} disabled={!editInfo} />
              <div className={styles.formGridFull}>
                <Field label="Usuário" value={info.username} onChange={setInfoField("username")} disabled={!editInfo} />
              </div>
            </div>

            {editInfo && (
              <div className={styles.saveRow}>
                <button className={styles.btnSecondary} onClick={() => setEditInfo(false)}>Cancelar</button>
                <button className={styles.btnPrimary} onClick={saveInfo}>Salvar Alterações</button>
              </div>
            )}
          </div>
        </section>

        {/* ─ Alteração de Senha ─ */}
        <section>
          <p className={styles.sectionLabel}>Segurança</p>
          <div className={styles.card} ref={card1}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Alterar senha</span>
              <button
                className={`${styles.editBtn} ${editPass ? styles.active : ""}`}
                onClick={() => { setEditPass(v => !v); if (!editPass) animateCard(card1); }}
              >
                <Icon.Edit /> {editPass ? "Editando" : "Editar"}
              </button>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGridFull}>
                <PasswordField
                  label="Senha atual"
                  value={pass.current}
                  onChange={setPassField("current")}
                  disabled={!editPass}
                />
              </div>
              <PasswordField
                label="Nova senha"
                value={pass.next}
                onChange={setPassField("next")}
                disabled={!editPass}
                showStrength
              />
              <PasswordField
                label="Confirmar nova senha"
                value={pass.confirm}
                onChange={setPassField("confirm")}
                disabled={!editPass}
              />
            </div>

            {editPass && (
              <div className={styles.saveRow}>
                <button className={styles.btnSecondary} onClick={() => { setEditPass(false); setPass({ current: "", next: "", confirm: "" }); }}>Cancelar</button>
                <button className={styles.btnPrimary} onClick={savePass}>Atualizar Senha</button>
              </div>
            )}
          </div>
        </section>

        {/* ─ Foto de Perfil ─ */}
        <section>
          <p className={styles.sectionLabel}>Foto de Perfil</p>
          <div className={styles.card} ref={card2}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Imagem da conta</span>
              <button
                className={`${styles.editBtn} ${editPhoto ? styles.active : ""}`}
                onClick={() => { setEditPhoto(v => !v); if (!editPhoto) animateCard(card2); }}
              >
                <Icon.Edit /> {editPhoto ? "Editando" : "Editar"}
              </button>
            </div>

            <div className={styles.photoRow}>
              <div className={styles.photoPreview} onClick={editPhoto ? () => fileRef.current?.click() : undefined} style={{ cursor: editPhoto ? "pointer" : "default" }}>
                {photoSrc ? <img src={photoSrc} alt="Foto de perfil" /> : data.initials}
              </div>
              <div className={styles.photoActions}>
                <p className={styles.photoHint}>
                  Foto exibida no painel e relatórios.<br />
                  Recomendado: quadrada, mínimo 200×200 px.
                </p>
                {editPhoto && (
                  <button className={styles.btnSecondary} style={{ alignSelf: "flex-start" }} onClick={() => fileRef.current?.click()}>
                    Escolher foto
                  </button>
                )}
              </div>
            </div>

            {editPhoto && (
              <div
                className={styles.uploadZone}
                onClick={() => fileRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = ev => { setPhotoSrc(ev.target.result); fireToast("Foto atualizada."); };
                  reader.readAsDataURL(file);
                }}
              >
                <div className={styles.uploadIcon}><Icon.Upload /></div>
                <p className={styles.uploadText}><strong>Clique para enviar</strong> ou arraste a imagem aqui</p>
                <p className={styles.uploadSub}>PNG, JPG, WEBP · máx 4 MB</p>
              </div>
            )}
          </div>
        </section>

      </div>

      {/* hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}