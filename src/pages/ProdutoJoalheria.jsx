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
/* Dados do produto (substitua pelos dados reais / vindos de API)      */
/* ------------------------------------------------------------------ */

const PRODUTO = {
  nome: 'Anel Solitário Constelação',
  // colecao: 'Coleção Constelação',
  descricaoCurta:
    'Um único diamante natural lapidado à mão, suspenso em ouro 18K. Peça exclusiva, numerada e certificada — feita para durar gerações.',
  precoAtual: 48900,
  precoParcelado: { vezes: 10, valor: 4890 },
  estoque: 3,
  imagens: [
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?q=80&w=1400&auto=format&fit=crop',
  ],
  materiais: [
    { id: 'ouro-18k', nome: 'Ouro Amarelo 18K', cor: '#c9a86a' },
    { id: 'ouro-rose', nome: 'Ouro Rosé 18K', cor: '#d9a892' },
    { id: 'ouro-branco', nome: 'Ouro Branco 18K', cor: '#e7e5df' },
  ],
  tamanhos: ['13', '14', '15', '16', '17', '18', '19', '20'],
}

/* Ordem = sentido horário a partir do topo (12h). Cada item recebe um
  ângulo fixo (45° de distância um do outro) — evita qualquer
  sobreposição entre rótulos, independente do conteúdo. */
const DESTAQUES = [
  { id: 'diamante', icone: 'diamante', titulo: 'Diamante Natural', descricao: '1,2 quilates · Lapidação brilhante · Cor D' },
  { id: 'ouro', icone: 'ouro', titulo: 'Ouro 18K', descricao: 'Liga nobre certificada, polimento espelhado' },
  { id: 'peso', icone: 'peso', titulo: 'Peso', descricao: '4,8g — leveza e presença em equilíbrio' },
  { id: 'exclusivo', icone: 'exclusivo', titulo: 'Exclusivo', descricao: 'Edição limitada, peça numerada' },
  { id: 'certificado', icone: 'certificado', titulo: 'Certificado GIA', descricao: 'Autenticidade e procedência garantidas' },
  { id: 'acabamento', icone: 'acabamento', titulo: 'Acabamento Artesanal', descricao: 'Lapidação e cravação feitas à mão' },
  { id: 'pedras', icone: 'pedras', titulo: 'Pedras Laterais', descricao: '12 diamantes em pavé, cravação francesa' },
  { id: 'colecao', icone: 'colecao', titulo: 'Coleção Premium', descricao: 'Assinatura Constelação, edição 2026' },
]

const ICONES_DESTAQUE = {
  diamante: Diamond,
  ouro: CircleDollarSign,
  peso: Scale,
  exclusivo: Sparkles,
  certificado: ShieldCheck,
  acabamento: Hammer,
  pedras: Gem,
  colecao: Crown,
}

// const BENEFICIOS = [
//   { icone: Truck, titulo: 'Frete Grátis', descricao: 'Entrega assegurada e rastreada para todo o Brasil' },
//   { icone: Gift, titulo: 'Embalagem Premium', descricao: 'Estojo assinado, pronto para presentear' },
//   { icone: Headset, titulo: 'Atendimento Especializado', descricao: 'Consultoria dedicada antes e depois da compra' },
//   { icone: ShieldCheck, titulo: 'Garantia Vitalícia', descricao: 'Manutenção e polimento cobertos para sempre' },
// ]

