import style from "../../styles/Admin/dashboard.module.css";
import SideBar from "../../components/Admin/SideBar";
import HeaderAdmin from "../../components/Admin/Header";
import { useAuth } from "../../context/authContext"
import { api } from "../../services/api"
import dadosDashboard from "../../context/dataContext"
import { useState } from "react";
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
  ResponsiveContainer
} from "recharts";


export default function Dashboard() {

  const { usuario } = useAuth()
  const { metricas, estoqueCategorias, alertasEstoque, produtosRecentes, vendas, carregando } = dadosDashboard()
  const vendasUltimos30Dias = vendas.vendasUltimos30Dias || []

  const formatarDataGrafico = (data) => {
    const dataObj = new Date(data)

    return dataObj.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit"
    })
  }

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(valor)
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
          <h1 className={style.saudacaoTitulo}>Olá, {usuario.nome}.</h1>
          <p className={style.saudacaoSubtitulo}>
            Todas as informações do seu sistema centralizadas em um único
            painel.
          </p>

          <div className={style.saudacaoResumo}>
            <div className={style.resumoItem}>
              <span className={style.resumoRotulo}>Hoje</span>
              <span className={style.resumoValor}>R$ 28.400</span>
            </div>
            <div className={style.resumoItem}>
              <span className={style.resumoRotulo}>Esta semana</span>
              <span className={style.resumoValor}>R$ 142K</span>
            </div>
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
                  src="https://img.icons8.com/pastel-glyph/128/C9A84C/box--v3.png"
                  alt="box--v3"
                />
              </div>
              <span className={style.cardRotulo}>PRODUTOS ATIVOS</span>
            </div>
            <h1 className={style.cardValor}>{metricas.produtosAtivos}</h1>
            <p className={style.cardDescricao}>produtos ativos em estoque</p>
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
              <span className={style.cardRotulo}>FATURAMENTO BRUTO</span>
            </div>
            <h1 className={style.cardValor}>R$ {Number(vendas.faturamentoBruto || 0).toLocaleString("pt-BR")}</h1>
            <p className={style.cardDescricao}>produtos ativos em estoque</p>
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


        {/* graficos e cards */}
        <section className={style.painelGraficos}>

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
                />      <Bar
                  dataKey="estoque"
                  fill="#C9A84C"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

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


          {/* <div className={style.cardRecentes}>
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
                    <div className={style.informacoesRecente}>
                      <p className={style.nomeRecente}>
                        {produtoRecente.nome}
                      </p>

                      <span className={style.categoriaRecente}>
                        {produtoRecente.categoria}
                      </span>
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
                  <div className={style.itemProduto}>
                    <div className={style.informacoesProduto}>
                      <p className={style.nomeProduto}>{produtoAlerta.nome}</p>
                      <span className={style.categoriaProduto}>{produtoAlerta.categoria}</span>
                    </div>

                    <span className={style.quantidadeProduto}>
                      {produtoAlerta.estoque} uni.
                    </span>
                  </div>
                ))
              )}

            </div>
          </div> */}
        </section>
      </main>
    </>
  );
}
