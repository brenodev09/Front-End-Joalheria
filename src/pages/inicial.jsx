// import style from "../../styles/Admin/inicial.module.css";
// import styles from "../../styles/User/inicial.module.css"
import style from "../styles/Admin/inicial.module.css"
import styles from "../styles/User/inicial.module.css"
import Particulas from "../components/particulas";
import Header from "../components/Header";

import relogio from "../img/Destaques/relogio.png"
import colar from "../img/Destaques/colar.png"
import modelo from "../img/Destaques/modelo.png"

import { useAuth } from "../context/authContext"
import { useNavigate } from "react-router-dom";
import { api } from "../services/api"
import { useState, useRef, useEffect } from "react";


const ITENS_NAV = ["Coleções", "Alta Joalheria", "Ateliê", "Sobre Nós", "Contato"];

const JOIA_DESTAQUE = {
  imagem:
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=90&fit=crop",
  colecao: "Coleção Lumière",
  descricao: "Ouro 18k com diamantes lapidação brilhante — edição numerada",
};

const VIDEO_URL =
  "https://cdn.pixabay.com/video/2022/08/24/129177-743849729_large.mp4";

const IMAGEM_FALLBACK =
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&q=85&fit=crop"


export default function inicial() {


  const { usuario, estaLogado } = useAuth()
  const [destaques, setDestaques] = useState([])
  const navegar = useNavigate()

  const videoRef = useRef(null);
  const heroCamadaRef = useRef(null);
  const tituloPrincipalRef = useRef(null);
  const subtituloRef = useRef(null);
  const pretituloRef = useRef(null);
  const ctasRef = useRef(null);
  const cardJoiaRef = useRef(null);
  const linhaDecorativaRef = useRef(null);
  const scrollIndicadorRef = useRef(null);
  const [videoFalhou, setVideoFalhou] = useState(false);
  const [gsapCarregado, setGsapCarregado] = useState(false);

  // Carregar GSAP dinamicamente
  useEffect(() => {
    if (window.gsap) {
      setGsapCarregado(true);
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
    script.onload = () => setGsapCarregado(true);
    document.head.appendChild(script);
  }, []);

  // Animações de entrada com GSAP
  useEffect(() => {
    if (!gsapCarregado || !window.gsap) return;
    const gsap = window.gsap;

    const tl = gsap.timeline({ delay: 0.3 });

    // Linha decorativa revelando-se
    tl.fromTo(
      linhaDecorativaRef.current,
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 1.2, ease: "power3.inOut" }
    );

    // Pré-título fade up
    tl.fromTo(
      pretituloRef.current,
      { opacity: 0, y: 24, filter: "blur(6px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power2.out" },
      "-=0.5"
    );

    // Título principal — letras surgindo
    tl.fromTo(
      tituloPrincipalRef.current,
      { opacity: 0, y: 48, filter: "blur(8px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1, ease: "power2.out" },
      "-=0.4"
    );

    // Subtítulo
    tl.fromTo(
      subtituloRef.current,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" },
      "-=0.6"
    );

    // CTAs
    tl.fromTo(
      ctasRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.5"
    );

    // Card joia flutuante
    tl.fromTo(
      cardJoiaRef.current,
      { opacity: 0, x: 48, filter: "blur(10px)" },
      { opacity: 1, x: 0, filter: "blur(0px)", duration: 1.0, ease: "power2.out" },
      "-=0.9"
    );

    // Indicador de scroll
    tl.fromTo(
      scrollIndicadorRef.current,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.3"
    );

    // Flutuação contínua do card
    gsap.to(cardJoiaRef.current, {
      y: -12,
      duration: 3.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 2,
    });

    // Pulso contínuo no indicador de scroll
    gsap.to(scrollIndicadorRef.current, {
      y: 8,
      duration: 1.4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 2.5,
    });
  }, [gsapCarregado]);

  // Efeito parallax suave no scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!heroCamadaRef.current) return;
      const scrollY = window.scrollY;
      heroCamadaRef.current.style.transform = `translateY(${scrollY * 0.35}px) scale(1.05)`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
    async function carregarProdDestaques() {
      try {
        const resposta = await api.get("/produtos/destaques")

        setDestaques(resposta.data)
      } catch (errror) {
        console.log(error)
      }
    }

    carregarProdDestaques()
  }, [])

  return (


    <div id="containerSite">

      {usuario?.tipo === "admin" ? (
        <section className={style.hero}>
          <Header />
          <Particulas />

          <div className={style.textHero}>
            <h1>O brilho da sofisticação começa aqui</h1>
            <p>
              Cada joia carrega exclusividade, história e valor. Sua gestão merece
              o mesmo nível de cuidado, sofisticação e excelência presente em cada
              peça da coleção.
            </p>
            <a href="/admin/dashboard" className={style.cta}>
              <span className={style.ctaTexto}>Acessar sistema</span>
              <img width="15" height="15" src="https://img.icons8.com/material-rounded/24/c9a96e/right.png" alt="right" />


            </a>
          </div>

        </section>
      ) : (
        <section className={styles.secaoHero}>

          <Header />
          {/* ── Fundo: vídeo + fallback imagem ── */}
          <div className={styles.camadaFundo} ref={heroCamadaRef}>
            {!videoFalhou ? (
              <video
                ref={videoRef}
                className={styles.videoFundo}
                autoPlay
                muted
                loop
                playsInline
                poster={IMAGEM_FALLBACK}
                onError={() => setVideoFalhou(true)}
              >
                <source src={VIDEO_URL} type="video/mp4" />
              </video>
            ) : (
              <div
                className={styles.imagemFallback}
                style={{ backgroundImage: `url(${IMAGEM_FALLBACK})` }}
              />
            )}
          </div>

          {/* Overlays em camadas */}
          <div className={styles.overlayEscuro} />
          <div className={styles.overlayGradiente} />
          <div className={styles.overlayVinheta} />



          {/* ── Conteúdo principal ── */}
          <main className={styles.conteudoHero}>
            <div className={styles.colunaEsquerda}>
              {/* Linha decorativa dourada */}
              <div className={styles.linhaDourada} ref={linhaDecorativaRef} />

              {/* Pré-título */}
              <p className={styles.pretitulo} ref={pretituloRef}>
                <span className={styles.pontoPretitulo}>✦</span>
                Alta Joalheria Exclusiva
              </p>

              {/* Título principal */}
              <h1 className={styles.tituloPrincipal} ref={tituloPrincipalRef}>
                <span className={styles.linhaTitulo}>Arte que</span>
                <span className={styles.linhaTituloItalico}>transcende</span>
                <span className={styles.linhaTitulo}>o tempo</span>
              </h1>

              {/* Subtítulo */}
              <p className={styles.subtitulo} ref={subtituloRef}>
                Peças únicas criadas com maestria artesanal, em ouro 18k
                <br />e gemas selecionadas dos quatro cantos do mundo.
              </p>

              {/* CTAs */}
              <div className={styles.grupoBotoes} ref={ctasRef}>
                <button className={styles.botaoPrimario}>
                  <span className={styles.textoBotaoPrimario}>Explorar Coleção</span>
                  <span className={styles.iconeBotao}>→</span>
                </button>
                <button className={styles.botaoSecundario}>
                  <span>Conheça a Marca</span>
                </button>
              </div>

              {/* Linha separadora + estatísticas discretas */}
              <div className={styles.estatisticasHero}>
                <div className={styles.itemEstatistica}>
                  <span className={styles.numeroEstatistica}>38</span>
                  <span className={styles.labelEstatistica}>Anos de Tradição</span>
                </div>
                <div className={styles.divisorEstatistica} />
                <div className={styles.itemEstatistica}>
                  <span className={styles.numeroEstatistica}>2.400</span>
                  <span className={styles.labelEstatistica}>Peças Únicas</span>
                </div>
                <div className={styles.divisorEstatistica} />
                <div className={styles.itemEstatistica}>
                  <span className={styles.numeroEstatistica}>18k</span>
                  <span className={styles.labelEstatistica}>Ouro Puro</span>
                </div>
              </div>
            </div>

            {/* ── Card glassmorphism ── */}
            <aside className={styles.cardJoia} ref={cardJoiaRef}>
              <div className={styles.cardImagemContainer}>
                <img
                  src={JOIA_DESTAQUE.imagem}
                  alt={JOIA_DESTAQUE.colecao}
                  className={styles.cardImagem}
                />
                <div className={styles.cardBadge}>Edição Limitada</div>
              </div>
              <div className={styles.cardConteudo}>
                <span className={styles.cardEtiqueta}>✦ Em Destaque</span>
                <h3 className={styles.cardTitulo}>{JOIA_DESTAQUE.colecao}</h3>
                <p className={styles.cardDescricao}>{JOIA_DESTAQUE.descricao}</p>
                <a href="#" className={styles.cardLink}>
                  Ver peça <span>→</span>
                </a>
              </div>
            </aside>
          </main>

          {/* ── Detalhe geométrico decorativo ── */}
          <div className={styles.decoracaoGeometrica}>
            <svg viewBox="0 0 120 120" fill="none" className={styles.svgDecorativo}>
              <circle cx="60" cy="60" r="58" stroke="#C8A86B" strokeWidth="0.5" opacity="0.4" />
              <circle cx="60" cy="60" r="44" stroke="#C8A86B" strokeWidth="0.3" opacity="0.25" />
              <line x1="60" y1="2" x2="60" y2="118" stroke="#C8A86B" strokeWidth="0.3" opacity="0.2" />
              <line x1="2" y1="60" x2="118" y2="60" stroke="#C8A86B" strokeWidth="0.3" opacity="0.2" />
              <polygon points="60,8 68,52 112,60 68,68 60,112 52,68 8,60 52,52" stroke="#C8A86B" strokeWidth="0.4" opacity="0.3" fill="none" />
            </svg>
          </div>

          {/* ── Indicador de Scroll ── */}
          <div className={styles.indicadorScroll} ref={scrollIndicadorRef}>
            <div className={styles.linhaScroll} />
            <span className={styles.textoScroll}>Rolar</span>
            <div className={styles.setaScroll}>
              <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
                <path d="M6 0v18M1 13l5 5 5-5" stroke="#C8A86B" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </section>
      )}





      <section className={style.containerDestaques}>
        <h1 className={style.tituloSec}>PRODUTOS EM DESTAQUE</h1>


        <h1 className={style.bgWord}>LUXO</h1>

        <div className={style.contentDestaques}>


          <section className={style.gridProdutos}>

            {destaques.map(produtoDestaque => (
              <div className={style.cardProduto}>
                <div className={style.imagemProduto}>
                  <img src={`http://localhost:3000${produtoDestaque.imagem}`} alt="Relógio Luxury Gold" />
                </div>
                <div className={style.infoProduto}>
                  <div className={style.textoProduto}>
                    <h3 className={style.tituloProduto}>{produtoDestaque.nome}</h3>
                    <p className={style.precoProduto}>
                      <span className={style.precoLabel}>a partir de </span>
                      <span className={style.precoValor}>R$ {produtoDestaque.preco}</span>
                    </p>
                  </div>
                  <button onClick={() => navegar("/produto")} className={`btnPadrao ${style.btnVerProduto}`}>Ver produto</button>
                </div>
              </div>

            ))}


            {/* <div className={style.cardProduto}>
              <div className={style.imagemProduto}>
                <img src={colar} alt="Relógio Luxury Gold" />
              </div>
              <div className={style.infoProduto}>
                <div className={style.textoProduto}>
                  <h3 className={style.tituloProduto}>Relógio Luxury Gold</h3>
                  <p className={style.precoProduto}>
                    <span className={style.precoLabel}>a partir de </span>
                    <span className={style.precoValor}>R$ 2099.00</span>
                  </p>
                </div>
                <button className={`btnPadrao ${style.btnVerProduto}`}>Ver produto</button>
              </div>
            </div>

            <div className={style.cardProduto}>
              <div className={style.imagemProduto}>
                <img src={relogio} alt="Relógio Luxury Gold" />
              </div>
              <div className={style.infoProduto}>
                <div className={style.textoProduto}>
                  <h3 className={style.tituloProduto}>Relógio Luxury Gold</h3>
                  <p className={style.precoProduto}>
                    <span className={style.precoLabel}>a partir de </span>
                    <span className={style.precoValor}>R$ 2099.00</span>
                  </p>
                </div>
                <button className={`btnPadrao ${style.btnVerProduto}`}>Ver produto</button>
              </div>
            </div>

            <div className={style.cardProduto}>
              <div className={style.imagemProduto}>
                <img src={colar} alt="Relógio Luxury Gold" />
              </div>
              <div className={style.infoProduto}>
                <div className={style.textoProduto}>
                  <h3 className={style.tituloProduto}>Relógio Luxury Gold</h3>
                  <p className={style.precoProduto}>
                    <span className={style.precoLabel}>a partir de </span>
                    <span className={style.precoValor}>R$ 2099.00</span>
                  </p>
                </div>
                <button className={`btnPadrao ${style.btnVerProduto}`}>Ver produto</button>
              </div>
            </div> */}

          </section>

          <img className={style.imgModelo} src={modelo} alt="imagem do modelo" />

        </div>
      </section>


    </div >
  );
}


