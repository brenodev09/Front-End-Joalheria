import { useEffect, useMemo, useState } from "react";
import { api } from "../../../services/api";
import { useAuth } from "../../../context/authContext";
import { resolveImage } from "../Catalogo/azoryUtils";

import styles from "./styles.module.css";

export default function ProximasColecoes({
    onLoginNecessario,
}) {
    const {
        usuario,
        estaLogado,
    } = useAuth();

    const [colecoes, setColecoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");

    const [interesses, setInteresses] = useState({});
    const [processando, setProcessando] = useState({});

    /*
     * ======================================================
     * CARREGAR PRÓXIMAS COLEÇÕES
     * ======================================================
     */

    async function carregarColecoes() {
        try {
            setLoading(true);
            setErro("");

            const resposta = await api.get(
                "/colecoes/publicas/proximas"
            );

            const dados = Array.isArray(resposta.data)
                ? resposta.data
                : [];

            setColecoes(dados);
        } catch (error) {
            console.error(
                "ERRO AO CARREGAR PRÓXIMAS COLEÇÕES:",
                error
            );

            setErro(
                "Não foi possível carregar as próximas coleções."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarColecoes();
    }, []);

    /*
     * ======================================================
     * VERIFICAR INTERESSE DO USUÁRIO
     * ======================================================
     */

    async function verificarInteresses(lista) {
        if (!estaLogado || !usuario?.id) {
            return;
        }

        try {
            const resultados = await Promise.all(
                lista.map(async (colecao) => {
                    try {
                        const resposta = await api.get(
                            `/colecoes/${colecao.id}/interessados/${usuario.id}`
                        );

                        return [
                            colecao.id,
                            Boolean(
                                resposta.data?.interessado
                            ),
                        ];
                    } catch (error) {
                        console.error(
                            `Erro ao verificar interesse da coleção ${colecao.id}:`,
                            error
                        );

                        return [
                            colecao.id,
                            false,
                        ];
                    }
                })
            );

            const mapa = {};

            for (const [id, interessado] of resultados) {
                mapa[id] = interessado;
            }

            setInteresses(mapa);
        } catch (error) {
            console.error(
                "ERRO AO VERIFICAR INTERESSES:",
                error
            );
        }
    }

    useEffect(() => {
        if (
            colecoes.length > 0 &&
            estaLogado &&
            usuario?.id
        ) {
            verificarInteresses(colecoes);
        }
    }, [
        colecoes,
        estaLogado,
        usuario?.id,
    ]);

    /*
     * ======================================================
     * FORMATAR DATA
     * ======================================================
     */

    function formatarData(data) {
        if (!data) {
            return "";
        }

        const partes = String(data)
            .slice(0, 10)
            .split("-");

        if (partes.length !== 3) {
            return "";
        }

        const [ano, mes, dia] = partes;

        return `${dia}.${mes}.${ano}`;
    }

    /*
     * ======================================================
     * CALCULAR CONTADOR
     * ======================================================
     */

    function calcularTempoRestante(dataInicio) {
        if (!dataInicio) {
            return null;
        }

        const inicio = new Date(
            `${String(dataInicio).slice(0, 10)}T00:00:00`
        );

        const agora = new Date();

        const diferenca =
            inicio.getTime() - agora.getTime();

        if (diferenca <= 0) {
            return {
                dias: 0,
                horas: 0,
                minutos: 0,
                segundos: 0,
            };
        }

        const totalSegundos = Math.floor(
            diferenca / 1000
        );

        const dias = Math.floor(
            totalSegundos / 86400
        );

        const horas = Math.floor(
            (totalSegundos % 86400) / 3600
        );

        const minutos = Math.floor(
            (totalSegundos % 3600) / 60
        );

        const segundos =
            totalSegundos % 60;

        return {
            dias,
            horas,
            minutos,
            segundos,
        };
    }

    /*
     * ======================================================
     * ESTADO DO CONTADOR
     * ======================================================
     */

    const [agora, setAgora] = useState(
        Date.now()
    );

    useEffect(() => {
        const intervalo = setInterval(() => {
            setAgora(Date.now());
        }, 1000);

        return () => {
            clearInterval(intervalo);
        };
    }, []);

    /*
     * ======================================================
     * QUERO SER AVISADO
     * ======================================================
     */

    async function alternarInteresse(colecao) {
        if (processando[colecao.id]) {
            return;
        }

        /*
         * Usuário não logado
         */

        if (!estaLogado || !usuario?.id) {
            if (onLoginNecessario) {
                onLoginNecessario();
            } else {
                window.location.href = "/Login";
            }

            return;
        }

        const jaInteressado =
            Boolean(interesses[colecao.id]);

        try {
            setProcessando((estado) => ({
                ...estado,
                [colecao.id]: true,
            }));

            /*
             * REMOVER INTERESSE
             */

            if (jaInteressado) {
                await api.delete(
                    `/colecoes/${colecao.id}/interessados/${usuario.id}`
                );

                setInteresses((estado) => ({
                    ...estado,
                    [colecao.id]: false,
                }));

                return;
            }

            /*
             * CADASTRAR INTERESSE
             */

            await api.post(
                `/colecoes/${colecao.id}/interessados`,
                {
                    usuario_id: usuario.id,
                }
            );

            setInteresses((estado) => ({
                ...estado,
                [colecao.id]: true,
            }));
        } catch (error) {
            console.error(
                "ERRO AO ALTERAR INTERESSE:",
                error
            );

            const mensagem =
                error.response?.data?.erro ||
                "Não foi possível atualizar seu interesse.";

            alert(mensagem);
        } finally {
            setProcessando((estado) => ({
                ...estado,
                [colecao.id]: false,
            }));
        }
    }

    /*
     * ======================================================
     * COLEÇÃO PRINCIPAL
     * ======================================================
     */

    const colecaoPrincipal = useMemo(() => {
        if (!colecoes.length) {
            return null;
        }

        return colecoes[0];
    }, [colecoes]);

    /*
     * ======================================================
     * LOADING
     * ======================================================
     */

    if (loading) {
        return (
            <section
                className={
                    styles.secao
                }
            >
                <div
                    className={
                        styles.loading
                    }
                >
                    <span>
                        PRÓXIMAS COLEÇÕES
                    </span>

                    <div
                        className={
                            styles.loadingLine
                        }
                    />
                </div>
            </section>
        );
    }

    /*
     * ======================================================
     * ERRO
     * ======================================================
     */

    if (erro) {
        return (
            <section
                className={
                    styles.secao
                }
            >
                <div
                    className={
                        styles.erro
                    }
                >
                    <p>{erro}</p>

                    <button
                        type="button"
                        onClick={
                            carregarColecoes
                        }
                    >
                        TENTAR NOVAMENTE
                    </button>
                </div>
            </section>
        );
    }

    /*
     * ======================================================
     * NÃO EXISTEM COLEÇÕES
     * ======================================================
     */

    if (!colecaoPrincipal) {
        return null;
    }

    const tempo = calcularTempoRestante(
        colecaoPrincipal.data_inicio
    );

    const mostrarContador =
        Number(
            colecaoPrincipal.mostrar_contador
        ) === 1;

    const permitirInteressados =
        Number(
            colecaoPrincipal.permitir_interessados
        ) === 1;

    const interessado =
        Boolean(
            interesses[
                colecaoPrincipal.id
            ]
        );

    return (
        <section
            className={
                styles.secao
            }
        >
            <div
                className={
                    styles.headerSecao
                }
            >
                <span
                    className={
                        styles.eyebrow
                    }
                >
                    PRÓXIMA COLEÇÃO
                </span>

                <div
                    className={
                        styles.linha
                    }
                />

                <span
                    className={
                        styles.numero
                    }
                >
                    {String(
                        colecaoPrincipal.id
                    ).padStart(2, "0")}
                </span>
            </div>

            <div
                className={
                    styles.card
                }
            >
                <div
                    className={
                        styles.imagemArea
                    }
                >
                    {colecaoPrincipal.imagem ? (
                        <img
                            src={
                                resolveImage(colecaoPrincipal.imagem)
                            }
                            alt={
                                colecaoPrincipal.nome
                            }
                            className={
                                styles.imagem
                            }
                        />
                    ) : (
                        <div
                            className={
                                styles.semImagem
                            }
                        >
                            <span>
                                AZORY
                            </span>
                        </div>
                    )}

                    <div
                        className={
                            styles.numeroImagem
                        }
                    >
                        N.º{" "}
                        {String(
                            colecaoPrincipal.id
                        ).padStart(3, "0")}
                    </div>
                </div>

                <div
                    className={
                        styles.conteudo
                    }
                >
                    <span
                        className={
                            styles.rotulo
                        }
                    >
                        LANÇAMENTO
                    </span>

                    <h2>
                        {
                            colecaoPrincipal.nome
                        }
                    </h2>

                    {colecaoPrincipal.descricao && (
                        <p
                            className={
                                styles.descricao
                            }
                        >
                            {
                                colecaoPrincipal.descricao
                            }
                        </p>
                    )}

                    <div
                        className={
                            styles.data
                        }
                    >
                        <span>
                            DISPONÍVEL EM
                        </span>

                        <strong>
                            {formatarData(
                                colecaoPrincipal.data_inicio
                            )}
                        </strong>
                    </div>

                    {mostrarContador &&
                        tempo && (
                            <div
                                className={
                                    styles.contador
                                }
                            >
                                <div>
                                    <strong>
                                        {
                                            tempo.dias
                                        }
                                    </strong>

                                    <span>
                                        DIAS
                                    </span>
                                </div>

                                <span
                                    className={
                                        styles.separador
                                    }
                                >
                                    :
                                </span>

                                <div>
                                    <strong>
                                        {String(
                                            tempo.horas
                                        ).padStart(
                                            2,
                                            "0"
                                        )}
                                    </strong>

                                    <span>
                                        HORAS
                                    </span>
                                </div>

                                <span
                                    className={
                                        styles.separador
                                    }
                                >
                                    :
                                </span>

                                <div>
                                    <strong>
                                        {String(
                                            tempo.minutos
                                        ).padStart(
                                            2,
                                            "0"
                                        )}
                                    </strong>

                                    <span>
                                        MIN
                                    </span>
                                </div>

                                <span
                                    className={
                                        styles.separador
                                    }
                                >
                                    :
                                </span>

                                <div>
                                    <strong>
                                        {String(
                                            tempo.segundos
                                        ).padStart(
                                            2,
                                            "0"
                                        )}
                                    </strong>

                                    <span>
                                        SEG
                                    </span>
                                </div>
                            </div>
                        )}

                    {permitirInteressados && (
                        <button
                            type="button"
                            className={`
                                ${styles.botao}
                                ${
                                    interessado
                                        ? styles.botaoAtivo
                                        : ""
                                }
                            `}
                            disabled={
                                processando[
                                    colecaoPrincipal.id
                                ]
                            }
                            onClick={() =>
                                alternarInteresse(
                                    colecaoPrincipal
                                )
                            }
                        >
                            {processando[
                                colecaoPrincipal.id
                            ]
                                ? "AGUARDE..."
                                : interessado
                                ? "✓ VOCÊ SERÁ AVISADO"
                                : "QUERO SER AVISADO"}
                        </button>
                    )}
                </div>
            </div>

            {colecoes.length > 1 && (
                <div
                    className={
                        styles.lista
                    }
                >
                    {colecoes
                        .slice(1)
                        .map((colecao) => {
                            const interessadoSecundario =
                                Boolean(
                                    interesses[
                                        colecao.id
                                    ]
                                );

                            const tempoSecundario =
                                calcularTempoRestante(
                                    colecao.data_inicio
                                );

                            return (
                                <article
                                    key={
                                        colecao.id
                                    }
                                    className={
                                        styles.item
                                    }
                                >
                                    <div
                                        className={
                                            styles.itemImagem
                                        }
                                    >
                                        {colecao.imagem ? (
                                            <img
                                                src={
                                                    resolveImage(colecao.imagem)
                                                }
                                                alt={
                                                    colecao.nome
                                                }
                                            />
                                        ) : (
                                            <span>
                                                AZORY
                                            </span>
                                        )}
                                    </div>

                                    <div
                                        className={
                                            styles.itemConteudo
                                        }
                                    >
                                        <span>
                                            PRÓXIMA
                                        </span>

                                        <h3>
                                            {
                                                colecao.nome
                                            }
                                        </h3>

                                        <p>
                                            {formatarData(
                                                colecao.data_inicio
                                            )}
                                        </p>

                                        {Number(
                                            colecao.mostrar_contador
                                        ) ===
                                            1 &&
                                            tempoSecundario && (
                                                <small>
                                                    {tempoSecundario.dias}{" "}
                                                    dias restantes
                                                </small>
                                            )}

                                        {Number(
                                            colecao.permitir_interessados
                                        ) ===
                                            1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    alternarInteresse(
                                                        colecao
                                                    )
                                                }
                                                disabled={
                                                    processando[
                                                        colecao.id
                                                    ]
                                                }
                                            >
                                                {interessadoSecundario
                                                    ? "✓ AVISAR-ME"
                                                    : "QUERO SER AVISADO"}
                                            </button>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                </div>
            )}
        </section>
    );
}