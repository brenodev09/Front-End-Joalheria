import React, { useState, useEffect, useRef } from 'react';
import { FiCamera, FiEye, FiEyeOff } from 'react-icons/fi';
import { gsap } from 'gsap';
import './LuxuryRegister.css'; // Importe o CSS gerado acima

const LuxuryRegister = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [strength, setStrength] = useState({ width: '0%', color: 'transparent' });

  // Referências para animações GSAP
  const heroRef = useRef(null);
  const formRef = useRef(null);
  const fieldsRef = useRef([]);

  useEffect(() => {
    // Animação de entrada suave com GSAP
    gsap.fromTo(heroRef.current, 
      { opacity: 0, x: -50 }, 
      { opacity: 1, x: 0, duration: 1.2, ease: "power3.out" }
    );

    gsap.fromTo(formRef.current, 
      { opacity: 0, scale: 0.95 }, 
      { opacity: 1, scale: 1, duration: 1, delay: 0.3, ease: "power3.out" }
    );

    gsap.fromTo(fieldsRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.6, ease: "power2.out" }
    );
  }, []);

  const evaluatePassword = (pass) => {
    let score = 0;
    if (pass.length > 5) score += 1;
    if (pass.length > 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch(score) {
      case 0: return { width: '0%', color: 'transparent' };
      case 1: return { width: '20%', color: '#ff4d4d' }; // Fraca
      case 2: return { width: '40%', color: '#ff8c1a' }; // Razoável
      case 3: return { width: '60%', color: '#F3E5AB' }; // Boa
      case 4: return { width: '80%', color: '#D4AF37' }; // Forte
      case 5: return { width: '100%', color: '#00ff80' }; // Muito forte
      default: return { width: '0%', color: 'transparent' };
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: val }));
    
    // Limpar erro em tempo real
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));

    if (name === 'password') {
      setStrength(evaluatePassword(value));
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Nome é obrigatório';
    if (!formData.email.includes('@')) newErrors.email = 'E-mail inválido';
    if (formData.password.length < 6) newErrors.password = 'A senha deve ter no mínimo 6 caracteres';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'As senhas não coincidem';
    if (!formData.terms) newErrors.terms = 'Você deve aceitar os termos';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Animação de erro (shake)
      gsap.fromTo(formRef.current, 
        { x: -10 }, 
        { x: 10, duration: 0.1, yoyo: true, repeat: 3, onComplete: () => gsap.set(formRef.current, {x: 0}) }
      );
    } else {
      console.log('Dados enviados:', formData);
      alert('Cadastro realizado com sucesso na plataforma Premium!');
    }
  };

  const addToRefs = (el) => {
    if (el && !fieldsRef.current.includes(el)) {
      fieldsRef.current.push(el);
    }
  };

  return (
    <div className="luxury-container">
      
      {/* Lado Esquerdo - Hero */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content" ref={heroRef}>
          <h1 className="hero-title">AURELIA</h1>
          <p className="hero-subtitle">Gestão de joias e coleções exclusivas.</p>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="form-section">
        <div className="glass-card" ref={formRef}>
          <div className="form-header" ref={addToRefs}>
            <h2>Criar Conta</h2>
            <p>Junte-se ao nosso sistema de gestão de luxo.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            
            {/* Upload de Foto */}
            <div className="photo-upload-container" ref={addToRefs}>
              <label className="photo-preview" htmlFor="photo-upload">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" />
                ) : (
                  <FiCamera className="photo-icon" />
                )}
              </label>
              <input 
                id="photo-upload" 
                type="file" 
                accept="image/*" 
                onChange={handlePhotoUpload} 
                style={{ display: 'none' }} 
              />
            </div>

            <div className="input-row">
              <div className="input-group" ref={addToRefs}>
                <input 
                  type="text" 
                  name="fullName" 
                  value={formData.fullName} 
                  onChange={handleChange}
                  className={formData.fullName ? 'has-val' : ''} 
                  required
                />
                <label>Nome Completo</label>
                {errors.fullName && <span className="error-msg">{errors.fullName}</span>}
              </div>

              <div className="input-group" ref={addToRefs}>
                <input 
                  type="text" 
                  name="username" 
                  value={formData.username} 
                  onChange={handleChange}
                  className={formData.username ? 'has-val' : ''} 
                  required
                />
                <label>Username</label>
              </div>
            </div>

            <div className="input-group" ref={addToRefs}>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange}
                className={formData.email ? 'has-val' : ''} 
                required
              />
              <label>E-mail Corporativo</label>
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>

            <div className="input-row">
              <div className="input-group" ref={addToRefs}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange}
                  className={formData.password ? 'has-val' : ''} 
                  required
                />
                <label>Senha</label>
                <button type="button" className="icon-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
                <div className="password-strength">
                  <div className="strength-bar" style={{ width: strength.width, backgroundColor: strength.color }}></div>
                </div>
                {errors.password && <span className="error-msg">{errors.password}</span>}
              </div>

              <div className="input-group" ref={addToRefs}>
                <input 
                  type={showConfirm ? "text" : "password"} 
                  name="confirmPassword" 
                  value={formData.confirmPassword} 
                  onChange={handleChange}
                  className={formData.confirmPassword ? 'has-val' : ''} 
                  required
                />
                <label>Confirmar Senha</label>
                <button type="button" className="icon-btn" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <FiEyeOff /> : <FiEye />}
                </button>
                {errors.confirmPassword && <span className="error-msg">{errors.confirmPassword}</span>}
              </div>
            </div>

            <div className="terms-group" ref={addToRefs}>
              <input 
                type="checkbox" 
                name="terms" 
                id="terms" 
                checked={formData.terms}
                onChange={handleChange}
              />
              <label htmlFor="terms">
                Concordo com os <a href="#terms">Termos de Privacidade</a> e condições de uso.
              </label>
              {errors.terms && <span className="error-msg" style={{bottom: '-15px'}}>{errors.terms}</span>}
            </div>

            <div ref={addToRefs}>
              <button type="submit" className="submit-btn">
                Solicitar Acesso
              </button>
            </div>

            <div className="login-link" ref={addToRefs}>
              Já possui conta? <a href="#login">Entrar no Sistema</a>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default LuxuryRegister;