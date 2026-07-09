import style from "./styles.module.css";
import { useState, useEffect } from "react";
import { api } from "../../../../services/api";

export default function ModalAddProduto({
    isOpen,
    fecharModal,
}) {
    const [etapa, setEtapa] = useState(1);
   

    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState([]);
const [categoriaId, setCategoriaId] = useState("");

    const [preco, setPreco] = useState("");
    const [estoque, setEstoque] = useState("");
    const [estoqueMinimo, setEstoqueMinimo] =
        useState("");

    const [ativo, setAtivo] = useState(true);

    const [imagem, setImagem] = useState(null);
    const [imagemPreview, setImagemPreview] =
        useState(null);

    const [erro, setErro] = useState("");
    const [materiaisDisponiveis, setMateriaisDisponiveis] = useState([]);

    const [materialId, setMaterialId] = useState("");

  useEffect(() => {
    carregarMateriais();
    carregarCategorias();
}, []);

const categoriaSelecionada =
    categoriasDisponiveis.find(
        (categoria) =>
            categoria.id === Number(categoriaId)
    );

    async function carregarMateriais() {
        try {
            const response = await api.get("/materiais");
            setMateriaisDisponiveis(response.data);
        } catch (error) {
            console.error(error);
        }
    }
    async function carregarCategorias() {
    try {
        const response = await api.get("/categorias");
        setCategoriasDisponiveis(response.data);
    } catch (error) {
        console.error(error);
    }
}

  function limparFormulario() {
    setEtapa(1);

    setNome("");
    setDescricao("");

    setCategoriaId("");

    setPreco("");
    setEstoque("");
    setEstoqueMinimo("");

    setMaterialId("");

    setAtivo(true);

    setImagem(null);
    setImagemPreview(null);

    setErro("");
}

function fechar() {
    limparFormulario();
    fecharModal();
}

    const materialSelecionado =
        materiaisDisponiveis.find(
            (material) =>
                material.id === Number(materialId)
        );

    const custoMaterial = Number(
        materialSelecionado?.valor_medio || 0
    );

    const margemEstimada =
        Number(preco || 0) -
        custoMaterial;
    function capturarImagem(event) {
        const arquivo = event.target.files[0];

        if (!arquivo) return;

        setImagem(arquivo);

        setImagemPreview(
            URL.createObjectURL(arquivo)
        );
    }

    function validarEtapa1() {
       if (
    !nome ||
    !descricao ||
    !categoriaId ||
    !preco ||
    !estoque
) {
            setErro(
                "Preencha todos os campos obrigatórios."
            );

            setTimeout(() => {
                setErro("");
            }, 3000);

            return;
        }

        setEtapa(2);
    }

 async function salvarProduto() {
    try {
        if (!materialId) {
            setErro("Selecione um material.");

            setTimeout(() => {
                setErro("");
            }, 3000);

            return;
        }

        const formData = new FormData();

        formData.append("nome", nome);
        formData.append("descricao", descricao);
        formData.append("preco", preco);
        formData.append("estoque", estoque);
        formData.append(
            "estoque_minimo",
            estoqueMinimo || 0
        );

        formData.append("categoria_id", categoriaId);
        formData.append("material_id", materialId);
        formData.append(
            "ativo",
            ativo ? "true" : "false"
        );

        if (imagem) {
            formData.append("imagem", imagem);
        }

        await api.post("/produtos", formData, {
            headers: {
                "Content-Type":
                    "multipart/form-data",
            },
        });

        limparFormulario();
        fecharModal();

    } catch (error) {
        console.error(error);

        setErro(
            "Erro ao cadastrar produto."
        );

        setTimeout(() => {
            setErro("");
        }, 3000);
    }
}

    function PreviewProduto() {
        return (
            <div className={style.cardPreview}>
                <div className={style.imagemCategoria}>
                    {imagemPreview ? (
                        <img
                            src={imagemPreview}
                            alt=""
                            className={style.imagemPreview}
                        />
                    ) : (
                        <p>Imagem aparecerá aqui</p>
                    )}
                </div>

                <div className={style.textCard}>
                    <h1>
                        {nome || "Nome do produto"}
                    </h1>

                    <p>
                        {descricao ||
                            "Descrição do produto"}
                    </p>

                    <span className={style.previewCategoria}>
    {categoriaSelecionada?.nome ||
        "Categoria não selecionada"}
</span>

                    <strong
                        className={style.previewPreco}
                    >
                        {preco
                            ? `R$ ${Number(
                                preco
                            ).toFixed(2)}`
                            : "R$ 0,00"}
                    </strong>
                </div>
            </div>
        );
    }

    if (!isOpen) return null;

    return (
        <main className={style.overlayModal}>
            <section
                className={style.containerModal}
            >
                {/* HEADER */}
                <div
                    className={style.cabecalhoModal}
                >
                    <h1
                        className={style.tituloModal}
                    >
                        ADICIONAR PRODUTO
                    </h1>

                    <button
                       onClick={fechar}
                        className={
                            style.botaoFechar
                        }
                    >
                        X
                    </button>
                </div>

                {/* ETAPAS */}
                <div className={style.steps}>
                    <div
                        className={`${style.step} ${etapa >= 1
                            ? style.stepActive
                            : ""
                            }`}
                    >
                        <span>1</span>
                        <p>Informações</p>
                    </div>

                    <div
                        className={style.stepLine}
                    ></div>

                    <div
                        className={`${style.step} ${etapa >= 2
                            ? style.stepActive
                            : ""
                            }`}
                    >
                        <span>2</span>
                        <p>Materiais</p>
                    </div>
                </div>

                {/* ETAPA 1 */}
                {etapa === 1 && (
                    <div
                        className={
                            style.contentModal
                        }
                    >
                        {/* PREVIEW */}
                        <aside
                            className={
                                style.containerPreview
                            }
                        >
                            <p>
                                PREVIEW EM TEMPO REAL
                            </p>

                            <PreviewProduto />

                            {erro && (
                                <p
                                    className={
                                        style.erro
                                    }
                                >
                                    {erro}
                                </p>
                            )}

                            <div
                                className={
                                    style.botoesAcao
                                }
                            >
                                <button
                                    className={`btnPadrao ${style.btnCancelar}`}
                                    onClick={
                                        fechar
                                    }
                                >
                                    CANCELAR
                                </button>

                                <button
                                    className={
                                        style.btnAvancar
                                    }
                                    onClick={
                                        validarEtapa1
                                    }
                                >
                                    AVANÇAR
                                </button>
                            </div>
                        </aside>

                        {/* FORM */}
                        <section
                            className={
                                style.containerFormulario
                            }
                        >
                            <div
                                className={
                                    style.cabecalhoSecao
                                }
                            >
                                <p
                                    className={
                                        style.tituloSecao
                                    }
                                >
                                    DADOS DO PRODUTO
                                </p>

                                <div
                                    className={
                                        style.linhaTitulo
                                    }
                                ></div>
                            </div>

                            <div
                                className={
                                    style.grupoCampo
                                }
                            >
                                <label>
                                    NOME DO PRODUTO
                                </label>

                                <input
                                    type="text"
                                    className={
                                        style.inputCampo
                                    }
                                    value={nome}
                                    onChange={(e) =>
                                        setNome(
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <div
                                className={
                                    style.grupoCampo
                                }
                            >
                                <label>
                                    DESCRIÇÃO
                                </label>

                                <textarea
                                    className={
                                        style.textareaCampo
                                    }
                                    value={descricao}
                                    onChange={(e) =>
                                        setDescricao(
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <div
                                className={
                                    style.formGrid
                                }
                            >
                                <div
                                    className={
                                        style.grupoCampo
                                    }
                                >
                                    <label>
                                        CATEGORIA
                                    </label>

                                   <select
    className={style.inputCampo}
    value={categoriaId}
    onChange={(e) =>
        setCategoriaId(e.target.value)
    }
>
    <option value="">
        Selecione
    </option>

    {categoriasDisponiveis.map(
        (categoria) => (
            <option
                key={categoria.id}
                value={categoria.id}
            >
                {categoria.nome}
            </option>
        )
    )}
</select>
                                </div>

                                <div
                                    className={
                                        style.grupoCampo
                                    }
                                >
                                    <label>
                                        PREÇO
                                    </label>

                                    <input
                                        type="number"
                                        className={
                                            style.inputCampo
                                        }
                                        value={preco}
                                        onChange={(e) =>
                                            setPreco(
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <div
                                className={
                                    style.formGrid
                                }
                            >
                                <div
                                    className={
                                        style.grupoCampo
                                    }
                                >
                                    <label>
                                        ESTOQUE
                                    </label>

                                    <input
                                        type="number"
                                        className={
                                            style.inputCampo
                                        }
                                        value={estoque}
                                        onChange={(e) =>
                                            setEstoque(
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>

                                <div
                                    className={
                                        style.grupoCampo
                                    }
                                >
                                    <label>
                                        ESTOQUE MÍNIMO
                                    </label>

                                    <input
                                        type="number"
                                        className={
                                            style.inputCampo
                                        }
                                        value={
                                            estoqueMinimo
                                        }
                                        onChange={(e) =>
                                            setEstoqueMinimo(
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <div
                                className={
                                    style.grupoCampo
                                }
                            >
                                <label>
                                    IMAGEM
                                </label>

                                <div
                                    className={
                                        style.areaUpload
                                    }
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className={
                                            style.inputArquivo
                                        }
                                        onChange={
                                            capturarImagem
                                        }
                                    />

                                    <div
                                        className={
                                            style.conteudoUpload
                                        }
                                    >
                                        {imagemPreview ? (
                                            <>
                                                <img
                                                    src={
                                                        imagemPreview
                                                    }
                                                    alt=""
                                                    className={
                                                        style.imagemSelecionada
                                                    }
                                                />

                                                <p>
                                                    {
                                                        imagem?.name
                                                    }
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <span
                                                    className={
                                                        style.iconeUpload
                                                    }
                                                >
                                                    +
                                                </span>

                                                <p>
                                                    Clique para
                                                    enviar uma
                                                    imagem
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div
                                className={
                                    style.cardStatus
                                }
                            >
                                <span>
                                    Produto ativo
                                </span>

                                <label
                                    className={
                                        style.switch
                                    }
                                >
                                    <input
                                        type="checkbox"
                                        checked={ativo}
                                        onChange={(e) =>
                                            setAtivo(
                                                e.target
                                                    .checked
                                            )
                                        }
                                    />

                                    <span
                                        className={
                                            style.slider
                                        }
                                    ></span>
                                </label>
                            </div>
                        </section>
                    </div>
                )}

              {etapa === 2 && (
    <div className={style.contentModal}>
        <aside className={style.containerPreview}>
            <p>RESUMO DO PRODUTO</p>

            <PreviewProduto />

            <div className={style.resumoMateriais}>
                <div className={style.linhaResumo}>
                    <span>Material selecionado</span>

                    <strong>
                        {materialSelecionado?.nome ||
                            "Nenhum material"}
                    </strong>
                </div>

                <div className={style.linhaResumo}>
                    <span>Custo médio do material</span>

                    <strong>
                        R$ {custoMaterial.toFixed(2)}
                    </strong>
                </div>

                <div className={style.linhaResumo}>
                    <span>Preço de venda</span>

                    <strong>
                        R$ {Number(preco || 0).toFixed(2)}
                    </strong>
                </div>

                <div className={style.linhaResumo}>
                    <span>Margem estimada</span>

                    <strong>
                        R$ {margemEstimada.toFixed(2)}
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
                    className={`btnPadrao ${style.btnCancelar}`}
                    onClick={() => setEtapa(1)}
                >
                    VOLTAR
                </button>

              <button
    className={style.btnSalvar}
    onClick={salvarProduto}
>
    SALVAR PRODUTO
</button>
            </div>
        </aside>

        <section className={style.containerFormulario}>
            <div className={style.cabecalhoSecao}>
                <p className={style.tituloSecao}>
                    MATERIAL PRINCIPAL
                </p>

                <div className={style.linhaTitulo}></div>
            </div>

            <div className={style.grupoCampo}>
                <label>
                    MATERIAL UTILIZADO
                </label>

                <select
                    className={style.inputCampo}
                    value={materialId}
                    onChange={(e) =>
                        setMaterialId(
                            e.target.value
                        )
                    }
                >
                    <option value="">
                        Selecione um material
                    </option>

                    {materiaisDisponiveis.map(
                        (material) => (
                            <option
                                key={material.id}
                                value={material.id}
                            >
                                {material.nome}
                            </option>
                        )
                    )}
                </select>
            </div>

            {materialSelecionado && (
                <div className={style.cardMaterialSelecionado}>
                    <h4>
                        {materialSelecionado.nome}
                    </h4>

                    <p>
                        Estoque atual:{" "}
                        {materialSelecionado.quantidade}
                    </p>

                    <p>
                        Valor médio: R${" "}
                        {Number(
                            materialSelecionado.valor_medio
                        ).toFixed(2)}
                    </p>
                </div>
            )}
        </section>
    </div>
)}
            </section>
        </main>
    );
}