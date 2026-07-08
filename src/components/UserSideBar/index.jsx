import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/authContext"
import style from "./styles.module.css"

// ─── Ícones SVG inline para não depender de biblioteca externa ───────────────

const IcoConta = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
)

const IcoPedidos = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
    </svg>
)

const IcoFavoritos = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
)

const IcoCarrinho = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
    </svg>
)

const IcoDashboard = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
)

const IcoProdutos = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
    </svg>
)

const IcoCategorias = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <circle cx="3" cy="6" r="1" /><circle cx="3" cy="12" r="1" /><circle cx="3" cy="18" r="1" />
    </svg>
)

const IcoUsuarios = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
)

const IcoSair = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
)

const IcoFechar = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)

// ─── Subcomponente: item de menu ─────────────────────────────────────────────

function ItemMenu({ icone, rotulo, onClick }) {

    return (
        <li className={style.itemMenu} onClick={onClick}>
            <span className={style.itemMenuIcone}>{icone}</span>
            <span className={style.itemMenuRotulo}>{rotulo}</span>
        </li>
    )
}

// ─── Componente principal ────────────────────────────────────────────────────

export default function SideBar({ isOpen, fecharSideBar }) {
    const navegar = useNavigate()
    const [erro, setErro] = useState("")
    const [carregando, setCarregando] = useState(false)
    const { usuario } = useAuth()
    const { logout } = useAuth()

    if (!usuario) {
        return null
    }
    const ehAdmin = usuario?.tipo === "admin"

    // Inicial do nome para avatar fallback
    const inicialNome = usuario?.nome?.charAt(0).toUpperCase() || "U"



    async function sairConta(event) {
        event.preventDefault()
        setErro("")
        setCarregando(true)
        try {
            // Chame seu logout aqui, ex: await logout()
            await logout()
            navegar("/")
        } catch (e) {
            setErro("Erro ao sair. Tente novamente.")
        } finally {
            setCarregando(false)
        }
    }

    function navegar_e_fechar(rota) {
        fecharSideBar()
        navegar(rota)
    }

    return (
        <>
            {/* Overlay escuro */}
            <div
                className={`${style.overlay} ${isOpen ? style.overlayVisivel : ""}`}
                onClick={fecharSideBar}
                aria-hidden="true"
            />

            {/* Painel lateral */}
            <aside
                className={`${style.painelLateral} ${isOpen ? style.painelAberto : ""}`}
                role="dialog"
                aria-modal="true"
                aria-label="Menu do usuário"
            >
                {/* Cabeçalho */}
                <header className={style.cabecalho}>
                    <div className={style.logoMarca}>
                        <span className={style.logoTexto}>AZORY</span>
                    </div>
                    <button
                        className={style.btnFechar}
                        onClick={fecharSideBar}
                        aria-label="Fechar menu"
                    >
                        <IcoFechar />
                    </button>
                </header>

                {/* Perfil do usuário */}
                <section className={style.secaoPerfil}>
                    <div className={style.avatarWrapper}>
                        {usuario?.foto_perfil ? (
                            <img
                                src={`http://localhost:3000${usuario.foto_perfil}`}
                                alt={`Avatar de ${usuario?.nome}`}
                                className={style.avatarImagem}
                            />
                        ) : (
                            <div className={style.avatarFallback}>{inicialNome}</div>
                        )}
                        <span className={style.avatarStatus} />
                    </div>
                    <div className={style.perfilInfo}>
                        <p className={style.perfilNome}>{usuario?.nome}</p>
                        <p className={style.perfilEmail}>{usuario?.email}</p>
                        {/* {ehAdmin && (
              <span className={style.badgeAdmin}>Administrador</span>
            )} */}
                    </div>
                </section>

                <div className={style.divisoria} />

                {/* Navegação principal */}
                <nav className={style.linksNavegacao}>
                    {usuario?.tipo === "admin" ? (
                        <ul className={style.listaMenu}>
                            <ItemMenu
                                icone={<IcoDashboard />}
                                rotulo="Dashboard"
                                onClick={() => navegar_e_fechar("/admin/dashboard")}
                            />
                            <ItemMenu
                                icone={<IcoProdutos />}
                                rotulo="Produtos"
                                onClick={() => navegar_e_fechar("/admin/produtos")}
                            />
                            <ItemMenu
                                icone={<IcoCategorias />}
                                rotulo="Categorias"
                                onClick={() => navegar_e_fechar("/admin/categorias")}
                            />
                            <ItemMenu
                                icone={<IcoUsuarios />}
                                rotulo="Minha conta"
                                onClick={() => navegar_e_fechar("/admin/conta")}
                            />
                        </ul>
                    ) : (
                        <ul className={style.listaMenu}>
                            <ItemMenu
                                icone={<IcoConta />}
                                rotulo="Minha Conta"
                                onClick={() => navegar_e_fechar("/conta")}
                            />
                            <ItemMenu
                                icone={<IcoPedidos />}
                                rotulo="Meus Pedidos"
                                onClick={() => navegar_e_fechar("/pedidos")}
                            />
                            <ItemMenu
                                icone={<IcoFavoritos />}
                                rotulo="Favoritos"
                                onClick={() => navegar_e_fechar("/favoritos")}
                            />
                            <ItemMenu
                                icone={<IcoCarrinho />}
                                rotulo="Carrinho"
                                onClick={() => navegar_e_fechar("/carrinho")}
                            />
                        </ul>
                    )}

                </nav>

                {/* Rodapé com botão Sair */}
                <footer className={style.rodape}>
                    {erro && <p className={style.mensagemErro}>{erro}</p>}
                    <button
                        className={`btnPadrao ${style.btnSair}`}
                        onClick={sairConta}
                        disabled={carregando}
                        aria-label="Sair da conta"
                    >
                        <IcoSair />
                        <span>{carregando ? "Saindo..." : "Sair"}</span>
                    </button>
                </footer>
            </aside>
        </>
    )
}