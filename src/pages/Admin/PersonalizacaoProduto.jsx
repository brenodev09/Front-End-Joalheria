import { useEffect, useState } from "react";
import { api } from "../../services/api";
import styles from "../../styles/Admin/personalizacaoProduto.module.css";

const vazioGrupo = { nome: "", slug: "", tipo: "select", obrigatoria: false, permite_valor_livre: false, ordem: 0 };
const vazioOpcao = { nome: "", descricao: "", valorAdicional: 0, ordem: 0, visual: "" };
const authConfig = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

export default function PersonalizacaoProduto() {
  const [produtos, setProdutos] = useState([]);
  const [produtoId, setProdutoId] = useState("");
  const [dados, setDados] = useState(null);
  const [grupo, setGrupo] = useState(vazioGrupo);
  const [opcao, setOpcao] = useState(vazioOpcao);
  const [grupoAtivo, setGrupoAtivo] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    api.get("/produtos").then((resposta) => setProdutos(Array.isArray(resposta.data) ? resposta.data : []))
      .catch(() => setErro("Não foi possível carregar os produtos."));
  }, []);

  async function carregar(id = produtoId) {
    if (!id) return;
    try {
      const resposta = await api.get(`/produtos/${id}/personalizacao`, authConfig());
      setDados(resposta.data || {});
      setMensagem("");
    } catch (error) {
      setErro(error.response?.data?.message || "Não foi possível carregar a configuração.");
    }
  }

  async function criarGrupo(event) {
    event.preventDefault();
    try {
      await api.post(`/produtos/admin/${produtoId}/personalizacoes`, grupo, authConfig());
      setGrupo(vazioGrupo);
      await carregar();
      setMensagem("Personalização criada.");
    } catch (error) {
      setErro(error.response?.data?.erro || error.response?.data?.message || "Não foi possível criar a personalização.");
    }
  }

  async function criarOpcao(event) {
    event.preventDefault();
    if (!grupoAtivo) return;
    try {
      const visual = opcao.visual.trim() ? JSON.parse(opcao.visual) : null;
      await api.post(`/produtos/admin/personalizacoes/${grupoAtivo.id}/opcoes`, {
        ...opcao,
        valor_adicional: Number(opcao.valorAdicional || 0),
        visual,
      }, authConfig());
      setOpcao(vazioOpcao);
      await carregar();
      setMensagem("Opção criada.");
    } catch (error) {
      setErro(error instanceof SyntaxError ? "O visual precisa ser um JSON válido." : error.response?.data?.erro || error.response?.data?.message || "Não foi possível criar a opção.");
    }
  }

  async function removerGrupo(id) {
    if (!window.confirm("Excluir esta personalização e suas opções?")) return;
    await api.delete(`/produtos/admin/personalizacoes/${id}`, authConfig());
    await carregar();
  }

  const grupos = dados?.personalizacoes || [];

  return (
    <main className={styles.page}>
      <header><div><p className={styles.eyebrow}>CATÁLOGO DIGITAL</p><h1>Personalização visual</h1><p>Cadastre as escolhas e imagens de cada joia.</p></div></header>
      <select className={styles.productSelect} value={produtoId} onChange={(event) => { setProdutoId(event.target.value); carregar(event.target.value); }}>
        <option value="">Selecione um produto</option>
        {produtos.map((produto) => <option value={produto.id} key={produto.id}>{produto.nome} · #{produto.id}</option>)}
      </select>
      {produtoId && <div className={styles.grid}>
        <section className={styles.card}>
          <h2>Nova personalização</h2>
          <form onSubmit={criarGrupo} className={styles.form}>
            <input required placeholder="Nome (ex.: Material)" value={grupo.nome} onChange={(e) => setGrupo({ ...grupo, nome: e.target.value })} />
            <input placeholder="Slug/chave" value={grupo.slug} onChange={(e) => setGrupo({ ...grupo, slug: e.target.value })} />
            <select value={grupo.tipo} onChange={(e) => setGrupo({ ...grupo, tipo: e.target.value })}><option value="select">Select</option><option value="radio">Radio</option><option value="checkbox">Checkbox</option></select>
            <label><input type="checkbox" checked={grupo.obrigatoria} onChange={(e) => setGrupo({ ...grupo, obrigatoria: e.target.checked })} /> Obrigatória</label>
            <label><input type="checkbox" checked={grupo.permite_valor_livre} onChange={(e) => setGrupo({ ...grupo, permite_valor_livre: e.target.checked })} /> Permite texto livre</label>
            <button>Criar personalização</button>
          </form>
        </section>
        <section className={styles.card}>
          <h2>Nova opção</h2><p>Selecione um grupo abaixo antes de cadastrar uma opção.</p>
          <select value={grupoAtivo?.id || ""} onChange={(e) => setGrupoAtivo(grupos.find((item) => String(item.id) === e.target.value) || null)}><option value="">Grupo</option>{grupos.map((item) => <option value={item.id} key={item.id}>{item.nome}</option>)}</select>
          <form onSubmit={criarOpcao} className={styles.form}>
            <input required placeholder="Nome da opção" value={opcao.nome} onChange={(e) => setOpcao({ ...opcao, nome: e.target.value })} />
            <input type="number" min="0" step="0.01" placeholder="Valor adicional" value={opcao.valorAdicional} onChange={(e) => setOpcao({ ...opcao, valorAdicional: e.target.value })} />
            <textarea placeholder='Visual JSON: {"tipo":"material","alvo":"metal","cor":"#D4AF37"}' value={opcao.visual} onChange={(e) => setOpcao({ ...opcao, visual: e.target.value })} />
            <button disabled={!grupoAtivo}>Criar opção</button>
          </form>
        </section>
      </div>}
      {mensagem && <p className={styles.success}>{mensagem}</p>}{erro && <p className={styles.error}>{erro}</p>}
      <section className={styles.list}>{grupos.map((item) => <article className={styles.card} key={item.id}><div className={styles.row}><h2>{item.nome}</h2><button type="button" onClick={() => removerGrupo(item.id)}>Excluir</button></div><ul>{(item.opcoes || []).map((op) => <li key={op.id}>{op.nome} <span>+ R$ {Number(op.valorAdicional || 0).toFixed(2)}</span></li>)}</ul></article>)}</section>
    </main>
  );
}
