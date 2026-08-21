import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import styles from "../../styles/User/meus-pedidos.module.css";

import ResumoCards from "../../components/User/ResumoCards/ResumoCards";
import FiltrosBarra from "../../components/User/FiltrosBarra/FiltrosBarra";
import StatusBadge from "../../components/User/StatusBadge/StatusBadge";
import PedidoDetalhes from "../../components/User/PedidoDetalhes/PedidoDetalhes";

import { api } from "../../services/api";
import { normalizarPedidoUsuario } from "./normalizarPedidoUsuario.js";

gsap.registerPlugin(useGSAP);

/* =========================================================
   STATUS DA INTERFACE
========================================================= */

const STATUS = {
  PROCESSANDO: "processando",
  TRANSPORTE: "transporte",
  ENTREGUE: "entregue",
  CANCELADO: "cancelado",
};

/* =========================================================
   FILTROS
========================================================= */

const FILTRO_PARA_STATUS = {
  todos: null,

  andamento: [
    STATUS.PROCESSANDO,
    STATUS.TRANSPORTE,
  ],

  entregues: [
    STATUS.ENTREGUE,
  ],

  cancelados: [
    STATUS.CANCELADO,
  ],
};

/* =========================================================
   STATUS BANCO → INTERFACE
========================================================= */

/*
 * Banco:
 *
 * pendente
 * pago
 * separacao
 * processando
 * enviado
 * entregue
 * cancelado
 *
 * Interface:
 *
 * processando
 * transporte
 * entregue
 * cancelado
 */

const STATUS_DB_PARA_UI = {
  pendente: STATUS.PROCESSANDO,

  pago: STATUS.PROCESSANDO,

  separacao: STATUS.PROCESSANDO,

  processando: STATUS.PROCESSANDO,

  enviado: STATUS.TRANSPORTE,

  transporte: STATUS.TRANSPORTE,

  entregue: STATUS.ENTREGUE,

  cancelado: STATUS.CANCELADO,
};

/* =========================================================
   NORMALIZAR STATUS
========================================================= */

function normalizarStatus(status) {
  if (!status) {
    return STATUS.PROCESSANDO;
  }

  const statusNormalizado = String(
    status
  )
    .trim()
    .toLowerCase();

  return (
    STATUS_DB_PARA_UI[
      statusNormalizado
    ] ?? STATUS.PROCESSANDO
  );
}

/* =========================================================
   COMPONENTE
========================================================= */

