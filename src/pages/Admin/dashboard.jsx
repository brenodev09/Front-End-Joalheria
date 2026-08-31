import style from "../../styles/Admin/dashboard.module.css";
import SideBar from "../../components/Admin/SideBar";
import HeaderAdmin from "../../components/Admin/Header";
import { useAuth } from "../../context/authContext"
import { api } from "../../services/api"
import dadosDashboard from "../../context/dataContext"
import ModalAddMeta from "../../components/Admin/Modais/ModalAddMeta"
import ModalEditarMeta from "../../components/Admin/Modais/ModalEditarMeta"

import {
  STATUS_PEDIDO,
  formatarMoeda,
  normalizarPedidoAdmin,
  estaNoMesAtual,
} from "./utilitariosPedidosAdmin";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Text,
} from "recharts";


export default function Dashboard() {

  const { usuario } = useAuth()
  const { metricas, estoqueCategorias, alertasEstoque, produtosRecentes, vendas, metaMensal, todasMetas, carregando, carregarDashboard } = dadosDashboard()
  const metaDoMes = metaMensal || {}
  const [verTodasMetas, setVerTodasMetas] = useState(false)
  const metasExibidas = verTodasMetas ? todasMetas : todasMetas.slice(0, 5)
  const nomesMeses = {
    1: "Janeiro",
    2: "Fevereiro",
    3: "Março",
    4: "Abril",
    5: "Maio",
    6: "Junho",
    7: "Julho",
    8: "Agosto",
    9: "Setembro",
    10: "Outubro",
    11: "Novembro",
    12: "Dezembro"
  }
  const nomeMes = nomesMeses[metaMensal.mes] || "Mês não definido"
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState()
  const vendasUltimos30Dias = vendas.vendasUltimos30Dias || []
  const [abrirModalAdicionar, setAbrirModalAdicionar] = useState(false)
  const [abrirModalEditar, setAbrirModalEditar] = useState(false)
  const [visaoAtiva, setVisaoAtiva] = useState("geral")

  const VISOES = [
    { id: "geral", label: "Visão Geral" },
    { id: "vendas", label: "Vendas" },
    { id: "estoque", label: "Estoque" },
    { id: "metas", label: "Metas" },
  ]

  const mostrarBloco = (id) => visaoAtiva === "geral" || visaoAtiva === id

  // Renderiza a imagem do produto alinhada com a linha da barra no eixo Y,
  // reaproveitando o <Text> do recharts para o nome (mesmo comportamento de quebra de linha do eixo padrão)
  const TickProdutoComImagem = (props) => {
    const { x, y, payload, index } = props
    const produto = (vendas.produtosMaisVendidos || []).find(
      (p) => p.nome === payload.value
    )

    const tamanhoImagem = 26
    const larguraEixo = 170
    const espacoImagem = tamanhoImagem + 10
    const larguraTexto = larguraEixo - espacoImagem

    return (
      <g>
        {produto?.imagem ? (
          <>
            <defs>
              <clipPath id={`clipProdutoImg-${index}`}>
                <rect
                  x={x - larguraEixo}
                  y={y - tamanhoImagem / 2}
                  width={tamanhoImagem}
                  height={tamanhoImagem}
                  rx={4}
                  ry={4}
                />
              </clipPath>
            </defs>

            <image
              href={`http://localhost:3000${produto.imagem}`}
              x={x - larguraEixo}
              y={y - tamanhoImagem / 2}
              width={tamanhoImagem}
              height={tamanhoImagem}
              preserveAspectRatio="xMidYMid slice"
              clipPath={`url(#clipProdutoImg-${index})`}
            />
          </>
        ) : (
          <rect
            x={x - larguraEixo}
            y={y - tamanhoImagem / 2}
            width={tamanhoImagem}
            height={tamanhoImagem}
            rx={4}
            fill="rgba(201,168,76,0.08)"
            stroke="rgba(201,168,76,0.25)"
          />
        )}

        <Text
          x={x - 10}
          y={y}
          width={larguraTexto}
          textAnchor="end"
          verticalAnchor="middle"
          fill="#fff"
          fontSize={13}
        >
          {payload.value}
        </Text>
      </g>
    )
  }

  const formatarDataGrafico = (data) => {
    const dataObj = new Date(data)

    return dataObj.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit"
    })
  }

  const CORES_STATUS = {
    pendente: "#D4AF37",
    pago: "#C9A84C",
    enviado: "#395ea3",
    entregue: "#1c942a",
    cancelado: "#9a0606"
  }

  const formatarStatus = (status) => {

    const nomes = {
      pendente: "Pendente",
      pago: "Pago",
      enviado: "Enviado",
      entregue: "Entregue",
      cancelado: "Cancelado"
    }

    return nomes[status] || status

  }

  useEffect(() => {
    async function carregarPedidos() {
      try {
        setLoading(true);
        const resposta = await api.get('/pedidos/pedidos-admin');
        setPedidos(resposta.data.map(normalizarPedidoAdmin));
      } catch (error) {
        console.error(error);
        setPedidos([]);
      } finally {
        setLoading(false);
      }
    }
    carregarPedidos();
  }, []);

  const faturamentoBruto = pedidos
    .filter((p) => p.status !== STATUS_PEDIDO.CANCELADO)
    .reduce((acc, p) => acc + p.totalNumero, 0);

  // Faturamento apenas dos pedidos feitos no mês/ano atual (não cancelados).
  const faturamentoMensal = pedidos
    .filter((p) => p.status !== STATUS_PEDIDO.CANCELADO)
    .filter((p) => estaNoMesAtual(p.dataPedido))
    .reduce((acc, p) => acc + p.totalNumero, 0);


  const faturamentoCategorias = metricas.faturamentoCategorias || []
  const totalFaturamentoCategorias = faturamentoCategorias.reduce((acc, item) => acc + item.faturamento, 0)

  const dadosCategoriasPizza = (metricas.faturamentoCategorias || []).map(item => ({
    ...item,
    percentual: totalFaturamentoCategorias > 0
      ? ((item.faturamento / totalFaturamentoCategorias) * 100).toFixed(1)
      : "0.0"
  }))



  const CORES_CATEGORIAS = [
    "#D4AF37", // dourado
    "#00C2A8", // turquesa
    "#FF6B6B", // coral
    "#4D96FF", // azul
    "#9D4EDD", // roxo
    "#F77F00", // laranja
    "#2EC4B6", // verde água
    "#EF476F"  // rosa
  ]


  if (carregando) {
    return <p className={style.carregando}>Carregando dados do dashboard...</p>
  }

  // const totalProdutos = produtos.length

  return (



    <>

      <main className={style.painelPrincipal}>

        <div className={style.saudacao}>
          <p className={style.saudacaoRotulo}>
            PAINEL DE CONTROLE - AZORY JOALHERIA
          </p>
          <h1 className={style.saudacaoTitulo}>Olá, {usuario.nome}</h1>
          <p className={style.saudacaoSubtitulo}>
            Todas as informações do seu sistema centralizadas em um único
            painel.
          </p>

          <div className={style.acoesMetricas}>

            <div className={style.metricasFaturamento}>
              <div className={style.resumoItem}>
                <span className={style.resumoRotulo}>Hoje</span>
                <span className={style.resumoValor}>R$ 28.400</span>
              </div>
              <div className={style.resumoItem}>
                <span className={style.resumoRotulo}>Esta semana</span>
                <span className={style.resumoValor}>R$ 142K</span>
              </div>
            </div>

            <button
              className={`${style.btnPadrao} ${style.addMeta}`}
              onClick={() => setAbrirModalAdicionar(true)}
            >
              {/* <img
                width="20"
                height="20"
                src="https://img.icons8.com/ios-filled/23/plus-math.png"
                alt="plus-math"
              /> */}
              <p>ADICIONAR META MENSAL</p>
            </button>

          </div>


        </div>

        {/* Bloco de cards métricos */}
        <section className={style.cardsMetricos}>
          <div className={style.card}>
            <div className={style.cardTopo}>
              <div className={style.iconeCard}>
                <img
                  width="30"
                  height="30"
                  src="https://img.icons8.com/material-sharp/30/C9A84C/real.png"
                  alt="real"
                />
              </div>
              <span className={style.cardRotulo}>FATURAMENTO BRUTO</span>
            </div>
            <h1 className={style.cardValor}>{formatarMoeda(faturamentoBruto)}</h1>
            <p className={style.cardDescricao}>faturamento total da loja em todo o tempo</p>


          </div>

          <div className={style.card}>
            <div className={style.cardTopo}>
              <div className={style.iconeCard}>
                <img
                  width="30"
                  height="30"
                  src="https://img.icons8.com/material-sharp/30/C9A84C/real.png"
                  alt="real"
                />
              </div>
              <span className={style.cardRotulo}>FATURAMENTO MENSAL</span>
            </div>
            <h1 className={style.cardValor}>{formatarMoeda(faturamentoMensal)}</h1>
            <p className={style.cardDescricao}>faturamento da loja no mês atual</p>
          </div>


          <div className={style.card}>
            <div className={style.cardTopo}>
              <div className={style.iconeCard}>
                <img
                  width="30"
                  height="30"
                  src="https://img.icons8.com/material-sharp/30/C9A84C/real.png"
                  alt="real"
                />
              </div>
              <span className={style.cardRotulo}>TICKET MÉDIO</span>
            </div>
            <h1 className={style.cardValor}>{formatarMoeda(vendas.ticketMedio)}</h1>
            <p className={style.cardDescricao}>faturamento da loja no mês atual</p>
          </div>



          <div className={style.card}>
            <div className={style.cardTopo}>
              <div className={style.iconeCard}>
                <img
                  width="30"
                  height="30"
                  src="https://img.icons8.com/ios/50/C9A84C/total-sales-1.png"
                  alt="total-sales-1"
                />{" "}
              </div>
              <span className={style.cardRotulo}>VENDAS HOJE</span>
            </div>
            <h1 className={style.cardValor}>{vendas.vendasHoje}</h1>
            <p className={style.cardDescricao}>vendas através do site</p>
          </div>

          <div className={style.card}>
            <div className={style.cardTopo}>
              <div className={style.iconeCard}>
                <img
                  width="30"
                  height="30"
                  src="https://img.icons8.com/ios/50/C9A84C/total-sales-1.png"
                  alt="total-sales-1"
                />{" "}
              </div>
              <span className={style.cardRotulo}>VENDAS MENSAL</span>
            </div>
            <h1 className={style.cardValor}>{vendas.vendasMensal}</h1>
            <p className={style.cardDescricao}>vendas desse mês atráves do site</p>
          </div>


        </section>


        {/* Filtro de visão */}
        <div className={style.filtroVisao}>
          {VISOES.map((visao) => (
            <button
              key={visao.id}
              type="button"
              className={`${style.botaoFiltro} ${visaoAtiva === visao.id ? style.botaoFiltroAtivo : ""
                }`}
              onClick={() => setVisaoAtiva(visao.id)}
            >
              {visao.label}
            </button>
          ))}
        </div>


        {/* ==================== BLOCO: VENDAS ==================== */}
        {mostrarBloco("vendas") && (
        <section className={style.blocoSecao}>

          <div className={style.cabecalhoBloco}>
            <h2>Desempenho de Vendas</h2>
            <p>Evolução do faturamento e comparativo dos produtos e coleções mais vendidos</p>
          </div>

          <div className={style.cardGraficoGrande}>

            <div className={style.cabecalhoGrafico}>
              <span>VENDAS DOS ÚLTIMOS 30 DIAS</span>

              <p>
                Faturamento e quantidade de vendas por dia
              </p>
            </div>


            <ResponsiveContainer width="100%" height={300}>

              <ComposedChart
                data={vendas.vendasUltimos30Dias || []}
                margin={{
                  top: 10,
                  right: 10,
                  left: 10,
                  bottom: 10
                }}
              >

                {/* EIXO HORIZONTAL */}

                <XAxis
                  dataKey="data"
                  tickFormatter={formatarDataGrafico}
                />


                {/* EIXO DO FATURAMENTO */}

                <YAxis
                  yAxisId="faturamento"
                  orientation="left"
                  tickFormatter={(valor) => `R$ ${valor}`}
                />


                {/* EIXO DA QUANTIDADE */}

                <YAxis
                  yAxisId="quantidade"
                  orientation="right"
                  allowDecimals={false}
                />


                {/* TOOLTIP */}

                <Tooltip
                  labelFormatter={(data) =>
                    `Data: ${formatarDataGrafico(data)}`
                  }

                  formatter={(valor, nome) => {

                    if (nome === "Faturamento") {
                      return [
                        formatarMoeda(valor),
                        "Faturamento"
                      ]
                    }

                    return [
                      `${valor} vendas`,
                      "Quantidade"
                    ]

                  }}

                  contentStyle={{
                    backgroundColor: "#1b1b1b",
                    border: "1px solid #C9A84C",
                    borderRadius: "2px"
                  }}

                  labelStyle={{
                    color: "#C9A84C"
                  }}
                />


                {/* LEGENDA */}

                <Legend />


                {/* BARRAS - QUANTIDADE */}

                <Bar
                  yAxisId="quantidade"
                  dataKey="quantidade_vendas"
                  name="Quantidade"
                  fill="#8F7A3D"
                  radius={[4, 4, 0, 0]}
                  barSize={12}
                />


                {/* LINHA - FATURAMENTO */}

                <Line
                  yAxisId="faturamento"
                  type="monotone"
                  dataKey="faturamento"
                  name="Faturamento"
                  stroke="#C9A84C"
                  strokeWidth={3}
                  dot={{
                    r: 3,
                    fill: "#C9A84C"
                  }}
                  activeDot={{
                    r: 6
                  }}
                />

              </ComposedChart>

            </ResponsiveContainer>

          </div>

          <div className={style.linhaDuasColunas}>

          <div className={style.cardGrafico}>

            <div className={style.cabecalhoGrafico}>

              <span>PEDIDOS POR STATUS</span>

              <p>
                Distribuição dos pedidos atuais
              </p>

            </div>


            <ResponsiveContainer width="100%" height={300}>

              <PieChart>

                <Pie
                  data={vendas.pedidosPorStatus || []}
                  dataKey="quantidade"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={3}
                >

                  {(vendas.pedidosPorStatus || []).map((item) => (

                    <Cell
                      key={item.status}
                      fill={CORES_STATUS[item.status]}
                    />

                  ))}

                </Pie>


                <Tooltip
                  formatter={(valor, nome) => [
                    `${valor} pedidos`,
                    nome.charAt(0).toUpperCase() + nome.slice(1)
                  ]}

                  contentStyle={{
                    backgroundColor: "#1b1b1b",
                    border: "1px solid #C9A84C",
                    borderRadius: "2px"
                  }}

                  labelStyle={{
                    color: "#C9A84C"
                  }}
                />


                <Legend />

              </PieChart>

            </ResponsiveContainer>


          </div>

          <div className={style.cardGrafico}>

            <div className={style.cabecalhoGrafico}>
              <span>FATURAMENTO POR CATEGORIA</span>

              <p>
                Descubra quais categorias geram mais receita
              </p>
            </div>

            <div className={style.graficoCategorias}>

              <div className={style.graficoPizza}>

                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>

                    <Pie
                      data={dadosCategoriasPizza}
                      dataKey="faturamento"
                      nameKey="categoria"
                      cx="50%"
                      cy="50%"
                      innerRadius={75}
                      outerRadius={115}
                      paddingAngle={4}
                      cornerRadius={8}
                      stroke="transparent"
                    >
                      {dadosCategoriasPizza.map((item, index) => (
                        <Cell
                          key={item.id}
                          fill={
                            CORES_CATEGORIAS[
                            index % CORES_CATEGORIAS.length
                            ]
                          }
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      position={undefined}
                      cursor={false}
                      wrapperStyle={{
                        zIndex: 9999
                      }}
                      formatter={(valor) => [
                        formatarMoeda(valor),
                        "Faturamento"
                      ]}
                      contentStyle={{
                        backgroundColor: "#141414",
                        border: "1px solid #C9A84C",
                        borderRadius: "8px",
                        color: "#fff"
                      }}
                    />

                  </PieChart>
                </ResponsiveContainer>

                <div className={style.centroPizza}>
                  <span className={style.textoCentro}>
                    TOTAL
                  </span>

                  <strong className={style.valorCentro}>
                    {formatarMoeda(totalFaturamentoCategorias)}
                  </strong>
                </div>

              </div>

              <div className={style.legendaCategorias}>

                {dadosCategoriasPizza.map((categoria, index) => (

                  <div
                    key={categoria.id}
                    className={style.itemCategoria}
                  >

                    <div className={style.infoCategoria}>

                      <span
                        className={style.corCategoria}
                        style={{
                          background:
                            CORES_CATEGORIAS[
                            index % CORES_CATEGORIAS.length
                            ]
                        }}
                      />

                      <div>
                        <p className={style.nomeCategoria}>
                          {categoria.categoria}
                        </p>

                        <span className={style.valorCategoria}>
                          {formatarMoeda(categoria.faturamento)}
                        </span>
                      </div>

                    </div>

                    <div className={style.dadosCategoria}>
                      <span className={style.percentualCategoria}>
                        {categoria.percentual}%
                      </span>
                    </div>

                  </div>

                ))}

              </div>

            </div>
          </div>

          </div>
          {/* fim linha: Pedidos por status + Faturamento por categoria */}

          <div className={style.linhaDuasColunas}>

          <div className={`${style.cardGrafico} ${style.cardProdutosMaisVendidos}`}>
            <div className={style.cabecalhoGrafico}>
              <span>PRODUTOS MAIS VENDIDOS</span>
              <p>Ranking dos 5 produtos com maior volume de vendas</p>
            </div>

            <div className={style.graficoProdutos}>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart
                  data={vendas.produtosMaisVendidos || []}
                  layout="vertical"
                  margin={{
                    top: 10,
                    right: 20,
                    left: 30,
                    bottom: 10
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,.05)"
                  />

                  <XAxis
                    type="number"
                    stroke="#888"
                  />

                  <YAxis
                    type="category"
                    dataKey="nome"
                    width={170}
                    stroke="#888"
                    tick={<TickProdutoComImagem />}
                  />

                  <Tooltip
                    formatter={(value) => [`${value} vendas`, "Quantidade"]}
                    contentStyle={{
                      background: "#111",
                      border: "1px solid rgba(201,168,76,.4)",
                      borderRadius: "10px",
                      color: "#fff"
                    }}
                  />

                  <Bar
                    dataKey="totalVendas"
                    radius={[0, 8, 8, 0]}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  >
                    {(vendas.produtosMaisVendidos || []).map((_, index) => (
                      <Cell
                        key={index}
                        fill={
                          [
                            "#D4AF37",
                            "#14C8B8",
                            "#FF6B6B",
                            "#4F8EF7",
                            "#9B5DE5"
                          ][index]
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={style.cardRecentes}>
            <div className={style.cabecalhoRecentes}>
              <div>
                <p className={style.tituloRecentes}>
                  Coleções mais vendidas
                </p>

                <p className={style.subtituloRecentes}>
                  Descubra qual coleção está faturando mais
                </p>
              </div>
            </div>

            <div className={style.listaRecentes}>
              {(metricas.colecoesMaisVendidas || []).length === 0 ? (
                <p className={style.semProdutos}>
                  Não há nenhuma coleção cadastrada ou faturando no momento
                </p>
              ) : (
                (metricas.colecoesMaisVendidas.map((colecao) => (
                  <div
                    key={colecao.id}
                    className={style.itemRecente}
                  >
                    <div className={style.blocoComImagem}>

                      {colecao.imagem ? (
                        <img
                          src={`http://localhost:3000${colecao.imagem}`}
                          alt={colecao.nome}
                          className={style.miniImagem}
                        />
                      ) : (
                        <div className={style.imagemPlaceholder}>💎</div>
                      )}

                      <div className={style.informacoesRecente}>
                        <p className={style.nomeRecente}>
                          {colecao.nome}
                        </p>

                        <span className={style.categoriaRecente}>
                          {colecao.faturamento}
                        </span>
                      </div>

                    </div>

                    <div className={style.dadosRecente}>
                      <span className={style.estoqueRecente}>
                        {colecao.produtosVendidos} un.
                      </span>
                    </div>
                  </div>
                ))
                ))}
            </div>
          </div>

          </div>

        </section>
        )}

        {/* ==================== BLOCO: ESTOQUE ==================== */}
        {mostrarBloco("estoque") && (
        <section className={style.blocoSecao}>

          <div className={style.cabecalhoBloco}>
            <h2>Estoque</h2>
            <p>Visão geral do estoque disponível, alertas de reposição e produtos recém-cadastrados</p>
          </div>

          <div className={style.linhaDuasColunas}>

          <div className={style.cardGrafico}>
            <div className={style.cabecalhoGrafico}>
              <span>ESTOQUE POR CATEGORIA</span>
              <p>Total de peças disponíveis em cada categoria</p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={estoqueCategorias}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 10
                }}
              >
                <XAxis dataKey="categoria" />
                <YAxis />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    backgroundColor: "#1b1b1b",
                    border: "1px solid #C9A84C",
                    borderRadius: "2px"
                  }}
                />
                <Bar
                  dataKey="estoque"
                  fill="#C9A84C"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={style.cardEstoque}>
            <div className={style.cabecalho}>
              <span className={style.icone}>⚠</span>
              <span className={style.titulo}>ALERTAS DE ESTOQUE</span>
            </div>

            <div className={style.listaProdutos}>

              {alertasEstoque.length === 0 ? (
                <p>Nenhum alerta de estoque</p>
              ) : (
                alertasEstoque.map((produtoAlerta) => (
                  <div className={style.itemProduto} key={produtoAlerta.id}>
                    <div className={style.blocoComImagem}>

                      {produtoAlerta.imagem ? (
                        <img
                          src={`http://localhost:3000${produtoAlerta.imagem}`}
                          alt={produtoAlerta.nome}
                          className={style.miniImagem}
                        />
                      ) : (
                        <div className={style.imagemPlaceholder}>💎</div>
                      )}

                      <div className={style.informacoesProduto}>
                        <p className={style.nomeProduto}>{produtoAlerta.nome}</p>
                        <span className={style.categoriaProduto}>{produtoAlerta.categoria}</span>
                      </div>

                    </div>

                    <span className={style.quantidadeProduto}>
                      {produtoAlerta.estoque} uni.
                    </span>
                  </div>
                ))
              )}

            </div>
          </div>

          </div>

          <div className={style.cardRecentes}>
            <div className={style.cabecalhoRecentes}>
              <div>
                <p className={style.tituloRecentes}>
                  Produtos Recentes
                </p>

                <p className={style.subtituloRecentes}>
                  Últimos produtos cadastrados
                </p>
              </div>
            </div>

            <div className={style.listaRecentes}>
              {produtosRecentes.length === 0 ? (
                <p className={style.semProdutos}>
                  Nenhum produto cadastrado recentemente.
                </p>
              ) : (
                produtosRecentes.map((produtoRecente) => (
                  <div
                    key={produtoRecente.id}
                    className={style.itemRecente}
                  >
                    <div className={style.blocoComImagem}>

                      {produtoRecente.imagem ? (
                        <img
                          src={`http://localhost:3000${produtoRecente.imagem}`}
                          alt={produtoRecente.nome}
                          className={style.miniImagem}
                        />
                      ) : (
                        <div className={style.imagemPlaceholder}>💎</div>
                      )}

                      <div className={style.informacoesRecente}>
                        <p className={style.nomeRecente}>
                          {produtoRecente.nome}
                        </p>

                        <span className={style.categoriaRecente}>
                          {produtoRecente.categoria}
                        </span>
                      </div>

                    </div>

                    <div className={style.dadosRecente}>
                      <span className={style.estoqueRecente}>
                        {produtoRecente.estoque} un.
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </section>
        )}

        {/* ==================== BLOCO: METAS ==================== */}
        {mostrarBloco("metas") && (
        <section className={style.blocoSecao}>

          <div className={style.cabecalhoBloco}>
            <h2>Metas Financeiras</h2>
            <p>Acompanhe a meta do mês atual e compare com os resultados anteriores</p>
          </div>

          <div className={style.linhaDuasColunas}>

          <div className={style.cardMetaMensal}>

            <div className={style.cabecalhoMeta}>

              <div>
                <span className={style.tituloMeta}>
                  META DO MÊS DE {nomeMes.toUpperCase()}
                </span>

                <p className={style.descricaoMeta}>
                  {metaMensal.descricao || "Meta mensal"}
                </p>
              </div>

              {metaMensal.metaAtingida && (
                <div className={style.badgeMeta}>
                  ✓ Atingida
                </div>
              )}

              <button onClick={() => setAbrirModalEditar(true)} className={style.btnEditarMeta}>
                <img width="20" height="20" src="https://img.icons8.com/ios-glyphs/30/ffffff/edit--v1.png" alt="edit--v1" />
              </button>

            </div>

            <div className={style.valorMeta}>

              {formatarMoeda(metaMensal.valorMeta || 0)}

            </div>

            <div className={style.barraMeta}>

              <div
                className={style.progressoMeta}
                style={{
                  width: `${Math.min(metaMensal.percentual || 0, 100)}%`
                }}
              />

            </div>

            <div className={style.infoMeta}>

              <div>

                <span className={style.labelMeta}>
                  Faturado
                </span>

                <strong>
                  {formatarMoeda(metaMensal.faturamentoAtual || 0)}
                </strong>

              </div>

              <div>

                <span className={style.labelMeta}>
                  Progresso
                </span>

                <strong>
                  {metaMensal.percentual || 0}%
                </strong>

              </div>

            </div>

            <div className={style.rodapeMeta}>

              <span>
                Faltam
              </span>

              <strong>
                {formatarMoeda(metaMensal.faltam || 0)}
              </strong>

            </div>

          </div>

          {todasMetas.length > 0 && (
            <div className={style.cardComparativoMetas}>

              <div className={style.cabecalhoComparativo}>
                <div>
                  <span className={style.tituloMeta}>HISTÓRICO DE METAS</span>
                  <p className={style.descricaoMeta}>Compare os resultados de cada mês</p>
                </div>
              </div>

              <div className={style.listaMetasMini}>
                {metasExibidas.map((meta) => (
                  <div key={meta.id} className={style.metaMini}>

                    <div className={style.cabecalhoMetaMini}>
                      <span className={style.mesMetaMini}>
                        {nomesMeses[meta.mes]} / {meta.ano}
                      </span>

                      {meta.metaAtingida && (
                        <span className={style.badgeMetaMini}>✓</span>
                      )}
                    </div>

                    <strong className={style.valorMetaMini}>
                      {formatarMoeda(meta.valorMeta)}
                    </strong>

                    <div className={style.barraMetaMini}>
                      <div
                        className={style.progressoMetaMini}
                        style={{ width: `${Math.min(meta.percentual || 0, 100)}%` }}
                      />
                    </div>

                    <div className={style.infoMetaMini}>
                      <span>{formatarMoeda(meta.faturamentoAtual)} faturado</span>
                      <span className={style.percentualMetaMini}>{meta.percentual}%</span>
                    </div>

                  </div>
                ))}
              </div>

              {todasMetas.length > 5 && (
                <button
                  className={style.btnVerTodasMetas}
                  onClick={() => setVerTodasMetas(!verTodasMetas)}
                >
                  {verTodasMetas ? "Ver menos" : "Ver todas as metas"}
                </button>
              )}

            </div>
          )}

          </div>

        </section>
        )}


        <ModalAddMeta
          isOpen={abrirModalAdicionar}
          fecharModal={() => setAbrirModalAdicionar(false)}
          atualizarDashboard={carregarDashboard}


        />
        <ModalEditarMeta
          isOpen={abrirModalEditar}
          fecharModal={() => setAbrirModalEditar(false)}
          meta={metaMensal}
          atualizarDashboard={carregarDashboard}


        />
      </main>
    </>
  );
}