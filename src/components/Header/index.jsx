import style from "./styles.module.css"
import logo from "../../img/logo.svg"

export default function Header() {
    return (
        <>
            <header>
                <img className={style.logo} src={logo} alt="logo loja" />

                <nav>
                    <a className={style.link} href="">INÍCIO</a>
                    <a className={style.link} href="">PRODUTOS</a>
                    <a className={style.link} href="">DASHBOARD</a>
                </nav>

                <button href="#contato" className={style.navCta}>ACESSAR SISTEMA</button>
            </header>
        </>
    )
}