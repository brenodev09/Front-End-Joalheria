// ============================================================================
//  AVISO DE LANÇAMENTO (modal exibido no primeiro login após o lançamento)
//  Caminho sugerido: src/components/User/AvisoLancamento/index.jsx
//
//  Conceito visual: um estojo de joia se abre — a tampa (emblema AZORY)
//  balança para trás em 3D, um facho de luz acende e revela a coleção
//  deitada sobre uma "almofada", com brilhos de faceta no instante da abertura.
//
//  Comportamento:
//   - Quando o usuário está logado, busca em /colecoes/avisos/:usuarioId
//     as coleções que ele pediu para ser avisado, que JÁ lançaram e que
//     ainda não foram notificadas.
//   - Se houver, abre o modal.
//   - Ao fechar (ou clicar em "Ver coleção"), marca como notificado no
//     backend para nunca mais aparecer.
//
//  Uso: coloque <AvisoLancamento /> dentro do layout do cliente (após login),
//  ex.: no componente que envolve as páginas da loja.
//
//  Depende de useAuth (src/context/authContext.jsx).
// ============================================================================

import { useEffect, useState } from "react";
import { X, Gem, ArrowRight } from "lucide-react";
import styles from "./styles.module.css";
import { api } from "../../../services/api";
import { useAuth } from "../../../context/authContext";
import { resolveImage } from "../Catalogo/azoryUtils";

// Atributos que já aparecem na faixa do seu site — reaproveitados no ticker
// do rodapé do modal para reforçar a identidade da marca.
const ATRIBUTOS = [
    "Peças numeradas",
    "Certificado de autenticidade",
    "Garantia vitalícia",
    "Lapidação artesanal",
];

const DURACAO_SAIDA_MS = 240;

export default function AvisoLancamento({ onVerColecao }) {
    const { usuario } = useAuth();

    const [avisos, setAvisos] = useState([]);
    const [aberto, setAberto] = useState(false);
    const [saindo, setSaindo] = useState(false);

    async function marcarComoNotificado() {
        if (!usuario?.id) {
            return;
        }

        try {
            await api.put(`/colecoes/avisos/${usuario.id}/notificar`, {
                colecao_ids: avisos.map((colecao) => colecao.id)
            });
        } catch (error) {
            console.error("Erro ao marcar avisos como notificados:", error);
        }
    }

    function fechar() {
        if (saindo) return;
        setSaindo(true);
        setTimeout(async () => {
            await marcarComoNotificado();
            setAberto(false);
            setSaindo(false);
        }, DURACAO_SAIDA_MS);
    }

    useEffect(() => {
        // Sem usuário logado, não faz nada.
        if (!usuario?.id) {
            return;
        }

        async function buscarAvisos() {
            try {
                const { data } = await api.get(`/colecoes/avisos/${usuario.id}`);

                if (Array.isArray(data) && data.length > 0) {
                    setAvisos(data);
                    setAberto(true);
                }
            } catch (error) {
                console.error("Erro ao buscar avisos de lançamento:", error);
            }
        }

        buscarAvisos();
    }, [usuario]);

    // Trava o scroll do fundo e permite fechar com ESC enquanto o estojo
    // estiver aberto.
    useEffect(() => {
        if (!aberto) {
            return;
        }

        const overflowOriginal = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        function aoPressionarTecla(evento) {
            if (evento.key === "Escape") {
                fechar();
            }
        }

        window.addEventListener("keydown", aoPressionarTecla);

        return () => {
            document.body.style.overflow = overflowOriginal;
            window.removeEventListener("keydown", aoPressionarTecla);
        };
    }, [aberto, fechar]);

    function verColecao(colecao) {
        if (saindo) return;
        setSaindo(true);
        setTimeout(async () => {
            await marcarComoNotificado();
            setAberto(false);
            setSaindo(false);
            onVerColecao?.(colecao);
        }, DURACAO_SAIDA_MS);
    }

    if (!aberto || avisos.length === 0) {
        return null;
    }

    // Mostra a coleção mais recente em destaque; as demais como lista.
    const [principal, ...outras] = avisos;

    return (
        <div
            className={`${styles.overlay} ${saindo ? styles.overlaySaindo : ""}`}
            onClick={fechar}
        >
            <div
                className={`${styles.estojo} ${saindo ? styles.estojoSaindo : ""}`}
                onClick={(evento) => evento.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="aviso-lancamento-titulo"
            >
                <button
                    type="button"
                    className={styles.fechar}
                    onClick={fechar}
                    aria-label="Fechar aviso"
                >
                    <X size={16} strokeWidth={1.6} />
                </button>

                {/* Tampa do estojo — balança para trás em 3D ao abrir */}
                <div className={styles.tampa} aria-hidden="true">
                    <Gem size={20} strokeWidth={1.3} className={styles.tampaGema} />
                    <span className={styles.tampaEmblema}>AZORY</span>
                    <span className={styles.tampaLinha} />
                    <span className={styles.tampaSub}>uma coleção acaba de chegar</span>
                </div>

                {/* Interior do estojo — revelado quando a tampa abre */}
                <div className={styles.base}>
                    <span className={styles.facho} aria-hidden="true" />
                    <span className={styles.brilho1} aria-hidden="true" />
                    <span className={styles.brilho2} aria-hidden="true" />
                    <span className={styles.brilho3} aria-hidden="true" />
                    <span className={styles.brilho4} aria-hidden="true" />

                    <span className={styles.eyebrow}>A peça que você aguardava chegou</span>

                    <h2 id="aviso-lancamento-titulo" className={styles.titulo}>
                        {principal.nome}
                    </h2>

                    {principal.imagem && (
                        <div className={styles.coxim}>
                            <div className={styles.vitrine}>
                                <img src={resolveImage(principal.imagem)} alt={principal.nome} />
                            </div>
                        </div>
                    )}

                    {principal.descricao && (
                        <p className={styles.descricao}>{principal.descricao}</p>
                    )}

                    {outras.length > 0 && (
                        <div className={styles.gemas}>
                            {outras.map((colecao) => (
                                <span key={colecao.id} className={styles.gema}>
                                    <Gem size={11} strokeWidth={1.6} />
                                    {colecao.nome}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className={styles.acoes}>
                        <button
                            type="button"
                            className={styles.botaoPrincipal}
                            onClick={() => verColecao(principal)}
                        >
                            <span>Ver coleção</span>
                            <ArrowRight size={16} strokeWidth={1.8} />
                        </button>

                        <button
                            type="button"
                            className={styles.botaoSecundario}
                            onClick={fechar}
                        >
                            Agora não
                        </button>
                    </div>

                    <div className={styles.ticker} aria-hidden="true">
                        <div className={styles.tickerTrilha}>
                            {[...ATRIBUTOS, ...ATRIBUTOS].map((atributo, indice) => (
                                <span key={`${atributo}-${indice}`} className={styles.tickerItem}>
                                    {atributo}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}