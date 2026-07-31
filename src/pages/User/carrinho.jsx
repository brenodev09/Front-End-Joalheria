import { useState, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import estilos from "../../styles/User/carrinho.module.css";
  import Header from "../../components/Header";
import { useCarrinho } from "../../context/carrinhoContext";
import { api } from "../../services/api"
// import { use } from "react";

gsap.registerPlugin(useGSAP);

/**
 * Página de Carrinho / Checkout — Joalheria Premium
 * Navegação entre etapas (Carrinho, Entrega, Pagamento) com validação de
 * formulário, integrada aos dados reais do carrinho via Context API.
 */
export default function Carrinho() {
  const containerRef = useRef(null);

  const { itens, atualizarQuantidade, removerProduto, subtotal, total, carregarCarrinho } =
    useCarrinho();

  const produtos = itens;

  /* Etapa atual do checkout: 1 - Carrinho | 2 - Entrega | 3 - Pagamento */
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false);

  const [entregaSelecionada, setEntregaSelecionada] = useState("padrao");
  const [formaPagamento, setFormaPagamento] = useState("cartao");

  /* E-mail para envio de Pix/Boleto na etapa de Pagamento */
  const [emailPagamento, setEmailPagamento] = useState("");
  const [tentouFinalizarPagamento, setTentouFinalizarPagamento] = useState(false);

  /* Formulário de cartão na etapa de Pagamento */
  const [cartaoForm, setCartaoForm] = useState({
    numero: "",
    nome: "",
    validade: "",
    cvv: "",
  });

  /* Formulário de endereço da etapa de Entrega */
  const [enderecoForm, setEnderecoForm] = useState({
    nome: "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
  });
  const [tentouAvancarEntrega, setTentouAvancarEntrega] = useState(false);

  const etapas = [
    { numero: 1, label: "Carrinho" },
    { numero: 2, label: "Entrega" },
    { numero: 3, label: "Pagamento" },
  ];

  const opcoesEntrega = [
    { id: "padrão", nome: "Entrega Padrão", prazo: "5 a 7 dias úteis", preco: 0 },
    { id: "expressa", nome: "Entrega Expressa", prazo: "2 a 3 dias úteis", preco: 25 },
    { id: "retirada", nome: "Retirada em Boutique", prazo: "Disponível em 24h", preco: 0 },
  ];

  const abasPagamento = [
    { id: "cartao", label: "Cartão" },
    { id: "pix", label: "Pix" },
    { id: "boleto", label: "Boleto" },
  ];

  /* Rótulos e placeholders amigáveis para o formulário de endereço */
  const rotulosCampoEndereco = {
    nome: "Nome Completo",
    telefone: "Telefone",
    endereco: "Endereço",
    cidade: "Cidade",
    estado: "Estado",
    cep: "CEP",
  };

  const placeholdersCampoEndereco = {
    nome: "Seu nome completo",
    telefone: "(00) 00000-0000",
    endereco: "Rua, número, complemento",
    cidade: "Sua cidade",
    estado: "UF",
    cep: "00000-000",
  };

  const valorEntrega =
    opcoesEntrega.find((opcao) => opcao.id === entregaSelecionada)?.preco ?? 0;

  const totalPedido = total + valorEntrega;

  /* ==========================================================================
     Animações GSAP
     ========================================================================== */

  useGSAP(
    () => {
      const timelineEntrada = gsap.timeline({
        defaults: { ease: "power3.out" },
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
    { scope: containerRef }
  );

  /* Reanima o conteúdo sempre que a etapa muda */
  useGSAP(
    () => {
      gsap.fromTo(
        `.${estilos.titulo}`,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }
      );

      gsap.fromTo(
        `.${estilos.conteudoEtapa}`,
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.55, ease: "power3.out", delay: 0.08 }
      );

      gsap.fromTo(
        `.${estilos.resumoPedido}`,
        { opacity: 0, x: 24 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power3.out", delay: 0.12 }
      );
    },
    { scope: containerRef, dependencies: [etapaAtual, pedidoConfirmado] }
  );

  /* ==========================================================================
     Funções utilitárias e de estado
     ========================================================================== */

  const formatarPreco = (valor) =>
    Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  function imagemProduto(imagem) {
    if (!imagem) return "";
    return imagem.startsWith("http") ? imagem : `http://localhost:3000${imagem}`;
  }

  const totalItens = produtos.reduce(
    (acumulado, item) => acumulado + Number(item.quantidade),
    0
  );

  const aoMudarCampoEndereco = (evento) => {
    const { name, value } = evento.target;
    setEnderecoForm((anterior) => ({ ...anterior, [name]: value }));
  };

  const camposEndereco = ["nome", "telefone", "endereco", "cidade", "estado", "cep"];

  const entregaValida = camposEndereco.every(
    (campo) => enderecoForm[campo].trim() !== ""
  );

  const classeCampoEndereco = (campo, extra) =>
    [
      estilos.campo,
      extra ? estilos[extra] : "",
      tentouAvancarEntrega && !enderecoForm[campo].trim() ? estilos.campoErro : "",
    ]
      .filter(Boolean)
      .join(" ");

  const aoMudarCampoCartao = (evento) => {
    const { name, value } = evento.target;
    setCartaoForm((anterior) => ({ ...anterior, [name]: value }));
  };

  const numeroCartaoValido =
    cartaoForm.numero.replace(/\D/g, "").length >= 13;
  const validadeCartaoValida = /^\d{2}\/\d{2}$/.test(cartaoForm.validade.trim());
  const cvvValido = /^\d{3,4}$/.test(cartaoForm.cvv.trim());
  const nomeCartaoValido = cartaoForm.nome.trim() !== "";

  const cartaoValido =
    numeroCartaoValido && validadeCartaoValida && cvvValido && nomeCartaoValido;

  const classeCampoCartao = (campo) => {
    let valido = true;
    if (campo === "numero") valido = numeroCartaoValido;
    if (campo === "nome") valido = nomeCartaoValido;
    if (campo === "validade") valido = validadeCartaoValida;
    if (campo === "cvv") valido = cvvValido;

    return [
      estilos.campo,
      campo === "numero" || campo === "nome" ? estilos.campoLargo : "",
      tentouFinalizarPagamento && !valido ? estilos.campoErro : "",
    ]
      .filter(Boolean)
      .join(" ");
  };

  const emailValido = /^\S+@\S+\.\S+$/.test(emailPagamento.trim());
  const pagamentoValido =
    formaPagamento === "cartao" ? cartaoValido : emailValido;

  const opcaoEntregaEscolhida = opcoesEntrega.find(
    (opcao) => opcao.id === entregaSelecionada
  );

  const irParaEtapa = (numero) => {
    if (numero <= etapaAtual && !pedidoConfirmado) {
      setEtapaAtual(numero);
    }
  };





  // função de apliicar o cupom

  const [cupom, setCupom] = useState("")
  const [desconto, setDesconto] = useState(0)
  const [cupomAplicado, setCupomAplicado] = useState(null)
  const [erroCupom, setErroCupom] = useState("")
  const totalComDesconto = Math.max(subtotal - desconto, 0)


  async function aplicarCupom() {

    setErroCupom("");

    try {

      const resposta = await api.post("/cupons/validar-cupom", {
        codigo: cupom,
        subTotal: subtotal
      })

      console.log("Resposta:", resposta.data);

      setDesconto(resposta.data.desconto)
      setCupomAplicado(resposta.data.codigo)

    } catch (error) {
      const mensagemErro = error.response?.data?.erro || "Erro ao validar o cupom"
      setErroCupom(mensagemErro);


      setTimeout(() => {
        setErroCupom("")
      }, 3000);
    }
  }


  // função de finalizar a compra
  const [valorPedidoFinalizado, setValorPedidoFinalizado] = useState(0)
  const [codigoPedido, setCodigoPedido] = useState(0)
  const totalFinalCarrinho = Math.max(subtotal - desconto) + valorEntrega

  async function finalizarCompra() {
    try {
      const token = localStorage.getItem("token")
      const resposta = await api.post("/pedidos", {
        formaPagamento, tipoEntrega: entregaSelecionada, codigo: cupomAplicado
      }, {
        headers: {Authorization: `Bearer ${token}`}
})

      console.log(resposta.data)

      setCodigoPedido(resposta.data.pedidoId)
      setValorPedidoFinalizado(resposta.data.total)
      await carregarCarrinho()
      setPedidoConfirmado(true)
    } catch (error) {
      console.error(error)


    }
  }

 async  function aoClicarBotaoPrincipal() {
    if (produtos.length === 0) return;

    if (etapaAtual === 1) {
      setEtapaAtual(2);
      return;
    }

    if (etapaAtual === 2) {
      if (!entregaValida) {
        setTentouAvancarEntrega(true);
        return;
      }
      setTentouAvancarEntrega(false);
      setEtapaAtual(3);
      return;
    }

    if (!pagamentoValido) {
      setTentouFinalizarPagamento(true);
      return;
    }


    try {

      await finalizarCompra();

      setPedidoConfirmado(true);

    } catch (error) {

      console.error(error);

    }
  }

  return (
    <div className={estilos.pagina} ref={containerRef}>
      <Header />

      {/* Barra de etapas */}
      <nav className={estilos.stepper} aria-label="Etapas da compra">
        <div className={estilos.stepperLinhaBase}>
          <div
            className={estilos.linhaProgresso}
            style={{
              width:
                etapaAtual === 1 ? "0%" : etapaAtual === 2 ? "50%" : "100%",
            }}
          />
        </div>

        {etapas.map((etapa) => {
          const concluida = etapa.numero < etapaAtual || pedidoConfirmado;
          const ativa = etapa.numero === etapaAtual && !pedidoConfirmado;
          const clicavel = etapa.numero <= etapaAtual && !pedidoConfirmado;

          return (
            <button
              key={etapa.numero}
              type="button"
              onClick={() => irParaEtapa(etapa.numero)}
              className={`${estilos.etapa} ${ativa ? estilos.etapaAtiva : ""} ${concluida ? estilos.etapaConcluida : ""
                }`}
              style={{ cursor: clicavel ? "pointer" : "default" }}
              disabled={!clicavel}
            >
              <span className={estilos.etapaCirculo}>
                {concluida ? "✓" : etapa.numero}
              </span>
              <span className={estilos.etapaTexto}>{etapa.label}</span>
            </button>
          );
        })}
      </nav>

      <main className={estilos.conteudoPrincipal}>
        {pedidoConfirmado ? (
          /* ======================= Confirmação do pedido ======================= */
          <div className={estilos.confirmacaoWrapper}>
            <span className={estilos.confirmacaoIcone}>✓</span>
            <h1 className={estilos.titulo}>Pedido Confirmado</h1>

            {formaPagamento === "cartao" && (
              <p className={estilos.confirmacaoTexto}>
                Obrigado por escolher a Maison Aurélie. Seu pedido{" "}
                <strong>#AZ-{codigoPedido}</strong> está sendo preparado com todo o
                cuidado de nossos artesãos.
              </p>
            )}

            {formaPagamento === "pix" && (
              <p className={estilos.confirmacaoTexto}>
                Obrigado por escolher a Maison Aurélie. Seu pedido{" "}
                <strong>#AZ-{codigoPedido}</strong> foi registrado e o QR Code Pix foi
                enviado para o e-mail <strong>{emailPagamento}</strong>.
              </p>
            )}

            {formaPagamento === "boleto" && (
              <p className={estilos.confirmacaoTexto}>
                Obrigado por escolher a Maison Aurélie. Seu pedido{" "}
                <strong>#AZ-{codigoPedido}</strong> foi registrado e o boleto foi
                enviado para o e-mail <strong>{emailPagamento}</strong>.
              </p>
            )}

              <div className={estilos.confirmacaoTotal}>
                Total pago: <strong>{formatarPreco(valorPedidoFinalizado)}</strong>
              </div>
            </div>
        ) : (
          <>
            <h1 className={estilos.titulo}>
              {etapaAtual === 1 && "Seu Carrinho"}
              {etapaAtual === 2 && "Informações de Entrega"}
              {etapaAtual === 3 && "Pagamento"}
            </h1>

            <div className={estilos.grade}>
              {/* Coluna esquerda — conteúdo de cada etapa */}
              <section className={estilos.colunaEsquerda}>
                <div className={estilos.conteudoEtapa}>
                  {/* ======================= ETAPA 1 — CARRINHO ======================= */}
                  {etapaAtual === 1 && (
                    <>
                      {produtos.length === 0 ? (
                        <p className={estilos.carrinhoVazio}>
                          Seu carrinho está vazio.
                        </p>
                      ) : (
                        <div className={estilos.listaProdutos}>
                          {produtos.map((produto) => (
                            <article key={produto.id} className={estilos.produtoItem}>
                              <div className={estilos.produtoImagemWrapper}>
                                <img
                                  src={imagemProduto(produto.imagem)}
                                  alt={produto.nome}
                                  className={estilos.produtoImagem}
                                />
                              </div>

                              <div className={estilos.produtoInfo}>
                                <div className={estilos.produtoCabecalho}>
                                  <h2 className={estilos.produtoNome}>{produto.nome}</h2>
                                  <button
                                    type="button"
                                    className={estilos.botaoRemover}
                                    aria-label={`Remover ${produto.nome}`}
                                    onClick={() => removerProduto(produto.id)}
                                  >
                                    Remover
                                  </button>
                                </div>

                                <p className={estilos.produtoDescricao}>
                                  {produto.descricao}
                                </p>

                                <p className={estilos.produtoAtributos}>
                                  Material: <strong>{produto.material}</strong>
                                  {produto.variacao && (
                                    <>
                                      &nbsp;|&nbsp; Tamanho:{" "}
                                      <strong>{produto.variacao}</strong>
                                    </>
                                  )}
                                </p>

                                <div className={estilos.produtoRodape}>
                                  <div className={estilos.quantidadeControle}>
                                    <button
                                      type="button"
                                      className={estilos.quantidadeBotao}
                                      aria-label="Diminuir quantidade"
                                      onClick={() =>
                                        atualizarQuantidade(
                                          produto.id,
                                          Math.max(1, produto.quantidade - 1)
                                        )
                                      }
                                    >
                                      −
                                    </button>
                                    <span className={estilos.quantidadeValor}>
                                      {produto.quantidade}
                                    </span>
                                    <button
                                      type="button"
                                      className={estilos.quantidadeBotao}
                                      aria-label="Aumentar quantidade"
                                      onClick={() =>
                                        atualizarQuantidade(
                                          produto.id,
                                          produto.quantidade + 1
                                        )
                                      }
                                    >
                                      +
                                    </button>
                                  </div>

                                  <div className={estilos.produtoPrecos}>
                                    <span className={estilos.precoAtual}>
                                      {formatarPreco(
                                        Number(produto.preco) *
                                        Number(produto.quantidade)
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </article>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* ======================= ETAPA 2 — ENTREGA ======================= */}
                  {etapaAtual === 2 && (
                    <div className={estilos.formularioEtapa}>
                      <h2 className={estilos.formularioTitulo}>
                        Endereço de Entrega
                      </h2>

                      {tentouAvancarEntrega && !entregaValida && (
                        <p className={estilos.mensagemErro}>
                          Preencha todos os campos obrigatórios para
                          continuar.
                        </p>
                      )}

                      <div className={estilos.formularioGrade}>
                        {camposEndereco.map((campo) => (
                          <label
                            key={campo}
                            className={classeCampoEndereco(
                              campo,
                              campo === "endereco" ? "campoLargo" : undefined
                            )}
                          >
                            <span>{rotulosCampoEndereco[campo]}</span>
                            <input
                              type="text"
                              name={campo}
                              value={enderecoForm[campo]}
                              onChange={aoMudarCampoEndereco}
                              placeholder={placeholdersCampoEndereco[campo]}
                            />
                          </label>
                        ))}
                      </div>

                      <h2 className={estilos.formularioTitulo}>
                        Método de Entrega
                      </h2>

                      <div className={estilos.opcoesEntrega}>
                        {opcoesEntrega.map((opcao) => (
                          <label
                            key={opcao.id}
                            className={`${estilos.opcaoEntregaCard} ${entregaSelecionada === opcao.id
                              ? estilos.opcaoEntregaSelecionada
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              name="entrega"
                              value={opcao.id}
                              checked={entregaSelecionada === opcao.id}
                              onChange={() => setEntregaSelecionada(opcao.id)}
                            />
                            <div className={estilos.opcaoEntregaInfo}>
                              <span className={estilos.opcaoEntregaNome}>
                                {opcao.nome}
                              </span>
                              <span className={estilos.opcaoEntregaPrazo}>
                                {opcao.prazo}
                              </span>
                            </div>
                            <span className={estilos.opcaoEntregaPreco}>
                              {opcao.preco === 0
                                ? "Grátis"
                                : formatarPreco(opcao.preco)}
                            </span>
                          </label>
                        ))}
                      </div>

                      <button
                        type="button"
                        className={estilos.botaoVoltar}
                        onClick={() => setEtapaAtual(1)}
                      >
                        ← Voltar ao Carrinho
                      </button>
                    </div>
                  )}

                  {/* ======================= ETAPA 3 — PAGAMENTO ======================= */}
                  {etapaAtual === 3 && (
                    <div className={estilos.formularioEtapa}>
                      <h2 className={estilos.formularioTitulo}>
                        Resumo da Entrega
                      </h2>

                      <div className={estilos.resumoEntregaCard}>
                        <p className={estilos.resumoEntregaNome}>
                          {enderecoForm.nome}
                        </p>
                        <p className={estilos.resumoEntregaTexto}>
                          {enderecoForm.endereco}
                        </p>
                        <p className={estilos.resumoEntregaTexto}>
                          {enderecoForm.cidade} - {enderecoForm.estado},{" "}
                          {enderecoForm.cep}
                        </p>
                        <p className={estilos.resumoEntregaTexto}>
                          Telefone: {enderecoForm.telefone}
                        </p>
                        {opcaoEntregaEscolhida && (
                          <p className={estilos.resumoEntregaMetodo}>
                            {opcaoEntregaEscolhida.nome} —{" "}
                            {opcaoEntregaEscolhida.prazo} —{" "}
                            {opcaoEntregaEscolhida.preco === 0
                              ? "Grátis"
                              : formatarPreco(opcaoEntregaEscolhida.preco)}
                          </p>
                        )}
                      </div>

                      <h2 className={estilos.formularioTitulo}>Forma de Pagamento</h2>

                      <div className={estilos.abasPagamento}>
                        {abasPagamento.map((aba) => (
                          <button
                            key={aba.id}
                            type="button"
                            className={`${estilos.abaPagamento} ${formaPagamento === aba.id
                              ? estilos.abaPagamentoAtiva
                              : ""
                              }`}
                            onClick={() => {
                              setFormaPagamento(aba.id);
                              setTentouFinalizarPagamento(false);
                            }}
                          >
                            {aba.label}
                          </button>
                        ))}
                      </div>

                      {formaPagamento === "cartao" && (
                        <>
                          <div className={estilos.formularioGrade}>
                            <label className={classeCampoCartao("numero")}>
                              <span>Número do Cartão</span>
                              <input
                                type="text"
                                name="numero"
                                value={cartaoForm.numero}
                                onChange={aoMudarCampoCartao}
                                placeholder="0000 0000 0000 0000"
                              />
                            </label>
                            <label className={classeCampoCartao("nome")}>
                              <span>Nome no Cartão</span>
                              <input
                                type="text"
                                name="nome"
                                value={cartaoForm.nome}
                                onChange={aoMudarCampoCartao}
                                placeholder="Como está impresso no cartão"
                              />
                            </label>
                            <label className={classeCampoCartao("validade")}>
                              <span>Validade</span>
                              <input
                                type="text"
                                name="validade"
                                value={cartaoForm.validade}
                                onChange={aoMudarCampoCartao}
                                placeholder="MM/AA"
                              />
                            </label>
                            <label className={classeCampoCartao("cvv")}>
                              <span>CVV</span>
                              <input
                                type="text"
                                name="cvv"
                                value={cartaoForm.cvv}
                                onChange={aoMudarCampoCartao}
                                placeholder="000"
                              />
                            </label>
                          </div>

                          {tentouFinalizarPagamento && !cartaoValido && (
                            <p className={estilos.mensagemErro}>
                              Preencha corretamente todos os dados do cartão
                              para continuar.
                            </p>
                          )}
                        </>
                      )}

                      {formaPagamento === "pix" && (
                        <>
                          <p className={estilos.mensagemPagamentoAlternativo}>
                            Ao finalizar, um QR Code Pix será gerado com
                            validade de 30 minutos para pagamento instantâneo.
                          </p>
                          <div className={estilos.formularioGrade}>
                            <label
                              className={`${estilos.campo} ${estilos.campoLargo} ${tentouFinalizarPagamento && !emailValido
                                ? estilos.campoErro
                                : ""
                                }`}
                            >
                              <span>E-mail para envio do QR Code</span>
                              <input
                                type="email"
                                value={emailPagamento}
                                onChange={(evento) =>
                                  setEmailPagamento(evento.target.value)
                                }
                                placeholder="seuemail@exemplo.com"
                              />
                            </label>
                          </div>
                          {tentouFinalizarPagamento && !emailValido && (
                            <p className={estilos.mensagemErro}>
                              Informe um e-mail válido para receber o QR Code
                              Pix.
                            </p>
                          )}
                        </>
                      )}

                      {formaPagamento === "boleto" && (
                        <>
                          <p className={estilos.mensagemPagamentoAlternativo}>
                            O boleto será enviado para o seu e-mail e terá
                            vencimento em até 3 dias úteis.
                          </p>
                          <div className={estilos.formularioGrade}>
                            <label
                              className={`${estilos.campo} ${estilos.campoLargo} ${tentouFinalizarPagamento && !emailValido
                                ? estilos.campoErro
                                : ""
                                }`}
                            >
                              <span>E-mail para envio do Boleto</span>
                              <input
                                type="email"
                                value={emailPagamento}
                                onChange={(evento) =>
                                  setEmailPagamento(evento.target.value)
                                }
                                placeholder="seuemail@exemplo.com"
                              />
                            </label>
                          </div>
                          {tentouFinalizarPagamento && !emailValido && (
                            <p className={estilos.mensagemErro}>
                              Informe um e-mail válido para receber o boleto.
                            </p>
                          )}
                        </>
                      )}

                      <h2 className={estilos.formularioTitulo}>
                        Revisão do Pedido
                      </h2>

                      <div className={estilos.revisaoLista}>
                        {produtos.map((produto) => (
                          <div key={produto.id} className={estilos.revisaoItem}>
                            <img
                              src={imagemProduto(produto.imagem)}
                              alt={produto.nome}
                              className={estilos.revisaoImagem}
                            />
                            <div className={estilos.revisaoInfo}>
                              <span className={estilos.revisaoNome}>
                                {produto.nome}
                              </span>
                              <span className={estilos.revisaoQuantidade}>
                                Qtd: {produto.quantidade}
                              </span>
                            </div>
                            <span className={estilos.revisaoPreco}>
                              {formatarPreco(produto.preco * produto.quantidade)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        className={estilos.botaoVoltar}
                        onClick={() => setEtapaAtual(2)}
                      >
                        ← Voltar para Entrega
                      </button>
                    </div>
                  )}
                </div>
              </section>

              {/* Coluna direita — resumo do pedido, presente em todas as etapas */}
              <aside className={estilos.colunaDireita}>
                <div className={estilos.resumoPedido}>
                  <h2 className={estilos.resumoTitulo}>Resumo do Pedido</h2>

                  <div className={estilos.resumoLinha}>
                    <span>Itens no carrinho</span>
                    <span>{totalItens}</span>
                  </div>

                  <div className={estilos.resumoLinha}>
                    <span>Subtotal</span>
                    <span>{formatarPreco(subtotal)}</span>
                  </div>

                  <div className={estilos.resumoLinha}>
                    <span>Entrega</span>
                    <span
                      className={
                        valorEntrega === 0 ? estilos.resumoFreteGratis : ""
                      }
                    >
                      {valorEntrega === 0
                        ? "Grátis"
                        : formatarPreco(valorEntrega)}
                    </span>
                  </div>

                  {etapaAtual === 1 && (
                    <>

                      <div className={estilos.cupomWrapper}>
                        <input
                          type="text"
                          placeholder="Código do cupom"
                          className={estilos.cupomInput}
                          value={cupom}
                          onChange={(event) => setCupom(event.target.value)}
                        />
                        <button type="button" onClick={aplicarCupom} className={estilos.cupomBotao}>
                          Aplicar
                        </button>
                      </div>

                      {erroCupom && <p> {erroCupom} </p>}

                    </>
                  )}

                  <div className={estilos.resumoDivisor} />

                  <div className={estilos.resumoTotalLinha}>
                    <span>Total</span>
                    <span className={estilos.resumoTotalValor}>
                      {formatarPreco(totalFinalCarrinho)}
                    </span>
                  </div>

                  <button
                    type="button"
                    className={estilos.botaoContinuar}
                    onClick={aoClicarBotaoPrincipal}
                    disabled={produtos.length === 0}
                  >
                    {etapaAtual === 1
                      ? "Continuar para Entrega"
                      : etapaAtual === 2
                        ? "Continuar para Pagamento"
                        : "Finalizar Compra"}
                  </button>

                  <p className={estilos.resumoSeguranca}>
                    Pagamento processado com criptografia de ponta a ponta
                  </p>
                </div>
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  );
}