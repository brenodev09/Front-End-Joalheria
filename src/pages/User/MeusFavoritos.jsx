// MeusFavoritos.jsx
//
// Integração feita diretamente aqui, sem bibliotecas externas de
// data-fetching (sem React Query) e sem arquivos de api/hooks
// separados para favoritos. Espelha favoritos.routes.js:
//   GET    /favoritos                -> lista os favoritos do usuário
//   DELETE /favoritos/:produtoId     -> remove um favorito
//
// "Adicionar ao carrinho" usa o CarrinhoContext do projeto (mesma
// função que o resto da aplicação usa), em vez de uma chamada de API
// própria desta página.

import { useEffect, useMemo, useState } from "react"
import estilos from "../../styles/User/MeusFavoritos.module.css"
import FavoritoCard from "../../components/User/Favoritos/FavoritoCard/FavoritoCard.jsx"
import FavoritoCardSkeleton from "../../components/User/Favoritos/FavoritoCardSkeleton/FavoritocardSkeleton.jsx"
import { useCarrinho } from "../../context/carrinhoContext" // ajuste o caminho conforme a localização real do provider

const URL_BASE = import.meta.env?.VITE_API_URL || "/api"

function obterToken() {
    return localStorage.getItem("token")
}

async function requisicao(caminho, opcoes = {}) {
    const resposta = await fetch(`${URL_BASE}${caminho}`, {
        ...opcoes,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${obterToken()}`,
            ...opcoes.headers
        }
    })

    let corpo = null
    try {
        corpo = await resposta.json()
    } catch {
        corpo = null
    }

    if (!resposta.ok) {
        throw new Error(corpo?.erro || "Não foi possível completar a requisição.")
    }

    return corpo
}

// GET /favoritos
function buscarFavoritos() {
    return requisicao("/favoritos")
}

// DELETE /favoritos/:produtoId
function removerFavorito(produtoId) {
    return requisicao(`/favoritos/${produtoId}`, { method: "DELETE" })
}

const OPCOES_ORDENACAO = [
    { valor: "recentes", rotulo: "Mais recentes" },
    { valor: "antigos", rotulo: "Mais antigos" },
    { valor: "preco-menor", rotulo: "Menor preço" },
    { valor: "preco-maior", rotulo: "Maior preço" },
    { valor: "desconto", rotulo: "Maior desconto" },
    { valor: "nome", rotulo: "Nome (A-Z)" }
]

function ordenarProdutos(produtos, criterio) {
    const lista = [...produtos]
    // favoritado_em só existe se o backend passar a selecionar
    // f.created_at no GET /favoritos (ver comentário no topo do arquivo).
    const temDataFavorito = lista.length > 0 && lista.every((p) => p.favoritado_em)

    switch (criterio) {
        case "antigos":
            return temDataFavorito
                ? lista.sort((a, b) => new Date(a.favoritado_em) - new Date(b.favoritado_em))
                : lista.reverse()
        case "preco-menor":
            return lista.sort((a, b) => (a.preco ?? 0) - (b.preco ?? 0))
        case "preco-maior":
            return lista.sort((a, b) => (b.preco ?? 0) - (a.preco ?? 0))
        case "desconto":
            return lista.sort((a, b) => (b.desconto ?? 0) - (a.desconto ?? 0))
        case "nome":
            return lista.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
        case "recentes":
        default:
            return temDataFavorito
                ? lista.sort((a, b) => new Date(b.favoritado_em) - new Date(a.favoritado_em))
                : lista
    }
}

export default function MeusFavoritos() {
    const [favoritos, setFavoritos] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState(false)

    const [busca, setBusca] = useState("")
    const [ordenacao, setOrdenacao] = useState("recentes")
    const [aviso, setAviso] = useState(null)
    const [adicionandoTodos, setAdicionandoTodos] = useState(false)

    const { itens: itensCarrinho, adicionarAoCarrinho } = useCarrinho()

    async function carregarFavoritos() {
        setCarregando(true)
        setErro(false)
        try {
            const dados = await buscarFavoritos()
            setFavoritos(dados)
        } catch {
            setErro(true)
        } finally {
            setCarregando(false)
        }
    }

    useEffect(() => {
        carregarFavoritos()
    }, [])

    const produtosFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase()
        const filtrados = termo
            ? favoritos.filter((produto) => produto.nome?.toLowerCase().includes(termo))
            : favoritos

        return ordenarProdutos(filtrados, ordenacao)
    }, [favoritos, busca, ordenacao])

    function mostrarAviso(mensagem, tipo = "sucesso") {
        setAviso({ mensagem, tipo })
        window.clearTimeout(mostrarAviso._timer)
        mostrarAviso._timer = window.setTimeout(() => setAviso(null), 4000)
    }

    async function lidarComRemover(produtoId) {
        // Atualização otimista: some da tela na hora; se a chamada falhar,
        // devolve o item à lista.
        const listaAnterior = favoritos
        setFavoritos((atual) => atual.filter((produto) => produto.id !== produtoId))

        try {
            await removerFavorito(produtoId)
            mostrarAviso("Produto removido dos favoritos.")
        } catch (erroRequisicao) {
            setFavoritos(listaAnterior)
            mostrarAviso(erroRequisicao.message || "Não foi possível remover o favorito.", "erro")
        }
    }

    async function lidarComAdicionarUm(produto) {
        try {
            await adicionarAoCarrinho(produto.id, 1, null, produto)
            mostrarAviso("Produto adicionado ao carrinho.")
        } catch (erroRequisicao) {
            mostrarAviso(
                erroRequisicao.response?.data?.erro || "Não foi possível adicionar ao carrinho.",
                "erro"
            )
        }
    }

    async function lidarComAdicionarTodos() {
        const idsNoCarrinho = new Set(itensCarrinho.map((item) => item.produto_id))

        const elegiveis = Array.from(
            new Map(
                produtosFiltrados
                    .filter((produto) => (produto.estoque ?? 0) > 0)
                    .filter((produto) => !idsNoCarrinho.has(produto.id))
                    .map((produto) => [produto.id, produto])
            ).values()
        )

        const semEstoque = produtosFiltrados.filter((produto) => (produto.estoque ?? 0) <= 0).length
        const jaNoCarrinho = produtosFiltrados.length - semEstoque - elegiveis.length

        if (elegiveis.length === 0) {
            mostrarAviso(
                jaNoCarrinho > 0
                    ? "Esses favoritos já estão no seu carrinho."
                    : "Nenhum favorito com estoque disponível para adicionar.",
                "erro"
            )
            return
        }

        setAdicionandoTodos(true)
        try {
            const resultados = await Promise.allSettled(
                elegiveis.map((produto) => adicionarAoCarrinho(produto.id, 1, null, produto))
            )

            const sucesso = resultados.filter((r) => r.status === "fulfilled").length
            const falha = resultados.length - sucesso

            const partes = [`${sucesso} produto(s) adicionado(s) ao carrinho.`]
            if (semEstoque > 0) partes.push(`${semEstoque} sem estoque foram ignorados.`)
            if (jaNoCarrinho > 0) partes.push(`${jaNoCarrinho} já estavam no carrinho.`)
            if (falha > 0) partes.push(`${falha} falharam.`)

            mostrarAviso(partes.join(" "), falha > 0 ? "erro" : "sucesso")
        } catch {
            mostrarAviso("Não foi possível adicionar os favoritos ao carrinho.", "erro")
        } finally {
            setAdicionandoTodos(false)
        }
    }

    return (
        <div className={estilos.pagina}>
        <div className={estilos.container}>
            <header className={estilos.header}>
                <div>
                    <h1 className={estilos.titulo}>Meus Favoritos</h1>
                    <p className={estilos.subtitulo}>
                        As peças que você guardou para adquirir mais tarde.
                    </p>
                </div>
                <span className={`btnPadrao`}>
                    {favoritos.length} {favoritos.length === 1 ? "favorito" : "favoritos"}
                </span>
            </header>

            {aviso && (
                <div
                    role="status"
                    className={`${estilos.aviso} ${aviso.tipo === "erro" ? estilos.avisoErro : estilos.avisoSucesso}`}
                >
                    {aviso.mensagem}
                </div>
            )}

            {favoritos.length > 0 && (
                <div className={estilos.controles}>
                    <div className={estilos.campoBusca}>
                        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                            <path
                                fill="currentColor"
                                d="M15.5 14h-.8l-.3-.3a6.5 6.5 0 1 0-.7.7l.3.3v.8l5 5 1.5-1.5-5-5zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z"
                            />
                        </svg>
                        <input
                            type="search"
                            value={busca}
                            onChange={(evento) => setBusca(evento.target.value)}
                            placeholder="Buscar nos favoritos"
                            aria-label="Buscar por nome do produto"
                        />
                    </div>

                    <label className={estilos.campoOrdenar}>
                        <span>Ordenar por</span>
                        <select
                            value={ordenacao}
                            onChange={(evento) => setOrdenacao(evento.target.value)}
                        >
                            {OPCOES_ORDENACAO.map((opcao) => (
                                <option key={opcao.valor} value={opcao.valor}>
                                    {opcao.rotulo}
                                </option>
                            ))}
                        </select>
                    </label>

                    <button
                        type="button"
                        className={estilos.botaoAdicionarTodos}
                        onClick={lidarComAdicionarTodos}
                        disabled={adicionandoTodos}
                    >
                        {adicionandoTodos ? "Adicionando..." : "Adicionar Todos ao Carrinho"}
                    </button>
                </div>
            )}

            {carregando && (
                <div className={estilos.grid}>
                    {Array.from({ length: 8 }).map((_, indice) => (
                        <FavoritoCardSkeleton key={indice} />
                    ))}
                </div>
            )}

            {!carregando && erro && (
                <div className={estilos.estadoVazio}>
                    <h2>Não foi possível carregar seus favoritos</h2>
                    <p>Verifique sua conexão e tente novamente.</p>
                    <button type="button" className={estilos.botaoPrimario} onClick={carregarFavoritos}>
                        Tentar novamente
                    </button>
                </div>
            )}

            {!carregando && !erro && favoritos.length === 0 && (
                <div className={estilos.estadoVazio}>
                    <h2>Você ainda não tem favoritos</h2>
                    <p>Guarde peças que você gostar para encontrá-las facilmente depois.</p>
                    <a href="/produtos" className={estilos.botaoPrimario}>
                        Explorar Peças
                    </a>
                </div>
            )}

            {!carregando && !erro && favoritos.length > 0 && produtosFiltrados.length === 0 && (
                <div className={estilos.estadoVazio}>
                    <h2>Nenhum favorito encontrado</h2>
                    <p>Tente buscar por outro nome.</p>
                </div>
            )}

            {!carregando && !erro && produtosFiltrados.length > 0 && (
                <div className={estilos.grid}>
                    {produtosFiltrados.map((produto) => (
                        <FavoritoCard
                            key={produto.id}
                            produto={produto}
                            onRemover={lidarComRemover}
                            onAdicionarAoCarrinho={() => lidarComAdicionarUm(produto)}
                        />
                    ))}
                </div>
            )}
        </div>
        </div>
    )
}