const RELACIONADOS = [
  {
    id: 1,
    nome: 'Aliança Aurora',
    colecao: 'Coleção Constelação',
    preco: 21400,
    imagem: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 2,
    nome: 'Brinco Meridian',
    colecao: 'Coleção Meridian',
    preco: 32900,
    imagem: 'https://images.unsplash.com/photo-1620656798579-1984d9e87df7?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 3,
    nome: 'Colar Lumière',
    colecao: 'Coleção Lumière',
    preco: 56700,
    imagem: 'https://images.unsplash.com/photo-1599459183200-59c7687a0275?q=80&w=1200&auto=format&fit=crop',
  },
]

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatarPreco(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const RAIO_ANCORA = 30
const RAIO_ROTULO = 43

/** Distribui os destaques em ângulos fixos (45° entre cada um),
 *  começando no topo (12h) e andando em sentido horário. Isso garante
 *  que nenhum rótulo colida com outro, mesmo com 8 itens. */
function calcularPosicaoRadial(indice, total) {
  const anguloGraus = -90 + indice * (360 / total)
  const anguloRad = (anguloGraus * Math.PI) / 180
  const cos = Math.cos(anguloRad)
  const sin = Math.sin(anguloRad)
  return {
    ancora: { x: 50 + RAIO_ANCORA * cos, y: 50 + RAIO_ANCORA * sin },
    rotulo: { x: 50 + RAIO_ROTULO * cos, y: 50 + RAIO_ROTULO * sin },
  }
}



/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export default function ProdutoJoalheria() {


  const [produto, setProduto] = useState(null)
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

  const itensDestaque = useMemo(
    () =>
      DESTAQUES.map((item, indice) => ({
        ...item,
        ...calcularPosicaoRadial(indice, DESTAQUES.length),
      })),
    [],
  )

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

  /* ---- animação: destaques (reveal + linhas desenhadas + stagger) ---- */
  useGSAP(
    () => {
      linhasRef.current.forEach((elementoLinha) => {
        if (!elementoLinha) return
        const comprimento = elementoLinha.getTotalLength()
        gsap.set(elementoLinha, { strokeDasharray: comprimento, strokeDashoffset: comprimento })
      })

      const linhaDoTempo = gsap.timeline({
        scrollTrigger: { trigger: destaquesRef.current, start: 'top 68%', once: true },
      })

      linhaDoTempo
        .fromTo(
          imagemDestaqueRef.current,
          { opacity: 0, scale: 0.86, filter: 'blur(6px)' },
          { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out' },
        )
        .to(
          linhasRef.current,
          { strokeDashoffset: 0, duration: 0.85, ease: 'power2.inOut', stagger: 0.08 },
          '-=0.5',
        )
        .fromTo(
          rotulosRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08 },
          '-=0.5',
        )
    },
    { scope: destaquesRef, dependencies: [itensDestaque] },
  )

  /* ---- animação: benefícios (fade up com stagger no scroll) ---- */
  // useGSAP(
  //   () => {
  //     gsap.fromTo(
  //       `.${style.itemBeneficio}`,
  //       { opacity: 0, y: 26 },
  //       {
  //         opacity: 1,
  //         y: 0,
  //         duration: 0.8,
  //         ease: 'power3.out',
  //         stagger: 0.12,
  //         scrollTrigger: { trigger: beneficiosRef.current, start: 'top 80%', once: true },
  //       },
  //     )
  //   },
  //   { scope: beneficiosRef },
  // )

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
    { scope: relacionadosRef },
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
            <p className={`${style.colecao} ${style.animarEntrada}`}>{PRODUTO.colecao}</p>

            <h1 className={`${style.nomeProduto} ${style.animarEntrada}`}>{produto.nome}</h1>

            <p className={`${style.descricaoCurta} ${style.animarEntrada}`}>{produto.descricao}</p>
            {produto.personalizavel !== false && (
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

      {/* ========================= DESTAQUES ========================== */}
      {/* <section className={style.secaoDestaques} ref={destaquesRef}>
              <div className={style.cabecalho}>
                <span className={style.eyebrow}>Detalhes que definem a peça</span>
                <h2 className={style.titulo}>Cada elemento, uma decisão deliberada</h2>
              </div>

              <div className={style.palco}>
                <div className={style.brilhoAmbiente} />

                <svg className={style.svgLinhas} viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <marker
                      id="pontaSeta"
                      viewBox="0 0 10 10"
                      refX="8.5"
                      refY="5"
                      markerWidth="5.5"
                      markerHeight="5.5"
                      orient="auto-start-reverse"
                    >
                      <path d="M0,0 L10,5 L0,10 Z" fill="#e6c78a" />
                    </marker>
                  </defs>

                  {itensDestaque.map((item, indice) => (
                    <line
                      key={item.id}
                      ref={(el) => (linhasRef.current[indice] = el)}
                      x1={item.rotulo.x}
                      y1={item.rotulo.y}
                      x2={item.ancora.x}
                      y2={item.ancora.y}
                      className={style.linhaIndicadora}
                      markerEnd="url(#pontaSeta)"
                    />
                  ))}
                </svg>

                <div className={style.molduraCentral}>
                  <img
                    ref={imagemDestaqueRef}
                    src={PRODUTO.imagens[1]}
                    alt="Detalhe do Anel Solitário Constelação"
                    className={style.imagemCentral}
                  />
                </div>

                {itensDestaque.map((item, indice) => {
                  const Icone = ICONES_DESTAQUE[item.icone] ?? Gem
                  const alinharDireita = item.rotulo.x < 49
                  const centralizado = item.rotulo.x >= 49 && item.rotulo.x <= 51
                  return (
                    <div
                      key={item.id}
                      ref={(el) => (rotulosRef.current[indice] = el)}
                      className={`${style.indicadorCaracteristica} ${alinharDireita ? style.indicadorInvertido : ''} ${
                        centralizado ? style.indicadorCentralizado : ''
                      }`}
                      style={{ left: `${item.rotulo.x}%`, top: `${item.rotulo.y}%` }}
                    >
                      <div className={style.iconeIndicador}>
                        <Icone size={15} strokeWidth={1.3} />
                      </div>
                      <div className={style.textoIndicador}>
                        <p className={style.tituloIndicador}>{item.titulo}</p>
                        <p className={style.descricaoIndicador}>{item.descricao}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className={style.molduraCentralMobile}>
                <img
                  src={PRODUTO.imagens[1]}
                  alt="Detalhe do Anel Solitário Constelação"
                  className={style.imagemCentral}
                />
              </div>

              <div className={style.listaMobile}>
                {itensDestaque.map((item) => {
                  const Icone = ICONES_DESTAQUE[item.icone] ?? Gem
                  return (
                    <div key={`mobile-${item.id}`} className={style.itemListaMobile}>
                      <div className={style.iconeIndicador}>
                        <Icone size={15} strokeWidth={1.3} />
                      </div>
                      <div className={style.textoIndicador}>
                        <p className={style.tituloIndicador}>{item.titulo}</p>
                        <p className={style.descricaoIndicador}>{item.descricao}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section> */}

      {/* ========================= BENEFÍCIOS ========================== */}
      {/* <section className={style.secaoBeneficios} ref={beneficiosRef}>
              <div className={style.gradeBeneficios}>
                {BENEFICIOS.map(({ icone: Icone, titulo, descricao }) => (
                  <div className={style.itemBeneficio} key={titulo}>
                    <Icone size={22} strokeWidth={1.1} className={style.iconeBeneficio} />
                    <p className={style.tituloBeneficio}>{titulo}</p>
                    <p className={style.descricaoBeneficio}>{descricao}</p>
                  </div>
                ))}
              </div>
            </section> */}

      {/* ======================= RELACIONADOS =========================== */}
      <section className={style.secaoRelacionados} ref={relacionadosRef}>
        <div className={style.cabecalho}>
          <span className={style.eyebrow}>Complete o conjunto</span>
          <h2 className={style.titulo}>Peças da mesma coleção</h2>
        </div>

        <div className={style.gradeRelacionados}>
          {RELACIONADOS.map((produto) => (
            <article className={style.cardProduto} key={produto.id}>
              <div className={style.imagemCard}>
                <img src={produto.imagem} alt={produto.nome} />
              </div>
              <div className={style.infoCard}>
                <div>
                  <p className={style.colecaoCard}>{produto.colecao}</p>
                  <h3 className={style.nomeCard}>{produto.nome}</h3>
                  <p className={style.precoCard}>{formatarPreco(produto.preco)}</p>
                </div>
                <button type="button" className={style.botaoCard} aria-label={`Ver ${produto.nome}`}>
                  <ArrowUpRight size={18} strokeWidth={1.3} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>


      <Footer />
    </main>
  )
}