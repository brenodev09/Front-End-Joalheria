import style from "../../styles/Admin/inicial.module.css";
import Particulas from "../../components/particulas";
import Header from "../../components/Header";

import relogio from "../../img/Destaques/relogio.png"
import colar from "../../img/Destaques/colar.png"
import modelo from "../../img/Destaques/modelo.png"

export default function Inicial() {
  return (
    <div id="containerSite">

      <section className={style.hero}>
        <Header />
        <Particulas />

        <div className={style.textHero}>
          <h1>O brilho da sofisticação começa aqui</h1>
          <p>
            Cada joia carrega exclusividade, história e valor. Sua gestão merece
            o mesmo nível de cuidado, sofisticação e excelência presente em cada
            peça da coleção.
          </p>
          <a href="/admin" className={style.cta}>
            <span className={style.ctaTexto}>Acessar sistema</span>
            <img width="15" height="15" src="https://img.icons8.com/material-rounded/24/c9a96e/right.png" alt="right" />


          </a>
        </div>

      </section>

      <section className={style.containerDestaques}>
        <h1 className={style.tituloSec}>PRODUTOS EM DESTAQUE</h1>


          <h1 className={style.bgWord}>LUXO</h1>

        <div className={style.contentDestaques}>


          <section className={style.gridProdutos}>

            <div className={style.cardProduto}>
              <div className={style.imagemProduto}>
                <img src={relogio} alt="Relógio Luxury Gold" />
              </div>
              <div className={style.infoProduto}>
                <div className={style.textoProduto}>
                  <h3 className={style.tituloProduto}>Relógio Luxury Gold</h3>
                  <p className={style.precoProduto}>
                    <span className={style.precoLabel}>a partir de </span>
                    <span className={style.precoValor}>R$ 2099.00</span>
                  </p>
                </div>
                <button className={`btnPadrao ${style.btnVerProduto}` }>Ver produto</button>
              </div>
            </div>

            <div className={style.cardProduto}>
              <div className={style.imagemProduto}>
                <img src={colar} alt="Relógio Luxury Gold" />
              </div>
              <div className={style.infoProduto}>
                <div className={style.textoProduto}>
                  <h3 className={style.tituloProduto}>Relógio Luxury Gold</h3>
                  <p className={style.precoProduto}>
                    <span className={style.precoLabel}>a partir de </span>
                    <span className={style.precoValor}>R$ 2099.00</span>
                  </p>
                </div>
                <button className={`btnPadrao ${style.btnVerProduto}` }>Ver produto</button>
              </div>
            </div>

            <div className={style.cardProduto}>
              <div className={style.imagemProduto}>
                <img src={relogio} alt="Relógio Luxury Gold" />
              </div>
              <div className={style.infoProduto}>
                <div className={style.textoProduto}>
                  <h3 className={style.tituloProduto}>Relógio Luxury Gold</h3>
                  <p className={style.precoProduto}>
                    <span className={style.precoLabel}>a partir de </span>
                    <span className={style.precoValor}>R$ 2099.00</span>
                  </p>
                </div>
                <button className={`btnPadrao ${style.btnVerProduto}` }>Ver produto</button>
              </div>
            </div>

            <div className={style.cardProduto}>
              <div className={style.imagemProduto}>
                <img src={colar} alt="Relógio Luxury Gold" />
              </div>
              <div className={style.infoProduto}>
                <div className={style.textoProduto}>
                  <h3 className={style.tituloProduto}>Relógio Luxury Gold</h3>
                  <p className={style.precoProduto}>
                    <span className={style.precoLabel}>a partir de </span>
                    <span className={style.precoValor}>R$ 2099.00</span>
                  </p>
                </div>
                <button className={`btnPadrao ${style.btnVerProduto}` }>Ver produto</button>
              </div>
            </div>

          </section>

          <img className={style.imgModelo} src={modelo} alt="imagem do modelo" />

        </div>
      </section>


    </div>
  );
}
