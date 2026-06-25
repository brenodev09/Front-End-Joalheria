import style from "./styles.module.css";
import { useState, useEffect } from "react";
import { api } from "../../../../services/api";

export default function ModalEditarCategoria({ isOpen, fecharModal, categoria, aoSalvar }) {

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [imagem, setImagem] = useState(null);
  const [imagemPreview, setImagemPreview] = useState(null);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  // preenche o formulário com os dados da categoria sempre que o modal abrir
  useEffect(() => {
    if (isOpen && categoria) {
      setNome(categoria.nome || "");
      setDescricao(categoria.descricao || "");
      setAtivo(Boolean(categoria.ativo));
      setImagem(null);
      setImagemPreview(
        categoria.imagem?.startsWith("http")
          ? categoria.imagem
          : categoria.imagem
          ? `http://localhost:3000${categoria.imagem}`
          : null
      );
      setErro("");
    }
  }, [isOpen, categoria]);

  function capturarImagem(event) {
    const arquivo = event.target.files[0];

    if (arquivo) {
      setImagem(arquivo);
      setImagemPreview(URL.createObjectURL(arquivo));
    }
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
      formData.append("ativo", ativo);

      if (imagem) {
        formData.append("imagem", imagem);
      }

      const resposta = await api.put(`/categorias/${categoria.id}`, formData);

      aoSalvar?.(resposta.data);
      fecharModal();
    } catch (erro) {
      console.error(erro);
      console.error(erro.response?.data);

      setErro("Erro ao salvar as alterações, tente novamente!");
    } finally {
      setSalvando(false);
    }
  }

  if (!isOpen) return null;

  return (
    <main className={style.overlayModal}>
      <section className={style.containerModal}>

        <div className={style.cabecalhoModal}>
          <div className={style.textoCabecalho}>
            <h1 className={style.tituloModal}>{`EDITAR CATEGORIA: ${categoria?.nome}`}</h1>
            <p className={style.subtituloModal}>
              Atualize as informações de <span>{categoria?.nome}</span>
            </p>
          </div>

          <button onClick={fecharModal} className={style.botaoFechar}>
            X
          </button>
        </div>

        <div className={style.contentModal}>

          <aside className={style.containerPreview}>
            <p className={style.legendaPreview}>PREVIEW EM TEMPO REAL</p>

            <div className={style.cardPreview}>
              <div className={style.imagemCategoria}>
                {imagemPreview ? (
                  <img
                    src={imagemPreview}
                    alt="imagem da categoria"
                    className={style.imagemPreview}
                  />
                ) : (
                  <p>Imagem aparecerá aqui</p>
                )}
              </div>

              <div className={style.textCard}>
                <h1>{nome || "Nome da categoria"}</h1>
                <p>{descricao || "Descrição aparecerá aqui..."}</p>
              </div>
            </div>

            <div className={style.produtosAtivos}>
              <p>Produtos nessa categoria</p>
              <span>{categoria?.quantidadeProdutos ?? "-"}</span>
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

          <div className={style.containerFormulario}>

            <div className={style.cabecalhoSecao}>
              <p className={style.tituloSecao}>INFORME OS DADOS DA CATEGORIA</p>
              <div className={style.linhaTitulo}></div>
            </div>

            <div className={style.grupoCampo}>
              <p className={style.labelCampo}>NOME DA CATEGORIA</p>

              <input
                type="text"
                placeholder="Ex: Aneis"
                className={style.inputCampo}
                value={nome}
                onChange={(event) => setNome(event.target.value)}
              />
            </div>

            <div className={style.grupoCampo}>
              <p className={style.labelCampo}>DESCRIÇÃO</p>

              <textarea
                placeholder="Ex: Aneis de luxo com diamante..."
                className={style.textareaCampo}
                value={descricao}
                onChange={(event) => setDescricao(event.target.value)}
              />
            </div>

            <div className={style.grupoCampo}>
              <p className={style.labelCampo}>IMAGEM DA CATEGORIA</p>

              <div className={style.areaUpload}>
                <input
                  type="file"
                  className={style.inputArquivo}
                  accept="image/png, image/jpeg, image/webp"
                  onChange={capturarImagem}
                />

                <div className={style.conteudoUpload}>
                  {imagemPreview ? (
                    <div className={style.arquivoSelecionado}>
                      <img
                        src={imagemPreview}
                        alt="imagem selecionada"
                        className={style.imagemSelecionada}
                      />
                      <p>{imagem ? imagem.name : "Clique para trocar a imagem"}</p>
                    </div>
                  ) : (
                    <>
                      <img
                        width="40"
                        height="40"
                        src="https://img.icons8.com/pastel-glyph/64/C9A962/upload--v1.png"
                        alt="upload--v1"
                      />
                      <span className={style.textoUpload}>
                        Clique aqui para adicionar a imagem
                      </span>

                      <span className={style.textoAuxiliar}>
                        PNG, JPG, Webp - tamanho recomendado: 800x900
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className={style.cabecalhoSecao}>
              <p className={style.tituloSecao}>STATUS DA CATEGORIA</p>
              <div className={style.linhaTitulo}></div>
            </div>

            <div className={style.cardStatus}>
              <div className={style.informacoesStatus}>
                <span className={style.tituloStatus}>Status da categoria</span>

                <span className={style.descricaoStatus}>
                  {ativo
                    ? "Visível no catálogo da loja"
                    : "Não visível no catálogo da loja - Oculto para clientes"}
                </span>
              </div>

              <label className={style.switch}>
                <input
                  type="checkbox"
                  checked={ativo}
                  onChange={(event) => setAtivo(event.target.checked)}
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