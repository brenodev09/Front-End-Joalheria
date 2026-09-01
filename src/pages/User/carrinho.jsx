import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import estilos from "../../styles/User/carrinho.module.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer"
import { useCarrinho } from "../../context/carrinhoContext";
import { api } from "../../services/api";

gsap.registerPlugin(useGSAP);

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

const PRAZO_PAGAMENTO_MINUTOS = 30;

export default function Carrinho() {
  const containerRef = useRef(null);

  const {
    itens,
    atualizarQuantidade,
    removerProduto,
    subtotal,
    carregarCarrinho,
  } = useCarrinho();

  const produtos = itens || [];

  /* =========================================================
     ESTADO PRINCIPAL
  ========================================================= */

  const [etapaAtual, setEtapaAtual] = useState(1);
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false);
  const [pagamentoExpirado, setPagamentoExpirado] = useState(false);
  const [segundosRestantes, setSegundosRestantes] = useState(0);

  /* =========================================================
     ENTREGA
  ========================================================= */

  const [entregaSelecionada, setEntregaSelecionada] =
    useState("padrao");

  const [enderecoForm, setEnderecoForm] = useState({
    nome: "",
    telefone: "",
    endereco: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
  });

  const [tentouAvancarEntrega, setTentouAvancarEntrega] =
    useState(false);

  /* =========================================================
     PAGAMENTO
  ========================================================= */

  const [formaPagamento, setFormaPagamento] =
    useState("cartao");

  const [emailPagamento, setEmailPagamento] =
    useState("");

  const [tentouFinalizarPagamento, setTentouFinalizarPagamento] =
    useState(false);

  const [cartaoForm, setCartaoForm] = useState({
    numero: "",
    nome: "",
    validade: "",
    cvv: "",
  });

  /* =========================================================
     CUPOM
  ========================================================= */

  const [cupom, setCupom] = useState("");
  const [cuponsDisponiveis, setCuponsDisponiveis] = useState([]);
  const [carregandoCupons, setCarregandoCupons] = useState(false);
  const [desconto, setDesconto] = useState(0);
  const [cupomAplicado, setCupomAplicado] = useState(null);
  const [erroCupom, setErroCupom] = useState("");
  const [aplicandoCupom, setAplicandoCupom] =
    useState(false);

  /* =========================================================
     FINALIZAÇÃO
  ========================================================= */

  const [valorPedidoFinalizado, setValorPedidoFinalizado] =
    useState(0);
  const [pixQr, setPixQr] = useState(null)
  const [pixCopiaCola, setPixCopiaCola] = useState("")
  const [codigoPedido, setCodigoPedido] = useState(null);

  const [finalizando, setFinalizando] = useState(false);

  const [erroFinalizacao, setErroFinalizacao] =
    useState("");

  const pollingPixRef = useRef(null);
  const expiracaoPagamentoRef = useRef(null);

  useEffect(() => {
    async function carregarCuponsDisponiveis() {
      try {
        setCarregandoCupons(true);
        const token = localStorage.getItem("token");
        const resposta = await api.get("/cupons/disponiveis", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const dados = Array.isArray(resposta.data)
          ? resposta.data
          : resposta.data?.cupons || [];
        setCuponsDisponiveis(dados);
      } catch (error) {
        console.error("Erro ao carregar cupons disponíveis:", error);
        setCuponsDisponiveis([]);
      } finally {
        setCarregandoCupons(false);
      }
    }

    carregarCuponsDisponiveis();
  }, []);

  useEffect(() => {
    return () => {
      if (pollingPixRef.current) {
        clearInterval(pollingPixRef.current);
      }
      if (expiracaoPagamentoRef.current) {
        clearInterval(expiracaoPagamentoRef.current);
      }
    };
  }, []);

  function iniciarPrazoPagamento(pedidoId, expiraEm) {
    const prazo = expiraEm
      ? new Date(expiraEm).getTime()
      : Date.now() + PRAZO_PAGAMENTO_MINUTOS * 60 * 1000;

    const atualizarPrazo = async () => {
      const restante = Math.max(0, Math.ceil((prazo - Date.now()) / 1000));
      setSegundosRestantes(restante);

      if (restante > 0) return;

      clearInterval(expiracaoPagamentoRef.current);
      expiracaoPagamentoRef.current = null;
      clearInterval(pollingPixRef.current);
      pollingPixRef.current = null;
      setPagamentoExpirado(true);

      try {
        await api.patch(`/pedidos/${pedidoId}/cancelar`);
      } catch (error) {
        console.error("Erro ao cancelar pedido expirado:", error);
      }
    };

    atualizarPrazo();
    expiracaoPagamentoRef.current = setInterval(atualizarPrazo, 1000);
  }

  function formatarPrazoPagamento() {
    const minutos = Math.floor(segundosRestantes / 60);
    const segundos = String(segundosRestantes % 60).padStart(2, "0");
    return `${String(minutos).padStart(2, "0")}:${segundos}`;
  }

  /* =========================================================
     CONFIGURAÇÕES
  ========================================================= */







  const etapas = [
    {
      numero: 1,
      label: "Carrinho",
    },
    {
      numero: 2,
      label: "Entrega",
    },
    {
      numero: 3,
      label: "Pagamento",
    },
  ];

  const opcoesEntrega = [
    {
      id: "padrao",
      nome: "Entrega Padrão",
      prazo: "5 a 7 dias úteis",
      preco: 0,
    },
    {
      id: "expressa",
      nome: "Entrega Expressa",
      prazo: "2 a 3 dias úteis",
      preco: 25,
    },
    {
      id: "retirada",
      nome: "Retirada em Boutique",
      prazo: "Disponível em 24h",
      preco: 0,
    },
  ];

  const abasPagamento = [
    {
      id: "cartao",
      label: "Cartão",
    },
    {
      id: "pix",
      label: "Pix",
    },
    {
      id: "boleto",
      label: "Boleto",
    },
  ];

  /* =========================================================
     VALORES
  ========================================================= */

  const valorEntrega =
    opcoesEntrega.find(
      (opcao) => opcao.id === entregaSelecionada
    )?.preco ?? 0;

  const totalComDesconto = Math.max(
    Number(subtotal || 0) - Number(desconto || 0),
    0
  );

  const totalFinalCarrinho =
    totalComDesconto + valorEntrega;

  const totalItens = produtos.reduce(
    (acumulado, item) =>
      acumulado + Number(item.quantidade || 0),
    0
  );

  /* =========================================================
     ANIMAÇÕES
  ========================================================= */

  useGSAP(
    () => {
      const timelineEntrada = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timelineEntrada
        .from(`.${estilos.etapa}`, {
          opacity: 0,
          y: 16,
          duration: 0.6,
          stagger: 0.12,
        })
        .from(
          `.${estilos.linhaProgresso}`,
          {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.9,
            ease: "power2.inOut",
          },
          "-=0.5"
        );

      gsap.from(`.${estilos.recomendadoCard}`, {
        opacity: 0,
        y: 40,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.8,
      });
    },
    {
      scope: containerRef,
    }
  );

  useGSAP(
    () => {
      gsap.fromTo(
        `.${estilos.titulo}`,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        `.${estilos.conteudoEtapa}`,
        {
          opacity: 0,
          x: -24,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.55,
          ease: "power3.out",
          delay: 0.08,
        }
      );

      gsap.fromTo(
        `.${estilos.resumoPedido}`,
        {
          opacity: 0,
          x: 24,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power3.out",
          delay: 0.12,
        }
      );
    },
    {
      scope: containerRef,
      dependencies: [etapaAtual, pedidoConfirmado],
    }
  );

  /* =========================================================
     UTILITÁRIOS
  ========================================================= */

  const formatarPreco = (valor) =>
    Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  function imagemProduto(imagem) {
    if (!imagem) return "";

    if (
      imagem.startsWith("http://") ||
      imagem.startsWith("https://")
    ) {
      return imagem;
    }

    return `${API_BASE_URL}${imagem.startsWith("/") ? imagem : `/${imagem}`
      }`;
  }

  /* =========================================================
     ENDEREÇO
  ========================================================= */

  const camposEndereco = [
    "nome",
    "telefone",
    "endereco",
    "numero",
    "bairro",
    "cidade",
    "estado",
    "cep",
  ];

  const rotulosCampoEndereco = {
    nome: "Nome Completo",
    telefone: "Telefone",
    endereco: "Endereço",
    numero: "Número",
    bairro: "Bairro",
    cidade: "Cidade",
    estado: "UF",
    cep: "CEP",
  };

  const placeholdersCampoEndereco = {
    nome: "Seu nome completo",
    telefone: "(00) 00000-0000",
    endereco: "Rua, avenida...",
    numero: "Número",
    bairro: "Seu bairro",
    cidade: "Sua cidade",
    estado: "UF",
    cep: "00000-000",
  };

  function aoMudarCampoEndereco(evento) {
    const { name, value } = evento.target;

    setEnderecoForm((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  /*
   * Retirada NÃO exige endereço.
   */
  const entregaValida =
    entregaSelecionada === "retirada" ||
    camposEndereco.every(
      (campo) =>
        enderecoForm[campo]?.trim() !== ""
    );

  function classeCampoEndereco(campo, extra) {
    const erro =
      tentouAvancarEntrega &&
      entregaSelecionada !== "retirada" &&
      !enderecoForm[campo]?.trim();

    return [
      estilos.campo,
      extra ? estilos[extra] : "",
      erro ? estilos.campoErro : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  /* =========================================================
     CARTÃO
  ========================================================= */

  function aoMudarCampoCartao(evento) {
    const { name, value } = evento.target;

    setCartaoForm((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  const numeroCartaoValido =
    cartaoForm.numero.replace(/\D/g, "").length >= 13;

  const validadeCartaoValida =
    /^\d{2}\/\d{2}$/.test(
      cartaoForm.validade.trim()
    );

  const cvvValido =
    /^\d{3,4}$/.test(
      cartaoForm.cvv.trim()
    );

  const nomeCartaoValido =
    cartaoForm.nome.trim() !== "";

  const cartaoValido =
    numeroCartaoValido &&
    validadeCartaoValida &&
    cvvValido &&
    nomeCartaoValido;

  function classeCampoCartao(campo) {
    let valido = true;

    if (campo === "numero")
      valido = numeroCartaoValido;

    if (campo === "nome")
      valido = nomeCartaoValido;

    if (campo === "validade")
      valido = validadeCartaoValida;

    if (campo === "cvv")
      valido = cvvValido;

    return [
      estilos.campo,
      campo === "numero" || campo === "nome"
        ? estilos.campoLargo
        : "",
      tentouFinalizarPagamento && !valido
        ? estilos.campoErro
        : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  /* =========================================================
     PAGAMENTOS ALTERNATIVOS
  ========================================================= */

  const emailValido =
    /^\S+@\S+\.\S+$/.test(
      emailPagamento.trim()
    );

  const pagamentoValido =
    formaPagamento === "cartao"
      ? cartaoValido
      : emailValido;

  /* =========================================================
     ENTREGA
  ========================================================= */

  const opcaoEntregaEscolhida =
    opcoesEntrega.find(
      (opcao) =>
        opcao.id === entregaSelecionada
    );

  /* =========================================================
     CUPOM
  ========================================================= */

  async function aplicarCupom() {
    const codigo = cupom.trim();

    setErroCupom("");

    if (!codigo) {
      setErroCupom(
        "Informe um código de cupom."
      );
      return;
    }

    if (cupomAplicado) {
      setErroCupom(
        "Já existe um cupom aplicado."
      );
      return;
    }

    try {
      setAplicandoCupom(true);

      const resposta = await api.post(
        "/cupons/validar-cupom",
        {
          codigo,
          subTotal: Number(subtotal),
        }
      );

      const dados = resposta.data;

      setDesconto(
        Number(dados.desconto || 0)
      );

      setCupomAplicado(
        dados.codigo || codigo
      );

      setCupom(
        dados.codigo || codigo
      );
    } catch (error) {
      console.error(
        "Erro ao validar cupom:",
        error
      );

      const mensagem =
        error.response?.data?.erro ||
        error.response?.data?.message ||
        "Não foi possível validar o cupom.";

      setErroCupom(mensagem);
      setDesconto(0);
      setCupomAplicado(null);
    } finally {
      setAplicandoCupom(false);
    }
  }

  function removerCupom() {
    setCupom("");
    setDesconto(0);
    setCupomAplicado(null);
    setErroCupom("");
  }

  /* =========================================================
     BANDEIRA
  ========================================================= */

  function detectarBandeira(numero) {
    const limpo =
      numero.replace(/\D/g, "");

    if (/^4/.test(limpo))
      return "Visa";

    if (/^5[1-5]/.test(limpo))
      return "Mastercard";

    if (/^3[47]/.test(limpo))
      return "American Express";

    if (/^(636368|438935|504175|451416)/.test(limpo))
      return "Elo";

    return "Outra";
  }

  /* =========================================================
     FINALIZAÇÃO DO PEDIDO
  ========================================================= */

  function iniciarPollingPix(pedidoId) {
    if (!pedidoId) return;

    const token = localStorage.getItem("token");
    pollingPixRef.current = setInterval(async () => {
      try {
        const resposta = await api.get(
          `/pedidos/${pedidoId}/pagamento/status`,
          {
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : {},
          }
        );

        if (
          ["aprovado", "aprovada", "pago", "paga"].includes(
            resposta.data?.status?.toLowerCase()
          )
        ) {
          clearInterval(pollingPixRef.current);
          pollingPixRef.current = null;
          clearInterval(expiracaoPagamentoRef.current);
          expiracaoPagamentoRef.current = null;
          setSegundosRestantes(0);
          setPedidoConfirmado(true);
        }
      } catch (error) {
        console.error("Erro no polling PIX:", error);
      }
    }, 4000);
  }

  async function finalizarCompra() {
    setErroFinalizacao("");

    try {
      setFinalizando(true);

      /*
       * O interceptor do axios deve cuidar do token.
       * Ainda enviamos Authorization caso seu api.js não faça isso.
       */
      const token =
        localStorage.getItem("token");

      const payload = {
        forma_pagamento: formaPagamento,
        tipo_entrega: entregaSelecionada,
      };

      if (cupomAplicado) {
        payload.codigo = cupomAplicado;
      }

      if (entregaSelecionada !== "retirada") {
        payload.endereco = {
          nome_destinatario: enderecoForm.nome,
          telefone: enderecoForm.telefone,
          rua: enderecoForm.endereco,
          numero: enderecoForm.numero,
          bairro: enderecoForm.bairro,
          cidade: enderecoForm.cidade,
          estado: enderecoForm.estado,
          cep: enderecoForm.cep,
        };
      }

      if (formaPagamento === "cartao") {
        payload.dados_cartao = {
          numero: cartaoForm.numero,
          nome_titular: cartaoForm.nome,
          bandeira: detectarBandeira(cartaoForm.numero),
        };
      }

      if (formaPagamento === "pix" || formaPagamento === "boleto") {
        payload.email_pagamento = emailPagamento.trim();
      }

      const configuracao = token
        ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        : {};

      /*
       * Garante que os itens exibidos no frontend também existam
       * no carrinho persistido antes de criar o pedido.
       */
      for (const item of produtos) {
        const temConfiguracao =
          item.configuracao && Object.keys(item.configuracao).length > 0;

        await api.post(
          "/carrinho",
          {
            produto_id: Number(item.produto_id || item.id),
            quantidade: Number(item.quantidade) || 1,
            variacao_id: item.variacao_id || null,
            ...(temConfiguracao ? { configuracao: item.configuracao } : {}),
          },
          configuracao
        );
      }

      const resposta =
        await api.post(
          "/pedidos",
          payload,
          configuracao
        );
      const pag = resposta.data?.pagamento;

      const pedidoId =
        resposta.data?.pedidoId ??
        resposta.data?.id;

      const statusPagamento = String(
        resposta.data?.statusPagamento ??
        resposta.data?.status_pagamento ??
        resposta.data?.status ??
        ""
      ).toLowerCase();
      const pagamentoAprovado = [
        "aprovado",
        "aprovada",
        "pago",
        "paga",
      ].includes(statusPagamento);

      if (formaPagamento === "pix" && pag) {
        setPixQr(
          pag.qrCodeBase64 ??
          pag.qr_code_base64 ??
          pag.qrCode ??
          pag.qr_code ??
          null
        );
        setPixCopiaCola(
          pag.codigoPix ??
          pag.codigo_pix ??
          pag.copiaCola ??
          pag.copia_cola ??
          ""
        );
      }

      if (!pagamentoAprovado) {
        iniciarPollingPix(pedidoId);
      }

      if (!pagamentoAprovado) {
        iniciarPrazoPagamento(
          pedidoId,
          resposta.data?.expiraEm ?? resposta.data?.expira_em
        );
      }

      console.log(
        "Pedido criado:",
        resposta.data
      );

      const totalResposta =
        resposta.data?.total ??
        totalFinalCarrinho;

      setCodigoPedido(
        pedidoId
      );

      setValorPedidoFinalizado(
        Number(totalResposta)
      );

      /*
       * Mostra a confirmação antes de atualizar o carrinho.
       * O backend pode esvaziá-lo após criar o pedido.
       */
      setPedidoConfirmado(pagamentoAprovado);

      /*
       * Atualiza o contexto do carrinho em segundo plano.
       */
      await carregarCarrinho();
    } catch (error) {
      console.error(
        "Erro ao finalizar pedido:",
        error
      );

      const dadosErro = error.response?.data;
      const detalhesBrutos =
        dadosErro?.errors || dadosErro?.details;
      const detalhes = Array.isArray(detalhesBrutos)
        ? detalhesBrutos.join(" ")
        : typeof detalhesBrutos === "string"
          ? detalhesBrutos
          : detalhesBrutos
            ? JSON.stringify(detalhesBrutos)
            : "";

      const mensagem =
        dadosErro?.erro ||
        dadosErro?.message ||
        detalhes ||
        "Erro ao finalizar o pedido. Por favor, tente novamente.";

      setErroFinalizacao(
        mensagem
      );
    } finally {
      setFinalizando(false);
    }
  }

  /* =========================================================
     NAVEGAÇÃO
  ========================================================= */

  function irParaEtapa(numero) {
    if (
      numero <= etapaAtual &&
      !pedidoConfirmado
    ) {
      setEtapaAtual(numero);
    }
  }

  async function aoClicarBotaoPrincipal() {
    if (produtos.length === 0)
      return;

    /*
     * CARRINHO
     */
    if (etapaAtual === 1) {
      setEtapaAtual(2);
      return;
    }

    /*
     * ENTREGA
     */
    if (etapaAtual === 2) {
      if (!entregaValida) {
        setTentouAvancarEntrega(
          true
        );
        return;
      }

      setTentouAvancarEntrega(
        false
      );

      setEtapaAtual(3);
      return;
    }

    /*
     * PAGAMENTO
     */
    if (!pagamentoValido) {
      setTentouFinalizarPagamento(
        true
      );
      return;
    }

    setTentouFinalizarPagamento(
      false
    );

    await finalizarCompra();
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      className={estilos.pagina}
      ref={containerRef}
    >
      <Header />

      {/* =====================================================
          STEPPER
      ===================================================== */}

      <nav
        className={estilos.stepper}
        aria-label="Etapas da compra"
      >
        <div
          className={
            estilos.stepperLinhaBase
          }
        >
          <div
            className={
              estilos.linhaProgresso
            }
            style={{
              width:
                etapaAtual === 1
                  ? "0%"
                  : etapaAtual === 2
                    ? "50%"
                    : "100%",
            }}
          />
        </div>

        {etapas.map((etapa) => {
          const concluida =
            etapa.numero <
            etapaAtual ||
            pedidoConfirmado;

          const ativa =
            etapa.numero ===
            etapaAtual &&
            !pedidoConfirmado;

          const clicavel =
            etapa.numero <=
            etapaAtual &&
            !pedidoConfirmado;

          return (
            <button
              key={etapa.numero}
              type="button"
              onClick={() =>
                irParaEtapa(
                  etapa.numero
                )
              }
              className={`
                ${estilos.etapa}
                ${ativa
                  ? estilos.etapaAtiva
                  : ""
                }
                ${concluida
                  ? estilos.etapaConcluida
                  : ""
                }
              `}
              style={{
                cursor: clicavel
                  ? "pointer"
                  : "default",
              }}
              disabled={
                !clicavel
              }
            >
              <span
                className={
                  estilos.etapaCirculo
                }
              >
                {concluida
                  ? "✓"
                  : etapa.numero}
              </span>

              <span
                className={
                  estilos.etapaTexto
                }
              >
                {etapa.label}
              </span>
            </button>
          );
        })}
      </nav>

      <main
        className={
          estilos.conteudoPrincipal
        }
      >
        {/* ===================================================
            CONFIRMAÇÃO
        =================================================== */}

        {codigoPedido ? (
          <div
            className={
              estilos.confirmacaoWrapper
            }
          >
            <span
              className={
                estilos.confirmacaoIcone
              }
            >
              {pagamentoExpirado ? "!" : pedidoConfirmado ? "✓" : "..."}
            </span>

            <h1
              className={
                estilos.titulo
              }
            >
              {pagamentoExpirado
                ? "Pedido cancelado"
                : pedidoConfirmado
                  ? "Pedido confirmado"
                  : "Aguardando pagamento"}
            </h1>

            <p
              className={
                estilos.confirmacaoTexto
              }
            >
              {pagamentoExpirado
                ? "O prazo para pagamento terminou. Seu pedido"
                : pedidoConfirmado
                  ? "Obrigado por escolher a Azory. Seu pedido"
                  : "Seu pedido foi registrado. Efetue o pagamento em até"}{" "}
              <strong>
                #AZ-
                {codigoPedido}
              </strong>
              {!pagamentoExpirado && !pedidoConfirmado && (
                <> para evitar o cancelamento automático.</>
              )}
            </p>

            {!pagamentoExpirado && !pedidoConfirmado && (
              <p className={estilos.prazoPagamento}>
                Tempo restante: <strong>{formatarPrazoPagamento()}</strong>
              </p>
            )}

            {pedidoConfirmado && formaPagamento ===
              "cartao" && (
                <p
                  className={
                    estilos.confirmacaoTexto
                  }
                >
                  Seu pedido está sendo
                  preparado com todo o
                  cuidado de nossos
                  artesãos.
                </p>
              )}

            {!pagamentoExpirado && formaPagamento ===
              "pix" && (
                <>
                  <p
                    className={
                      estilos.confirmacaoTexto
                    }
                  >
                    Escaneie o QR Code ou copie
                    o código PIX para concluir o
                    pagamento.
                  </p>

                  {pixQr && (
                    <img
                      src={
                        pixQr.startsWith("data:")
                          ? pixQr
                          : `data:image/png;base64,${pixQr}`
                      }
                      alt="QR Code para pagamento PIX"
                      className={estilos.pixQr}
                    />
                  )}

                  {pixCopiaCola && (
                    <div className={estilos.pixCodigoWrapper}>
                      <input
                        type="text"
                        value={pixCopiaCola}
                        readOnly
                        aria-label="Código PIX copia e cola"
                        className={estilos.pixCodigo}
                      />
                      <button
                        type="button"
                        className={estilos.pixCopiar}
                        onClick={() =>
                          navigator.clipboard.writeText(pixCopiaCola)
                        }
                      >
                        Copiar código PIX
                      </button>
                    </div>
                  )}
                </>
              )}

            {!pagamentoExpirado && formaPagamento ===
              "boleto" && (
                <p
                  className={
                    estilos.confirmacaoTexto
                  }
                >
                  O boleto foi
                  encaminhado para{" "}
                  <strong>
                    {emailPagamento}
                  </strong>
                  .
                </p>
              )}

            <div
              className={
                estilos.confirmacaoTotal
              }
            >
              Total do pedido:{" "}
              <strong>
                {formatarPreco(
                  valorPedidoFinalizado
                )}
              </strong>
            </div>
          </div>
        ) : (
          <>
            {/* =================================================
                TÍTULO
            ================================================= */}

            <h1
              className={
                estilos.titulo
              }
            >
              {etapaAtual === 1 &&
                "Seu Carrinho"}

              {etapaAtual === 2 &&
                "Informações de Entrega"}

              {etapaAtual === 3 &&
                "Pagamento"}
            </h1>

            <div
              className={
                estilos.grade
              }
            >
              {/* =================================================
                  COLUNA ESQUERDA
              ================================================= */}

              <section
                className={
                  estilos.colunaEsquerda
                }
              >
                <div
                  className={
                    estilos.conteudoEtapa
                  }
                >
                  {/* =================================================
                      ETAPA 1
                  ================================================= */}

                  {etapaAtual === 1 && (
                    <>
                      {produtos.length ===
                        0 ? (
                        <p
                          className={
                            estilos.carrinhoVazio
                          }
                        >
                          Seu carrinho
                          está vazio.
                        </p>
                      ) : (
                        <div
                          className={
                            estilos.listaProdutos
                          }
                        >
                          {produtos.map(
                            (produto) => (
                              <article
                                key={
                                  produto.id
                                }
                                className={
                                  estilos.produtoItem
                                }
                              >
                                <div
                                  className={
                                    estilos.produtoImagemWrapper
                                  }
                                >
                                  <img
                                    src={imagemProduto(
                                      produto.imagem
                                    )}
                                    alt={
                                      produto.nome
                                    }
                                    className={
                                      estilos.produtoImagem
                                    }
                                  />
                                </div>

                                <div
                                  className={
                                    estilos.produtoInfo
                                  }
                                >
                                  <div
                                    className={
                                      estilos.produtoCabecalho
                                    }
                                  >
                                    <h2
                                      className={
                                        estilos.produtoNome
                                      }
                                    >
                                      {
                                        produto.nome
                                      }
                                    </h2>

                                    <button
                                      type="button"
                                      className={
                                        estilos.botaoRemover
                                      }
                                      onClick={() =>
                                        removerProduto(
                                          produto.id
                                        )
                                      }
                                    >
                                      Remover
                                    </button>
                                  </div>

                                  <p
                                    className={
                                      estilos.produtoDescricao
                                    }
                                  >
                                    {
                                      produto.descricao
                                    }
                                  </p>

                                  <p
                                    className={
                                      estilos.produtoAtributos
                                    }
                                  >
                                    Material:{" "}
                                    <strong>
                                      {
                                        produto.material
                                      }
                                    </strong>

                                    {produto.variacao && (
                                      <>
                                        &nbsp;|&nbsp;
                                        Tamanho:{" "}
                                        <strong>
                                          {
                                            produto.variacao
                                          }
                                        </strong>
                                      </>
                                    )}
                                  </p>

                                  <div
                                    className={
                                      estilos.produtoRodape
                                    }
                                  >
                                    <div
                                      className={
                                        estilos.quantidadeControle
                                      }
                                    >
                                      <button
                                        type="button"
                                        className={
                                          estilos.quantidadeBotao
                                        }
                                        onClick={() =>
                                          atualizarQuantidade(
                                            produto.id,
                                            Math.max(
                                              1,
                                              produto.quantidade -
                                              1
                                            )
                                          )
                                        }
                                      >
                                        −
                                      </button>

                                      <span
                                        className={
                                          estilos.quantidadeValor
                                        }
                                      >
                                        {
                                          produto.quantidade
                                        }
                                      </span>

                                      <button
                                        type="button"
                                        className={
                                          estilos.quantidadeBotao
                                        }
                                        onClick={() =>
                                          atualizarQuantidade(
                                            produto.id,
                                            produto.quantidade +
                                            1
                                          )
                                        }
                                      >
                                        +
                                      </button>
                                    </div>

                                    <span
                                      className={
                                        estilos.precoAtual
                                      }
                                    >
                                      {formatarPreco(
                                        Number(
                                          produto.preco
                                        ) *
                                        Number(
                                          produto.quantidade
                                        )
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </article>
                            )
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {/* =================================================
                      ETAPA 2
                  ================================================= */}

                  {etapaAtual === 2 && (
                    <div
                      className={
                        estilos.formularioEtapa
                      }
                    >
                      {entregaSelecionada !==
                        "retirada" && (
                          <>
                            <h2
                              className={
                                estilos.formularioTitulo
                              }
                            >
                              Endereço de
                              Entrega
                            </h2>

                            {tentouAvancarEntrega &&
                              !entregaValida && (
                                <p
                                  className={
                                    estilos.mensagemErro
                                  }
                                >
                                  Preencha todos
                                  os campos
                                  obrigatórios
                                  para
                                  continuar.
                                </p>
                              )}

                            <div
                              className={
                                estilos.formularioGrade
                              }
                            >
                              {camposEndereco.map(
                                (campo) => (
                                  <label
                                    key={
                                      campo
                                    }
                                    className={classeCampoEndereco(
                                      campo,
                                      campo ===
                                        "endereco"
                                        ? "campoLargo"
                                        : undefined
                                    )}
                                  >
                                    <span>
                                      {
                                        rotulosCampoEndereco[
                                        campo
                                        ]
                                      }
                                    </span>

                                    <input
                                      type="text"
                                      name={
                                        campo
                                      }
                                      value={
                                        enderecoForm[
                                        campo
                                        ]
                                      }
                                      onChange={
                                        aoMudarCampoEndereco
                                      }
                                      placeholder={
                                        placeholdersCampoEndereco[
                                        campo
                                        ]
                                      }
                                    />
                                  </label>
                                )
                              )}
                            </div>
                          </>
                        )}

                      {entregaSelecionada ===
                        "retirada" && (
                          <div>
                            <h2
                              className={
                                estilos.formularioTitulo
                              }
                            >
                              Retirada em
                              Boutique
                            </h2>

                            <p
                              className={
                                estilos.mensagemPagamentoAlternativo
                              }
                            >
                              Seu pedido
                              ficará
                              disponível
                              para retirada
                              em até 24
                              horas.
                            </p>
                          </div>
                        )}

                      <h2
                        className={
                          estilos.formularioTitulo
                        }
                      >
                        Método de
                        Entrega
                      </h2>

                      <div
                        className={
                          estilos.opcoesEntrega
                        }
                      >
                        {opcoesEntrega.map(
                          (opcao) => (
                            <label
                              key={
                                opcao.id
                              }
                              className={`
                                ${estilos.opcaoEntregaCard}
                                ${entregaSelecionada ===
                                  opcao.id
                                  ? estilos.opcaoEntregaSelecionada
                                  : ""
                                }
                              `}
                            >
                              <input
                                type="radio"
                                name="entrega"
                                value={
                                  opcao.id
                                }
                                checked={
                                  entregaSelecionada ===
                                  opcao.id
                                }
                                onChange={() =>
                                  setEntregaSelecionada(
                                    opcao.id
                                  )
                                }
                              />

                              <div
                                className={
                                  estilos.opcaoEntregaInfo
                                }
                              >
                                <span
                                  className={
                                    estilos.opcaoEntregaNome
                                  }
                                >
                                  {
                                    opcao.nome
                                  }
                                </span>

                                <span
                                  className={
                                    estilos.opcaoEntregaPrazo
                                  }
                                >
                                  {
                                    opcao.prazo
                                  }
                                </span>
                              </div>

                              <span
                                className={
                                  estilos.opcaoEntregaPreco
                                }
                              >
                                {opcao.preco ===
                                  0
                                  ? "Grátis"
                                  : formatarPreco(
                                    opcao.preco
                                  )}
                              </span>
                            </label>
                          )
                        )}
                      </div>

                      <button
                        type="button"
                        className={
                          estilos.botaoVoltar
                        }
                        onClick={() =>
                          setEtapaAtual(1)
                        }
                      >
                        ← Voltar ao
                        Carrinho
                      </button>
                    </div>
                  )}

                  {/* =================================================
                      ETAPA 3
                  ================================================= */}

                  {etapaAtual === 3 && (
                    <div
                      className={
                        estilos.formularioEtapa
                      }
                    >
                      <h2
                        className={
                          estilos.formularioTitulo
                        }
                      >
                        Resumo da
                        Entrega
                      </h2>

                      <div
                        className={
                          estilos.resumoEntregaCard
                        }
                      >
                        {entregaSelecionada ===
                          "retirada" ? (
                          <>
                            <p
                              className={
                                estilos.resumoEntregaNome
                              }
                            >
                              Retirada em
                              Boutique
                            </p>

                            <p
                              className={
                                estilos.resumoEntregaTexto
                              }
                            >
                              Disponível em
                              até 24 horas.
                            </p>
                          </>
                        ) : (
                          <>
                            <p
                              className={
                                estilos.resumoEntregaNome
                              }
                            >
                              {
                                enderecoForm.nome
                              }
                            </p>

                            <p
                              className={
                                estilos.resumoEntregaTexto
                              }
                            >
                              {
                                enderecoForm.endereco
                              }
                              ,{" "}
                              {
                                enderecoForm.numero
                              }{" "}
                              —{" "}
                              {
                                enderecoForm.bairro
                              }
                            </p>

                            <p
                              className={
                                estilos.resumoEntregaTexto
                              }
                            >
                              {
                                enderecoForm.cidade
                              }{" "}
                              -{" "}
                              {
                                enderecoForm.estado
                              }
                              ,{" "}
                              {
                                enderecoForm.cep
                              }
                            </p>

                            <p
                              className={
                                estilos.resumoEntregaTexto
                              }
                            >
                              Telefone:{" "}
                              {
                                enderecoForm.telefone
                              }
                            </p>
                          </>
                        )}

                        {opcaoEntregaEscolhida && (
                          <p
                            className={
                              estilos.resumoEntregaMetodo
                            }
                          >
                            {
                              opcaoEntregaEscolhida.nome
                            }{" "}
                            —{" "}
                            {
                              opcaoEntregaEscolhida.prazo
                            }{" "}
                            —{" "}
                            {opcaoEntregaEscolhida.preco ===
                              0
                              ? "Grátis"
                              : formatarPreco(
                                opcaoEntregaEscolhida.preco
                              )}
                          </p>
                        )}
                      </div>

                      <h2
                        className={
                          estilos.formularioTitulo
                        }
                      >
                        Forma de
                        Pagamento
                      </h2>

                      <div
                        className={
                          estilos.abasPagamento
                        }
                      >
                        {abasPagamento.map(
                          (aba) => (
                            <button
                              key={
                                aba.id
                              }
                              type="button"
                              className={`
                                ${estilos.abaPagamento}
                                ${formaPagamento ===
                                  aba.id
                                  ? estilos.abaPagamentoAtiva
                                  : ""
                                }
                              `}
                              onClick={() => {
                                setFormaPagamento(
                                  aba.id
                                );

                                setTentouFinalizarPagamento(
                                  false
                                );
                              }}
                            >
                              {
                                aba.label
                              }
                            </button>
                          )
                        )}
                      </div>

                      {/* =================================================
                          CARTÃO
                      ================================================= */}

                      {formaPagamento ===
                        "cartao" && (
                          <>
                            <div
                              className={
                                estilos.formularioGrade
                              }
                            >
                              <label
                                className={classeCampoCartao(
                                  "numero"
                                )}
                              >
                                <span>
                                  Número do
                                  Cartão
                                </span>

                                <input
                                  type="text"
                                  name="numero"
                                  value={
                                    cartaoForm.numero
                                  }
                                  onChange={
                                    aoMudarCampoCartao
                                  }
                                  placeholder="0000 0000 0000 0000"
                                  inputMode="numeric"
                                />
                              </label>

                              <label
                                className={classeCampoCartao(
                                  "nome"
                                )}
                              >
                                <span>
                                  Nome no
                                  Cartão
                                </span>

                                <input
                                  type="text"
                                  name="nome"
                                  value={
                                    cartaoForm.nome
                                  }
                                  onChange={
                                    aoMudarCampoCartao
                                  }
                                  placeholder="Como está impresso no cartão"
                                />
                              </label>

                              <label
                                className={classeCampoCartao(
                                  "validade"
                                )}
                              >
                                <span>
                                  Validade
                                </span>

                                <input
                                  type="text"
                                  name="validade"
                                  value={
                                    cartaoForm.validade
                                  }
                                  onChange={
                                    aoMudarCampoCartao
                                  }
                                  placeholder="MM/AA"
                                />
                              </label>

                              <label
                                className={classeCampoCartao(
                                  "cvv"
                                )}
                              >
                                <span>
                                  CVV
                                </span>

                                <input
                                  type="password"
                                  name="cvv"
                                  value={
                                    cartaoForm.cvv
                                  }
                                  onChange={
                                    aoMudarCampoCartao
                                  }
                                  placeholder="000"
                                  inputMode="numeric"
                                />
                              </label>
                            </div>

                            {tentouFinalizarPagamento &&
                              !cartaoValido && (
                                <p
                                  className={
                                    estilos.mensagemErro
                                  }
                                >
                                  Preencha
                                  corretamente
                                  todos os
                                  dados do
                                  cartão.
                                </p>
                              )}
                          </>
                        )}

                      {/* =================================================
                          PIX
                      ================================================= */}

                      {formaPagamento ===
                        "pix" && (
                          <>
                            <p
                              className={
                                estilos.mensagemPagamentoAlternativo
                              }
                            >
                              Ao finalizar,
                              seu pedido
                              será
                              registrado e
                              as
                              instruções de
                              pagamento
                              serão
                              disponibilizadas
                              conforme a
                              configuração
                              do backend.
                            </p>

                            <div
                              className={
                                estilos.formularioGrade
                              }
                            >
                              <label
                                className={`
                                ${estilos.campo}
                                ${estilos.campoLargo}
                                ${tentouFinalizarPagamento &&
                                    !emailValido
                                    ? estilos.campoErro
                                    : ""
                                  }
                              `}
                              >
                                <span>
                                  E-mail
                                  para
                                  pagamento
                                </span>

                                <input
                                  type="email"
                                  value={
                                    emailPagamento
                                  }
                                  onChange={(
                                    evento
                                  ) =>
                                    setEmailPagamento(
                                      evento
                                        .target
                                        .value
                                    )
                                  }
                                  placeholder="seuemail@exemplo.com"
                                />
                              </label>
                            </div>

                            {tentouFinalizarPagamento &&
                              !emailValido && (
                                <p
                                  className={
                                    estilos.mensagemErro
                                  }
                                >
                                  Informe um
                                  e-mail
                                  válido.
                                </p>
                              )}
                          </>
                        )}

                      {/* =================================================
                          BOLETO
                      ================================================= */}

                      {formaPagamento ===
                        "boleto" && (
                          <>
                            <p
                              className={
                                estilos.mensagemPagamentoAlternativo
                              }
                            >
                              O boleto será
                              associado ao
                              pedido e as
                              instruções
                              serão
                              disponibilizadas
                              conforme a
                              configuração
                              do backend.
                            </p>

                            <div
                              className={
                                estilos.formularioGrade
                              }
                            >
                              <label
                                className={`
                                ${estilos.campo}
                                ${estilos.campoLargo}
                                ${tentouFinalizarPagamento &&
                                    !emailValido
                                    ? estilos.campoErro
                                    : ""
                                  }
                              `}
                              >
                                <span>
                                  E-mail
                                </span>

                                <input
                                  type="email"
                                  value={
                                    emailPagamento
                                  }
                                  onChange={(
                                    evento
                                  ) =>
                                    setEmailPagamento(
                                      evento
                                        .target
                                        .value
                                    )
                                  }
                                  placeholder="seuemail@exemplo.com"
                                />
                              </label>
                            </div>

                            {tentouFinalizarPagamento &&
                              !emailValido && (
                                <p
                                  className={
                                    estilos.mensagemErro
                                  }
                                >
                                  Informe um
                                  e-mail
                                  válido.
                                </p>
                              )}
                          </>
                        )}

                      {/* =================================================
                          REVISÃO
                      ================================================= */}

                      <h2
                        className={
                          estilos.formularioTitulo
                        }
                      >
                        Revisão do
                        Pedido
                      </h2>

                      <div
                        className={
                          estilos.revisaoLista
                        }
                      >
                        {produtos.map(
                          (produto) => (
                            <div
                              key={
                                produto.id
                              }
                              className={
                                estilos.revisaoItem
                              }
                            >
                              <img
                                src={imagemProduto(
                                  produto.imagem
                                )}
                                alt={
                                  produto.nome
                                }
                                className={
                                  estilos.revisaoImagem
                                }
                              />

                              <div
                                className={
                                  estilos.revisaoInfo
                                }
                              >
                                <span
                                  className={
                                    estilos.revisaoNome
                                  }
                                >
                                  {
                                    produto.nome
                                  }
                                </span>

                                <span
                                  className={
                                    estilos.revisaoQuantidade
                                  }
                                >
                                  Qtd:{" "}
                                  {
                                    produto.quantidade
                                  }
                                </span>
                              </div>

                              <span
                                className={
                                  estilos.revisaoPreco
                                }
                              >
                                {formatarPreco(
                                  Number(
                                    produto.preco
                                  ) *
                                  Number(
                                    produto.quantidade
                                  )
                                )}
                              </span>
                            </div>
                          )
                        )}
                      </div>

                      <button
                        type="button"
                        className={
                          estilos.botaoVoltar
                        }
                        onClick={() =>
                          setEtapaAtual(2)
                        }
                      >
                        ← Voltar para
                        Entrega
                      </button>
                    </div>
                  )}
                </div>
              </section>

              {/* =================================================
                  RESUMO
              ================================================= */}

              <aside
                className={
                  estilos.colunaDireita
                }
              >
                <div
                  className={
                    estilos.resumoPedido
                  }
                >
                  <h2
                    className={
                      estilos.resumoTitulo
                    }
                  >
                    Resumo do Pedido
                  </h2>

                  <div
                    className={
                      estilos.resumoLinha
                    }
                  >
                    <span>
                      Itens no carrinho
                    </span>

                    <span>
                      {totalItens}
                    </span>
                  </div>

                  <div
                    className={
                      estilos.resumoLinha
                    }
                  >
                    <span>
                      Subtotal
                    </span>

                    <span>
                      {formatarPreco(
                        subtotal
                      )}
                    </span>
                  </div>

                  {desconto > 0 && (
                    <div
                      className={
                        estilos.resumoLinha
                      }
                    >
                      <span>
                        Desconto
                        {cupomAplicado
                          ? ` (${cupomAplicado})`
                          : ""}
                      </span>

                      <span>
                        -{" "}
                        {formatarPreco(
                          desconto
                        )}
                      </span>
                    </div>
                  )}

                  <div
                    className={
                      estilos.resumoLinha
                    }
                  >
                    <span>
                      Entrega
                    </span>

                    <span
                      className={
                        valorEntrega === 0
                          ? estilos.resumoFreteGratis
                          : ""
                      }
                    >
                      {valorEntrega === 0
                        ? "Grátis"
                        : formatarPreco(
                          valorEntrega
                        )}
                    </span>
                  </div>

                  {/* =================================================
                      CUPOM
                  ================================================= */}

                  {etapaAtual === 1 && (
                    <>
                      {!cupomAplicado ? (
                        <div className={estilos.cupomArea}>
                          <label className={estilos.cupomLabel} htmlFor="cupom-disponivel">
                            Cupons disponíveis para você
                          </label>
                          <div className={estilos.cupomWrapper}>
                            <select
                              id="cupom-disponivel"
                              className={estilos.cupomInput}
                              value={cupom}
                              onChange={(event) => setCupom(event.target.value)}
                              disabled={carregandoCupons || aplicandoCupom}
                            >
                              <option value="">
                                {carregandoCupons
                                  ? "Carregando cupons..."
                                  : cuponsDisponiveis.length > 0
                                    ? "Selecione um cupom"
                                    : "Nenhum cupom disponível"}
                              </option>
                              {cuponsDisponiveis.map((cupomDisponivel) => (
                                <option
                                  key={cupomDisponivel.id || cupomDisponivel.codigo}
                                  value={cupomDisponivel.codigo}
                                >
                                  {cupomDisponivel.codigo} - {cupomDisponivel.tipo === "percentual"
                                    ? `${cupomDisponivel.valor}% de desconto`
                                    : `R$ ${Number(cupomDisponivel.valor || 0).toFixed(2).replace(".", ",")}`}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={aplicarCupom}
                              className={estilos.cupomBotao}
                              disabled={!cupom || aplicandoCupom || carregandoCupons}
                            >
                              {aplicandoCupom ? "..." : "Aplicar"}
                            </button>
                          </div>
                          <span className={estilos.cupomOu}>ou informe o código manualmente</span>
                          <div className={estilos.cupomWrapper}>
                            <input
                              type="text"
                              placeholder="Código do cupom"
                              className={estilos.cupomInput}
                              value={cupom}
                              onChange={(event) => setCupom(event.target.value.toUpperCase())}
                              onKeyDown={(event) => {
                                if (event.key === "Enter") aplicarCupom();
                              }}
                            />
                            <button
                              type="button"
                              onClick={aplicarCupom}
                              className={estilos.cupomBotao}
                              disabled={!cupom || aplicandoCupom}
                            >
                              {aplicandoCupom ? "..." : "Aplicar"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={
                            estilos.cupomWrapper
                          }
                        >
                          <input
                            type="text"
                            className={
                              estilos.cupomInput
                            }
                            value={
                              cupomAplicado
                            }
                            readOnly
                          />

                          <button
                            type="button"
                            onClick={
                              removerCupom
                            }
                            className={
                              estilos.cupomBotao
                            }
                          >
                            Remover
                          </button>
                        </div>
                      )}

                      {erroCupom && (
                        <p
                          className={
                            estilos.mensagemErro
                          }
                        >
                          {erroCupom}
                        </p>
                      )}
                    </>
                  )}

                  <div
                    className={
                      estilos.resumoDivisor
                    }
                  />

                  <div
                    className={
                      estilos.resumoTotalLinha
                    }
                  >
                    <span>
                      Total
                    </span>

                    <span
                      className={
                        estilos.resumoTotalValor
                      }
                    >
                      {formatarPreco(
                        totalFinalCarrinho
                      )}
                    </span>
                  </div>

                  {etapaAtual === 3 &&
                    erroFinalizacao && (
                      <p
                        className={
                          estilos.mensagemErro
                        }
                      >
                        {
                          erroFinalizacao
                        }
                      </p>
                    )}

                  <button
                    type="button"
                    className={
                      estilos.botaoContinuar
                    }
                    onClick={
                      aoClicarBotaoPrincipal
                    }
                    disabled={
                      produtos.length ===
                      0 ||
                      finalizando
                    }
                  >
                    {finalizando
                      ? "Finalizando..."
                      : etapaAtual === 1
                        ? "Continuar para Entrega"
                        : etapaAtual === 2
                          ? "Continuar para Pagamento"
                          : "Finalizar Compra"}
                  </button>

                  <p
                    className={
                      estilos.resumoSeguranca
                    }
                  >
                    Pagamento processado
                    com criptografia de
                    ponta a ponta
                  </p>
                </div>
              </aside>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}