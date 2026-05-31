import style from "./styles.module.css";
import { useState } from "react";

export default function ModalAddCategoria({ isOpen, fecharModal }) {
  if (!isOpen) return null;

  // function closeModal(){
  //     fecharModal()
  // }

  // funcao do preview

  const [nome, setNome] = useState("Nome da categoria");
  const [descricao, setDescricao] = useState(
    "Descrição aparecerá aqui conforme você digita...",
  );
  const [ativo, setAtivo] = useState();
  const [imagem, setImagem] = useState(null);
  const[imagemPreview, setImagemPreview] = useState(null);

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
          <h1>{nome}</h1>
          <p>{descricao}</p>
        </div>
      </div>
    );
  }

  return (
    <main className={style.overlayModal}>
      <section className={style.containerModal}>
        <div className={style.cabecalhoModal}>
          <h1 className={style.tituloModal}>ADICIONAR CATEGORIA</h1>

          <div className={style.etapasModal}>
            <div className={style.itemEtapa}>
              <div className={`${style.circuloEtapa} ${style.etapaAtiva}`}>
                <span>1</span>
              </div>

              <span className={`${style.textoEtapa} ${style.textoEtapaAtiva}`}>
                Informações
              </span>
            </div>

            <hr className={style.linhaEtapa} />

            <div className={style.itemEtapa}>
              <div className={style.circuloEtapa}>
                <span>2</span>
              </div>

              <span className={style.textoEtapa}>Revisão</span>
            </div>
          </div>

          <button onClick={fecharModal} className={style.botaoFechar}>
            X
          </button>
        </div>

        <div className={style.contentModal}>
          <div className={style.containerPreview}>
            <p>PREVIEW EM TEMPO REAL</p>
            <PreviewCategoria />

            <div className={style.produtosAtivos}>
              <p>Produtos nessa categoria</p>
              <span>-</span>
            </div>

          <div className={style.botoesAcao}>
            <button className={`btnPadrao ${style.btnCancelar}`} onClick={fecharModal}>CANCELAR</button>
            <button className={style.btnAvancar}>AVANÇAR</button>
          </div>
            
          </div>

          <div className={style.containerFormulario}>
            {/* Título da seção */}
            <div className={style.cabecalhoSecao}>
              <p className={style.tituloSecao}>INFORME OS DADOS DA CATEGORIA</p>
              <div className={style.linhaTitulo}></div>
            </div>

            {/* Nome da categoria */}
            <div className={style.grupoCampo}>
              <label className={style.labelCampo}>NOME DA CATEGORIA</label>

              <input
                type="text"
                placeholder="Ex: Aneis"
                className={style.inputCampo}
                onChange={(event) =>
                  setNome(event.target.value || "Nome da categoria")
                }
              />
            </div>

            {/* Descrição */}
            <div className={style.grupoCampo}>
              <label className={style.labelCampo}>DESCRIÇÃO</label>

              <textarea
                placeholder="Ex: Aneis de luxo com diamante..."
                className={style.textareaCampo}
                onChange={(event) =>
                  setDescricao(
                    event.target.value ||
                      "Descrição aparecerá aqui conforme você digita...",
                  )
                }
              />
            </div>

            {/* Upload */}
            <div className={style.grupoCampo}>
              <label className={style.labelCampo}>IMAGEM DA CATEGORIA</label>

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
                        <img src={imagemPreview } alt="imagem selecionada" className={style.imagemSelecionada}/>
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
              <p className={style.tituloSecao}>INFORME O STATUS DA CATEGORIA</p>
              <div className={style.linhaTitulo}></div>
            </div>

            <div className={style.cardStatus}>
              <div className={style.informacoesStatus}>
                <span className={style.tituloStatus}>Status da categoria</span>

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
      </section>
    </main>
  );
}
