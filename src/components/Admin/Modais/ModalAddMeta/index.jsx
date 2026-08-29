import style from "./styles.module.css";
import { api } from "../../../../services/api"
import { useState } from "react";

const MESES = [
    { valor: 1, nome: "Janeiro" },
    { valor: 2, nome: "Fevereiro" },
    { valor: 3, nome: "Março" },
    { valor: 4, nome: "Abril" },
    { valor: 5, nome: "Maio" },
    { valor: 6, nome: "Junho" },
    { valor: 7, nome: "Julho" },
    { valor: 8, nome: "Agosto" },
    { valor: 9, nome: "Setembro" },
    { valor: 10, nome: "Outubro" },
    { valor: 11, nome: "Novembro" },
    { valor: 12, nome: "Dezembro" },
];

export default function ModalAddMetaFaturamento({
    isOpen,
    fecharModal,
}) {
    // Campos baseados na tabela metas_faturamento
    const [mes, setMes] = useState("");
    const [ano, setAno] = useState("");
    const [valorMeta, setValorMeta] = useState("");
    const [descricao, setDescricao] = useState("");

    const [erro, setErro] = useState("");

    const mesSelecionado = MESES.find(
        (item) => Number(item.valor) === Number(mes)
    );

    function limparFormulario() {
        setMes("");
        setAno("");
        setValorMeta("");
        setDescricao("");

        setErro("");
    }

    function fechar() {
        limparFormulario();
        fecharModal();
    }

    async function adicionarMeta(event) {
        event.preventDefault()

        try {
            setErro("")
            if (!mes || !ano || !valorMeta) {
                setErro("Preencha todos os campos para prosseguir")
            }


            await api.post("/dashboard/metas-mensais", {
                mes: Number(mes),
                ano: Number(ano),
                valor_meta: Number(valorMeta),
                descricao: descricao || null
            })

            limparFormulario()
            fecharModal()
        } catch (error) {
            console.error(error)

            if (error.response?.data?.erro) {
                setErro(error.response.data.erro);
            } else {
                setErro("Erro ao cadastrar a meta");
            }
        }
    }

    function PreviewMeta() {
        return (
            <div className={style.cardPreview}>
                <div className={style.textCard}>
                    <h1>
                        {mesSelecionado && ano
                            ? `Meta de ${mesSelecionado.nome} / ${ano}`
                            : "Meta de faturamento"}
                    </h1>

                    <p>
                        {descricao || "Descrição da meta (opcional)"}
                    </p>

                    <span className={style.previewPeriodo}>
                        {mesSelecionado && ano
                            ? `${mesSelecionado.nome} de ${ano}`
                            : "Período não selecionado"}
                    </span>

                    <strong className={style.previewPreco}>
                        {valorMeta
                            ? `R$ ${Number(valorMeta).toFixed(2)}`
                            : "R$ 0,00"}
                    </strong>
                </div>
            </div>
        );
    }

    if (!isOpen) return null;

    return (
        <main className={style.overlayModal}>
            <section className={style.containerModal}>

                {/* HEADER */}

                <div className={style.cabecalhoModal}>
                    <div>
                        <h1 className={style.tituloModal}>
                            ADICIONAR META
                        </h1>

                        <p className={style.subtituloModal}>
                            Cadastre uma nova meta de faturamento mensal
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={fechar}
                        className={style.botaoFechar}
                    >
                        X
                    </button>
                </div>

                {/* CONTEÚDO */}

                <div className={style.contentModal}>

                    <aside className={style.containerPreview}>
                        <p>
                            PREVIEW EM TEMPO REAL
                        </p>

                        <PreviewMeta />

                        {erro && (
                            <p className={style.erro}>
                                {erro}
                            </p>
                        )}
                    </aside>

                    <section className={style.containerFormulario}>

                        <div className={style.cabecalhoSecao}>
                            <p className={style.tituloSecao}>
                                INFORME OS DADOS DA META
                            </p>

                            <div className={style.linhaTitulo} />
                        </div>

                        <div className={style.formGrid}>

                            <div className={style.grupoCampo}>
                                <label>
                                    MÊS
                                </label>

                                <select
                                    className={style.inputCampo}
                                    value={mes}
                                    onChange={(e) =>
                                        setMes(e.target.value)
                                    }
                                >
                                    <option value="">
                                        Selecione
                                    </option>

                                    {MESES.map((item) => (
                                        <option
                                            key={item.valor}
                                            value={item.valor}
                                        >
                                            {item.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={style.grupoCampo}>
                                <label>
                                    ANO
                                </label>

                                <input
                                    type="number"
                                    min="2000"
                                    className={style.inputCampo}
                                    value={ano}
                                    onChange={(e) =>
                                        setAno(e.target.value)
                                    }
                                    placeholder="2026"
                                />
                            </div>

                        </div>

                        <div className={style.grupoCampo}>
                            <label>
                                VALOR DA META
                            </label>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                className={style.inputCampo}
                                value={valorMeta}
                                onChange={(e) =>
                                    setValorMeta(e.target.value)
                                }
                                placeholder="0,00"
                            />
                        </div>

                        <div className={style.grupoCampo}>
                            <label>
                                DESCRIÇÃO (OPCIONAL)
                            </label>

                            <textarea
                                className={style.textareaCampo}
                                value={descricao}
                                onChange={(e) =>
                                    setDescricao(e.target.value)
                                }
                                placeholder="Digite uma descrição para a meta"
                            />
                        </div>

                        <div className={style.botoesAcao}>

                            <button
                                type="button"
                                className={`btnPadrao ${style.btnCancelar}`}
                                onClick={fechar}
                            >
                                CANCELAR
                            </button>

                            <button
                                type="button"
                                className={style.btnSalvar}
                                onClick={adicionarMeta}
                            >
                                SALVAR META
                            </button>

                        </div>

                    </section>
                </div>

            </section>
        </main>
    );
}