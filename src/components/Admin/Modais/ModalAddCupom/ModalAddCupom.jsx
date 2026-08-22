import { useState } from "react";
import style from "./ModalAddCupom.module.css";

const TIPOS_DESCONTO = ["Percentual", "Valor fixo", "Frete grátis"];

export default function ModalAddCupom({
    isOpen,
    fecharModal,
}) {
    const [etapa, setEtapa] = useState(1);

    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [tipo, setTipo] = useState("");
    const [valor, setValor] = useState("");

    const [usoMaximo, setUsoMaximo] = useState("");
    const [valorMinimo, setValorMinimo] = useState("");
    const [validadeDias, setValidadeDias] = useState("");

    const [ativo, setAtivo] = useState(true);
    const [destaque, setDestaque] = useState(false);

    const [erro, setErro] = useState("");

    function mostrarErro(mensagem) {
        setErro(mensagem);

        setTimeout(() => {
            setErro("");
        }, 3000);
    }

    function limparFormulario() {
        setEtapa(1);

        setNome("");
        setDescricao("");
        setTipo("");
        setValor("");

        setUsoMaximo("");
        setValorMinimo("");
        setValidadeDias("");

        setAtivo(true);
        setDestaque(false);

        setErro("");
    }

    function fechar() {
        limparFormulario();
        fecharModal();
    }

    function validarEtapa1() {
        if (!nome.trim() || !tipo || !valor) {
            mostrarErro("Preencha todos os campos obrigatórios.");
            return;
        }

        if (Number(valor) <= 0) {
            mostrarErro("Informe um valor de desconto válido.");
            return;
        }

        setErro("");
        setEtapa(2);
    }

    function salvarCupom() {
        if (!usoMaximo || !validadeDias) {
            mostrarErro("Preencha o limite de usos e a validade.");
            return;
        }

        // TODO: integrar com a API para criar o cupom.
        limparFormulario();
        fecharModal();
    }

    if (!isOpen) return null;

    return (
        <main className={style.overlayModal}>
            <section className={style.containerModal}>

                {/* HEADER */}

                <div className={style.cabecalhoModal}>
                    <div>
                        <h1 className={style.tituloModal}>
                            ADICIONAR CUPOM
                        </h1>

                        <p className={style.subtituloModal}>
                            Cadastre um novo cupom de desconto
                        </p>
                    </div>

                    <div className={style.steps}>

                        <div
                            className={`${style.step} ${
                                etapa >= 1
                                    ? style.stepActive
                                    : ""
                            }`}
                        >
                            <span>1</span>
                            <p>Informações</p>
                        </div>

                        <div className={style.stepLine} />

                        <div
                            className={`${style.step} ${
                                etapa >= 2
                                    ? style.stepActive
                                    : ""
                            }`}
                        >
                            <span>2</span>
                            <p>Limites</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={fechar}
                        className={style.botaoFechar}
                    >
                        X
                    </button>
                </div>

                {/* ETAPA 1 */}

                {etapa === 1 && (
                    <div className={style.contentModal}>

                        <section className={style.containerFormulario}>

                            <div className={style.cabecalhoSecao}>
                                <p className={style.tituloSecao}>
                                    INFORME OS DADOS DO CUPOM
                                </p>

                                <div className={style.linhaTitulo} />
                            </div>

                            <div className={style.grupoCampo}>
                                <label>
                                    CÓDIGO DO CUPOM
                                </label>

                                <input
                                    type="text"
                                    className={style.inputCampo}
                                    value={nome}
                                    onChange={(e) =>
                                        setNome(e.target.value)
                                    }
                                    placeholder="Ex: BEMVINDO10"
                                />
                            </div>

                            <div className={style.grupoCampo}>
                                <label>
                                    DESCRIÇÃO
                                </label>

                                <textarea
                                    className={style.textareaCampo}
                                    value={descricao}
                                    onChange={(e) =>
                                        setDescricao(e.target.value)
                                    }
                                    placeholder="Digite a descrição do cupom"
                                />
                            </div>

                            <div className={style.formGrid}>

                                <div className={style.grupoCampo}>
                                    <label>
                                        TIPO DE DESCONTO
                                    </label>

                                    <select
                                        className={style.inputCampo}
                                        value={tipo}
                                        onChange={(e) =>
                                            setTipo(e.target.value)
                                        }
                                    >
                                        <option value="">
                                            Selecione
                                        </option>

                                        {TIPOS_DESCONTO.map(
                                            (opcao) => (
                                                <option
                                                    key={opcao}
                                                    value={opcao}
                                                >
                                                    {opcao}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <div className={style.grupoCampo}>
                                    <label>
                                        VALOR DO DESCONTO
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className={style.inputCampo}
                                        value={valor}
                                        onChange={(e) =>
                                            setValor(e.target.value)
                                        }
                                        placeholder="0,00"
                                    />
                                </div>

                            </div>

                            <div className={style.cabecalhoSecao}>
                                <p className={style.tituloSecao}>
                                    STATUS DO CUPOM
                                </p>

                                <div className={style.linhaTitulo} />
                            </div>

                            <div className={style.cardStatus}>
                                <span>
                                    Cupom ativo
                                </span>

                                <label className={style.switch}>
                                    <input
                                        type="checkbox"
                                        checked={ativo}
                                        onChange={(e) =>
                                            setAtivo(e.target.checked)
                                        }
                                    />

                                    <span className={style.slider} />
                                </label>
                            </div>

                            <div className={style.cardDestaque}>

                                <div className={style.informacoesDestaque}>
                                    <span className={style.tituloDestaque}>
                                        Cupom em destaque
                                    </span>

                                    <span className={style.descricaoDestaque}>
                                        {destaque
                                            ? "Visível na seção de cupons em destaque da loja"
                                            : "Não visível na seção de destaques da loja - Oculto para clientes"}
                                    </span>
                                </div>

                                <label className={style.switch}>
                                    <input
                                        type="checkbox"
                                        checked={destaque}
                                        onChange={(e) =>
                                            setDestaque(e.target.checked)
                                        }
                                    />

                                    <span className={style.slider} />
                                </label>

                            </div>

                            {erro && (
                                <p className={style.erro}>
                                    {erro}
                                </p>
                            )}

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
                                    className={style.btnAvancar}
                                    onClick={validarEtapa1}
                                >
                                    AVANÇAR
                                </button>

                            </div>

                        </section>
                    </div>
                )}

                {/* ETAPA 2 */}

                {etapa === 2 && (
                    <div className={style.contentModal}>

                        <section className={style.containerFormulario}>

                            <div className={style.cabecalhoSecao}>
                                <p className={style.tituloSecao}>
                                    LIMITES E VALIDADE
                                </p>

                                <div className={style.linhaTitulo} />
                            </div>

                            <div className={style.formGrid}>

                                <div className={style.grupoCampo}>
                                    <label>
                                        LIMITE DE USOS
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        className={style.inputCampo}
                                        value={usoMaximo}
                                        onChange={(e) =>
                                            setUsoMaximo(e.target.value)
                                        }
                                        placeholder="Ex: 40"
                                    />
                                </div>

                                <div className={style.grupoCampo}>
                                    <label>
                                        VALOR MÍNIMO DO PEDIDO
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className={style.inputCampo}
                                        value={valorMinimo}
                                        onChange={(e) =>
                                            setValorMinimo(e.target.value)
                                        }
                                        placeholder="0,00"
                                    />
                                </div>

                            </div>

                            <div className={style.grupoCampo}>
                                <label>
                                    VALIDADE (EM DIAS)
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    className={style.inputCampo}
                                    value={validadeDias}
                                    onChange={(e) =>
                                        setValidadeDias(e.target.value)
                                    }
                                    placeholder="Ex: 30"
                                />
                            </div>

                            <div className={style.resumoMateriais}>

                                <div className={style.linhaResumo}>
                                    <span>
                                        Tipo de desconto
                                    </span>

                                    <strong>
                                        {tipo || "Não selecionado"}
                                    </strong>
                                </div>

                                <div className={style.linhaResumo}>
                                    <span>
                                        Valor do desconto
                                    </span>

                                    <strong>
                                        {valor
                                            ? tipo === "Percentual"
                                                ? `${Number(valor)}%`
                                                : `R$ ${Number(valor).toFixed(2)}`
                                            : "—"}
                                    </strong>
                                </div>

                                <div className={style.linhaResumo}>
                                    <span>
                                        Limite de usos
                                    </span>

                                    <strong>
                                        {usoMaximo || "—"}
                                    </strong>
                                </div>

                                <div className={style.linhaResumo}>
                                    <span>
                                        Validade
                                    </span>

                                    <strong>
                                        {validadeDias
                                            ? `${validadeDias} dias`
                                            : "—"}
                                    </strong>
                                </div>

                            </div>

                            {erro && (
                                <p className={style.erro}>
                                    {erro}
                                </p>
                            )}

                            <div className={style.botoesAcao}>

                                <button
                                    type="button"
                                    className={`btnPadrao ${style.btnCancelar}`}
                                    onClick={() => setEtapa(1)}
                                >
                                    VOLTAR
                                </button>

                                <button
                                    type="button"
                                    className={style.btnSalvar}
                                    onClick={salvarCupom}
                                >
                                    SALVAR CUPOM
                                </button>

                            </div>

                        </section>
                    </div>
                )}

            </section>
        </main>
    );
}