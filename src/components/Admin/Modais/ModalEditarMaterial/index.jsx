import style from "./styles.module.css";
import { useState, useEffect } from "react";
import { api } from "../../../../services/api";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function ModalEditarMaterial({
  isOpen,
  fecharModal,
  material,
  aoSalvar,
}) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [estoque, setEstoque] = useState("");
  const [unidade, setUnidade] = useState("");
  const [valorMedio, setValorMedio] = useState("");
  const [fornecedor, setFornecedor] = useState("");
  const [ativo, setAtivo] = useState(true);
const [nomeImagem, setNomeImagem] = useState("");
  const [imagem, setImagem] = useState(null);
  const [imagemPreview, setImagemPreview] = useState(null);

  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  // preencher dados ao abrir modal
  useEffect(() => {
    if (isOpen && material) {
      setNome(material.nome || "");
      setDescricao(material.descricao || "");
      setEstoque(material.estoque || "");
      setUnidade(material.unidade || "");
      setValorMedio(material.valor_medio || "");
      setFornecedor(material.fornecedor || "");
      setAtivo(Boolean(material.ativo));

      setImagem(null);

      setImagemPreview(
        material.imagem?.startsWith("http")
              ? material.imagem
              : material.imagem
              ? `${API_URL}${material.imagem}`
          : null
      );

      setErro("");
    }
  }, [isOpen, material]);

 function capturarImagem(event) {
  const arquivo = event.target.files[0];
  if (!arquivo) return;

  setImagem(arquivo);
  setImagemPreview(URL.createObjectURL(arquivo));
  setNomeImagem(arquivo.name);
}

  async function salvarAlteracoes(event) {
    event.preventDefault();

    if (!nome || !descricao) {
      setErro("Preencha todos os campos para salvar!");

      setTimeout(() => {
        setErro("");
      }, 3500);
      return;
    }

    setSalvando(true);

    try {
      const formData = new FormData();

      formData.append("nome", nome);
      formData.append("descricao", descricao);
      formData.append("estoque", estoque);
      formData.append("unidade", unidade);
      formData.append("valor_medio", valorMedio);
      formData.append("fornecedor", fornecedor);
      formData.append("ativo", ativo);

      if (imagem) {
        formData.append("imagem", imagem);
      }

      const resposta = await api.put(`/materiais/${material.id}`, formData);

      aoSalvar?.(resposta.data);
      fecharModal();
    } catch (erro) {
      console.error(erro);
      console.error(erro.response?.data);

      setErro(
        erro.response?.data?.erro ||
        erro.response?.data?.message ||
        "Erro ao salvar as alterações, tente novamente!"
      );
    } finally {
      setSalvando(false);
    }
  }

  if (!isOpen) return null;

  return (
    <main className={style.overlayModal}>
      <section className={style.containerModal}>

        {/* HEADER */}
        <div className={style.cabecalhoModal}>
          <div>
            <h1 className={style.tituloModal}>
              EDITAR MATERIAL
            </h1>
            <p className={style.subtituloModal}>
              Atualize os dados do material selecionado
            </p>
          </div>

          <button onClick={fecharModal} className={style.botaoFechar}>
            X
          </button>
        </div>

        {/* CONTENT */}
        <div className={style.contentModal}>

          {/* PREVIEW */}
          <aside className={style.containerPreview}>
            <p>PREVIEW EM TEMPO REAL</p>

            <div className={style.cardPreview}>
              <div className={style.imagemCategoria}>
                {imagemPreview ? (
  <img
    src={imagemPreview}
    alt="preview"
    className={style.imagemPreview}
  />
) : (
  <p>Imagem aparecerá aqui</p>
)}
              </div>

              <div className={style.textCard}>
                <h1>{nome || "Nome do material"}</h1>
                <p>{descricao || "Descrição..."}</p>
              </div>
            </div>

            {erro && <p className={style.erro}>{erro}</p>}

            <div className={style.botoesAcao}>
               <button
                              className={`btnPadrao `}
                              onClick={fecharModal}
                              disabled={salvando}
                            >
                              CANCELAR
                            </button>
              
                            <button
                              className={style.btnSalvar}
                              onClick={salvarAlteracoes}
                              disabled={salvando}
                            >
                              <img
                                width="20"
                                height="20"
                                src="https://img.icons8.com/fluency-systems-filled/48/checkmark--v1.png"
                                alt="checkmark--v1"
                              />
                              {salvando ? "SALVANDO..." : "SALVAR ALTERAÇÕES"}
                            </button>
            </div>
          </aside>

          {/* FORM */}
          <div className={style.containerFormulario}>

            <div className={style.cabecalhoSecao}>
              <p className={style.tituloSecao}>
                DADOS DO MATERIAL
              </p>
              <div className={style.linhaTitulo}></div>
            </div>

            <input
              className={style.inputCampo}
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <textarea
              className={style.textareaCampo}
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />

            <input
              className={style.inputCampo}
              placeholder="Estoque"
              value={estoque}
              onChange={(e) => setEstoque(e.target.value)}
            />

            <select
              className={style.inputCampo}
              value={unidade}
              onChange={(e) => setUnidade(e.target.value)}
            >
              <option value="">Unidade</option>
              <option value="g">g</option>
              <option value="kg">kg</option>
              <option value="ct">ct</option>
              <option value="un">un</option>
            </select>

            <input
              className={style.inputCampo}
              placeholder="Valor médio"
              value={valorMedio}
              onChange={(e) => setValorMedio(e.target.value)}
            />

            <input
              className={style.inputCampo}
              placeholder="Fornecedor"
              value={fornecedor}
              onChange={(e) => setFornecedor(e.target.value)}
            />

            {/* UPLOAD */}
            <div className={style.areaUpload}>
  <input
    type="file"
    accept="image/*"
    className={style.inputArquivo}
    onChange={capturarImagem}
  />

  <div className={style.conteudoUpload}>
    {nomeImagem ? (
      <>
        <span className={style.iconeUpload}>🖼️</span>

        <p className={style.textoUpload}>
          {nomeImagem}
        </p>

        <span className={style.textoAuxiliar}>
          Clique para trocar a imagem
        </span>
      </>
    ) : (
      <>
        <span className={style.iconeUpload}>+</span>

        <p className={style.textoUpload}>
          Clique para enviar uma imagem
        </p>

        <span className={style.textoAuxiliar}>
          PNG, JPG ou WEBP
        </span>
      </>
    )}
  </div>
</div>

            {/* STATUS */}
            <div className={style.cardStatus}>
              <span>Material ativo</span>

              <label className={style.switch}>
                <input
                  type="checkbox"
                  checked={ativo}
                  onChange={(e) => setAtivo(e.target.checked)}
                />
                <span className={style.slider}></span>
              </label>
            </div>

          </div>
        </div>

      </section>
    </main>
  );
}