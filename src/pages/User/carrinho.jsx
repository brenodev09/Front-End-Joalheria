import { useState, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import estilos from "../../styles/User/carrinho.module.css";
import Header from "../../components/Header"

gsap.registerPlugin(useGSAP);

/**
 * Página de Carrinho / Checkout — Joalheria Premium
 * Mockup visual com navegação entre etapas (Carrinho, Entrega, Pagamento)
 * e controle funcional de quantidade/preço. Sem integração real ou API.
 */
export default function Carrinho() {
  const containerRef = useRef(null);

  /* Etapa atual do checkout: 1 - Carrinho | 2 - Entrega | 3 - Pagamento */
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false);

  /* Produtos do carrinho — estado local para permitir alterar quantidade */
  const [produtos, setProdutos] = useState([
    {
      id: 1,
      nome: "Aliança Éternel",
      descricao: "Ouro 18k com diamante lapidação brilhante 0,5ct",
      material: "Ouro Amarelo 18k",
      tamanho: "16",
      quantidade: 1,
      precoOriginal: 18900,
      precoAtual: 16900,
      imagem:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: 2,
      nome: "Colar Solitaire Prestige",
      descricao: "Corrente veneziana em ouro branco com pingente solitário",
      material: "Ouro Branco 18k",
      tamanho: "45cm",
      quantidade: 1,
      precoOriginal: 24500,
      precoAtual: 22400,
      imagem:
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: 3,
      nome: "Relógio Château Automatique",
      descricao: "Movimento suíço automático, caixa em aço e ouro rosé",
      material: "Aço & Ouro Rosé",
      tamanho: "40mm",
      quantidade: 1,
      precoOriginal: 42800,
      precoAtual: 42800,
      imagem:
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=400&auto=format&fit=crop",
    },
  ]);

  const recomendados = [
    {
      id: "r1",
      nome: "Brinco Perle Royale",
      preco: 9800,
      imagem:
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: "r2",
      nome: "Pulseira Lumière",
      preco: 13200,
      imagem:
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: "r3",
      nome: "Anel Vintage Émeraude",
      preco: 27600,
      imagem:
        "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: "r4",
      nome: "Gemelos Héritage",
      preco: 6400,
      imagem:
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400&auto=format&fit=crop",
    },
  ];

  /* Opções de entrega — cada uma com custo próprio, refletido no resumo */
  const opcoesEntrega = [
    { id: "padrao", nome: "Entrega Padrão", prazo: "5 a 7 dias úteis", preco: 0 },
    { id: "expressa", nome: "Entrega Expressa", prazo: "2 a 3 dias úteis", preco: 150 },
    { id: "retirada", nome: "Retirada em Boutique", prazo: "Disponível em 24h", preco: 0 },
  ];
  const [entregaSelecionada, setEntregaSelecionada] = useState("padrao");
  const [formaPagamento, setFormaPagamento] = useState("cartao");

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

  /* E-mail para envio de Pix/Boleto na etapa de Pagamento */
  const [emailPagamento, setEmailPagamento] = useState("");
  const [tentouFinalizarPagamento, setTentouFinalizarPagamento] = useState(false);

  const etapas = [
    { numero: 1, label: "Carrinho" },
    { numero: 2, label: "Entrega" },
    { numero: 3, label: "Pagamento" },
  ];

  /* ==========================================================================
     Animações GSAP
     ========================================================================== */

  useGSAP(
    () => {
      const timelineEntrada = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      timelineEntrada
        .from(`.${estilos.cabecalho}`, {
          opacity: 0,
          y: -24,
          duration: 0.7,
        })
        .from(
          `.${estilos.etapa}`,
          {
            opacity: 0,
            y: 16,
            duration: 0.6,
            stagger: 0.12,
          },
          "-=0.4"
        )
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
    valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const aumentarQuantidade = (id) => {
    setProdutos((anterior) =>
      anterior.map((produto) =>
        produto.id === id
          ? { ...produto, quantidade: produto.quantidade + 1 }
          : produto
      )
    );
  };

  const diminuirQuantidade = (id) => {
    setProdutos((anterior) =>
      anterior.map((produto) =>
        produto.id === id
          ? { ...produto, quantidade: Math.max(1, produto.quantidade - 1) }
          : produto
      )
    );
  };

  const removerProduto = (id) => {
    setProdutos((anterior) => anterior.filter((produto) => produto.id !== id));
  };

  const irParaEtapa = (numero) => {
    if (numero <= etapaAtual && !pedidoConfirmado) {
      setEtapaAtual(numero);
    }
  };

  const totalItens = produtos.reduce(
    (acumulado, produto) => acumulado + produto.quantidade,
    0
  );
  const subtotal = produtos.reduce(
    (acumulado, produto) => acumulado + produto.precoAtual * produto.quantidade,
    0
  );
  const valorEntrega =
    opcoesEntrega.find((opcao) => opcao.id === entregaSelecionada)?.preco ?? 0;
  const total = subtotal + valorEntrega;

  const progressoLinha =
    etapaAtual === 1 ? "0%" : etapaAtual === 2 ? "50%" : "100%";

  /* Campos obrigatórios do endereço de entrega */
  const camposEndereco = ["nome", "telefone", "endereco", "cidade", "estado", "cep"];

  const aoMudarCampoEndereco = (evento) => {
    const { name, value } = evento.target;
    setEnderecoForm((anterior) => ({ ...anterior, [name]: value }));
  };

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

  const emailValido = /^\S+@\S+\.\S+$/.test(emailPagamento.trim());
  const pagamentoValido =
    formaPagamento === "cartao" ? true : emailValido;

  const rotuloBotaoPrincipal =
    etapaAtual === 1
      ? "Continuar para Entrega"
      : etapaAtual === 2
      ? "Continuar para Pagamento"
      : "Finalizar Compra";

  const aoClicarBotaoPrincipal = () => {
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
    setPedidoConfirmado(true);
  };

  return (
    <main className={estilos.pagina} ref={containerRef}>

    <Header/>


      {/* Barra de etapas */}
      <nav className={estilos.stepper} aria-label="Etapas da compra">
        <div className={estilos.stepperLinhaBase}>
          <div
            className={estilos.linhaProgresso}
            style={{ width: progressoLinha }}
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
              className={`${estilos.etapa} ${ativa ? estilos.etapaAtiva : ""} ${
                concluida ? estilos.etapaConcluida : ""
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
                <strong>#MA-28471</strong> está sendo preparado com todo o
                cuidado de nossos artesãos.
              </p>
            )}

            {formaPagamento === "pix" && (
              <p className={estilos.confirmacaoTexto}>
                Obrigado por escolher a Maison Aurélie. Seu pedido{" "}
                <strong>#MA-28471</strong> foi registrado e o QR Code Pix foi
                enviado para o e-mail <strong>{emailPagamento}</strong>.
              </p>
            )}

            {formaPagamento === "boleto" && (
              <p className={estilos.confirmacaoTexto}>
                Obrigado por escolher a Maison Aurélie. Seu pedido{" "}
                <strong>#MA-28471</strong> foi registrado e o boleto foi
                enviado para o e-mail <strong>{emailPagamento}</strong>.
              </p>
            )}

            <div className={estilos.confirmacaoTotal}>
              Total pago: <strong>{formatarPreco(total)}</strong>
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
                      {/* <ul className={estilos.beneficios}>
                        <li className={estilos.beneficioItem}>
                          <span className={estilos.beneficioIcone}>&#9670;</span>
                          Frete Grátis
                        </li>
                        <li className={estilos.beneficioItem}>
                          <span className={estilos.beneficioIcone}>&#9670;</span>
                          Garantia Vitalícia
                        </li>
                        <li className={estilos.beneficioItem}>
                          <span className={estilos.beneficioIcone}>&#9670;</span>
                          Certificado de Autenticidade
                        </li>
                        <li className={estilos.beneficioItem}>
                          <span className={estilos.beneficioIcone}>&#9670;</span>
                          Troca Facilitada
                        </li>
                      </ul> */}

                      {produtos.length === 0 ? (
                        <p className={estilos.carrinhoVazio}>
                          Seu carrinho está vazio no momento.
                        </p>
                      ) : (
                        <div className={estilos.listaProdutos}>
                          {produtos.map((produto) => (
                            <article key={produto.id} className={estilos.produtoItem}>
                              <div className={estilos.produtoImagemWrapper}>
                                <img
                                  src={produto.imagem}
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
                                  &nbsp;|&nbsp; Tamanho: <strong>{produto.tamanho}</strong>
                                </p>

                                <div className={estilos.produtoRodape}>
                                  <div className={estilos.quantidadeControle}>
                                    <button
                                      type="button"
                                      className={estilos.quantidadeBotao}
                                      aria-label="Diminuir quantidade"
                                      onClick={() => diminuirQuantidade(produto.id)}
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
                                      onClick={() => aumentarQuantidade(produto.id)}
                                    >
                                      +
                                    </button>
                                  </div>

                                  <div className={estilos.produtoPrecos}>
                                    {produto.precoOriginal !== produto.precoAtual && (
                                      <span className={estilos.precoOriginal}>
                                        {formatarPreco(produto.precoOriginal)}
                                      </span>
                                    )}
                                    <span className={estilos.precoAtual}>
                                      {formatarPreco(
                                        produto.precoAtual * produto.quantidade
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
                        <label className={classeCampoEndereco("nome")}>
                          <span>Nome Completo</span>
                          <input
                            type="text"
                            name="nome"
                            value={enderecoForm.nome}
                            onChange={aoMudarCampoEndereco}
                            placeholder="Seu nome completo"
                          />
                        </label>
                        <label className={classeCampoEndereco("telefone")}>
                          <span>Telefone</span>
                          <input
                            type="text"
                            name="telefone"
                            value={enderecoForm.telefone}
                            onChange={aoMudarCampoEndereco}
                            placeholder="(00) 00000-0000"
                          />
                        </label>
                        <label
                          className={classeCampoEndereco("endereco", "campoLargo")}
                        >
                          <span>Endereço</span>
                          <input
                            type="text"
                            name="endereco"
                            value={enderecoForm.endereco}
                            onChange={aoMudarCampoEndereco}
                            placeholder="Rua, número, complemento"
                          />
                        </label>
                        <label className={classeCampoEndereco("cidade")}>
                          <span>Cidade</span>
                          <input
                            type="text"
                            name="cidade"
                            value={enderecoForm.cidade}
                            onChange={aoMudarCampoEndereco}
                            placeholder="Sua cidade"
                          />
                        </label>
                        <label className={classeCampoEndereco("estado")}>
                          <span>Estado</span>
                          <input
                            type="text"
                            name="estado"
                            value={enderecoForm.estado}
                            onChange={aoMudarCampoEndereco}
                            placeholder="UF"
                          />
                        </label>
                        <label className={classeCampoEndereco("cep")}>
                          <span>CEP</span>
                          <input
                            type="text"
                            name="cep"
                            value={enderecoForm.cep}
                            onChange={aoMudarCampoEndereco}
                            placeholder="00000-000"
                          />
                        </label>
                      </div>

                      <h2 className={estilos.formularioTitulo}>
                        Método de Entrega
                      </h2>

                      <div className={estilos.opcoesEntrega}>
                        {opcoesEntrega.map((opcao) => (
                          <label
                            key={opcao.id}
                            className={`${estilos.opcaoEntregaCard} ${
                              entregaSelecionada === opcao.id
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
                      <h2 className={estilos.formularioTitulo}>Forma de Pagamento</h2>

                      <div className={estilos.abasPagamento}>
                        {[
                          { id: "cartao", label: "Cartão" },
                          { id: "pix", label: "Pix" },
                          { id: "boleto", label: "Boleto" },
                        ].map((aba) => (
                          <button
                            key={aba.id}
                            type="button"
                            className={`${estilos.abaPagamento} ${
                              formaPagamento === aba.id
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
                        <div className={estilos.formularioGrade}>
                          <label className={`${estilos.campo} ${estilos.campoLargo}`}>
                            <span>Número do Cartão</span>
                            <input type="text" placeholder="0000 0000 0000 0000" />
                          </label>
                          <label className={`${estilos.campo} ${estilos.campoLargo}`}>
                            <span>Nome no Cartão</span>
                            <input type="text" placeholder="Como está impresso no cartão" />
                          </label>
                          <label className={estilos.campo}>
                            <span>Validade</span>
                            <input type="text" placeholder="MM/AA" />
                          </label>
                          <label className={estilos.campo}>
                            <span>CVV</span>
                            <input type="text" placeholder="000" />
                          </label>
                        </div>
                      )}

                      {formaPagamento === "pix" && (
                        <>
                          <p className={estilos.mensagemPagamentoAlternativo}>
                            Ao finalizar, um QR Code Pix será gerado com
                            validade de 30 minutos para pagamento instantâneo.
                          </p>
                          <div className={estilos.formularioGrade}>
                            <label
                              className={`${estilos.campo} ${estilos.campoLargo} ${
                                tentouFinalizarPagamento && !emailValido
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
                              className={`${estilos.campo} ${estilos.campoLargo} ${
                                tentouFinalizarPagamento && !emailValido
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
                        </>
                      )}

                      {tentouFinalizarPagamento &&
                        formaPagamento !== "cartao" &&
                        !emailValido && (
                          <p className={estilos.mensagemErro}>
                            Informe um e-mail válido para receber o{" "}
                            {formaPagamento === "pix" ? "QR Code Pix" : "boleto"}.
                          </p>
                        )}

                      <h2 className={estilos.formularioTitulo}>
                        Revisão do Pedido
                      </h2>

                      <div className={estilos.revisaoLista}>
                        {produtos.map((produto) => (
                          <div key={produto.id} className={estilos.revisaoItem}>
                            <img
                              src={produto.imagem}
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
                              {formatarPreco(
                                produto.precoAtual * produto.quantidade
                              )}
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
                    <div className={estilos.cupomWrapper}>
                      <input
                        type="text"
                        placeholder="Código do cupom"
                        className={estilos.cupomInput}
                      />
                      <button type="button" className={estilos.cupomBotao}>
                        Aplicar
                      </button>
                    </div>
                  )}

                  <div className={estilos.resumoDivisor} />

                  <div className={estilos.resumoTotalLinha}>
                    <span>Total</span>
                    <span className={estilos.resumoTotalValor}>
                      {formatarPreco(total)}
                    </span>
                  </div>

                  <button
                    type="button"
                    className={estilos.botaoContinuar}
                    onClick={aoClicarBotaoPrincipal}
                    disabled={produtos.length === 0}
                  >
                    {rotuloBotaoPrincipal}
                  </button>

                  <p className={estilos.resumoSeguranca}>
                    Pagamento processado com criptografia de ponta a ponta
                  </p>
                </div>
              </aside>
            </div>
          </>
        )}

        {/* Produtos recomendados */}
        <section className={estilos.secaoRecomendados}>
          <h2 className={estilos.recomendadoTitulo}>
            Você também pode gostar
          </h2>

          <div className={estilos.recomendadoGrade}>
            {recomendados.map((item) => (
              <article key={item.id} className={estilos.recomendadoCard}>
                <div className={estilos.recomendadoImagemWrapper}>
                  <img
                    src={item.imagem}
                    alt={item.nome}
                    className={estilos.recomendadoImagem}
                  />
                </div>
                <h3 className={estilos.recomendadoNome}>{item.nome}</h3>
                <p className={estilos.recomendadoPreco}>
                  {formatarPreco(item.preco)}
                </p>
                <button type="button" className={estilos.recomendadoBotao}>
                  Adicionar
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>
    </main>
  );
}