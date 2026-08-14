import { useEffect, useState } from "react";
import { api } from "../../../services/api";
import styles from "./SeletorColecoes.module.css";

export default function SeletorColecoes({
    selecionadas = [],
    onChange
}) {
    const [colecoes, setColecoes] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const carregarColecoes = async () => {
            try {
                const resposta = await api.get("/colecoes");

                setColecoes(resposta.data || []);
            } catch (error) {
                console.error(
                    "ERRO AO CARREGAR COLEÇÕES:",
                    error
                );
            } finally {
                setCarregando(false);
            }
        };

        carregarColecoes();
    }, []);

    const alternarColecao = (id) => {
        const idNumerico = Number(id);

        const jaSelecionada = selecionadas.some(
            (colecaoId) => Number(colecaoId) === idNumerico
        );

        if (jaSelecionada) {
            onChange(
                selecionadas.filter(
                    (colecaoId) =>
                        Number(colecaoId) !== idNumerico
                )
            );

            return;
        }

        onChange([
            ...selecionadas,
            idNumerico
        ]);
    };

    if (carregando) {
        return (
            <div className={styles.container}>
                <div className={styles.label}>
                    Coleções
                </div>

                <div className={styles.loading}>
                    Carregando coleções...
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <label className={styles.label}>
                        Coleções
                    </label>

                    <p className={styles.description}>
                        Selecione as coleções às quais este
                        produto pertence.
                    </p>
                </div>

                <span className={styles.counter}>
                    {selecionadas.length} selecionada
                    {selecionadas.length !== 1 ? "s" : ""}
                </span>
            </div>

            {colecoes.length === 0 ? (
                <div className={styles.empty}>
                    Nenhuma coleção cadastrada.
                </div>
            ) : (
                <div className={styles.lista}>
                    {colecoes.map((colecao) => {
                        const selecionada =
                            selecionadas.some(
                                (id) =>
                                    Number(id) ===
                                    Number(colecao.id)
                            );

                        return (
                            <button
                                key={colecao.id}
                                type="button"
                                className={`${styles.item} ${
                                    selecionada
                                        ? styles.selecionada
                                        : ""
                                }`}
                                onClick={() =>
                                    alternarColecao(
                                        colecao.id
                                    )
                                }
                            >
                                <span
                                    className={
                                        styles.checkbox
                                    }
                                >
                                    {selecionada ? "✓" : ""}
                                </span>

                                <span
                                    className={
                                        styles.nome
                                    }
                                >
                                    {colecao.nome}
                                </span>

                                {colecao.status && (
                                    <span
                                        className={
                                            styles.status
                                        }
                                    >
                                        {colecao.status}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}