import { useEffect, useState } from "react";
import { api } from "../../services/api";
import styles from "../../styles/Admin/personalizacaoProduto.module.css";

const vazioGrupo = { nome: "", slug: "", tipo: "select", obrigatoria: false, permite_valor_livre: false, ordem: 0 };
const vazioOpcao = { nome: "", descricao: "", valorAdicional: 0, aplicaAcrescimo: false, ordem: 0, visual: "" };
const modelosGrupo = [
  { nome: "Tamanho", slug: "tamanho", tipo: "select", obrigatoria: true, opcoes: ["14", "15", "16", "17", "18", "19", "20", "21", "22"] },
  { nome: "Cor do metal", slug: "cor", tipo: "radio", obrigatoria: true, opcoes: ["Ouro 18k", "Prata 925", "Ouro rosé"] },
  { nome: "Tipo de pedra", slug: "tipo_de_pedra", tipo: "radio", obrigatoria: false, opcoes: ["Sem pedra", "Diamante", "Rubi", "Esmeralda"] },
  { nome: "Gravação", slug: "gravacao", tipo: "select", obrigatoria: false, permite_valor_livre: true, opcoes: ["Sem gravação"] },
  { nome: "Acabamento", slug: "acabamento", tipo: "radio", obrigatoria: false, opcoes: ["Polido", "Fosco", "Escovado"] },
];
const authConfig = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
const extrairGrupos = (valor) => valor?.personalizacoes || valor?.grupos || valor?.personalizacoesProduto || [];

