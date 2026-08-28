import style from "./styles.module.css";
import { useState, useEffect } from "react";
import { api } from "../../../../services/api";
import SeletorColecoes from "../../SeletorColecoes/SeletorColecoes";

export default function ModalAddProduto({
    isOpen,
    fecharModal,
}) {
    const [etapa, setEtapa] = useState(1);
    const [colecoesSelecionadas, setColecoesSelecionadas] = useState([]);

    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");

    const [categoriasDisponiveis, setCategoriasDisponiveis] =
        useState([]);
    const [materiaisDisponiveis, setMateriaisDisponiveis] =
        useState([]);

    const [categoriaId, setCategoriaId] = useState("");
    const [materialId, setMaterialId] = useState("");

    const [preco, setPreco] = useState("");
    const [estoque, setEstoque] = useState("");
    const [estoqueMinimo, setEstoqueMinimo] = useState("");

    const [ativo, setAtivo] = useState(true);
    const [destaque, setDestaque] = useState(false);
    const [personalizavel, setPersonalizavel] = useState(false);

    const [imagem, setImagem] = useState(null);
    const [imagemPreview, setImagemPreview] = useState(null);

    const [erro, setErro] = useState("");
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        carregarCategorias();
        carregarMateriais();
    }, []);

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
            console.error("Erro ao carregar categorias:", error);
        }
    }

    async function carregarMateriais() {
        try {
            const response = await api.get("/materiais");
            setMateriaisDisponiveis(response.data);
        } catch (error) {
            console.error("Erro ao carregar materiais:", error);
        }
    }

    const categoriaSelecionada =
        categoriasDisponiveis.find(
            (categoria) =>
                Number(categoria.id) === Number(categoriaId)
        );

    const materialSelecionado =
        materiaisDisponiveis.find(
            (material) =>
                Number(material.id) === Number(materialId)
        );

    const custoMaterial = Number(
        materialSelecionado?.valor_medio || 0
    );

    const margemEstimada =
        Number(preco || 0) - custoMaterial;

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

        setCategoriaId("");
        setMaterialId("");

        setPreco("");
        setEstoque("");
        setEstoqueMinimo("");

        setAtivo(true);
        setDestaque(false);
        setPersonalizavel(false);

        setImagem(null);
        setImagemPreview(null);

        setColecoesSelecionadas([]);

        setErro("");
        setSalvando(false);
    }

    function fechar() {
        limparFormulario();
        fecharModal();
    }

    function capturarImagem(event) {
        const arquivo = event.target.files?.[0];

        if (!arquivo) return;

        if (imagemPreview?.startsWith("blob:")) {
            URL.revokeObjectURL(imagemPreview);
        }

        setImagem(arquivo);
        setImagemPreview(URL.createObjectURL(arquivo));
    }

    function validarEtapa1() {
        if (
            !nome.trim() ||
            !descricao.trim() ||
            !categoriaId ||
            !preco ||
            !estoque
        ) {
            mostrarErro(
                "Preencha todos os campos obrigatórios."
            );

            return;
        }

        if (Number(preco) <= 0) {
            mostrarErro("Informe um preço válido.");

            return;
        }

        if (Number(estoque) < 0) {
            mostrarErro("Informe um estoque válido.");

            return;
        }

        setErro("");
        setEtapa(2);
    }

    async function salvarProduto() {
        if (salvando) return;

        if (!materialId) {
            mostrarErro("Selecione um material.");
            return;
        }

        setSalvando(true);

        try {
            const formData = new FormData();

            formData.append("nome", nome.trim());
            formData.append("descricao", descricao.trim());
            formData.append("preco", preco);
            formData.append("estoque", estoque);
            formData.append(
                "estoque_minimo",
                estoqueMinimo || "0"
            );

            formData.append("categoria_id", categoriaId);
            formData.append("material_id", materialId);

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
                formData.append("imagem", imagem);
            }

            const { data: produtoCriado } = await api.post("/produtos", formData);

            // Vincula as coleções escolhidas ao produto que acabou de ser criado.
            if (colecoesSelecionadas.length > 0) {
                await api.put(`/colecoes/produto/${produtoCriado.id}`, {
                    colecao_ids: colecoesSelecionadas,
                });
            }

            limparFormulario();
            fecharModal();

        } catch (error) {
            console.error(
                "Erro ao cadastrar produto:",
                error
            );

            console.error(
                "Resposta da API:",
                error.response?.data
            );

            mostrarErro(
                error.response?.data?.message ||
                "Erro ao cadastrar produto."
            );
        } finally {
            setSalvando(false);
        }
    }

    function PreviewProduto() {
        return (
            <div className={style.cardPreview}>
                <div className={style.imagemProduto}>
                    {imagemPreview ? (
                        <img
                            src={imagemPreview}
                            alt={nome || "Produto"}
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

                    <strong className={style.previewPreco}>
                        {preco
                            ? `R$ ${Number(preco).toFixed(2)}`
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
                            ADICIONAR PRODUTO
                        </h1>

                        <p className={style.subtituloModal}>
                            Cadastre um novo produto no catálogo
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
                            <p>Material</p>
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

                        <aside className={style.containerPreview}>
                            <p>
                                PREVIEW EM TEMPO REAL
                            </p>

                            <PreviewProduto />

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
                        </aside>

                        <section className={style.containerFormulario}>

                            <div className={style.cabecalhoSecao}>
                                <p className={style.tituloSecao}>
                                    INFORME OS DADOS DO PRODUTO
                                </p>

                                <div className={style.linhaTitulo} />
                            </div>

                            <div className={style.grupoCampo}>
                                <label>
                                    NOME DO PRODUTO
                                </label>

                                <input
                                    type="text"
                                    className={style.inputCampo}
                                    value={nome}
                                    onChange={(e) =>
                                        setNome(e.target.value)
                                    }
                                    placeholder="Digite o nome do produto"
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
                                    placeholder="Digite a descrição do produto"
                                />
                            </div>

                            <div className={style.formGrid}>

                                <div className={style.grupoCampo}>
                                    <label>
                                        CATEGORIA
                                    </label>

                                    <select
                                        className={style.inputCampo}
                                        value={categoriaId}
                                        onChange={(e) =>
                                            setCategoriaId(
                                                e.target.value
                                            )
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

                                <div className={style.grupoCampo}>
                                    <label>
                                        PREÇO
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className={style.inputCampo}
                                        value={preco}
                                        onChange={(e) =>
                                            setPreco(
                                                e.target.value
                                            )
                                        }
                                        placeholder="0,00"
                                    />
                                </div>

                            </div>

                            <div className={style.formGrid}>

                                <div className={style.grupoCampo}>
                                    <label>
                                        ESTOQUE
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        className={style.inputCampo}
                                        value={estoque}
                                        onChange={(e) =>
                                            setEstoque(
                                                e.target.value
                                            )
                                        }
                                        placeholder="0"
                                    />
                                </div>

                                <div className={style.grupoCampo}>
                                    <label>
                                        ESTOQUE MÍNIMO
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        className={style.inputCampo}
                                        value={estoqueMinimo}
                                        onChange={(e) =>
                                            setEstoqueMinimo(
                                                e.target.value
                                            )
                                        }
                                        placeholder="0"
                                    />
                                </div>

                            </div>

                            <div className={style.grupoCampo}>
                                <label>
                                    IMAGEM DO PRODUTO
                                </label>

                                <div className={style.areaUpload}>

                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        className={style.inputArquivo}
                                        onChange={capturarImagem}
                                    />

                                    <div className={style.conteudoUpload}>

                                        {imagem ? (
                                            <div
                                                className={
                                                    style.arquivoSelecionado
                                                }
                                            >
                                                <img
                                                    src={imagemPreview}
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

                            <div className={style.cabecalhoSecao}>
                                <p className={style.tituloSecao}>
                                    COLEÇÕES
                                </p>

                                <div className={style.linhaTitulo} />
                            </div>

                            <SeletorColecoes
                                selecionadas={colecoesSelecionadas}
                                onChange={setColecoesSelecionadas}
                            />

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

                            <div className={style.cardDestaque}>

                                <div className={style.informacoesDestaque}>
                                    <span className={style.tituloDestaque}>
                                        Produto em destaque
                                    </span>

                                    <span className={style.descricaoDestaque}>
                                        {destaque
                                            ? "Visível na seção destaques da loja"
                                            : "Não visível na seção de destaques da loja - Oculto para clientes"}
                                    </span>
                                </div>

                                <label className={style.switch}>
                                    <input
                                        type="checkbox"
                                        checked={destaque}
                                        onChange={(e) => setDestaque(e.target.checked)}
                                    />
                                    <span className={style.slider} />
                                </label>
                            </div>

                            <div className={style.cardDestaque}>
                                <div className={style.informacoesDestaque}>
                                    <span className={style.tituloDestaque}>
                                        Personalização liberada
                                    </span>

                                    <span className={style.descricaoDestaque}>
                                        {personalizavel
                                            ? "O cliente pode personalizar esta joia no ateliê"
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

                        </section>
                    </div>
                )}

                {/* ETAPA 2 */}

                {etapa === 2 && (
                    <div className={style.contentModal}>

                        <aside className={style.containerPreview}>

                            <p>
                                RESUMO DO PRODUTO
                            </p>

                            <PreviewProduto />

                            <div
                                className={
                                    style.resumoMateriais
                                }
                            >

                                <div className={style.linhaResumo}>
                                    <span>
                                        Material selecionado
                                    </span>

                                    <strong>
                                        {materialSelecionado?.nome ||
                                            "Nenhum material"}
                                    </strong>
                                </div>

                                <div className={style.linhaResumo}>
                                    <span>
                                        Custo médio do material
                                    </span>

                                    <strong>
                                        R${" "}
                                        {custoMaterial.toFixed(2)}
                                    </strong>
                                </div>

                                <div className={style.linhaResumo}>
                                    <span>
                                        Preço de venda
                                    </span>

                                    <strong>
                                        R${" "}
                                        {Number(
                                            preco || 0
                                        ).toFixed(2)}
                                    </strong>
                                </div>

                                <div className={style.linhaResumo}>
                                    <span>
                                        Margem estimada
                                    </span>

                                    <strong>
                                        R${" "}
                                        {margemEstimada.toFixed(2)}
                                    </strong>
                                </div>

                            </div>

                            {erro && (
                                <p className={style.erro}>
                                    {erro}
                                </p>
                            )}

                        </aside>

                        <section className={style.containerFormulario}>

                            <div className={style.cabecalhoSecao}>
                                <p className={style.tituloSecao}>
                                    MATERIAL PRINCIPAL
                                </p>

                                <div className={style.linhaTitulo} />
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
                                <div
                                    className={
                                        style.cardMaterialSelecionado
                                    }
                                >
                                    <h4>
                                        {materialSelecionado.nome}
                                    </h4>

                                    <p>
                                        Estoque atual:{" "}
                                        {
                                            materialSelecionado.quantidade
                                        }
                                    </p>

                                    <p>
                                        Valor médio: R${" "}
                                        {Number(
                                            materialSelecionado.valor_medio
                                        ).toFixed(2)}
                                    </p>
                                </div>
                            )}

                            <div className={style.botoesAcao}>

                                <button
                                    type="button"
                                    className={`btnPadrao ${style.btnCancelar}`}
                                    onClick={() =>
                                        setEtapa(1)
                                    }
                                    disabled={salvando}
                                >
                                    VOLTAR
                                </button>

                                <button
                                    type="button"
                                    className={style.btnSalvar}
                                    onClick={salvarProduto}
                                    disabled={salvando}
                                >
                                    {salvando
                                        ? "SALVANDO..."
                                        : "SALVAR PRODUTO"}
                                </button>

                            </div>

                        </section>
                    </div>
                )}

            </section>
        </main>
    );
}