export default function MeusPedidos() {
  /* =========================================================
     ESTADOS
  ========================================================= */

  const [
    filtroAtivo,
    setFiltroAtivo,
  ] = useState("todos");

  const [
    busca,
    setBusca,
  ] = useState("");

  const [
    pedidoAberto,
    setPedidoAberto,
  ] = useState(null);

  const [
    pedidos,
    setPedidos,
  ] = useState([]);

  const [
    carregando,
    setCarregando,
  ] = useState(true);

  const [
    erro,
    setErro,
  ] = useState("");

  /* =========================================================
     REFS
  ========================================================= */

  const containerRef =
    useRef(null);

  const headerRef =
    useRef(null);

  const resumoRef =
    useRef(null);

  const filtrosRef =
    useRef(null);

  const listaRef =
    useRef(null);

  const painelRefs =
    useRef({});

  const conteudoRefs =
    useRef({});

  const setaRefs =
    useRef({});

  const pedidoAbertoAnteriorRef =
    useRef(null);

  /* =========================================================
     BUSCAR PEDIDOS
  ========================================================= */

  async function carregarPedidos() {
    try {
      setCarregando(true);
      setErro("");

      const resposta =
        await api.get(
          "/pedidos/meus-pedidos"
        );

      /*
       * O backend pode retornar:
       *
       * [
       *   pedido,
       *   pedido
       * ]
       *
       * ou:
       *
       * {
       *   pedidos: [...]
       * }
       */

      const dados =
        Array.isArray(
          resposta.data
        )
          ? resposta.data
          : Array.isArray(
              resposta.data?.pedidos
            )
          ? resposta.data.pedidos
          : [];

      /*
       * Normaliza todos os pedidos
       * recebidos do backend.
       */

      const pedidosNormalizados =
        dados
          .filter(Boolean)
          .map((pedido) => {
            const normalizado =
              normalizarPedidoUsuario(
                pedido
              );

            return {
              ...normalizado,

              /*
               * O normalizador mantém
               * o status original do banco.
               *
               * Aqui transformamos para
               * o status utilizado pela UI.
               */

              status:
                normalizarStatus(
                  normalizado.status
                ),

              /*
               * Garantia de arrays para
               * evitar erros no JSX.
               */

              itens:
                Array.isArray(
                  normalizado.itens
                )
                  ? normalizado.itens
                  : [],

              timeline:
                Array.isArray(
                  normalizado.timeline
                )
                  ? normalizado.timeline
                  : [],
            };
          });

      setPedidos(
        pedidosNormalizados
      );
    } catch (error) {
      console.error(
        "Erro ao carregar pedidos:",
        error
      );

      const mensagem =
        error.response?.data
          ?.erro ||
        error.response?.data
          ?.message ||
        "Não foi possível carregar seus pedidos.";

      setErro(mensagem);

      setPedidos([]);
    } finally {
      setCarregando(false);
    }
  }

  /* =========================================================
     CARREGAMENTO INICIAL
  ========================================================= */

  useEffect(() => {
    carregarPedidos();
  }, []);

  /* =========================================================
     RESUMO
  ========================================================= */

  const resumo = useMemo(() => {
    const total =
      pedidos.length;

    const entregues =
      pedidos.filter(
        (pedido) =>
          pedido.status ===
          STATUS.ENTREGUE
      ).length;

    const transporte =
      pedidos.filter(
        (pedido) =>
          pedido.status ===
          STATUS.TRANSPORTE
      ).length;

    const cancelados =
      pedidos.filter(
        (pedido) =>
          pedido.status ===
          STATUS.CANCELADO
      ).length;

    return {
      total,
      entregues,
      transporte,
      cancelados,
    };
  }, [pedidos]);

  /* =========================================================
     FILTROS
  ========================================================= */

  const pedidosFiltrados =
    useMemo(() => {
      const statusPermitidos =
        FILTRO_PARA_STATUS[
          filtroAtivo
        ];

      const termo =
        busca
          .trim()
          .toLowerCase();

      return pedidos.filter(
        (pedido) => {
          /*
           * Filtro por status
           */

          const passaStatus =
            !statusPermitidos ||
            statusPermitidos.includes(
              pedido.status
            );

          if (!passaStatus) {
            return false;
          }

          /*
           * Sem busca:
           * retorna normalmente.
           */

          if (!termo) {
            return true;
          }

          /*
           * Busca pelo número
           * do pedido.
           */

          const numeroPedido =
            String(
              pedido.numero ?? ""
            ).toLowerCase();

          const numeroBate =
            numeroPedido.includes(
              termo
            );

          /*
           * Busca pelo nome
           * dos produtos.
           */

          const itens =
            Array.isArray(
              pedido.itens
            )
              ? pedido.itens
              : [];

          const itemBate =
            itens.some(
              (item) =>
                String(
                  item.nome ?? ""
                )
                  .toLowerCase()
                  .includes(termo)
            );

          return (
            numeroBate ||
            itemBate
          );
        }
      );
    }, [
      pedidos,
      filtroAtivo,
      busca,
    ]);

  /* =========================================================
     ANIMAÇÃO DE ENTRADA
  ========================================================= */

  useGSAP(
    () => {
      const timeline =
        gsap.timeline({
          defaults: {
            ease: "power3.out",
          },
        });

      /* -------------------------------------------------------
         HEADER
      ------------------------------------------------------- */

      if (headerRef.current) {
        timeline.fromTo(
          headerRef.current,
          {
            y: 22,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
          }
        );
      }

      /* -------------------------------------------------------
         CARDS DE RESUMO
      ------------------------------------------------------- */

      if (resumoRef.current) {
        const cards =
          resumoRef.current.querySelectorAll(
            "[data-resumo-card]"
          );

        if (cards.length) {
          timeline.fromTo(
            cards,
            {
              y: 18,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.08,
            },
            "-=0.35"
          );
        }
      }

      /* -------------------------------------------------------
         FILTROS
      ------------------------------------------------------- */

      if (filtrosRef.current) {
        timeline.fromTo(
          filtrosRef.current,
          {
            y: 14,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
          },
          "-=0.3"
        );
      }
    },
    {
      scope: containerRef,
    }
  );

  /* =========================================================
     ANIMAÇÃO DOS CARDS
  ========================================================= */

  useGSAP(
    () => {
      const cards =
        listaRef.current?.querySelectorAll(
          "[data-pedido-card]"
        );

      if (!cards?.length) {
        return;
      }

      gsap.fromTo(
        cards,
        {
          y: 22,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
        }
      );
    },
    {
      scope: listaRef,
      dependencies: [
        pedidosFiltrados,
      ],
    }
  );

  /* =========================================================
     ABRIR / FECHAR DETALHES
  ========================================================= */

  useGSAP(
    () => {
      const idAnterior =
        pedidoAbertoAnteriorRef.current;

      const idAtual =
        pedidoAberto;

      /* =====================================================
         FECHAR PAINEL ANTERIOR
      ===================================================== */

      if (
        idAnterior &&
        idAnterior !== idAtual
      ) {
        const painelAntigo =
          painelRefs.current[
            idAnterior
          ];

        const setaAntiga =
          setaRefs.current[
            idAnterior
          ];

        if (painelAntigo) {
          gsap.killTweensOf(
            painelAntigo
          );

          gsap.to(
            painelAntigo,
            {
              height: 0,
              opacity: 0,
              duration: 0.4,
              ease: "power2.inOut",

              onComplete: () => {
                gsap.set(
                  painelAntigo,
                  {
                    display:
                      "none",
                  }
                );
              },
            }
          );
        }

        if (setaAntiga) {
          gsap.killTweensOf(
            setaAntiga
          );

          gsap.to(
            setaAntiga,
            {
              rotate: 0,
              duration: 0.4,
              ease: "power2.inOut",
            }
          );
        }
      }

      /* =====================================================
         ABRIR PAINEL ATUAL
      ===================================================== */

      if (idAtual) {
        const painel =
          painelRefs.current[
            idAtual
          ];

        const conteudo =
          conteudoRefs.current[
            idAtual
          ];

        const seta =
          setaRefs.current[
            idAtual
          ];

        if (
          painel &&
          conteudo
        ) {
          gsap.killTweensOf(
            painel
          );

          gsap.killTweensOf(
            conteudo
          );

          gsap.set(
            painel,
            {
              display: "block",
              height: 0,
              opacity: 0,
              overflow:
                "hidden",
            }
          );

          /*
           * Mede o conteúdo antes
           * da animação.
           */

          const altura =
            conteudo.getBoundingClientRect()
              .height;

          gsap.to(
            painel,
            {
              height: altura,
              opacity: 1,
              duration: 0.55,
              ease: "power3.out",
            }
          );

          gsap.fromTo(
            conteudo,
            {
              y: -8,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              ease: "power2.out",
              delay: 0.08,
            }
          );
        }

        if (seta) {
          gsap.killTweensOf(
            seta
          );

          gsap.to(
            seta,
            {
              rotate: 180,
              duration: 0.4,
              ease: "power2.inOut",
            }
          );
        }
      }

      pedidoAbertoAnteriorRef.current =
        idAtual;
    },
    {
      dependencies: [
        pedidoAberto,
      ],
      scope: containerRef,
    }
  );

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      className={styles.pagina}
      ref={containerRef}
    >
      <div
        className={styles.container}
      >
        {/* ===================================================
            HEADER
        =================================================== */}

        <header
          className={styles.header}
          ref={headerRef}
        >
          <h1
            className={styles.titulo}
          >
            Meus Pedidos
          </h1>

          <p
            className={
              styles.descricao
            }
          >
            Acompanhe o preparo, o
            envio e a entrega de cada
            peça adquirida na AZORY.
          </p>
        </header>

        {/* ===================================================
            RESUMO
        =================================================== */}

        <div ref={resumoRef}>
          <ResumoCards
            resumo={resumo}
            className={styles.secao}
          />
        </div>

        {/* ===================================================
            FILTROS
        =================================================== */}

        <div ref={filtrosRef}>
          <FiltrosBarra
            filtroAtivo={
              filtroAtivo
            }
            onFiltroChange={
              setFiltroAtivo
            }
            busca={busca}
            onBuscaChange={
              setBusca
            }
            className={
              styles.secao
            }
          />
        </div>

        {/* ===================================================
            LISTA
        =================================================== */}

        <section
          className={styles.lista}
          ref={listaRef}
        >
          {/* =================================================
              CARREGANDO
          ================================================= */}

          {carregando ? (
            <div
              className={
                styles.carregando
              }
            >
              <span
                className={
                  styles.carregandoIcone
                }
              >
                ◇
              </span>

              <p
                className={
                  styles.carregandoTexto
                }
              >
                Carregando seus
                pedidos…
              </p>
            </div>
          ) : erro ? (
            /* ===============================================
               ERRO
            =============================================== */

            <div
              className={
                styles.vazio
              }
            >
              <span
                className={
                  styles.vazioIcone
                }
              >
                ◇
              </span>

              <p
                className={
                  styles.vazioTitulo
                }
              >
                Não foi possível
                carregar seus
                pedidos
              </p>

              <p
                className={
                  styles.vazioTexto
                }
              >
                {erro}
              </p>

              <button
                type="button"
                className={
                  styles.botaoDetalhes
                }
                onClick={
                  carregarPedidos
                }
              >
                Tentar novamente
              </button>
            </div>
          ) : pedidosFiltrados.length >
            0 ? (
            /* ===============================================
               PEDIDOS
            =============================================== */

            pedidosFiltrados.map(
              (pedido) => {
                const aberto =
                  pedidoAberto ===
                  pedido.id;

                const itens =
                  Array.isArray(
                    pedido.itens
                  )
                    ? pedido.itens
                    : [];

                const qtdItens =
                  itens.length;

                const multiplasPecas =
                  qtdItens > 1;

                const limiteVisivel = 3;

                const mostrarResumo =
                  qtdItens >
                  limiteVisivel;

                /*
                 * Mostra no máximo 2 itens
                 * quando existem mais de 3,
                 * deixando o "+ X peças".
                 */

                const itensVisiveis =
                  mostrarResumo
                    ? itens.slice(
                        0,
                        limiteVisivel -
                          1
                      )
                    : itens;

                const itensRestantes =
                  qtdItens -
                  itensVisiveis.length;

                return (
                  <article
                    key={
                      pedido.id
                    }
                    className={`
                      ${styles.card}
                      ${
                        aberto
                          ? styles.cardAberto
                          : ""
                      }
                    `}
                    data-pedido-card
                  >
                    {/* ===================================
                        CABEÇALHO
                    =================================== */}

                    <div
                      className={
                        styles.cabecalho
                      }
                    >
                      <div
                        className={
                          styles.identificacao
                        }
                      >
                        <span
                          className={
                            styles.numeroPedido
                          }
                        >
                          {
                            pedido.numero
                          }
                        </span>

                        <span
                          className={
                            styles.dataCompra
                          }
                        >
                          Comprado em{" "}
                          {
                            pedido.dataCompra
                          }
                        </span>
                      </div>

                      <StatusBadge
                        status={
                          pedido.status
                        }
                      />
                    </div>

                    {/* ===================================
                        CORPO
                    =================================== */}

                    <div
                      className={
                        styles.corpo
                      }
                    >
                      {/* ---------------------------------
                          MINIATURAS
                      --------------------------------- */}

                      <div
                        className={
                          styles.miniaturasGrupo
                        }
                      >
                        {itensVisiveis.map(
                          (
                            item,
                            index
                          ) => (
                            <div
                              key={`${pedido.id}-${item.id}-${index}`}
                              className={
                                styles.itemLinha
                              }
                            >
                              <span
                                className={`
                                  ${styles.miniatura}
                                  ${
                                    styles[
                                      `tom-${item.tom}`
                                    ] ??
                                    ""
                                  }
                                  ${
                                    !multiplasPecas
                                      ? styles.miniaturaUnica
                                      : ""
                                  }
                                `}
                              >
                                {/* FALLBACK */}
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  className={
                                    styles.miniaturaFallback
                                  }
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M12 3 4 9l8 12 8-12-8-6Z"
                                    stroke="currentColor"
                                    strokeWidth="1.1"
                                    strokeLinejoin="round"
                                  />

                                  <path
                                    d="M4 9h16M9 9l3 12 3-12"
                                    stroke="currentColor"
                                    strokeWidth="1.1"
                                    strokeLinejoin="round"
                                  />
                                </svg>

                                {/* IMAGEM */}
                                {item.imagem && (
                                  <img
                                    src={
                                      item.imagem
                                    }
                                    alt={
                                      item.nome ??
                                      "Produto"
                                    }
                                    className={
                                      styles.miniaturaImg
                                    }
                                    onError={(
                                      event
                                    ) => {
                                      event.currentTarget.style.display =
                                        "none";
                                    }}
                                  />
                                )}
                              </span>

                              <span
                                className={
                                  styles.itemNomeCard
                                }
                              >
                                {
                                  item.nome
                                }
                              </span>
                            </div>
                          )
                        )}

                        {/* ---------------------------------
                            MAIS ITENS
                        --------------------------------- */}

                        {mostrarResumo && (
                          <div
                            className={
                              styles.itemLinha
                            }
                          >
                            <span
                              className={
                                styles.maisTexto
                              }
                            >
                              +{" "}
                              {
                                itensRestantes
                              }{" "}
                              {itensRestantes ===
                              1
                                ? "peça"
                                : "peças"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* ---------------------------------
                          AÇÕES / VALOR
                      --------------------------------- */}

                      <div
                        className={
                          styles.acoes
                        }
                      >
                        <div
                          className={
                            styles.valorBloco
                          }
                        >
                          <span
                            className={
                              styles.valorLabel
                            }
                          >
                            Total (
                            {
                              qtdItens
                            }{" "}
                            {qtdItens ===
                            1
                              ? "peça"
                              : "peças"}
                            )
                          </span>

                          <span
                            className={
                              styles.valorTotal
                            }
                          >
                            {
                              pedido.valorTotal
                            }
                          </span>
                        </div>

                        <button
                          type="button"
                          className={`${styles.botaoDetalhes} btnPadrao`}
                          onClick={() =>
                            setPedidoAberto(
                              aberto
                                ? null
                                : pedido.id
                            )
                          }
                          aria-expanded={
                            aberto
                          }
                          aria-controls={`pedido-detalhes-${pedido.id}`}
                        >
                          {aberto
                            ? "Ocultar detalhes"
                            : "Ver detalhes"}

                          <svg
                            ref={(el) => {
                              setaRefs.current[
                                pedido.id
                              ] = el;
                            }}
                            viewBox="0 0 24 24"
                            fill="none"
                            className={
                              styles.seta
                            }
                            aria-hidden="true"
                          >
                            <path
                              d="M6 9l6 6 6-6"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* ===================================
                        DETALHES
                    =================================== */}

                    <div
                      id={`pedido-detalhes-${pedido.id}`}
                      className={
                        styles.painel
                      }
                      ref={(el) => {
                        painelRefs.current[
                          pedido.id
                        ] = el;
                      }}
                      style={{
                        display:
                          "none",
                        height: 0,
                        overflow:
                          "hidden",
                      }}
                    >
                      <div
                        ref={(el) => {
                          conteudoRefs.current[
                            pedido.id
                          ] = el;
                        }}
                      >
                        <PedidoDetalhes
                          pedido={
                            pedido
                          }
                        />
                      </div>
                    </div>
                  </article>
                );
              }
            )
          ) : (
            /* ===============================================
               NENHUM PEDIDO
            =============================================== */

            <div
              className={
                styles.vazio
              }
            >
              <span
                className={
                  styles.vazioIcone
                }
              >
                ◇
              </span>

              <p
                className={
                  styles.vazioTitulo
                }
              >
                Nenhum pedido
                encontrado
              </p>

              <p
                className={
                  styles.vazioTexto
                }
              >
                {pedidos.length ===
                0
                  ? "Você ainda não realizou nenhum pedido."
                  : "Ajuste os filtros ou o termo de busca para encontrar o que procura."}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}