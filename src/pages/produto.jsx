import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Heart, Diamond, Shield, Award, Sparkles, Clock, Box, Share2, Star } from 'lucide-react';
import styles from "../styles/produto.module.css"

gsap.registerPlugin(ScrollTrigger);

export default function JewelryProduct() {
  const container = useRef(null);
  const heroImageRef = useRef(null);
  const galleryRef = useRef(null);
  const galleryTrackRef = useRef(null);
  const timelineRef = useRef(null);
  const progressLineRef = useRef(null);
  
  const [mousePos, setMousePos] = useState({ x: '50%', y: '50%' });

  useGSAP(() => {
    // 1. Animações Hero (Fade up e Reveal)
    const tlHero = gsap.timeline();
    tlHero.from('.hero-elem', {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.2
    });

    gsap.from(heroImageRef.current, {
      scale: 1.1,
      opacity: 0,
      duration: 1.5,
      ease: 'power2.out',
    });

    // 2. Horizontal Scroll Storytelling (Galeria)
    const galleryItems = gsap.utils.toArray('.gallery-item');
    gsap.to(galleryItems, {
      xPercent: -100 * (galleryItems.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: galleryRef.current,
        pin: true,
        scrub: 1,
        end: () => "+=" + galleryTrackRef.current.offsetWidth
      }
    });

    // 3. Reveal Exclusivity Grid
    gsap.from('.exclusivity-item', {
      scrollTrigger: {
        trigger: '.exclusivity-container',
        start: 'top 70%',
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out'
    });

    // 4. Timeline Draw
    gsap.to(progressLineRef.current, {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: timelineRef.current,
        start: 'top center',
        end: 'bottom center',
        scrub: 0.5
      }
    });

    const nodes = gsap.utils.toArray('.timeline-node');
    nodes.forEach((node) => {
      gsap.from(node, {
        scrollTrigger: {
          trigger: node,
          start: 'top 60%',
        },
        opacity: 0,
        x: node.dataset.side === 'left' ? -30 : 30,
        duration: 0.8
      });
    });

  }, { scope: container });

  // Efeito Parallax 3D no mouse hover (Hero)
    const handleHeroMouseMove = (e) => {
    if (!heroImageRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const xPos = (clientX / innerWidth - 0.5) * 15;
    const yPos = (clientY / innerHeight - 0.5) * -15;
    
    gsap.to(heroImageRef.current, { 
      rotationY: xPos, 
      rotationX: yPos, 
      ease: 'power2.out',
      duration: 1 
    });
  };

  const handleHeroMouseLeave = () => {
    gsap.to(heroImageRef.current, { rotationY: 0, rotationX: 0, duration: 1, ease: 'power2.out' });
  };

  // Spotlight Mouse Move (Seção Detalhe)
  const handleSpotlightMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x: `${x}%`, y: `${y}%` });
  };

  return (
    <div className={styles.container} ref={container}>
      
      {/* 1. HERO CINEMATOGRÁFICA */}
      <section 
        className={styles.hero} 
        onMouseMove={handleHeroMouseMove} 
        onMouseLeave={handleHeroMouseLeave}
      >
        <div className={styles.heroLeft}>
          <div className={`hero-elem ${styles.category}`}>Alta Joalheria</div>
          <h1 className={`hero-elem ${styles.titleSerif} ${styles.productTitle}`}>
            Aura Éternité
          </h1>
          <p className={`hero-elem ${styles.textSans} ${styles.description}`}>
            Um design transcendente forjado na interseção do tempo e do espaço. Diamantes lapidação brilhante meticulosamente cravados em ouro maciço 18k, criando uma constelação particular ao redor do seu pescoço.
          </p>
          
          <div className={`hero-elem ${styles.price}`}>R$ 45.900</div>

          <div className="hero-elem">
            <div className={styles.metaInfo} style={{ marginBottom: '1.5rem' }}>
              <span><Star size={14} fill="#C9A86A" color="#C9A86A"/> 4.9 (12 Avaliações)</span>
              <span><Box size={14}/> Em estoque (2 unidades)</span>
              <span><Clock size={14}/> Entrega em 48h</span>
            </div>

            <div className={styles.optionsGrid}>
              <div className={styles.optionBlock}>
                <label>Material</label>
                <select className={styles.selectPremium}>
                  <option>Ouro Amarelo 18k</option>
                  <option>Ouro Branco 18k</option>
                  <option>Ouro Rosa 18k</option>
                </select>
              </div>
              <div className={styles.optionBlock}>
                <label>Comprimento</label>
                <select className={styles.selectPremium}>
                  <option>40 cm</option>
                  <option>45 cm</option>
                  <option>50 cm</option>
                </select>
              </div>
            </div>
            
            <div className={styles.actions}>
              <button className={styles.btnPrimary}>Adicionar à Sacola</button>
              <button className={styles.btnSecondary} aria-label="Favoritar">
                <Heart size={20} />
              </button>
              <button className={styles.btnSecondary} aria-label="Compartilhar">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.glowBox}></div>
          <div className={styles.heroImageContainer} ref={heroImageRef}>
            <img 
              src="https://images.tcdn.com.br/img/img_prod/480877/medicina_colar_luxo_de_profissoes_folheado_a_ouro_1_20260506122042_1498753b3ef1.jpg" 
              alt="Colar Aura Éternité" 
            />
          </div>
        </div>
      </section>

      {/* 3. GALERIA HORIZONTAL PREMIUM */}
      <section className={styles.galleryWrapper} ref={galleryRef}>
        <div className={styles.galleryTrack} ref={galleryTrackRef}>
          {[
            "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop",
          ].map((src, index) => (
            <div key={index} className={`gallery-item ${styles.galleryItem}`}>
              <img src={src} alt={`Detalhe ${index + 1}`} />
            </div>
          ))}
        </div>
      </section>

      {/* 4. SEÇÃO DE EXCLUSIVIDADE */}
      <section className={`exclusivity-container ${styles.exclusivity}`}>
        <div className={styles.exclusivityGrid}>
          <div className={`exclusivity-item ${styles.exclusivityItem}`}>
            <div className={styles.iconWrapper}><Diamond size={32} /></div>
            <h4 className={styles.titleSerif}>Diamantes VVS1</h4>
            <p className={styles.textSans}>Claridade excepcional, pureza que reflete a luz absoluta.</p>
          </div>
          <div className={`exclusivity-item ${styles.exclusivityItem}`}>
            <div className={styles.iconWrapper}><Shield size={32} /></div>
            <h4 className={styles.titleSerif}>Garantia Vitalícia</h4>
            <p className={styles.textSans}>Manutenção e polimento gratuitos para toda a vida.</p>
          </div>
          <div className={`exclusivity-item ${styles.exclusivityItem}`}>
            <div className={styles.iconWrapper}><Award size={32} /></div>
            <h4 className={styles.titleSerif}>Certificação GIA</h4>
            <p className={styles.textSans}>Acompanha dossiê gemológico internacional de autenticidade.</p>
          </div>
          <div className={`exclusivity-item ${styles.exclusivityItem}`}>
            <div className={styles.iconWrapper}><Sparkles size={32} /></div>
            <h4 className={styles.titleSerif}>Feito à Mão</h4>
            <p className={styles.textSans}>Forjado por mestres ourives nos ateliês suíços.</p>
          </div>
        </div>
      </section>

      {/* 6. VISUALIZAÇÃO DETALHADA (SPOTLIGHT) */}
      <section 
        className={styles.spotlightSection} 
        onMouseMove={handleSpotlightMove}
        style={{ '--mouse-x': mousePos.x, '--mouse-y': mousePos.y }}
      >
        <img 
          src="https://images.tcdn.com.br/img/img_prod/1041603/colar_riviera_luxo_esmeralda_6214_2_147076980e32ac861a26c0d6746ebcf6.jpegc:\Users\Breno\Downloads\joalheria-produto-premium\joalheria-produto\src\pages\PaginaProduto\PaginaProduto.jsx" 
          alt="Base" 
          className={styles.spotlightImage} 
        />
        <div className={styles.spotlightMask}></div>
        <p className={styles.spotlightText}>Explore os Detalhes</p>
      </section>

      {/* 5. PROCESSO DE CRIAÇÃO (TIMELINE) */}
      <section className={styles.process}>
        <h2 className={`${styles.titleSerif} ${styles.processTitle}`}>O Nascimento de um Ícone</h2>
        <div className={styles.timeline} ref={timelineRef}>
          <div className={styles.timelineLine}></div>
          <div className={styles.timelineProgress} ref={progressLineRef}></div>
          
          {[
            { step: '01', title: 'O Esboço', desc: 'Semanas de desenho até encontrar a harmonia perfeita entre metal e pedra.', side: 'left' },
            { step: '02', title: 'A Fundição', desc: 'Ouro 18k fundido a 1.064°C, ganhando a forma exata imaginada pelos designers.', side: 'right' },
            { step: '03', title: 'A Cravação', desc: 'Sob microscópio, cada diamante é posicionado milimetricamente para maximizar o brilho.', side: 'left' },
            { step: '04', title: 'O Polimento', desc: 'Acabamento espelhado final que revela a verdadeira alma dourada da peça.', side: 'right' },
          ].map((item, i) => (
            <div key={i} className={`timeline-node ${styles.timelineNode}`} data-side={item.side}>
              <div className={styles.dot}></div>
              <div className={styles.content}>
                <span className={styles.category}>Etapa {item.step}</span>
                <h3 className={styles.titleSerif} style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{item.title}</h3>
                <p className={styles.textSans}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. CTA FINAL IMPACTANTE */}
      <section className={styles.ctaFinal}>
        <div className={styles.ctaGlow}></div>
        <h2 className={styles.titleSerif}>Uma joia criada para atravessar gerações.</h2>
        <button className={styles.btnPrimary} style={{ position: 'relative', zIndex: 3, maxWidth: '300px' }}>
          Adquirir Agora
        </button>
      </section>

    </div>
  );
}