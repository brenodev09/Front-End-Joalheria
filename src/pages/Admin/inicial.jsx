import style from "../../styles/Admin/inicial.module.css";
import Particulas from "../../components/particulas";
import Header from "../../components/Header";

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
              <img width="15" height="15" src="https://img.icons8.com/material-rounded/24/c9a96e/right.png" alt="right"/>

              
            </a>
        </div>

      </section>

      
    </div>
  );
}
