import { useState, useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import styles from "./Register.module.css";

const STEPS = ["Dados Pessoais", "Segurança", "Finalização"];

const EYE_OPEN = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EYE_CLOSED = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

function GoldParticles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const count = 55;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      opacity: Math.random() * 0.5 + 0.1,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.008 + 0.003,
    }));

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.pulse += p.pulseSpeed;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        const alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,175,55,${alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className={styles.particles} />;
}

function FloatingInput({ id, label, type = "text", value, onChange, error, autoComplete, suffix }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div className={`${styles.fieldWrap} ${error ? styles.fieldError : ""}`}>
      <label htmlFor={id} className={`${styles.label} ${active ? styles.labelUp : ""}`}>{label}</label>
      <input
        id={id} type={type} value={value} autoComplete={autoComplete}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`${styles.input} ${active ? styles.inputActive : ""}`}
      />
      {suffix && <span className={styles.inputSuffix}>{suffix}</span>}
      {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  );
}

function PasswordInput({ id, label, value, onChange, error, autoComplete }) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div className={`${styles.fieldWrap} ${error ? styles.fieldError : ""}`}>
      <label htmlFor={id} className={`${styles.label} ${active ? styles.labelUp : ""}`}>{label}</label>
      <input
        id={id} type={show ? "text" : "password"} value={value} autoComplete={autoComplete}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`${styles.input} ${styles.inputPwd} ${active ? styles.inputActive : ""}`}
      />
      <button type="button" className={styles.eyeBtn} onClick={() => setShow(s => !s)} tabIndex={-1}
        aria-label={show ? "Ocultar senha" : "Mostrar senha"}>
        {show ? EYE_OPEN : EYE_CLOSED}
      </button>
      {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  );
}

function StrengthBar({ password }) {
  const score = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();
  const labels = ["", "Fraca", "Regular", "Boa", "Forte"];
  const colors = ["", "#c0392b", "#e67e22", "#f1c40f", "#27ae60"];
  return (
    <div className={styles.strengthWrap}>
      <div className={styles.strengthBars}>
        {[1,2,3,4].map(i => (
          <div key={i} className={styles.strengthSeg}
            style={{ background: i <= score ? colors[score] : "rgba(212,175,55,0.12)" }} />
        ))}
      </div>
      {password && <span className={styles.strengthLabel} style={{ color: colors[score] }}>{labels[score]}</span>}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className={styles.checkSvg} viewBox="0 0 52 52">
      <circle className={styles.checkCircle} cx="26" cy="26" r="25" fill="none"/>
      <path className={styles.checkMark} fill="none" d="M14 27l8 8 16-16"/>
    </svg>
  );
}

