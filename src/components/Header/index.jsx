import style from "./styles.module.css"
import logo from "../../img/logo.svg"
import { useAuth } from "../../context/authContext"
import SideBarUser from "../UserSideBar"
import { useState } from "react"
import { NavLink } from "react-router-dom"


export default function Header() {

    const { usuario, estaLogado } = useAuth()
    const [openSideBarUser, setOpenSideBarUser] = useState(false)


    return (
        <>
            <header>
                <a href="/">
                    <img className={style.logo} src={logo} alt="logo loja" />

                </a>


                {usuario?.tipo === "admin" ? (
                    <nav>
                        <a className={style.link} href="">INÍCIO</a>
                        <a className={style.link} href="">PRODUTOS</a>
                        <a className={style.link} href="/admin">DASHBOARD</a>
                        <a className={style.link} href="/admin">CATEGORIAS</a>
                    </nav>

                ) : (
                    <nav>
                        <a className={style.link} href="">INÍCIO</a>
                        <a className={style.link} href="">PRODUTOS</a>
                        <a className={style.link} href="">COLEÇÕES</a>
                    </nav>
                )}



                {!estaLogado ? (
                    <div className={style.btnsAcoes}>
                        <NavLink to="/login" className="btnPadrao">Login</NavLink>
                        <NavLink to="/cadastrar" className={`btnPadrao ${style.btnCadastrar}`}>Cadastrar</NavLink>
                    </div>
                ) : usuario?.tipo === "admin" ? (
                    <div className={style.acoesUser}>
                        <button onClick={() => setOpenSideBarUser(true)}>
                            <img width="24" height="24" src="https://img.icons8.com/material-sharp/24/ffffff/user.png" alt="user" />
                        </button>
                    </div>



                ) : (
                    <div className={style.acoesUser}>

                        <div className={style.acoesLogado}>
                            <button>
                                <img title="Minha sacola" width="28" height="28" src="https://img.icons8.com/ios-filled/50/ffffff/shopping-bag.png" alt="shopping-bag" />                            </button>
                            <button onClick={() => setOpenSideBarUser(true)}>
                                <img title="Minha conta" width="30" height="30" src="https://img.icons8.com/material-sharp/24/ffffff/user.png" alt="user" />
                            </button>
                        </div>


                    </div>

                )}

                {/* <a href="/admin" className={style.navCta}>ACESSAR SISTEMA</a> */}

            </header>


            {/* {openSideBarUser && ( */}
            <SideBarUser isOpen={openSideBarUser} fecharSideBar={() => setOpenSideBarUser(false)} />

            {/* )} */}
        </>
    )
}