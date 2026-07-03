import style from "./styles.module.css";
import { useState } from "react";
import { api } from "../../../../services/api"

export default function ModalAddMaterial({
  isOpen,
  fecharModal,
}) {
  const [etapa, setEtapa] = useState(1);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  const [estoque, setEstoque] = useState("");
  const [unidade, setUnidade] = useState("");

  const [valorMedio, setValorMedio] = useState("");

  const [fornecedor, setFornecedor] = useState("");

  const [ativo, setAtivo] = useState(true);

  const [imagem, setImagem] = useState(null);
  const [imagemPreview, setImagemPreview] =
    useState(null);

  const [erro, setErro] = useState("");

  const [mostrarNotificacao, setMostrarNotificacao] =
    useState(false);

  function capturarImagem(event) {
    const arquivo = event.target.files[0];

    if (!arquivo) return;

    setImagem(arquivo);

    setImagemPreview(
      URL.createObjectURL(arquivo)
    );
  }

  function validarCampos() {
    if (
      !nome ||
      !estoque ||
      !unidade
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

  async function cadastrarMaterial(event) {
    event.preventDefault();

    try {
      const formData = new FormData();

      formData.append("nome", nome);
      formData.append("descricao", descricao);
      formData.append("estoque", estoque);
      formData.append("unidade", unidade);
      formData.append(
        "valor_medio",
        valorMedio
      );
      formData.append(
        "fornecedor",
        fornecedor
      );
      formData.append("ativo", ativo);

      if (imagem) {
        formData.append(
          "imagem",
          imagem
        );
      }

      await api.post(
        "/materiais",
        formData
      );

      setMostrarNotificacao(true);

      setTimeout(() => {
        setMostrarNotificacao(false);
      }, 4000);
      
      setNome("");
setDescricao("");
setEstoque("");
setUnidade("");
setValorMedio("");
setFornecedor("");
setImagem(null);
setImagemPreview(null);
setAtivo(true);
setEtapa(1);

      fecharModal();
    } catch (error) {
      console.error(error);
    }
  }

  function PreviewMaterial() {
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
            <p>
              Imagem aparecerá aqui
            </p>
          )}
        </div>

        <div className={style.textCard}>
          <h1>
            {nome ||
              "Nome do material"}
          </h1>

          <p>
            {descricao ||
              "Descrição do material"}
          </p>
        </div>
      </div>
    );
  }

 if (!isOpen && !mostrarNotificacao) return null;
  return (
    <>
      <main className={style.overlayModal}>
        <section
          className={style.containerModal}
        >
          <div
            className={
              style.cabecalhoModal
            }
          >
            <h1
              className={
                style.tituloModal
              }
            >
              ADICIONAR MATERIAL
            </h1>

            <button
              onClick={fecharModal}
              className={
                style.botaoFechar
              }
            >
              X
            </button>
          </div>

          {etapa === 1 ? (
            <div
              className={
                style.contentModal
              }
            >
              <div
                className={
                  style.containerPreview
                }
              >
                <p>
                  PREVIEW EM TEMPO
                  REAL
                </p>

                <PreviewMaterial />

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
                      fecharModal
                    }
                  >
                    CANCELAR
                  </button>

                  <button
                    className={
                      style.btnAvancar
                    }
                    onClick={
                      validarCampos
                    }
                  >
                    AVANÇAR
                  </button>
                </div>
              </div>

              <div
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
                    DADOS DO
                    MATERIAL
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
                    NOME
                  </label>

                  <input
                    type="text"
                    className={
                      style.inputCampo
                    }
                    value={nome}
                    onChange={(e) =>
                      setNome(
                        e.target
                          .value
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
                    value={
                      descricao
                    }
                    onChange={(e) =>
                      setDescricao(
                        e.target
                          .value
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
                        e.target
                          .value
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
                    UNIDADE
                  </label>

                  <select
                    className={
                      style.inputCampo
                    }
                    value={unidade}
                    onChange={(e) =>
                      setUnidade(
                        e.target
                          .value
                      )
                    }
                  >
                    <option value="">
                      Selecione
                    </option>

                    <option value="g">
                      Gramas (g)
                    </option>

                    <option value="kg">
                      Quilogramas
                      (kg)
                    </option>

                    <option value="ct">
                      Quilates
                      (ct)
                    </option>

                    <option value="un">
                      Unidade
                      (un)
                    </option>
                  </select>
                </div>

                <div
                  className={
                    style.grupoCampo
                  }
                >
                  <label>
                    VALOR MÉDIO
                  </label>

                  <input
                    type="number"
                    className={
                      style.inputCampo
                    }
                    value={
                      valorMedio
                    }
                    onChange={(e) =>
                      setValorMedio(
                        e.target
                          .value
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
                    FORNECEDOR
                  </label>

                  <input
                    type="text"
                    className={
                      style.inputCampo
                    }
                    value={
                      fornecedor
                    }
                    onChange={(e) =>
                      setFornecedor(
                        e.target
                          .value
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
                    IMAGEM
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      capturarImagem
                    }
                  />
                </div>

                <div
                  className={
                    style.cardStatus
                  }
                >
                  <div>
                    <span>
                      Material
                      ativo
                    </span>
                  </div>

                  <label
                    className={
                      style.switch
                    }
                  >
                    <input
                      type="checkbox"
                      checked={
                        ativo
                      }
                      onChange={(
                        e
                      ) =>
                        setAtivo(
                          e
                            .target
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
              </div>
            </div>
          ) : (
            <main
              className={
                style.containerRevisao
              }
            >
              <aside
                className={
                  style.containerPreview
                }
              >
                <p>
                  PREVIEW FINAL
                </p>

                <PreviewMaterial />
              </aside>

              <section
                className={
                  style.contentRevisao
                }
              >
                <div
                  className={
                    style.gridRevisao
                  }
                >
                  <div
                    className={
                      style.itemRevisao
                    }
                  >
                    <p>Nome</p>
                    <span>
                      {nome}
                    </span>
                  </div>

                  <div
                    className={
                      style.itemRevisao
                    }
                  >
                    <p>
                      Estoque
                    </p>
                    <span>
                      {estoque}{" "}
                      {unidade}
                    </span>
                  </div>

                  <div
                    className={
                      style.itemRevisao
                    }
                  >
                    <p>
                      Valor Médio
                    </p>
                    <span>
                      R$ {
                        valorMedio
                      }
                    </span>
                  </div>

                  <div
                    className={
                      style.itemRevisao
                    }
                  >
                    <p>
                      Fornecedor
                    </p>
                    <span>
                      {
                        fornecedor
                      }
                    </span>
                  </div>
                </div>

                <div
                  className={
                    style.botoesRodape
                  }
                >
                  <button
                    className="btnPadrao"
                    onClick={() =>
                      setEtapa(
                        1
                      )
                    }
                  >
                    VOLTAR
                  </button>

                  <button
                    className={
                      style.btnSalvar
                    }
                    onClick={
                      cadastrarMaterial
                    }
                  >
                    SALVAR
                    MATERIAL
                  </button>
                </div>
              </section>
            </main>
          )}
        </section>
      </main>

      {mostrarNotificacao && (
        <div
          className={
            style.notificacao
          }
        >
          <p>
            Material cadastrado!
          </p>
        </div>
      )}
    </>
  );
}