export default function PersonalizacaoProduto() {
  const [produtos, setProdutos] = useState([]);
  const [produtoId, setProdutoId] = useState("");
  const [dados, setDados] = useState(null);
  const [grupo, setGrupo] = useState(vazioGrupo);
  const [opcao, setOpcao] = useState(vazioOpcao);
  const [grupoAtivo, setGrupoAtivo] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [ativandoModelo, setAtivandoModelo] = useState("");

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
      return resposta.data || {};
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
      const { aplicaAcrescimo, valorAdicional, ...dadosOpcao } = opcao;
      await api.post(`/produtos/admin/personalizacoes/${grupoAtivo.id}/opcoes`, {
        ...dadosOpcao,
        valor_adicional: aplicaAcrescimo ? Number(valorAdicional || 0) : 0,
        visual,
      }, authConfig());
      setOpcao(vazioOpcao);
      await carregar();
      setMensagem("Opção criada.");
    } catch (error) {
      setErro(error instanceof SyntaxError ? "O visual precisa ser um JSON válido." : error.response?.data?.erro || error.response?.data?.message || "Não foi possível criar a opção.");
    }
  }

  async function ativarModelo(modelo) {
    const existente = grupos.find((item) => item.slug === modelo.slug || item.nome?.toLowerCase() === modelo.nome.toLowerCase());
    if (existente) {
      setGrupoAtivo(existente);
      setMensagem(`${modelo.nome} já está liberado nesta joia.`);
      return;
    }

    setAtivandoModelo(modelo.slug);
    setErro("");
    try {
      await api.post(`/produtos/admin/${produtoId}/personalizacoes`, { ...modelo, opcoes: undefined }, authConfig());
      const dadosAtualizados = await carregar();
      const gruposAtualizados = extrairGrupos(dadosAtualizados);
      const grupoCriado = gruposAtualizados.find((item) => item.slug === modelo.slug || item.nome?.toLowerCase() === modelo.nome.toLowerCase());
      if (grupoCriado && modelo.opcoes?.length) {
        await Promise.all(modelo.opcoes.map((nome) => api.post(`/produtos/admin/personalizacoes/${grupoCriado.id}/opcoes`, { nome, descricao: "", valor_adicional: 0, visual: null }, authConfig())));
      }
      await carregar();
      setMensagem(`${modelo.nome} foi liberado com opções prontas.`);
    } catch (error) {
      const dadosDepoisDoErro = await carregar();
      const grupoExistente = extrairGrupos(dadosDepoisDoErro).find((item) => item.slug === modelo.slug || item.nome?.toLowerCase() === modelo.nome.toLowerCase());
      if (grupoExistente) {
        setGrupoAtivo(grupoExistente);
        setErro("");
        setMensagem(`${modelo.nome} já estava liberado nesta joia.`);
        return;
      }
      setErro(error.response?.data?.erro || error.response?.data?.message || `Não foi possível liberar ${modelo.nome}.`);
    } finally {
      setAtivandoModelo("");
    }
  }

  async function removerGrupo(id) {
    if (!window.confirm("Excluir esta personalização e suas opções?")) return;
    await api.delete(`/produtos/admin/personalizacoes/${id}`, authConfig());
    if (grupoAtivo?.id === id) setGrupoAtivo(null);
    await carregar();
  }

  function aplicarModelo(modelo) {
    setGrupo({ ...vazioGrupo, ...modelo });
  }

  const grupos = extrairGrupos(dados);
  const produtoSelecionado = produtos.find((produto) => String(produto.id) === String(produtoId));

  return (
    <main className={styles.page}>
      <header><div><p className={styles.eyebrow}>CATÁLOGO DIGITAL · ATELIER</p><h1>Personalização do produto</h1><p>Libere apenas as escolhas que fazem sentido para cada joia.</p></div></header>
      <label className={styles.productField}>Produto que será personalizado<select className={styles.productSelect} value={produtoId} onChange={(event) => { setProdutoId(event.target.value); setGrupoAtivo(null); carregar(event.target.value); }}>
        <option value="">Selecione um produto</option>
        {produtos.map((produto) => <option value={produto.id} key={produto.id}>{produto.nome} · #{produto.id}</option>)}
      </select></label>
      {produtoId && <div className={styles.productContext}><div><span>EDITANDO AGORA</span><strong>{produtoSelecionado?.nome || `Produto #${produtoId}`}</strong></div><div className={styles.contextStats}><strong>{grupos.length}</strong><span>{grupos.length === 1 ? "grupo configurado" : "grupos configurados"}</span></div></div>}
      {produtoId && <div className={styles.grid}>
        <section className={styles.card}>
          <div className={styles.cardHeading}><div><span className={styles.step}>01</span><h2>Escolha as características desta joia</h2></div></div>
          <p className={styles.help}>Ative uma característica e suas opções padrão serão liberadas para este produto.</p>
          <div className={styles.templates}>{modelosGrupo.map((modelo) => { const ativo = grupos.some((item) => item.slug === modelo.slug || item.nome?.toLowerCase() === modelo.nome.toLowerCase()); return <button type="button" className={`${styles.template} ${ativo ? styles.templateActive : ""}`} key={modelo.slug} onClick={() => ativarModelo(modelo)} disabled={ativandoModelo === modelo.slug}>{ativo ? "Ativo · " : "+ "}{modelo.nome}{ativandoModelo === modelo.slug ? "..." : ""}</button>; })}</div>
          <details className={styles.customDetails}><summary>Adicionar uma característica diferente</summary>
          <form onSubmit={criarGrupo} className={styles.form}>
            <label>Nome exibido para o cliente<input required placeholder="Ex.: Tamanho do anel" value={grupo.nome} onChange={(e) => setGrupo({ ...grupo, nome: e.target.value })} /></label>
            <div className={styles.formRow}><label>Identificador interno<input placeholder="tamanho" value={grupo.slug} onChange={(e) => setGrupo({ ...grupo, slug: e.target.value })} /></label><label>Como escolher<select value={grupo.tipo} onChange={(e) => setGrupo({ ...grupo, tipo: e.target.value })}><option value="select">Lista suspensa</option><option value="radio">Uma opção</option><option value="checkbox">Várias opções</option></select></label></div>
            <div className={styles.checks}><label><input type="checkbox" checked={grupo.obrigatoria} onChange={(e) => setGrupo({ ...grupo, obrigatoria: e.target.checked })} /> Cliente precisa escolher</label><label><input type="checkbox" checked={grupo.permite_valor_livre} onChange={(e) => setGrupo({ ...grupo, permite_valor_livre: e.target.checked })} /> Aceitar texto personalizado</label></div>
            <button className={styles.primary}>Adicionar grupo de escolhas</button>
          </form>
          </details>
        </section>
        <section className={styles.card}>
          <div className={styles.cardHeading}><div><span className={styles.step}>02</span><h2>Ajuste as opções permitidas</h2></div></div>
          {!grupoAtivo ? <div className={styles.emptyPanel}>As opções padrão já foram adicionadas. Para incluir uma opção extra, clique em uma característica marcada como <strong>Ativo</strong> no bloco ao lado.</div> : <><p className={styles.help}>Adicionando uma opção extra em: <strong>{grupoAtivo.nome}</strong></p><form onSubmit={criarOpcao} className={styles.form}>
            <label>Nome da opção<input required placeholder="Ex.: Ouro 18k" value={opcao.nome} onChange={(e) => setOpcao({ ...opcao, nome: e.target.value })} /></label>
            <label className={styles.priceToggle}><input type="checkbox" checked={opcao.aplicaAcrescimo} onChange={(e) => setOpcao({ ...opcao, aplicaAcrescimo: e.target.checked })} /><span><strong>Esta opção aumenta o preço</strong><small>Marque apenas para materiais, pedras ou serviços mais caros.</small></span></label>
            <div className={styles.formRow}><label>Valor do acréscimo{opcao.aplicaAcrescimo ? <input required type="number" min="0.01" step="0.01" placeholder="Ex.: 800,00" value={opcao.valorAdicional} onChange={(e) => setOpcao({ ...opcao, valorAdicional: e.target.value })} /> : <span className={styles.noCharge}>Sem acréscimo</span>}</label><label>Descrição curta<input placeholder="Ex.: brilho quente" value={opcao.descricao} onChange={(e) => setOpcao({ ...opcao, descricao: e.target.value })} /></label></div>
            <details><summary>Configurar imagem ou cor (opcional)</summary><textarea placeholder='JSON visual: {"tipo":"material","cor":"#D4AF37"}' value={opcao.visual} onChange={(e) => setOpcao({ ...opcao, visual: e.target.value })} /></details>
            <button className={styles.primary}>Adicionar opção extra</button>
          </form></>}
        </section>
      </div>}
      {mensagem && <p className={styles.success}>{mensagem}</p>}{erro && <p className={styles.error}>{erro}</p>}
      {produtoId && <section className={styles.configured}><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>VISÃO DO ATELIER</span><h2>Escolhas liberadas para o cliente</h2></div><p>Esses grupos aparecerão na página desta joia.</p></div><section className={styles.list}>{grupos.length ? grupos.map((item) => <article className={styles.card} key={item.id}><div className={styles.row}><div><span className={styles.groupType}>{item.tipo === "checkbox" ? "VÁRIAS ESCOLHAS" : item.tipo === "radio" ? "UMA ESCOLHA" : "LISTA"}</span><h2>{item.nome}</h2></div><button type="button" className={styles.delete} onClick={() => removerGrupo(item.id)}>Excluir</button></div><ul>{(item.opcoes || []).map((op) => <li key={op.id}><span className={styles.optionName}>{op.nome}</span><span>{Number(op.valorAdicional || 0) ? `+ R$ ${Number(op.valorAdicional || 0).toFixed(2)}` : "Sem acréscimo"}</span></li>)}</ul>{!item.opcoes?.length && <p className={styles.empty}>Adicione as opções que o cliente poderá escolher.</p>}</article>) : <div className={styles.emptyPanel}>Nenhum grupo criado para esta joia ainda. Comece adicionando tamanho, cor, pedra ou outra característica.</div>}</section></section>}
    </main>
  );
}
