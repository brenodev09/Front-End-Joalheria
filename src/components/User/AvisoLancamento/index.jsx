// ============================================================================
//  AVISO DE LANÇAMENTO (modal exibido no primeiro login após o lançamento)
//  Caminho sugerido: src/components/User/AvisoLancamento/index.jsx
//
//  Comportamento:
//   - Quando o usuário está logado, busca em /colecoes/avisos/:usuarioId
//     as coleções que ele pediu para ser avisado, que JÁ lançaram e que
//     ainda não foram notificadas.
//   - Se houver, abre o modal comemorativo.
//   - Ao fechar (ou clicar em "Ver coleção"), marca como notificado no
//     backend para nunca mais aparecer.
//
//  Uso: coloque <AvisoLancamento /> dentro do layout do cliente (após login),
//  ex.: no componente que envolve as páginas da loja.
//
//  Depende de useAuth (src/context/authContext.jsx).
// ============================================================================

import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { api } from "../../../services/api";
import { useAuth } from "../../../context/authContext";

export default function AvisoLancamento({ onVerColecao }) {
    const { usuario } = useAuth();

    const [avisos, setAvisos] = useState([]);
    const [aberto, setAberto] = useState(false);

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

    async function fechar() {
        await marcarComoNotificado();
        setAberto(false);
    }

    async function verColecao(colecao) {
        await marcarComoNotificado();
        setAberto(false);
        onVerColecao?.(colecao);
    }

    if (!aberto || avisos.length === 0) {
        return null;
    }

    // Mostra a coleção mais recente em destaque; as demais como lista.
    const [principal, ...outras] = avisos;

    return (
        <div className={styles.overlay} onClick={fechar}>
            <div
                className={styles.modal}
                onClick={(evento) => evento.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <button
                    type="button"
                    className={styles.fechar}
                    onClick={fechar}
                    aria-label="Fechar aviso"
                >
                    ×
                </button>

                <span className={styles.confete}>✦</span>

                <h2 className={styles.titulo}>
                    A coleção que você aguardava chegou!
                </h2>

                <p className={styles.destaque}>{principal.nome}</p>

                {principal.descricao && (
                    <p className={styles.descricao}>{principal.descricao}</p>
                )}

                {outras.length > 0 && (
                    <div className={styles.outras}>
                        <span className={styles.outrasRotulo}>
                            Também disponíveis:
                        </span>
                        <ul>
                            {outras.map((colecao) => (
                                <li key={colecao.id}>{colecao.nome}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className={styles.acoes}>
                    <button
                        type="button"
                        className={styles.botaoPrincipal}
                        onClick={() => verColecao(principal)}
                    >
                        Ver coleção
                    </button>

                    <button
                        type="button"
                        className={styles.botaoSecundario}
                        onClick={fechar}
                    >
                        Agora não
                    </button>
                </div>
            </div>
        </div>
    );
}
