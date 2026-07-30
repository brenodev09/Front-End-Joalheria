import style from "./styles.module.css"
import logo from "../../img/logo.svg"
import { useAuth } from "../../context/authContext"
import SideBarUser from "../UserSideBar"
import { useState } from "react"
import { NavLink } from "react-router-dom"
import { useCarrinho } from "../../context/carrinhoContext";


export default function Header() {

    const { usuario, estaLogado } = useAuth()
    const { itens, abrirSidebar } = useCarrinho();
    const [openSideBarUser, setOpenSideBarUser] = useState(false)

    const quantidadeCarrinho = itens.reduce(
        (total, item) => total + item.quantidade,
        0
    );
    return (
        <>
            <header>
                <a href="/">
                    <img className={style.logo} src={logo} alt="logo loja" />

                </a>


                {usuario?.tipo === "admin" ? (
                    <nav>
                        <a className={style.link} href="/">INÍCIO</a>
                        <a className={style.link} href="/admin/produtos">PRODUTOS</a>
                        <a className={style.link} href="/admin/dashboard">DASHBOARD</a>
                        <a className={style.link} href="/admin/categorias">CATEGORIAS</a>
                    </nav>

                ) : (
                    <nav>
                        <a className={style.link} href="/">INÍCIO</a>
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
                            <button type="button" className={style.btnAcao} onClick={abrirSidebar}>

                                <img
                                    title="Minha sacola"
                                    width="28"
                                    height="28"
                                    src="https://img.icons8.com/ios-filled/50/ffffff/shopping-bag.png"
                                    alt="shopping-bag"
                                />

                                {quantidadeCarrinho > 0 && (
                                    <span className={style.badgeCarrinho}>
                                        {quantidadeCarrinho}
                                    </span>
                                )}

                            </button>
                            <button className={style.btnAcao} onClick={() => setOpenSideBarUser(true)}>
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