export default function Register() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    nome: "", sobrenome: "", email: "", telefone: "",
    usuario: "", senha: "", confirmar: "",
    termo: false, newsletter: false,
  });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  const cardRef = useRef(null);
  const contentRef = useRef(null);
  const progressRef = useRef(null);
  const titleRef = useRef(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 60, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: "power3.out", delay: 0.2 }
    );
    gsap.fromTo(titleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.6 }
    );
  }, []);

  const animateStep = useCallback((dir = 1) => {
    const el = contentRef.current;
    gsap.fromTo(el,
      { opacity: 0, x: dir * 40 },
      { opacity: 1, x: 0, duration: 0.45, ease: "power2.out" }
    );
  }, []);

  useEffect(() => {
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: `${((step) / (STEPS.length - 1)) * 100}%`,
        duration: 0.6, ease: "power2.inOut"
      });
    }
  }, [step]);

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!form.nome.trim()) e.nome = "Nome obrigatório";
      if (!form.sobrenome.trim()) e.sobrenome = "Sobrenome obrigatório";
      if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "E-mail inválido";
      if (!form.telefone.trim()) e.telefone = "Telefone obrigatório";
    }
    if (step === 1) {
      if (!form.usuario.trim() || form.usuario.length < 4) e.usuario = "Mínimo 4 caracteres";
      if (form.senha.length < 8) e.senha = "Mínimo 8 caracteres";
      if (form.confirmar !== form.senha) e.confirmar = "Senhas não coincidem";
    }
    if (step === 2) {
      if (!form.termo) e.termo = "Aceite os termos para continuar";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
      animateStep(1);
    } else {
      setDone(true);
    }
  };

  const prev = () => {
    if (step > 0) { setStep(s => s - 1); animateStep(-1); }
  };

  const phoneMask = v => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`;
    return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  };

  return (
    <div className={styles.root}>
      <GoldParticles />
      <div className={styles.ambient} />

      {!done ? (
        <div className={styles.card} ref={cardRef}>
          <div className={styles.cardShine} />
          <div className={styles.cardGlassEdge} />

          <div className={styles.brand} ref={titleRef}>
            <div className={styles.brandLogo}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <polygon points="16,2 30,10 30,22 16,30 2,22 2,10" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.7"/>
                <polygon points="16,6 26,12 26,20 16,26 6,20 6,12" stroke="#D4AF37" strokeWidth="0.5" fill="none" opacity="0.4"/>
                <circle cx="16" cy="16" r="3" fill="#D4AF37" opacity="0.9"/>
              </svg>
            </div>
            <div>
              <h1 className={styles.brandName}>LUMIÈRE</h1>
              <p className={styles.brandSub}>Sistema de Joalheria &amp; Estoque</p>
            </div>
          </div>

          <div className={styles.progressWrap}>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} ref={progressRef} />
            </div>
            <div className={styles.stepLabels}>
              {STEPS.map((s, i) => (
                <span key={i} className={`${styles.stepLabel} ${i === step ? styles.stepActive : ""} ${i < step ? styles.stepDone : ""}`}>
                  <span className={styles.stepDot}>{i < step ? "✓" : i + 1}</span>
                  <span className={styles.stepName}>{s}</span>
                </span>
              ))}
            </div>
          </div>

          <div className={styles.formContent} ref={contentRef}>
            {step === 0 && (
              <div className={styles.stepGrid}>
                <h2 className={styles.stepTitle}>Seus Dados</h2>
                <p className={styles.stepDesc}>Informe seus dados pessoais para criar sua conta exclusiva.</p>
                <div className={styles.row}>
                  <FloatingInput id="nome" label="Nome" value={form.nome} onChange={v => set("nome", v)} error={errors.nome} autoComplete="given-name" />
                  <FloatingInput id="sobrenome" label="Sobrenome" value={form.sobrenome} onChange={v => set("sobrenome", v)} error={errors.sobrenome} autoComplete="family-name" />
                </div>
                <FloatingInput id="email" label="E-mail" type="email" value={form.email} onChange={v => set("email", v)} error={errors.email} autoComplete="email" />
                <FloatingInput id="telefone" label="Telefone" value={form.telefone}
                  onChange={v => set("telefone", phoneMask(v))} error={errors.telefone} autoComplete="tel" />
              </div>
            )}
            {step === 1 && (
              <div className={styles.stepGrid}>
                <h2 className={styles.stepTitle}>Segurança</h2>
                <p className={styles.stepDesc}>Crie credenciais seguras para proteger seu acesso.</p>
                <FloatingInput id="usuario" label="Nome de usuário" value={form.usuario} onChange={v => set("usuario", v)} error={errors.usuario} autoComplete="username" />
                <PasswordInput id="senha" label="Senha" value={form.senha} onChange={v => set("senha", v)} error={errors.senha} autoComplete="new-password" />
                <StrengthBar password={form.senha} />
                <PasswordInput id="confirmar" label="Confirmar senha" value={form.confirmar} onChange={v => set("confirmar", v)} error={errors.confirmar} autoComplete="new-password" />
              </div>
            )}
            {step === 2 && (
              <div className={styles.stepGrid}>
                <h2 className={styles.stepTitle}>Finalização</h2>
                <p className={styles.stepDesc}>Revise e confirme para ativar sua conta no sistema.</p>
                <div className={styles.reviewCard}>
                  <div className={styles.reviewRow}><span>Nome</span><span>{form.nome} {form.sobrenome}</span></div>
                  <div className={styles.reviewRow}><span>E-mail</span><span>{form.email}</span></div>
                  <div className={styles.reviewRow}><span>Telefone</span><span>{form.telefone}</span></div>
                  <div className={styles.reviewRow}><span>Usuário</span><span>@{form.usuario}</span></div>
                </div>
                <label className={styles.checkLabel}>
                  <input type="checkbox" checked={form.termo} onChange={e => set("termo", e.target.checked)} className={styles.checkInput} />
                  <span className={styles.checkBox}>{form.termo && "✓"}</span>
                  <span>Aceito os <a href="#" className={styles.link}>Termos de Uso</a> e a <a href="#" className={styles.link}>Política de Privacidade</a></span>
                </label>
                {errors.termo && <span className={styles.errorMsg}>{errors.termo}</span>}
                <label className={styles.checkLabel}>
                  <input type="checkbox" checked={form.newsletter} onChange={e => set("newsletter", e.target.checked)} className={styles.checkInput} />
                  <span className={styles.checkBox}>{form.newsletter && "✓"}</span>
                  <span>Receber atualizações e novidades por e-mail</span>
                </label>
              </div>
            )}
          </div>

          <div className={styles.actions}>
            {step > 0 && (
              <button type="button" className={styles.btnBack} onClick={prev}>← Voltar</button>
            )}
            <button type="button" className={styles.btnPrimary} onClick={next}>
              <span className={styles.btnInner}>
                {step < STEPS.length - 1 ? "Continuar" : "Criar Conta"}
              </span>
              <span className={styles.btnShine} />
            </button>
          </div>

          <p className={styles.loginLink}>Já possui uma conta? <a href="#" className={styles.link}>Entrar agora</a></p>
        </div>
      ) : (
        <SuccessCard name={form.nome} />
      )}
    </div>
  );
}

function SuccessCard({ name }) {
  const ref = useRef(null);
  useEffect(() => {
    gsap.fromTo(ref.current, { opacity: 0, scale: 0.88, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: "back.out(1.4)" });
  }, []);
  return (
    <div className={`${styles.card} ${styles.cardSuccess}`} ref={ref}>
      <div className={styles.cardShine} />
      <div className={styles.successBody}>
        <CheckIcon />
        <h2 className={styles.successTitle}>Bem-vindo, {name}</h2>
        <p className={styles.successDesc}>Sua conta foi criada com sucesso.<br/>Você já pode acessar o sistema LUMIÈRE.</p>
        <a href="#" className={styles.btnPrimary} style={{ textDecoration: "none", display: "inline-flex", justifyContent: "center" }}>
          <span className={styles.btnInner}>Acessar o Sistema</span>
          <span className={styles.btnShine} />
        </a>
      </div>
    </div>
  );
}
