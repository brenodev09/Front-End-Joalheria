import style from "./styles.module.css";
import { useState } from "react";
import { api } from "../../../../services/api";

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
  const [imagemPreview, setImagemPreview] = useState(null);

  const [erro, setErro] = useState("");
  const [mostrarNotificacao, setMostrarNotificacao] = useState(false);

  if (!isOpen && !mostrarNotificacao) return null;

  

  function capturarImagem(e) {
    const file = e.target.files[0];
    if (!file) return;

    setImagem(file);
    setImagemPreview(URL.createObjectURL(file));
  }

  function validarEtapa1() {
    if (!nome || !estoque || !unidade) {
      setErro("Preenche os campos obrigatórios!");

      setTimeout(() => setErro(""), 2500);
      return;
    }

    setErro("");
    setEtapa(2);
  }

  function validarEtapa2() {
    setEtapa(3);
  }

  async function salvar(e) {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("nome", nome);
      formData.append("descricao", descricao);
      formData.append("estoque", estoque);
      formData.append("unidade", unidade);
      formData.append("valor_medio", valorMedio);
      formData.append("fornecedor", fornecedor);
      formData.append("ativo", ativo);

      if (imagem) formData.append("imagem", imagem);

    await api.post("/materiais", formData);

// limpa tudo primeiro
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

// fecha modal
fecharModal();

// notificação depois (opcional manter fora do modal)
setMostrarNotificacao(true);
setTimeout(() => setMostrarNotificacao(false), 2000);

      setTimeout(() => {
        setMostrarNotificacao(false);
        fecharModal();
      }, 2000);

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
    } catch (err) {
      console.log(err);
    }
  }

  const Preview = () => (
    <div className={style.cardPreview}>
      <div className={style.imagemCategoria}>
        {imagemPreview ? (
          <img src={imagemPreview} alt="Preview do material" className={style.imagemPreview} />
        ) : (
          <p>Preview aqui</p>
        )}
      </div>

      <div className={style.textCard}>
        <h1>{nome || "Material"}</h1>
        <p>{descricao || "Descrição..."}</p>
      </div>
    </div>
  );

  return (
    <>
      <main className={style.overlayModal}>
        <section className={style.containerModal}>

          {/* HEADER + STEPS */}
          <div className={style.cabecalhoModal}>
            <h1 className={style.tituloModal}>
              ADICIONAR MATERIAL
            </h1>

            <div className={style.etapasModal}>
              <Step ativo={etapa >= 1} numero={1} texto="Básico" />
              <div className={`${style.linhaEtapa} ${etapa >= 2 ? style.linhaPreenchida : ""}`} />
              <Step ativo={etapa >= 2} numero={2} texto="Detalhes" />
              <div className={`${style.linhaEtapa} ${etapa >= 3 ? style.linhaPreenchida : ""}`} />
              <Step ativo={etapa === 3} numero={3} texto="Revisão" />
            </div>

            <button className={style.botaoFechar} onClick={fecharModal}>
              ✕
            </button>
          </div>

          {/* ETAPA 1 */}
          {etapa === 1 && (
            <div className={style.contentModal}>
              <div className={style.containerPreview}>
                <p>PREVIEW</p>
                <Preview />
              </div>

              <div className={style.containerFormulario}>

                <Input label="Nome" value={nome} setValue={setNome} />
                <Input label="Descrição" textarea value={descricao} setValue={setDescricao} />
                <Input label="Estoque" type="number" value={estoque} setValue={setEstoque} />

                <SelectUnidade value={unidade} setValue={setUnidade} />

                {erro && <p className={style.erro}>{erro}</p>}

                <div className={style.botoesAcao}>
                  <button className="btnPadrao" onClick={fecharModal}>Cancelar</button>
                  <button className={style.btnAvancar} onClick={validarEtapa1}>Avançar</button>
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 2 */}
          {etapa === 2 && (
            <div className={style.contentModal}>
              <div className={style.containerFormulario}>

                <Input label="Valor médio" type="number" value={valorMedio} setValue={setValorMedio} />
                <Input label="Fornecedor" value={fornecedor} setValue={setFornecedor} />

                <div className={style.areaUpload}>
                  <input type="file" className={style.inputArquivo} onChange={capturarImagem} />

                  <div className={style.conteudoUpload}>
                    <span className={style.iconeUpload}>+</span>
                    <p>Upload imagem</p>
                  </div>
                </div>

                <div className={style.cardStatus}>
                  <span>Ativo</span>

                  <label className={style.switch}>
                    <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} />
                    <span className={style.slider}></span>
                  </label>
                </div>

                <div className={style.botoesAcao}>
                  <button className="btnPadrao" onClick={() => setEtapa(1)}>Voltar</button>
                  <button className={style.btnAvancar} onClick={validarEtapa2}>Avançar</button>
                </div>

              </div>
            </div>
          )}

          {/* ETAPA 3 */}
          {etapa === 3 && (
            <div className={style.containerRevisao}>

              <aside className={style.containerPreview}>
                <p>REVISÃO</p>
                <Preview />
              </aside>

              <section className={style.contentRevisao}>

                <div className={style.gridRevisao}>
                  <Info label="Nome" value={nome} />
                  <Info label="Estoque" value={`${estoque} ${unidade}`} />
                  <Info label="Valor" value={`R$ ${valorMedio}`} />
                  <Info label="Fornecedor" value={fornecedor} />
                  <div className={style.itemRevisao}>
  <p>Descrição</p>
  <span>{descricao || "—"}</span>
</div>

<div className={style.itemRevisao}>
  <p>Unidade</p>
  <span>{unidade || "—"}</span>
</div>

<div className={style.itemRevisao}>
  <p>Status</p>
  <span>{ativo ? "Ativo" : "Inativo"}</span>
</div>

<div className={style.itemRevisao}>
  <p>Imagem</p>
  <span>{imagem ? imagem.name : "Sem imagem"}</span>
</div>
                </div>

                <div className={style.botoesRodape}>
                  <div className={style.cancelBtns}>
                               <button className="btnPadrao" onClick={fecharModal}>
                                 CANCELAR
                               </button>
                               <button className="btnPadrao" onClick={() => setEtapa(2)}>
                                 VOLTAR
                               </button>
                             </div>
                  
                              <button className={style.btnSalvar} onClick={salvar}>
                                <img
                                  width="25"
                                  height="25"
                                  src="https://img.icons8.com/fluency-systems-filled/48/downloading-updates.png"
                                  alt="downloading-updates"
                                />
                                SALVAR MATERIAL
                              </button>
                              
                </div>
            

              </section>

            </div>
          )}

        </section>
      </main>

      {mostrarNotificacao && (
        <div className={style.notificacao}>
          Material salvo com sucesso 🚀
        </div>
      )}
    </>
  );
}

