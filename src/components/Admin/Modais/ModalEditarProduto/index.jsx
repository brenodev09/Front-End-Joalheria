import style from "./styles.module.css";
import { useState, useEffect } from "react";
import { api } from "../../../../services/api";

export default function ModalEditarProduto({
  isOpen,
  fecharModal,
  produto,
  aoSalvar,
}) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const [estoqueMinimo, setEstoqueMinimo] =
    useState("");

  const [categoriaId, setCategoriaId] =
    useState("");

  const [materialId, setMaterialId] =
    useState("");

  const [ativo, setAtivo] = useState(true);

  const [imagem, setImagem] = useState(null);
  const [imagemPreview, setImagemPreview] =
    useState(null);

  const [nomeImagem, setNomeImagem] =
    useState("");

  const [erro, setErro] = useState("");
  const [salvando, setSalvando] =
    useState(false);

  const [
    categoriasDisponiveis,
    setCategoriasDisponiveis,
  ] = useState([]);

  const [
    materiaisDisponiveis,
    setMateriaisDisponiveis,
  ] = useState([]);

  useEffect(() => {
    carregarCategorias();
    carregarMateriais();
  }, []);

  useEffect(() => {
    if (isOpen && produto) {
      setNome(produto.nome || "");
      setDescricao(produto.descricao || "");

      setPreco(produto.preco || "");
      setEstoque(produto.estoque || "");

      setEstoqueMinimo(
        produto.estoque_minimo || ""
      );

      setCategoriaId(
        produto.categoria_id || ""
      );

      setMaterialId(
        produto.material_id || ""
      );

      setAtivo(Boolean(produto.ativo));

      setImagem(null);

      setImagemPreview(
        produto.imagem
          ? `http://localhost:3000${produto.imagem}`
          : null
      );

      setNomeImagem("");
      setErro("");
    }
  }, [isOpen, produto]);

  async function carregarCategorias() {
    try {
      const response =
        await api.get("/categorias");

      setCategoriasDisponiveis(
        response.data
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function carregarMateriais() {
    try {
      const response =
        await api.get("/materiais");

      setMateriaisDisponiveis(
        response.data
      );
    } catch (error) {
      console.error(error);
    }
  }

  function capturarImagem(event) {
    const arquivo =
      event.target.files[0];

    if (!arquivo) return;

    setImagem(arquivo);

    setNomeImagem(arquivo.name);

    setImagemPreview(
      URL.createObjectURL(arquivo)
    );
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


  const categoriaSelecionada =
    categoriasDisponiveis.find(
      (categoria) =>
        categoria.id ===
        Number(categoriaId)
    );

  const materialSelecionado =
    materiaisDisponiveis.find(
      (material) =>
        material.id ===
        Number(materialId)
    );

  return (
    <main className={style.overlayModal}>
      <section
        className={style.containerModal}
      >
        <div
          className={
            style.cabecalhoModal
          }
        >
          <div>
            <h1
              className={
                style.tituloModal
              }
            >
              EDITAR PRODUTO
            </h1>

            <p
              className={
                style.subtituloModal
              }
            >
              Atualize os dados do
              produto selecionado
            </p>
          </div>

          <button
            onClick={fecharModal}
            className={
              style.botaoFechar
            }
          >
            X
          </button>
        </div>

        <div
          className={
            style.contentModal
          }
        >
          <aside
            className={
              style.containerPreview
            }
          >
            <p>
              PREVIEW EM TEMPO REAL
            </p>

            <div
              className={
                style.cardPreview
              }
            >
              <div
                className={
                  style.imagemCategoria
                }
              >
                {imagemPreview ? (
                  <img
                    src={
                      imagemPreview
                    }
                    alt=""
                    className={
                      style.imagemPreview
                    }
                  />
                ) : (
                  <p>
                    Imagem aparecerá
                    aqui
                  </p>
                )}
              </div>

              <div
                className={
                  style.textCard
                }
              >
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
                  {categoriaSelecionada?.nome}
                </p>

                <p>
                  Material:{" "}
                  {materialSelecionado?.nome}
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
              <p
                className={style.erro}
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
                DADOS DO PRODUTO
              </p>

              <div
                className={
                  style.linhaTitulo
                }
              ></div>
            </div>

            <input
              className={
                style.inputCampo
              }
              placeholder="Nome"
              value={nome}
              onChange={(e) =>
                setNome(
                  e.target.value
                )
              }
            />

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

            <div
              className={
                style.formGrid
              }
            >
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

            <div
              className={
                style.formGrid
              }
            >
              <input
                type="number"
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

              <input
                type="number"
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

            <input
              type="number"
              className={
                style.inputCampo
              }
              placeholder="Estoque mínimo"
              value={estoqueMinimo}
              onChange={(e) =>
                setEstoqueMinimo(
                  e.target.value
                )
              }
            />

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
                <span
                  className={
                    style.iconeUpload
                  }
                >
                  {nomeImagem
                    ? "🖼️"
                    : "+"}
                </span>

                <p>
                  {nomeImagem ||
                    "Clique para enviar uma imagem"}
                </p>
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
                      e.target.checked
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
      </section>
    </main>
  );
}