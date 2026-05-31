import style from "./styles.module.css";
import { useState } from "react";

export default function ModalAddCategoria({ isOpen, fecharModal }) {
  // function closeModal(){
  //     fecharModal()
  // }

  // funcao do preview

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [ativo, setAtivo] = useState();
  const [imagem, setImagem] = useState(null);
  const [imagemPreview, setImagemPreview] = useState(null);

  function capturarImagem(event) {
    const arquivo = event.target.files[0];

    if (arquivo) {
      setImagem(arquivo);
      setImagemPreview(URL.createObjectURL(arquivo));
    }
  }

  function PreviewCategoria() {
    return (
      <div className={style.cardPreview}>
        <div className={style.imagemCategoria}>
          {imagemPreview ? (
            <img
              src={imagemPreview}
              alt="imagem da categoria"
              className={style.imagemPreview}
            ></img>
          ) : (
            <p>Imagem aparecerá aqui</p>
          )}
        </div>

        <div className={style.textCard}>
          <h1>{nome || "Nome da categoria"}</h1>
          <p>{descricao || "Descrição aparecerá aqui..."}</p>
        </div>
      </div>
    );
  }

  // etapa de revisoa da categoria

  function Revisao({ nome, descricao, ativo }) {
    return (
      <main className={style.containerRevisao}>
        <aside className={style.containerPreview}>
          <p>PREVIEW FINAL</p>
          <PreviewCategoria />

          <div className={style.produtosAtivos}>
            <p>Produtos nessa categoria</p>
            <span>-</span>
          </div>
        </aside>

        <section className={style.contentRevisao}>
          <div className={style.cabecalhoSecao}>
            <p className={style.tituloSecao}>RESUMO DA CATEGORIA</p>
            <div className={style.linhaTitulo}></div>
          </div>

          <div className={style.gridRevisao}>
            <div className={style.itemRevisao}>
              <p>Nome da categoria</p>
              <span>{nome}</span>
            </div>

            <div className={style.itemRevisao}>
              <p>Descrição da categoria</p>
              <span>{descricao}</span>
            </div>

            <div className={style.itemRevisao}>
              <p>Descrição da categoria</p>
              <span>{ativo ? "Categoria vísivel" : "Categoria oculta"}</span>
            </div>
          </div>

          <div className={style.botoesRodape}>
            <div className={style.cancelBtns}>
              <button className="btnPadrao" onClick={fecharModal}>
                CANCELAR
              </button>
              <button className="btnPadrao" onClick={() => setEtapa(1)}>
                VOLTAR
              </button>
            </div>

            <button className={style.btnSalvar} onClick={SalvarCategoria}>
              <img
                width="25"
                height="25"
                src="https://img.icons8.com/fluency-systems-filled/48/downloading-updates.png"
                alt="downloading-updates"
              />
              SALVAR CATEGORIA
            </button>
          </div>
        </section>
      </main>
    );
  }

  // funcao das etapas do modal
  const [etapa, setEtapa] = useState(1);

  // funcao de preencher os campos
  const [erro, setErro] = useState("");

  function PreenchaCampos(event) {
    // event.preventDefault()

    if (!nome || !descricao || !imagem) {
      setErro("Preencha todos os campos para prosseguir!");

      setTimeout(() => {
        setErro("");
      }, 3500);
      return;
    }

    setErro("");
    setEtapa(2);
  }

  // notificacao da categoria
  function NotificacaoCategoria() {
    return (
      <div className={style.notificacao}>
        <p>Categoria adicionada!</p>
      </div>
    );
  }

  const [mostrarNotificacao, setMostrarNotificacao] = useState(false);

  function SalvarCategoria() {
    setMostrarNotificacao(true);
    fecharModal();

    setTimeout(() => {
      setMostrarNotificacao(false);
    }, 4500);
  }

  if (!mostrarNotificacao && !isOpen) return null;

  return (
    <>
      <main className={style.overlayModal}>
        <section className={style.containerModal}>
          <div className={style.cabecalhoModal}>
            <h1 className={style.tituloModal}>ADICIONAR CATEGORIA</h1>

            <div className={style.etapasModal}>
              <div className={style.itemEtapa}>
                <div
                  className={`${style.circuloEtapa} ${
                    etapa >= 1 ? style.etapaAtiva : ""
                  } ${etapa === 2 ? style.etapaConcluida : ""}`}
                >
                  <span>{etapa === 2 ? "✓" : "1"}</span>
                </div>

                <span
                  className={`${style.textoEtapa} ${
                    etapa >= 1 ? style.textoEtapaAtiva : ""
                  }`}
                >
                  Informações
                </span>
              </div>

              <div
                className={`${style.linhaEtapa} ${
                  etapa === 2 ? style.linhaPreenchida : ""
                }`}
              ></div>

              <div className={style.itemEtapa}>
                <div
                  className={`${style.circuloEtapa} ${
                    etapa === 2 ? style.etapaAtiva : ""
                  }`}
                >
                  <span>2</span>
                </div>

                <span
                  className={`${style.textoEtapa} ${
                    etapa === 2 ? style.textoEtapaAtiva : ""
                  }`}
                >
                  Revisão
                </span>
              </div>
            </div>
            <button onClick={fecharModal} className={style.botaoFechar}>
              X
            </button>
          </div>

          {/* etapas do modal */}

          {etapa === 1 ? (
            <div className={style.contentModal}>
              <div className={style.containerPreview}>
                <p>PREVIEW EM TEMPO REAL</p>
                <PreviewCategoria />

                <div className={style.produtosAtivos}>
                  <p>Produtos nessa categoria</p>
                  <span>-</span>
                </div>

                {erro && <p className={style.erro}>{erro}</p>}

                <div className={style.botoesAcao}>
                  <button
                    className={`btnPadrao ${style.btnCancelar}`}
                    onClick={fecharModal}
                  >
                    CANCELAR
                  </button>
                  <button className={style.btnAvancar} onClick={PreenchaCampos}>
                    AVANÇAR
                  </button>
                </div>
              </div>

              <div className={style.containerFormulario}>
                {/* Título da seção */}
                <div className={style.cabecalhoSecao}>
                  <p className={style.tituloSecao}>
                    INFORME OS DADOS DA CATEGORIA
                  </p>
                  <div className={style.linhaTitulo}></div>
                </div>

                {/* Nome da categoria */}
                <div className={style.grupoCampo}>
                  <label className={style.labelCampo}>NOME DA CATEGORIA</label>

                  <input
                    type="text"
                    placeholder="Ex: Aneis"
                    className={style.inputCampo}
                    onChange={(event) => setNome(event.target.value)}
                  />
                </div>

                {/* Descrição */}
                <div className={style.grupoCampo}>
                  <label className={style.labelCampo}>DESCRIÇÃO</label>

                  <textarea
                    placeholder="Ex: Aneis de luxo com diamante..."
                    className={style.textareaCampo}
                    onChange={(event) => setDescricao(event.target.value)}
                  />
                </div>

                {/* Upload */}
                <div className={style.grupoCampo}>
                  <label className={style.labelCampo}>
                    IMAGEM DA CATEGORIA
                  </label>

                  <div className={style.areaUpload}>
                    <input
                      type="file"
                      className={style.inputArquivo}
                      accept="image/png, imagem/jpeg, image/webp"
                      onChange={capturarImagem}
                    />

                    <div className={style.conteudoUpload}>
                      {imagem ? (
                        <div className={style.arquivoSelecionado}>
                          <img
                            src={imagemPreview}
                            alt="imagem selecionada"
                            className={style.imagemSelecionada}
                          />
                          <p>{imagem.name}</p>
                        </div>
                      ) : (
                        <>
                          <img
                            width="45"
                            height="45"
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

                {/* Status */}
                <div className={style.cabecalhoSecao}>
                  <p className={style.tituloSecao}>
                    INFORME O STATUS DA CATEGORIA
                  </p>
                  <div className={style.linhaTitulo}></div>
                </div>

                <div className={style.cardStatus}>
                  <div className={style.informacoesStatus}>
                    <span className={style.tituloStatus}>
                      Status da categoria
                    </span>

                    <span className={style.descricaoStatus}>
                      {ativo
                        ? "Visível no catálago da loja"
                        : "Não visível no catalágo da loja - Oculto para clientes"}
                      {/* Visível no catálogo da loja */}
                    </span>
                  </div>

                  <label className={style.switch}>
                    <input
                      type="checkbox"
                      checked={ativo}
                      onChange={() => setAtivo(!ativo)}
                    />
                    <span className={style.slider}></span>
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <Revisao nome={nome} descricao={descricao} ativo={ativo} />
          )}
        </section>
      </main>

      {mostrarNotificacao && <NotificacaoCategoria />}
    </>
  );
}
