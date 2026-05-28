import style from "../../styles/Admin/dashboard.module.css";
import SideBar from "../../components/Admin/SideBar";
import HeaderAdmin from "../../components/Admin/Header";

export default function Dashboard() {
  return (
    <>

      <main className={style.painelPrincipal}>

        <div className={style.saudacao}>
          <p className={style.saudacaoRotulo}>
            PAINEL DE CONTROLE - AZORY JOALHERIA
          </p>
          <h1 className={style.saudacaoTitulo}>Olá, Breno.</h1>
          <p className={style.saudacaoSubtitulo}>
            Todas as informações da sua coleção centralizadas em um único
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
        <div className={style.cardsMetricos}>
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
            <h1 className={style.cardValor}>243</h1>
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
            <h1 className={style.cardValor}>R$ 320k</h1>
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
        </div>
      </main>
    </>
  );
}