/* COMPONENTES AUX */
function Step({ ativo, numero, texto }) {
  return (
    <div className={style.itemEtapa}>
      <div className={`${style.circuloEtapa} ${ativo ? style.etapaAtiva : ""}`}>
        {numero}
      </div>
      <span className={`${style.textoEtapa} ${ativo ? style.textoEtapaAtiva : ""}`}>
        {texto}
      </span>
    </div>
  );
}

function Input({ label, value, setValue, type = "text", textarea }) {
  return (
    <div className={style.grupoCampo}>
      <label>{label}</label>

      {textarea ? (
        <textarea className={style.textareaCampo} value={value} onChange={(e) => setValue(e.target.value)} />
      ) : (
        <input className={style.inputCampo} type={type} value={value} onChange={(e) => setValue(e.target.value)} />
      )}
    </div>
  );
}

function SelectUnidade({ value, setValue }) {
  return (
    <div className={style.grupoCampo}>
      <label>Unidade</label>
      <select className={style.inputCampo} value={value} onChange={(e) => setValue(e.target.value)}>
        <option value="">Selecione</option>
        <option value="g">g</option>
        <option value="kg">kg</option>
        <option value="ct">ct</option>
        <option value="un">un</option>
      </select>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className={style.itemRevisao}>
      <p>{label}</p>
      <span>{value}</span>
    </div>
  );
}