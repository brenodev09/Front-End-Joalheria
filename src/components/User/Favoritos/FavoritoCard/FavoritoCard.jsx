// components/FavoritoCard.jsx
import { useState } from "react"
import estilos from "./FavoritoCard.module.css"
import { p } from "framer-motion/client"
import { Trash2 } from "lucide-react";

function formatarPreco(valor) {
    if (valor == null) return null
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export default function FavoritoCard({ produto, onRemover, onAdicionarAoCarrinho }) {
    const [removendo, setRemovendo] = useState(false)
    const [adicionando, setAdicionando] = useState(false)

    const semEstoque = (produto.estoque ?? 0) <= 0
    const temDesconto = produto.desconto > 0 && produto.precoOriginal
    const avaliacao = produto.avaliacao ?? produto.nota ?? null

    async function lidarComRemover() {
        setRemovendo(true)
        try {
            await onRemover(produto.id)
        } finally {
            setRemovendo(false)
        }
    }

    async function lidarComAdicionar() {
        setAdicionando(true)
        try {
            await onAdicionarAoCarrinho()
        } finally {
            setAdicionando(false)
        }
    }

    return (
        <article className={estilos.card} aria-label={produto.nome}>
            <div className={estilos.imagemContainer}>
                {produto.imagem ? (
                    <img
                        src={`http://localhost:3000${produto.imagem}`}
                        alt={produto.nome}
                        className={estilos.imagem}
                        loading="lazy"
                    />
                ) : (
                    <div className={estilos.imagemPlaceholder} aria-hidden="true" />
                )}

                {temDesconto && (
                    <span className={estilos.selecoDesconto}>-{produto.desconto}%</span>
                )}

                <button
                    type="button"
                    className={estilos.botaoRemover}
                    onClick={lidarComRemover}
                    disabled={removendo}
                    aria-label={`Remover ${produto.nome} dos favoritos`}
                    title="Remover dos favoritos"
                >
                    {removendo ? (
                        <span
                            className={estilos.spinnerPequeno}
                            aria-hidden="true"
                        />
                    ) : (
                        <Trash2
                            size={20}
                            strokeWidth={2}
                            aria-hidden="true"
                        />
                    )}
                </button>
            </div>

            <div className={estilos.conteudo}>
                {produto.categoria && (
                    <p className={estilos.categoria}>{produto.categoria}</p>
                )}

                <h3 className={estilos.nome}>{produto.nome}</h3>

                {avaliacao != null && (
                    <div className={estilos.avaliacao} aria-label={`Avaliação ${avaliacao} de 5`}>
                        <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
                            <path
                                fill="currentColor"
                                d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 15l-5.2 2.7 1-5.9L1.5 7.7l5.9-.8L10 1.5z"
                            />
                        </svg>
                        <span>{avaliacao.toFixed ? avaliacao.toFixed(1) : avaliacao}</span>
                    </div>
                )}

                <div className={estilos.precos}>
                    <span className={estilos.precoAtual}>{formatarPreco(produto.preco)}</span>
                    {temDesconto && (
                        <span className={estilos.precoOriginal}>
                            {formatarPreco(produto.precoOriginal)}
                        </span>
                    )}
                </div>

                <p className={semEstoque ? estilos.estoqueIndisponivel : estilos.estoqueDisponivel}>
                    {semEstoque ? "Sem estoque" : `${produto.estoque} em estoque`}
                </p>

                <button
                    type="button"
                    className={estilos.botaoCarrinho}
                    onClick={lidarComAdicionar}
                    disabled={semEstoque || adicionando}
                >
                    {adicionando ? (
                        <span className={estilos.spinnerPequeno} aria-hidden="true" />
                    ) : semEstoque ? (
                        "Sem estoque"
                    ) : (
                        "Adicionar ao carrinho"
                    )}
                </button>
            </div>
        </article>
    )
}