import style from "../../styles/Admin/categorias.module.css"
import aneis from "../../img/Categorias/aneis.png"
import { useState, useEffect } from "react"
import { api } from "../../services/api.js"
import ModalAddCategoria from "../../components/Admin/Modais/ModalAddCategoria"
import ModalDeleteCategoria from "../../components/Admin/Modais/ModalDeletarCategoria"
import ModalEditarCategoria from "../../components/Admin/Modais/ModalEditarCategoria/index.jsx"

export default function Categorias() {

    const [openModal, setOpenModal] = useState()
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [openModalEditar, setOpenModalEditar] = useState(false)
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null)
    const [categorias, setCategorias] = useState([])
    const [erro, setErro] = useState("")
    const [excluindo, setExcluindo] = useState(false)
    const [pesquisa, setPesquisar] = useState("")



    // listagem das categorias na pagina
    useEffect(() => {
        api.get("/categorias").then((resposta) => {
            setCategorias(resposta.data)
        }).catch(() => {
            setErro("Erro ao carregar as categorias, por favor tente novamente!")
        })
    }, [])



    // função de deletar a categoria

    async function excluirCategoria() {
        if (!categoriaSelecionada) return


        setExcluindo(true)

        try {
            await api.delete(`/categorias/${categoriaSelecionada.id}`)


            setCategorias((categoriasAtuais) =>
                categoriasAtuais.filter((categoria) => categoria.id !== categoriaSelecionada.id)
            )

            setOpenModalDelete(false)
        } catch (error) {
            setErro("Erro ao excluir a categoria, por favor tente novamente!")
        } finally {
            setExcluindo(false)
        }
    }


    // funcao de filtrar a categoria para pesquisar 
    const categoriaPesquisada = categorias.filter((categoria) =>
        categoria.nome.toLowerCase().includes(pesquisa.toLocaleLowerCase())
    )



    return (

        <main>

            <header className={style.headerCategoria}>

                <div className={style.textTitle}>
                    <h1>Categorias</h1>
                    <p>Gerencie as categorias dos produtos.</p>
                </div>

                {/* <button onClick={() => setOpenModal(true)} className={style.btnAddCategoria}>
                    <img width="20" height="20" src="https://img.icons8.com/ios-filled/23/plus-math.png" alt="plus-math" />
                    <p>ADICIONAR CATEGORIA</p>
                </button> */}

                {/* botaoa teste */}
                <button onClick={() => setOpenModal(true)} className={style.btnAddCategoria}>
                    <img width="20" height="20" src="https://img.icons8.com/ios-filled/23/plus-math.png" alt="plus-math" />
                    <p>ADICIONAR CATEGORIA </p>
                </button>
            </header>

            <div className={style.acoesPage}>

                <div className={style.inputBusca}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input type="text" placeholder="Buscar categoria..." value={pesquisa} onChange={(event) => setPesquisar(event.target.value)} />
                </div>

                <div className={style.filtros}>

                    <select className={style.selectFiltro} name="categoria">
                        <option value="">Categoria</option>
                        <option value="aneis">Anéis</option>
                    </select>

                    <select className={style.selectFiltro} name="material">
                        <option value="">Material</option>
                        <option value="ouro">Ouro</option>
                    </select>

                    <select className={style.selectFiltro} name="status">
                        <option value="">Status</option>
                        <option value="ativo">Ativo</option>
                    </select>

                    <select className={style.selectFiltro} name="estoque">
                        <option value="">Estoque</option>
                        <option value="disponivel">Disponível</option>
                    </select>

                    <button className={style.botaoMaisFiltros}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="4" y1="6" x2="20" y2="6" />
                            <line x1="8" y1="12" x2="16" y2="12" />
                            <line x1="11" y1="18" x2="13" y2="18" />
                        </svg>
                        Mais Filtros
                    </button>

                </div>

            </div>

            {erro && <p>{erro}</p>}

            {categorias.length === 0 && !erro && (
                <p className={style.vazioMensagem}>Nenhuma categoria cadastrado!</p>
            )}

            <section className={style.secaoGrid}>


                {categoriaPesquisada.map((categoria) => (
                    <div key={categoria.id} className={style.cardCategoria}>
                        <div className={style.imagemCategoria}>
                            <img src={categoria.imagem?.startsWith("http") ? categoria.imagem : `http://localhost:3000${categoria.imagem}`}
                                alt={`imagem da categoria: ${categoria.nome}`} />
                        </div>

                        <div className={style.infoCategoria}>
                            <h3 className={style.tituloCategoria}>{categoria.nome}</h3>
                            <span className={style.quantidadeProdutos}>
                                {categoria.total_produtos}{" "}
                                {categoria.total_produtos === 1 ? "produto cadastrado" : "produtos cadastrados"}
                            </span>
                            <p className={style.descricaoCategoria}>{categoria.descricao}</p>

                            <div className={style.acoesCategoria}>
                                <button onClick={() => { setOpenModalEditar(true); setCategoriaSelecionada(categoria) }} className={style.botaoEditar}>
                                    <img width="21" height="21" src="https://img.icons8.com/material/24/D1A84B/edit--v1.png" alt="edit--v1" />
                                    <p>Editar</p>
                                </button>
                                <button onClick={() => { setOpenModalDelete(true); setCategoriaSelecionada(categoria) }} className={style.botaoExcluir}>
                                    <img width="21" height="21" src="https://img.icons8.com/material-outlined/24/B50A0A/filled-trash.png" alt="filled-trash" />
                                    <p>Excluir</p>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}



                {/* <div className={style.cardCategoria}>
                    
                    <div className={style.imagemCategoria}>
                        <img src={aneis} alt="Anéis" />
                    </div>

                    <div className={style.infoCategoria}>
                        <h3 className={style.tituloCategoria}>Anéis</h3>
                        <span className={style.quantidadeProdutos}>48 produtos cadastrados</span>
                        <p className={style.descricaoCategoria}>Anéis em ouro, prata e pedras preciosas</p>
                        <div className={style.acoesCategoria}>
                            <button className={style.botaoEditar}> 
                                <img width="21" height="21" src="https://img.icons8.com/material/24/D1A84B/edit--v1.png" alt="edit--v1"/>
                                <p>Editar</p>
                            </button>
                            <button className={style.botaoExcluir}>
                                <img width="21" height="21" src="https://img.icons8.com/material-outlined/24/B50A0A/filled-trash.png" alt="filled-trash"/>
                                <p>Excluir</p>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={style.cardCategoria}>
                    <div className={style.imagemCategoria}>
                        <img src={aneis} alt="Anéis" />
                    </div>
                    <div className={style.infoCategoria}>
                        <h3 className={style.tituloCategoria}>Anéis</h3>
                        <span className={style.quantidadeProdutos}>48 produtos cadastrados</span>
                        <p className={style.descricaoCategoria}>Anéis em ouro, prata e pedras preciosas</p>
                       <div className={style.acoesCategoria}>
                            <button className={style.botaoEditar}> 
                                <img width="21" height="21" src="https://img.icons8.com/material/24/D1A84B/edit--v1.png" alt="edit--v1"/>
                                <p>Editar</p>
                            </button>
                            <button className={style.botaoExcluir}>
                                <img width="21" height="21" src="https://img.icons8.com/material-outlined/24/B50A0A/filled-trash.png" alt="filled-trash"/>
                                <p>Excluir</p>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={style.cardCategoria}>
                    <div className={style.imagemCategoria}>
                        <img src={aneis} alt="Anéis" />
                    </div>
                    <div className={style.infoCategoria}>
                        <h3 className={style.tituloCategoria}>Anéis</h3>
                        <span className={style.quantidadeProdutos}>48 produtos cadastrados</span>
                        <p className={style.descricaoCategoria}>Anéis em ouro, prata e pedras preciosas</p>
                       <div className={style.acoesCategoria}>
                            <button className={style.botaoEditar}> 
                                <img width="21" height="21" src="https://img.icons8.com/material/24/D1A84B/edit--v1.png" alt="edit--v1"/>
                                <p>Editar</p>
                            </button>
                            <button className={style.botaoExcluir}>
                                <img width="21" height="21" src="https://img.icons8.com/material-outlined/24/B50A0A/filled-trash.png" alt="filled-trash"/>
                                <p>Excluir</p>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={style.cardCategoria}>
                    <div className={style.imagemCategoria}>
                        <img src={aneis} alt="Anéis" />
                    </div>
                    <div className={style.infoCategoria}>
                        <h3 className={style.tituloCategoria}>Anéis</h3>
                        <span className={style.quantidadeProdutos}>48 produtos cadastrados</span>
                        <p className={style.descricaoCategoria}>Anéis em ouro, prata e pedras preciosas</p>
                         <div className={style.acoesCategoria}>
                            <button className={style.botaoEditar}> 
                                <img width="21" height="21" src="https://img.icons8.com/material/24/D1A84B/edit--v1.png" alt="edit--v1"/>
                                <p>Editar</p>
                            </button>
                            <button className={style.botaoExcluir}>
                                <img width="21" height="21" src="https://img.icons8.com/material-outlined/24/B50A0A/filled-trash.png" alt="filled-trash"/>
                                <p>Excluir</p>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={style.cardCategoria}>
                    <div className={style.imagemCategoria}>
                        <img src={aneis} alt="Anéis" />
                    </div>
                    <div className={style.infoCategoria}>
                        <h3 className={style.tituloCategoria}>Anéis</h3>
                        <span className={style.quantidadeProdutos}>48 produtos cadastrados</span>
                        <p className={style.descricaoCategoria}>Anéis em ouro, prata e pedras preciosas</p>
                        <div className={style.acoesCategoria}>
                            <button className={style.botaoEditar}>✏ Editar</button>
                            <button className={style.botaoExcluir}>🗑 Excluir</button>
                        </div>
                    </div>
                </div>

                <div className={style.cardCategoria}>
                    <div className={style.imagemCategoria}>
                        <img src={aneis} alt="Anéis" />
                    </div>
                    <div className={style.infoCategoria}>
                        <h3 className={style.tituloCategoria}>Anéis</h3>
                        <span className={style.quantidadeProdutos}>48 produtos cadastrados</span>
                        <p className={style.descricaoCategoria}>Anéis em ouro, prata e pedras preciosas</p>
                        <div className={style.acoesCategoria}>
                            <button className={style.botaoEditar}>✏ Editar</button>
                            <button className={style.botaoExcluir}>🗑 Excluir</button>
                        </div>
                    </div>
                </div> */}

            </section>

            <ModalDeleteCategoria aberto={openModalDelete} categoria={categoriaSelecionada}
                aoConfirmar={excluirCategoria} aoFechar={() => { setOpenModalDelete(false) }} />
            <ModalEditarCategoria isOpen={openModalEditar} fecharModal={() => setOpenModalEditar(false)}
                categoria={categoriaSelecionada}
                aoSalvar={(categoriaAtualizada) => {
                    setCategorias((atual) => atual.map((c) => (c.id === categoriaAtualizada.id ? categoriaAtualizada : c)))
                }} />
            <ModalAddCategoria isOpen={openModal} fecharModal={() => setOpenModal(false)} />
        </main>



    )
}