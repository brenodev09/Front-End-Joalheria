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
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {

  const { usuario } = useAuth()
  const { metricas, estoqueCategorias, alertasEstoque, produtosRecentes, carregando } = dadosDashboard()

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
              <span className={style.cardRotulo}>RECEITA MENSAL</span>
            </div>
            <h1 className={style.cardValor}>R$ {Number(metricas.valorEstoque || 0).toLocaleString("pt-BR")}</h1>
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
            <h1 className={style.cardValor}>18</h1>
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
              <span className={style.cardRotulo}>PRODUTOS ATIVOS</span>
            </div>
            <h1 className={style.cardValor}>243</h1>
            <p className={style.cardDescricao}>produtos ativos em estoque</p>
          </div>
        </section>


        {/* graficos e cards */}
        <section className={style.painelGraficos}>

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
          </div>
        </section>
      </main>
    </>
  );
}
