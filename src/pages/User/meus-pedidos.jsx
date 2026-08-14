import { useEffect, useMemo, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import styles from '../../styles/User/meus-pedidos.module.css';
import ResumoCards from '../../components/User/ResumoCards/ResumoCards';
import FiltrosBarra from '../../components/User/FiltrosBarra/FiltrosBarra';
import StatusBadge from '../../components/User/StatusBadge/StatusBadge';
import PedidoDetalhes from '../../components/User/PedidoDetalhes/PedidoDetalhes';
import { STATUS } from '../../pages/User/mockPedidos';
import {api} from '../../services/api'; // ajuste o caminho conforme a estrutura real do seu projeto

gsap.registerPlugin(useGSAP);

const FILTRO_PARA_STATUS = {
  todos: null,
  andamento: [STATUS.PROCESSANDO, STATUS.TRANSPORTE],
  entregues: [STATUS.ENTREGUE],
  cancelados: [STATUS.CANCELADO],
};

// Tons cíclicos usados só para variar a cor das miniaturas — puramente visual,
// então preenchemos aqui caso a API não mande esse campo.
const TONS = ['a', 'b', 'c', 'd', 'e'];

// A tabela `pedidos` usa status_pedido (pendente/pago/enviado/entregue/cancelado),
// diferente dos status que a UI conhece — aqui é o "tradutor" entre os dois.
const STATUS_DB_PARA_UI = {
  pendente: STATUS.PROCESSANDO,
  pago: STATUS.PROCESSANDO,
  enviado: STATUS.TRANSPORTE,
  entregue: STATUS.ENTREGUE,
  cancelado: STATUS.CANCELADO,
};

// Em que ponto da timeline (Confirmado/Preparando/Enviado/Entregue) cada
// status_pedido do banco corresponde — a ProgressoEntrega agora calcula isso
// sozinha a partir do status cru, então esse mapa não é mais necessário aqui.

const LABEL_PAGAMENTO = {
  cartao: 'Cartão de crédito',
  pix: 'Pix',
  boleto: 'Boleto',
};

const LABEL_TIPO_ENTREGA = {
  'padrão': 'Entrega padrão',
  expressa: 'Entrega expressa',
  retirada: 'Retirada na loja',
};

// URL base do backend. Configure VITE_API_URL no seu arquivo .env do
// frontend (ex: VITE_API_URL=http://localhost:3000) usando a MESMA porta
// definida na variável PORT do .env do backend. Sem essa variável, cai em
// localhost:3000 como padrão.
const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

// A coluna `imagem` já vem com o caminho (ex: "/uploads/colar.jpg"), então só
// prefixamos com o host do backend — igual ao padrão já usado no restante do
// projeto (ex: página de detalhe do produto).
function montarUrlImagem(imagem) {
  if (!imagem) return null;
  if (imagem.startsWith('http://') || imagem.startsWith('https://')) return imagem;
  const caminho = imagem.startsWith('/') ? imagem : `/${imagem}`;
  return `${API_BASE_URL}${caminho}`;
}

const formatarMoeda = (valor) =>
  Number(valor ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const formatarData = (data) => {
  if (!data) return '';
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

// Converte a linha de `pedidos` (+ itens vindos do join no backend) no formato
// que os componentes da página esperam. Campos que ainda não existem no banco
// (endereço, rastreio, transportadora) ficam com fallback em vez de quebrar a tela.
function normalizarPedido(pedidoApi) {
  const itensBrutos = pedidoApi.itens ?? [];

  return {
    id: pedidoApi.id,
    numero: `AZY-${String(pedidoApi.id).padStart(6, '0')}`,
    status: STATUS_DB_PARA_UI[pedidoApi.status_pedido] ?? STATUS.PROCESSANDO,
    // Valor cru (pendente/pago/enviado/entregue/cancelado) — é o que
    // ProgressoEntrega usa pra calcular a etapa; "status" acima é só a
    // versão traduzida pro StatusBadge/filtros da lista.
    statusPedido: pedidoApi.status_pedido,
    dataCompra: formatarData(pedidoApi.criado_em),
    valorTotal: formatarMoeda(pedidoApi.total),
    // Histórico real (historico_pedidos), já em ordem cronológica — é o que
    // alimenta a lista de data/hora embaixo da barra de progresso.
    timeline: pedidoApi.timeline ?? [],
    itens: itensBrutos.map((item, index) => ({
      id: item.produto_id,
      nome: item.nome,
      imagem: montarUrlImagem(item.imagem),
      preco: formatarMoeda(item.preco_unitario),
      qtd: item.quantidade,
      tom: TONS[index % TONS.length],
    })),
    // Endereço de entrega salvo no pedido — não existe quando a entrega é
    // retirada na loja, já que nesse caso o back-end não grava esses campos.
    entrega: {
      tipoLabel: LABEL_TIPO_ENTREGA[pedidoApi.tipo_entrega] ?? 'Entrega',
      prazo: pedidoApi.prazo_entrega ?? null,
      endereco: pedidoApi.tipo_entrega !== 'retirada' ? {
        nome: pedidoApi.endereco_nome_destinatario,
        telefone: pedidoApi.endereco_telefone,
        rua: pedidoApi.endereco_rua,
        numero: pedidoApi.endereco_numero,
        complemento: pedidoApi.endereco_complemento,
        bairro: pedidoApi.endereco_bairro,
        cidade: pedidoApi.endereco_cidade,
        estado: pedidoApi.endereco_estado,
        cep: pedidoApi.endereco_cep,
      } : null,
    },
    pagamento: {
      metodo: LABEL_PAGAMENTO[pedidoApi.forma_pagamento] ?? pedidoApi.forma_pagamento ?? 'Não informado',
      bandeira: pedidoApi.cartao_bandeira ?? null,
      final: pedidoApi.cartao_final ?? null,
      nomeTitular: pedidoApi.cartao_nome_titular ?? null,
      parcelas: null,
    },
    // Rastreio e transportadora ainda não existem no banco.
    rastreio: null,
    transportadora: null,
  };
}

export default function MeusPedidos() {
  const [filtroAtivo, setFiltroAtivo] = useState('todos');
  const [busca, setBusca] = useState('');
  const [pedidoAberto, setPedidoAberto] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const resumoRef = useRef(null);
  const filtrosRef = useRef(null);
  const listaRef = useRef(null);

  // Mapas de refs por pedido.id — substituem os refs "locais" que existiam
  // quando cada card era um componente próprio.
  const painelRefs = useRef({});
  const conteudoRefs = useRef({});
  const setaRefs = useRef({});
  const pedidoAbertoAnteriorRef = useRef(null);

  useEffect(() => {
    async function carregarPedidos() {
      try {
        setCarregando(true);
        const resposta = await api.get('/pedidos/meus-pedidos');
        setPedidos(resposta.data.map(normalizarPedido));
      } catch (error) {
        console.error(error);
      } finally {
        setCarregando(false);
      }
    }
    carregarPedidos();
  }, []);

  const resumo = useMemo(() => {
    return {
      total: pedidos.length,
      entregues: pedidos.filter((p) => p.status === STATUS.ENTREGUE).length,
      transporte: pedidos.filter((p) => p.status === STATUS.TRANSPORTE).length,
      cancelados: pedidos.filter((p) => p.status === STATUS.CANCELADO).length,
    };
  }, [pedidos]);

  const pedidosFiltrados = useMemo(() => {
    const statusPermitidos = FILTRO_PARA_STATUS[filtroAtivo];
    const termo = busca.trim().toLowerCase();

    return pedidos.filter((pedido) => {
      const passaStatus = !statusPermitidos || statusPermitidos.includes(pedido.status);
      if (!passaStatus) return false;

      if (!termo) return true;
      const numeroBate = pedido.numero.toLowerCase().includes(termo);
      const itemBate = pedido.itens.some((item) => item.nome.toLowerCase().includes(termo));
      return numeroBate || itemBate;
    });
  }, [pedidos, filtroAtivo, busca]);

  // Entrada da página: fade + slide up em cascata do cabeçalho, resumo e filtros.
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(headerRef.current, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
        .fromTo(
          resumoRef.current.querySelectorAll('[data-resumo-card]'),
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 },
          '-=0.35'
        )
        .fromTo(filtrosRef.current, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.3');
    },
    { scope: containerRef }
  );

  // Stagger dos cards de pedido — dispara no 1º carregamento vindo da API
  // e também sempre que o filtro/busca muda o conjunto exibido.
  useGSAP(
    () => {
      const cards = listaRef.current?.querySelectorAll('[data-pedido-card]');
      if (!cards || !cards.length) return;
      gsap.fromTo(
        cards,
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
      );
    },
    { scope: listaRef, dependencies: [pedidosFiltrados] }
  );

  // Abre/fecha o painel de detalhes do pedido selecionado.
  // Como pedidoAberto guarda um único id, o comportamento é de acordeão:
  // ao abrir um novo pedido, o anterior é fechado automaticamente.
  useGSAP(
    () => {
      const idAnterior = pedidoAbertoAnteriorRef.current;
      const idAtual = pedidoAberto;

      if (idAnterior && idAnterior !== idAtual) {
        const painelAntigo = painelRefs.current[idAnterior];
        const setaAntiga = setaRefs.current[idAnterior];
        if (painelAntigo) {
          gsap.to(painelAntigo, {
            height: 0,
            opacity: 0,
            duration: 0.4,
            ease: 'power2.inOut',
            onComplete: () => gsap.set(painelAntigo, { display: 'none' }),
          });
        }
        if (setaAntiga) {
          gsap.to(setaAntiga, { rotate: 0, duration: 0.4, ease: 'power2.inOut' });
        }
      }

      if (idAtual) {
        const painel = painelRefs.current[idAtual];
        const conteudo = conteudoRefs.current[idAtual];
        const seta = setaRefs.current[idAtual];

        if (painel && conteudo) {
          gsap.killTweensOf(painel);
          gsap.set(painel, { display: 'block' });
          const altura = conteudo.getBoundingClientRect().height;
          gsap.fromTo(
            painel,
            { height: 0, opacity: 0 },
            { height: altura, opacity: 1, duration: 0.55, ease: 'power3.out' }
          );
          gsap.fromTo(
            conteudo,
            { y: -8, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.08 }
          );
        }
        if (seta) gsap.to(seta, { rotate: 180, duration: 0.4, ease: 'power2.inOut' });
      }

      pedidoAbertoAnteriorRef.current = idAtual;
    },
    { dependencies: [pedidoAberto], scope: containerRef }
  );

  return (
    <div className={styles.pagina} ref={containerRef}>
      <div className={styles.container}>
        <header className={styles.header} ref={headerRef}>
          {/* <span className={styles.eyebrow}>AZORY · Central da conta</span> */}
          <h1 className={styles.titulo}>Meus Pedidos</h1>
          <p className={styles.descricao}>
            Acompanhe o preparo, o envio e a entrega de cada peça adquirida na AZORY.
          </p>
        </header>

        <div ref={resumoRef}>
          <ResumoCards resumo={resumo} className={styles.secao} />
        </div>

        <div ref={filtrosRef}>
          <FiltrosBarra
            filtroAtivo={filtroAtivo}
            onFiltroChange={setFiltroAtivo}
            busca={busca}
            onBuscaChange={setBusca}
            className={styles.secao}
          />
        </div>

        <section className={styles.lista} ref={listaRef}>
          {carregando ? (
            <div className={styles.carregando}>
              <span className={styles.carregandoIcone}>◇</span>
              <p className={styles.carregandoTexto}>Carregando seus pedidos…</p>
            </div>
          ) : pedidosFiltrados.length > 0 ? (
            pedidosFiltrados.map((pedido) => {
              const aberto = pedidoAberto === pedido.id;
              const qtdItens = pedido.itens.length;
              const multiplasPecas = qtdItens > 1;
              // Mostra até 3 linhas (imagem + nome). Se houver mais peças que isso,
              // a 3ª linha vira um resumo "+N peças" em vez de mais uma imagem.
              const limiteVisivel = 3;
              const mostrarResumo = qtdItens > limiteVisivel;
              const itensVisiveis = mostrarResumo
                ? pedido.itens.slice(0, limiteVisivel - 1)
                : pedido.itens;
              const itensRestantes = qtdItens - itensVisiveis.length;

              return (
                // Card do pedido — antes era o componente PedidoCard, agora vive
                // direto aqui dentro do .map().
                <article
                  key={pedido.id}
                  className={`${styles.card} ${aberto ? styles.cardAberto : ''}`}
                  data-pedido-card
                >
                  <div className={styles.cabecalho}>
                    <div className={styles.identificacao}>
                      <span className={styles.numeroPedido}>{pedido.numero}</span>
                      <span className={styles.dataCompra}>Comprado em {pedido.dataCompra}</span>
                    </div>
                    <StatusBadge status={pedido.status} />
                  </div>

                  <div className={styles.corpo}>
                    <div className={styles.miniaturasGrupo}>
                      {itensVisiveis.map((item) => (
                        <div key={item.id} className={styles.itemLinha}>
                          <span
                            className={`${styles.miniatura} ${styles[`tom-${item.tom}`]} ${
                              !multiplasPecas ? styles.miniaturaUnica : ''
                            }`}
                          >
                            {/* Ícone de fallback — some por trás da foto real quando ela carrega */}
                            <svg viewBox="0 0 24 24" fill="none" className={styles.miniaturaFallback}>
                              <path d="M12 3 4 9l8 12 8-12-8-6Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
                              <path d="M4 9h16M9 9l3 12 3-12" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
                            </svg>
                            {item.imagem && (
                              <img
                                src={item.imagem}
                                alt={item.nome}
                                className={styles.miniaturaImg}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                          </span>
                          <span className={styles.itemNomeCard}>{item.nome}</span>
                        </div>
                      ))}

                      {mostrarResumo && (
                        <div className={styles.itemLinha}>
                          <span className={styles.maisTexto}>
                            + {itensRestantes} {itensRestantes === 1 ? 'peça' : 'peças'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className={styles.acoes}>
                      <div className={styles.valorBloco}>
                        <span className={styles.valorLabel}>
                          Total ({qtdItens} {qtdItens === 1 ? 'peça' : 'peças'})
                        </span>
                        <span className={styles.valorTotal}>{pedido.valorTotal}</span>
                      </div>

                      <button
                        type="button"
                        className={` ${styles.botaoDetalhes} btnPadrao `}
                        onClick={() => setPedidoAberto(aberto ? null : pedido.id)}
                        aria-expanded={aberto}
                      >
                        Ver detalhes
                        <svg
                          ref={(el) => (setaRefs.current[pedido.id] = el)}
                          viewBox="0 0 24 24"
                          fill="none"
                          className={styles.seta}
                        >
                          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div
                    className={styles.painel}
                    ref={(el) => (painelRefs.current[pedido.id] = el)}
                    style={{ display: 'none', height: 0, overflow: 'hidden' }}
                  >
                    <div ref={(el) => (conteudoRefs.current[pedido.id] = el)}>
                      <PedidoDetalhes pedido={pedido} />
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className={styles.vazio}>
              <span className={styles.vazioIcone}>◇</span>
              <p className={styles.vazioTitulo}>Nenhum pedido encontrado</p>
              <p className={styles.vazioTexto}>
                Ajuste os filtros ou o termo de busca para encontrar o que procura.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}