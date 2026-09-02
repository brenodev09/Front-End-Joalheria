import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { api } from "../services/api"
import Footer from "../components/Footer"
import {
  RotateCw,
  ZoomIn,
  Heart,
  Share2,
  Minus,
  Plus,
  ShoppingBag,
  Check,
  Gem,
  CircleDollarSign,
  Scale,
  Sparkles,
  ShieldCheck,
  Hammer,
  Diamond,
  Crown,
  Truck,
  Gift,
  Headset,
  ArrowUpRight,
} from 'lucide-react'
import style from "../styles/ProdutoJoalheria.module.css"
import Header from "../components/Header"
import { useCarrinho } from "../context/carrinhoContext";
import semFoto from "../img/semFotoImg.png";




gsap.registerPlugin(ScrollTrigger)


/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatarPreco(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function isProdutoPersonalizavel(produto) {
  if (!produto) return false;

  const valor = produto.personalizavel ?? produto.personalizable ?? produto.personalizacaoAtiva ?? produto.hasPersonalizacao;

  if (valor === undefined || valor === null || valor === '') {
    return Boolean(
      (Array.isArray(produto.personalizacoes) && produto.personalizacoes.length > 0) ||
      (Array.isArray(produto.personalizacao) && produto.personalizacao.length > 0) ||
      (Array.isArray(produto.configuracao) && produto.configuracao.length > 0) ||
      (Array.isArray(produto.personalizacoesConfig) && produto.personalizacoesConfig.length > 0) ||
      (Array.isArray(produto.gruposPersonalizacao) && produto.gruposPersonalizacao.length > 0) ||
      Boolean(produto.hasPersonalizacao)
    );
  }

  if (typeof valor === 'string') {
    const normalizado = valor.trim().toLowerCase();
    if (['false', '0', 'no', 'off', 'null', 'undefined', ''].includes(normalizado)) return false;
    if (['true', '1', 'yes', 'on'].includes(normalizado)) return true;
    return Boolean(normalizado);
  }

  if (typeof valor === 'number') return valor !== 0;

  return Boolean(valor);
}





/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export default function ProdutoJoalheria() {


  const [produto, setProduto] = useState(null)
  const [relacionados, setRelacionados] = useState([])
  const { id } = useParams()
  const {
    adicionarAoCarrinho,
    abrirSidebar
  } = useCarrinho();

  useEffect(() => {
    async function produtoSelecionado() {
      try {
        const resposta = await api.get(`/produtos/${id}`)
        setProduto(resposta.data)
      } catch (error) {
        console.error("Erro ao carregar produto:", error.response?.data || error)
      }
    }

    produtoSelecionado()
  }, [id])

  /* Produtos da mesma coleção — só aparecem se existirem de fato. */
  useEffect(() => {
    async function buscarRelacionados() {
      try {
        const resposta = await api.get(`/colecoes/produto/${id}/relacionados`)
        setRelacionados(resposta.data)
      } catch (error) {
        console.error("Erro ao carregar produtos relacionados:", error.response?.data || error)
        setRelacionados([])
      }
    }

    buscarRelacionados()
  }, [id])


  /* ---- estado: galeria ---- */
  const [indiceAtivo, setIndiceAtivo] = useState(0)
  const [modo360, setModo360] = useState(false)
  const [zoomAtivo, setZoomAtivo] = useState(false)
  const [origemZoom, setOrigemZoom] = useState('50% 50%')

  /* ---- estado: informações ---- */
  const [variacaoAtiva, setVariacaoAtiva] = useState(null);
  const [quantidade, setQuantidade] = useState(1)
  const [favorito, setFavorito] = useState(false)
  const [adicionado, setAdicionado] = useState(false)
  const [erroConfiguracao, setErroConfiguracao] = useState('')
  const [erroTamanho, setErroTamanho] = useState(false)

  /* ---- refs: galeria ---- */
  const galeriaRef = useRef(null)
  const imagemGaleriaRef = useRef(null)
  const rotacaoTween = useRef(null)

  /* ---- refs: informações ---- */
  const infoRef = useRef(null)
  const botaoSacolaRef = useRef(null)

  /* ---- refs: destaques ---- */
  const destaquesRef = useRef(null)
  const imagemDestaqueRef = useRef(null)
  const linhasRef = useRef([])
  const rotulosRef = useRef([])

  /* ---- refs: benefícios / relacionados ---- */
  const beneficiosRef = useRef(null)
  const relacionadosRef = useRef(null)




  /* ---- animação: galeria (fade + scale de entrada) ---- */
  useGSAP(
    () => {
      gsap.fromTo(
        galeriaRef.current,
        { opacity: 0, scale: 0.94 },
        { opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out', delay: 0.15 },
      )
    },
    { scope: galeriaRef },
  )

  /* ---- animação: informações (fade up com stagger) ---- */
  useGSAP(
    () => {
      gsap.fromTo(
        `.${style.animarEntrada}`,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay: 0.25 },
      )
    },
    { scope: infoRef },
  )


  /* ---- animação: relacionados (fade up com stagger no scroll) ---- */
  useGSAP(
    () => {
      gsap.fromTo(
        `.${style.cardProduto}`,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.14,
          scrollTrigger: { trigger: relacionadosRef.current, start: 'top 78%', once: true },
        },
      )
    },
    { scope: relacionadosRef, dependencies: [relacionados] },
  )

  /* ---- ações: galeria ---- */
  function trocarImagem(indice) {
    if (indice === indiceAtivo) return
    setIndiceAtivo(indice)
    gsap.fromTo(
      imagemGaleriaRef.current,
      { opacity: 0.3, scale: 1.02 },
      { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' },
    )
  }

  function alternarModo360() {
    setModo360((atual) => !atual)
    if (!modo360) {
      rotacaoTween.current = gsap.to(imagemGaleriaRef.current, {
        rotateY: 360,
        duration: 3.5,
        ease: 'none',
        repeat: -1,
        transformPerspective: 900,
      })
    } else {
      rotacaoTween.current?.kill()
      gsap.set(imagemGaleriaRef.current, { rotateY: 0 })
    }
  }

  function moverMouse(evento) {
    if (modo360) return
    const limites = evento.currentTarget.getBoundingClientRect()
    const x = ((evento.clientX - limites.left) / limites.width) * 100
    const y = ((evento.clientY - limites.top) / limites.height) * 100
    setOrigemZoom(`${x}% ${y}%`)
  }

  /* ---- ações: informações ---- */
  function ajustarQuantidade(delta) {
    setQuantidade((atual) => Math.min(5, Math.max(1, atual + delta)))
  }

  async function adicionarSacola() {
    try {
      await adicionarAoCarrinho(produto.id, quantidade, variacaoAtiva?.id || null, produto)
      setAdicionado(true);
      abrirSidebar();
      setTimeout(() => setAdicionado(false), 2500);
    } catch (error) {
      setErroConfiguracao(error.response?.data?.message || error.response?.data?.erro || error.message || "Não foi possível adicionar esta configuração.")
    }
  }

  if (!produto) {
    return <div>Carregando...</div>
  }

  const precoSelecionado = variacaoAtiva?.preco ?? produto.preco;


  const precoParceladoo = precoSelecionado / 12;

  /* ------------------------------------------------------------------ */

  return (
    <main className={style.containerPagina}>

      <Header />
      {/* ============================ HERO ============================ */}
      <section className={style.secaoHero}>
        {/* <div className={style.marcaTopo}>
                <span className={style.nomeMarca}>Aurum & Constance</span>
                <span className={style.linhaMarca} />
              </div> */}

        <div className={style.gradeHero}>
          {/* ---------- Galeria ---------- */}
          <div className={style.galeriaProduto} ref={galeriaRef}>
            <div className={style.selosGaleria}>
              <span className={style.selo}>Edição Limitada</span>
            </div>

            <div
              className={style.molduraImagem}
              onMouseEnter={() => setZoomAtivo(true)}
              onMouseLeave={() => setZoomAtivo(false)}
              onMouseMove={moverMouse}
            >
              <img
                ref={imagemGaleriaRef}
                src={produto.imagem?.startsWith("http") ? produto.imagem : `http://localhost:3000${produto.imagem}`}
                alt={produto.nome}
                className={style.imagemPrincipal}
                onError={(event) => {
                  event.currentTarget.onerror = null
                  event.currentTarget.src = semFoto
                }}
              />

              <button
                type="button"
                className={`${style.botao360} ${modo360 ? style.botao360Ativo : ''}`}
                onClick={alternarModo360}
              >
                <RotateCw size={15} strokeWidth={1.5} />
                <span>{modo360 ? 'Parar rotação' : 'Visualização 360°'}</span>
              </button>

              {!modo360 && (
                <div className={style.dicaZoom}>
                  <ZoomIn size={13} strokeWidth={1.5} />
                  <span>Aproxime o cursor para ampliar</span>
                </div>
              )}
            </div>

            <div className={style.miniaturas}>
              <div className={style.miniaturas}>

                <button
                  className={`${style.miniatura} ${style.miniaturaAtiva}`}
                >
                  <img
                    src={
                      produto.imagem?.startsWith("http")
                        ?
                        produto.imagem
                        :
                        `http://localhost:3000${produto.imagem}`
                    }
                    alt={produto.nome}
                    onError={(event) => {
                      event.currentTarget.onerror = null
                      event.currentTarget.src = semFoto
                    }}
                  />
                </button>

              </div>
            </div>
          </div>

          {/* ---------- Informações ---------- */}
          <div className={style.informacoesProduto} ref={infoRef}>
            <p className={`${style.colecao} ${style.animarEntrada}`}>{produto.colecao}</p>

            <h1 className={`${style.nomeProduto} ${style.animarEntrada}`}>{produto.nome}</h1>

            <p className={`${style.descricaoCurta} ${style.animarEntrada}`}>{produto.descricao}</p>
            {isProdutoPersonalizavel(produto) && (
              <Link className={style.botaoAtelier} to={`/atelier/${produto.id}`}>
                ✨ Personalizar esta joia
              </Link>
            )}

            <div className={`${style.blocoPreco} ${style.animarEntrada}`}>
              <span className={style.precoAtual}>{formatarPreco(precoSelecionado)}</span>
              <span className={style.parcelamento}>
                ou 12x de {formatarPreco(precoParceladoo)} sem juros
              </span>
            </div>

            <div className={style.linhaDivisoria} />

            <div className={`${style.linhaAcoes} ${style.animarEntrada}`}>
              <div className={style.seletorQuantidade}>
                <button type="button" onClick={() => ajustarQuantidade(-1)} aria-label="Diminuir quantidade">
                  <Minus size={14} strokeWidth={1.5} />
                </button>
                <span>{quantidade}</span>
                <button type="button" onClick={() => ajustarQuantidade(1)} aria-label="Aumentar quantidade">
                  <Plus size={14} strokeWidth={1.5} />
                </button>
              </div>

              <p className={style.estoque}>
                <span className={style.pontoEstoque} />
                {produto.estoque <= 300 ? (
                  <span className={style.estoque}> Apenas {produto.estoque} unidades disponíveis</span>

                ) : (
                  <span className={style.estoque}> {produto.estoque} unidades disponíveis</span>
                )}
              </p>
            </div>

            <div className={`${style.linhaBotoes} ${style.animarEntrada}`}>
              <button type="button" ref={botaoSacolaRef} className={style.botaoSacola} onClick={adicionarSacola}>
                {adicionado ? (
                  <>
                    <Check size={16} strokeWidth={1.5} />
                    Adicionado à sacola
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} strokeWidth={1.5} />
                    Adicionar à Sacola
                  </>
                )}
              </button>

              <button
                type="button"
                className={`${style.botaoIcone} ${favorito ? style.botaoIconeAtivo : ''}`}
                onClick={() => setFavorito((a) => !a)}
                aria-label="Favoritar produto"
              >
                <Heart size={17} strokeWidth={1.5} fill={favorito ? 'currentColor' : 'none'} />
              </button>
              {/* 
              <button type="button" className={style.botaoIcone} aria-label="Compartilhar produto">
                <Share2 size={17} strokeWidth={1.5} />
              </button> */}
            </div>
          </div>
        </div>
      </section>



      {/* ======================= RELACIONADOS =========================== */}
      {relacionados.length > 0 && (
        <section className={style.secaoRelacionados} ref={relacionadosRef}>
          <div className={style.cabecalho}>
            <span className={style.eyebrow}>Complete o conjunto</span>
            <h2 className={style.titulo}>Peças da mesma coleção</h2>
          </div>

          <div className={style.gradeRelacionados}>
            {relacionados.map((item) => (
              <article className={style.cardProduto} key={item.id}>
                <div className={style.imagemCard}>
                  <Link to={`/produto/${item.id}`}>
                    <img
                      src={item.imagem?.startsWith("http") ? item.imagem : `http://localhost:3000${item.imagem}`}
                      alt={item.nome}
                      onError={(event) => {
                        event.currentTarget.onerror = null
                        event.currentTarget.src = semFoto
                      }}
                    />
                  </Link>

                </div>
                <div className={style.infoCard}>
                  <div>
                    <p className={style.colecaoCard}>{item.colecao}</p>
                    <h3 className={style.nomeCard}>{item.nome}</h3>
                    <p className={style.precoCard}>{formatarPreco(item.preco)}</p>
                  </div>
                  <Link to={`/produto/${item.id}`} className={style.botaoCard} aria-label={`Ver ${item.nome}`}>
                    <ArrowUpRight size={18} strokeWidth={1.3} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}


      <Footer />
    </main>
  )
}