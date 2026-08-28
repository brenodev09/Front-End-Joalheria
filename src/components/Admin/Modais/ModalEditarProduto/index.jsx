import style from "./styles.module.css";
import { useState, useEffect } from "react";
import { api } from "../../../../services/api";
import SeletorColecoes from "../../SeletorColecoes/SeletorColecoes";

export default function ModalEditarProduto({
    isOpen,
    fecharModal,
    produto,
    aoSalvar,
}) {
    const [colecoesSelecionadas, setColecoesSelecionadas] = useState([]);
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");

    const [preco, setPreco] = useState("");
    const [estoque, setEstoque] = useState("");
    const [estoqueMinimo, setEstoqueMinimo] = useState("");

    const [categoriaId, setCategoriaId] = useState("");
    const [materialId, setMaterialId] = useState("");

    const [ativo, setAtivo] = useState(true);
    const [destaque, setDestaque] = useState(false);
    const [personalizavel, setPersonalizavel] = useState(false);

    const [imagem, setImagem] = useState(null);
    const [imagemPreview, setImagemPreview] = useState(null);

    const [erro, setErro] = useState("");
    const [salvando, setSalvando] = useState(false);

    const [categoriasDisponiveis, setCategoriasDisponiveis] =
        useState([]);

    const [materiaisDisponiveis, setMateriaisDisponiveis] =
        useState([]);

    useEffect(() => {
        carregarCategorias();
        carregarMateriais();
    }, []);

    useEffect(() => {
        if (!isOpen || !produto) return;

        setNome(produto.nome || "");
        setDescricao(produto.descricao || "");

        setPreco(produto.preco ?? "");
        setEstoque(produto.estoque ?? "");
        setEstoqueMinimo(produto.estoque_minimo ?? "");

        setCategoriaId(produto.categoria_id ?? "");
        setMaterialId(produto.material_id ?? "");

        setAtivo(
            produto.ativo === true ||
            produto.ativo === 1 ||
            produto.ativo === "1" ||
            produto.ativo === "true"
        );

        setDestaque(
            produto.destaque === true ||
            produto.destaque === 1 ||
            produto.destaque === "1" ||
            produto.destaque === "true"
        );

        setPersonalizavel(
            produto.personalizavel === true ||
            produto.personalizavel === 1 ||
            produto.personalizavel === "1" ||
            produto.personalizavel === "true"
        );

        setImagem(null);

        setImagemPreview(
            produto.imagem
                ? `http://localhost:3000${produto.imagem}`
                : null
        );

        setErro("");
        setSalvando(false);
    }, [isOpen, produto]);

    useEffect(() => {
        if (!isOpen || !produto?.id) return;

        async function carregarColecoesDoProduto() {
            try {
                const { data } = await api.get(`/colecoes/produto/${produto.id}`);
                setColecoesSelecionadas((data || []).map((c) => c.id));
            } catch (error) {
                console.error("Erro ao carregar coleções do produto:", error);
            }
        }

        carregarColecoesDoProduto();
    }, [isOpen, produto?.id]);

    useEffect(() => {
        return () => {
            if (imagemPreview?.startsWith("blob:")) {
                URL.revokeObjectURL(imagemPreview);
            }
        };
    }, [imagemPreview]);

    async function carregarCategorias() {
        try {
            const response = await api.get("/categorias");

            setCategoriasDisponiveis(response.data);
        } catch (error) {
            console.error(
                "Erro ao carregar categorias:",
                error
            );
        }
    }

    async function carregarMateriais() {
        try {
            const response = await api.get("/materiais");

            setMateriaisDisponiveis(response.data);
        } catch (error) {
            console.error(
                "Erro ao carregar materiais:",
                error
            );
        }
    }

    const categoriaSelecionada =
        categoriasDisponiveis.find(
            (categoria) =>
                Number(categoria.id) ===
                Number(categoriaId)
        );

    const materialSelecionado =
        materiaisDisponiveis.find(
            (material) =>
                Number(material.id) ===
                Number(materialId)
        );

    function mostrarErro(mensagem) {
        setErro(mensagem);

        setTimeout(() => {
            setErro("");
        }, 3500);
    }

    function capturarImagem(event) {
        const arquivo = event.target.files?.[0];

        if (!arquivo) return;

        if (imagemPreview?.startsWith("blob:")) {
            URL.revokeObjectURL(imagemPreview);
        }

        setImagem(arquivo);
        setImagemPreview(
            URL.createObjectURL(arquivo)
        );
    }

    async function salvarAlteracoes(event) {
        event.preventDefault();

        if (salvando) return;

        if (!nome.trim() || !descricao.trim()) {
            mostrarErro(
                "Preencha todos os campos obrigatórios."
            );

            return;
        }

        if (!categoriaId) {
            mostrarErro(
                "Selecione uma categoria."
            );

            return;
        }

        if (!materialId) {
            mostrarErro(
                "Selecione um material."
            );

            return;
        }

        setSalvando(true);

        try {
            const formData = new FormData();

            formData.append("nome", nome.trim());
            formData.append(
                "descricao",
                descricao.trim()
            );

            formData.append("preco", preco);
            formData.append("estoque", estoque);

            formData.append(
                "estoque_minimo",
                estoqueMinimo || "0"
            );

            formData.append(
                "categoria_id",
                categoriaId
            );

            formData.append(
                "material_id",
                materialId
            );

            formData.append(
                "ativo",
                ativo ? "true" : "false"
            );

            formData.append(
                "destaque",
                destaque ? "true" : "false"
            );

            formData.append(
                "personalizavel",
                personalizavel ? "true" : "false"
            );

            if (imagem) {
                formData.append(
                    "imagem",
                    imagem
                );
            }

            const resposta = await api.put(
                `/produtos/${produto.id}`,
                formData
            );

            await api.put(`/colecoes/produto/${produto.id}`, {
                colecao_ids: colecoesSelecionadas,
            });

            aoSalvar?.(resposta.data);

            fecharModal();

        } catch (error) {
            console.error(
                "Erro ao editar produto:",
                error
            );

            console.error(
                "Resposta da API:",
                error.response?.data
            );

            mostrarErro(
                error.response?.data?.message ||
                "Erro ao salvar as alterações. Tente novamente."
            );
        } finally {
            setSalvando(false);
        }
    }

    if (!isOpen || !produto) {
        return null;
    }

    return (
        <main className={style.overlayModal}>
            <section className={style.containerModal}>

                {/* HEADER */}

                <div className={style.cabecalhoModal}>

                    <div>
                        <h1 className={style.tituloModal}>
                            EDITAR PRODUTO
                        </h1>

                        <p className={style.subtituloModal}>
                            Atualize os dados do produto selecionado
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={fecharModal}
                        className={style.botaoFechar}
                        disabled={salvando}
                    >
                        X
                    </button>

                </div>

                <div className={style.contentModal}>

                    {/* PREVIEW */}

                    <aside className={style.containerPreview}>

                        <p>
                            PREVIEW EM TEMPO REAL
                        </p>

                        <div className={style.cardPreview}>

                            <div className={style.imagemCategoria}>

                                {imagemPreview ? (
                                    <img
                                        src={imagemPreview}
                                        alt={nome}
                                        className={
                                            style.imagemPreview
                                        }
                                    />
                                ) : (
                                    <p>
                                        Imagem aparecerá aqui
                                    </p>
                                )}

                            </div>

                            <div className={style.textCard}>

                                <h1>
                                    {nome ||
                                        "Nome do produto"}
                                </h1>

                                <p>
                                    {descricao ||
                                        "Descrição do produto"}
                                </p>

                                <p>
                                    Categoria:{" "}
                                    {categoriaSelecionada?.nome ||
                                        "Não selecionada"}
                                </p>

                                <p>
                                    Material:{" "}
                                    {materialSelecionado?.nome ||
                                        "Não selecionado"}
                                </p>

                                <p>
                                    R${" "}
                                    {Number(
                                        preco || 0
                                    ).toFixed(2)}
                                </p>

                            </div>
                        </div>

                        {erro && (
                            <p className={style.mensagemErro}>
                                {erro}
                            </p>
                        )}

                        <div className={style.botoesAcao}>

                            <button
                                type="button"
                                className="btnPadrao"
                                onClick={fecharModal}
                                disabled={salvando}
                            >
                                CANCELAR
                            </button>

                            <button
                                type="button"
                                className={style.btnSalvar}
                                onClick={salvarAlteracoes}
                                disabled={salvando}
                            >
                                {salvando
                                    ? "SALVANDO..."
                                    : "SALVAR ALTERAÇÕES"}
                            </button>

                        </div>

                    </aside>

                    {/* FORMULÁRIO */}

                    <div className={style.containerFormulario}>

                        <div className={style.cabecalhoSecao}>

                            <p className={style.tituloSecao}>
                                DADOS DO PRODUTO
                            </p>

                            <div className={style.linhaTitulo} />

                        </div>

                        {/* NOME */}

                        <div className={style.grupoCampo}>

                            <p className={style.labelCampo}>
                                NOME DO PRODUTO
                            </p>

                            <input
                                type="text"
                                className={style.inputCampo}
                                placeholder="Nome"
                                value={nome}
                                onChange={(e) =>
                                    setNome(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        {/* DESCRIÇÃO */}

                        <div className={style.grupoCampo}>

                            <p className={style.labelCampo}>
                                DESCRIÇÃO
                            </p>

                            <textarea
                                className={
                                    style.textareaCampo
                                }
                                placeholder="Descrição"
                                value={descricao}
                                onChange={(e) =>
                                    setDescricao(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        {/* CATEGORIA / MATERIAL */}

                        <div className={style.formGrid}>

                            <div className={style.grupoCampo}>

                                <p className={style.labelCampo}>
                                    CATEGORIA
                                </p>

                                <select
                                    className={
                                        style.inputCampo
                                    }
                                    value={categoriaId}
                                    onChange={(e) =>
                                        setCategoriaId(
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="">
                                        Categoria
                                    </option>

                                    {categoriasDisponiveis.map(
                                        (categoria) => (
                                            <option
                                                key={
                                                    categoria.id
                                                }
                                                value={
                                                    categoria.id
                                                }
                                            >
                                                {
                                                    categoria.nome
                                                }
                                            </option>
                                        )
                                    )}
                                </select>

                            </div>

                            <div className={style.grupoCampo}>

                                <p className={style.labelCampo}>
                                    MATERIAL
                                </p>

                                <select
                                    className={
                                        style.inputCampo
                                    }
                                    value={materialId}
                                    onChange={(e) =>
                                        setMaterialId(
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="">
                                        Material
                                    </option>

                                    {materiaisDisponiveis.map(
                                        (material) => (
                                            <option
                                                key={
                                                    material.id
                                                }
                                                value={
                                                    material.id
                                                }
                                            >
                                                {
                                                    material.nome
                                                }
                                            </option>
                                        )
                                    )}
                                </select>

                            </div>

                        </div>

                        {/* PREÇO / ESTOQUE */}

                        <div className={style.formGrid}>

                            <div className={style.grupoCampo}>

                                <p className={style.labelCampo}>
                                    PREÇO
                                </p>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className={
                                        style.inputCampo
                                    }
                                    placeholder="Preço"
                                    value={preco}
                                    onChange={(e) =>
                                        setPreco(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                            <div className={style.grupoCampo}>

                                <p className={style.labelCampo}>
                                    ESTOQUE
                                </p>

                                <input
                                    type="number"
                                    min="0"
                                    className={
                                        style.inputCampo
                                    }
                                    placeholder="Estoque"
                                    value={estoque}
                                    onChange={(e) =>
                                        setEstoque(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                        </div>

                        {/* ESTOQUE MÍNIMO */}

                        <div className={style.grupoCampo}>

                            <p className={style.labelCampo}>
                                ESTOQUE MÍNIMO
                            </p>

                            <input
                                type="number"
                                min="0"
                                className={style.inputCampo}
                                placeholder="Estoque mínimo"
                                value={estoqueMinimo}
                                onChange={(e) =>
                                    setEstoqueMinimo(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        {/* IMAGEM */}

                        <div className={style.grupoCampo}>

                            <p className={style.labelCampo}>
                                IMAGEM DO PRODUTO
                            </p>

                            <div className={style.areaUpload}>

                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
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

                                    {imagem ? (
                                        <div
                                            className={
                                                style.arquivoSelecionado
                                            }
                                        >

                                            <img
                                                src={
                                                    imagemPreview
                                                }
                                                alt="Imagem selecionada"
                                                className={
                                                    style.imagemSelecionada
                                                }
                                            />

                                            <p>
                                                {imagem.name}
                                            </p>

                                        </div>
                                    ) : (
                                        <>
                                            <img
                                                width="45"
                                                height="45"
                                                src="https://img.icons8.com/pastel-glyph/64/C9A962/upload--v1.png"
                                                alt="Upload"
                                            />

                                            <span
                                                className={
                                                    style.textoUpload
                                                }
                                            >
                                                Clique aqui para
                                                adicionar a imagem
                                            </span>

                                            <span
                                                className={
                                                    style.textoAuxiliar
                                                }
                                            >
                                                PNG, JPG, Webp -
                                                tamanho recomendado:
                                                800x900
                                            </span>
                                        </>
                                    )}

                                </div>

                            </div>

                        </div>

                        {/* STATUS */}

                        <div className={style.cabecalhoSecao}>

                            <p className={style.tituloSecao}>
                                STATUS DO PRODUTO
                            </p>

                            <div className={style.linhaTitulo} />

                        </div>

                        <div className={style.cardStatus}>

                            <span>
                                Produto ativo
                            </span>

                            <label className={style.switch}>

                                <input
                                    type="checkbox"
                                    checked={ativo}
                                    onChange={(e) =>
                                        setAtivo(
                                            e.target.checked
                                        )
                                    }
                                />

                                <span
                                    className={style.slider}
                                />

                            </label>

                        </div>

                        {/* DESTAQUE */}

                        <div className={style.cardDestaque}>

                            <div
                                className={
                                    style.informacoesDestaque
                                }
                            >

                                <span
                                    className={
                                        style.tituloDestaque
                                    }
                                >
                                    Produto em destaque
                                </span>

                                <span
                                    className={
                                        style.descricaoDestaque
                                    }
                                >
                                    {destaque
                                        ? "Visível na seção destaques da loja"
                                        : "Não visível na seção de destaques da loja - Oculto para clientes"}
                                </span>

                            </div>

                            <label className={style.switch}>

                                <input
                                    type="checkbox"
                                    checked={destaque}
                                    onChange={(e) =>
                                        setDestaque(
                                            e.target.checked
                                        )
                                    }
                                />

                                <span
                                    className={style.slider}
                                />

                            </label>

                        </div>

                        <div className={style.cardDestaque}>
                            <div className={style.informacoesDestaque}>
                                <span className={style.tituloDestaque}>
                                    Personalização liberada
                                </span>

                                <span className={style.descricaoDestaque}>
                                    {personalizavel
                                        ? "O cliente pode customizar esta joia no ateliê"
                                        : "O cliente não verá a opção de personalização"}
                                </span>
                            </div>

                            <label className={style.switch}>
                                <input
                                    type="checkbox"
                                    checked={personalizavel}
                                    onChange={(e) => setPersonalizavel(e.target.checked)}
                                />
                                <span className={style.slider} />
                            </label>
                        </div>

                    </div>

                </div>

            </section>
        </main>
    );
}