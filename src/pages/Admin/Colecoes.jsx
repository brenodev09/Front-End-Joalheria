// ============================================================================
//  COLEÇÕES — ADMIN AZORY
//  Caminho no seu projeto: src/pages/Admin/Colecoes.jsx
//
//  Observações:
//  - Preserva 100% da integração existente (API + 4 modais + FormData).
//  - Nenhum dado é inventado: só usa campos que a API já envia.
//  - CSS: src/styles/Admin/Colecoes.module.css
// ============================================================================

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Archive,
  Search,
  Info,
  Star,
  Gem,
  Calendar,
  Eye,
  Pin,
  BarChart3,
  Copy,
  Pencil,
  Trash2,
  Plus,
  ChevronDown,
  Sparkles,
  ArrowRight,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Percent,
} from "lucide-react";

import styles from "../../styles/Admin/Colecoes.module.css";
import { api } from "../../services/api";

import ModalAddColecoes from "../../components/Admin/Modais/ModalAddColecoes";
import DeleteCollectionModal from "../../components/Admin/Modais/ModalDeletarColecoes";
import CollectionDetailsModal from "../../components/Admin/Modais/ModalDetalhesColecoes";
import EditCollectionModal from "../../components/Admin/Modais/ModalEditarColecoes";

// ============================================================================
//  CONSTANTES
// ============================================================================

// Ajuste aqui caso seu backend rode em outra porta/host.
const API_BASE = "http://localhost:3000";

const STATUS_CONFIG = {
  ativa: {
    label: "ATIVA",
    classe: "badgeAtiva",
    thumbClasse: "thumb_ativa",
    kickerPadrao: "Coleção especial",
  },
  agendada: {
    label: "AGENDADA",
    classe: "badgeAgendada",
    thumbClasse: "thumb_agendada",
    kickerPadrao: "Homenagem",
  },
  permanente: {
    label: "PERMANENTE",
    classe: "badgePermanente",
    thumbClasse: "thumb_permanente",
    kickerPadrao: "Linha signature",
  },
  encerrada: {
    label: "ENCERRADA",
    classe: "badgeEncerrada",
    thumbClasse: "thumb_encerrada",
    kickerPadrao: "Campanha",
  },
};

const FILTROS = [
  { id: "todas", label: "Todas" },
  { id: "ativa", label: "Ativas" },
  { id: "agendada", label: "Agendadas" },
  { id: "permanente", label: "Permanentes" },
  { id: "encerrada", label: "Encerradas" },
];

// ============================================================================
//  HELPERS (puros — ficam fora do componente)
// ============================================================================

function obterStatusColecao(colecao) {
  const hoje = new Date();
  const inicio = colecao.data_inicio ? new Date(colecao.data_inicio) : null;
  const fim = colecao.data_fim ? new Date(colecao.data_fim) : null;

  if (inicio && !Number.isNaN(inicio.getTime()) && inicio > hoje) {
    return "agendada";
  }
  if (!fim && colecao.permanente) {
    return "permanente";
  }
  return colecao.ativo ? "ativa" : "encerrada";
}

function calcularDiasRestantes(data) {
  if (!data) return null;

  const alvo = new Date(data);
  if (Number.isNaN(alvo.getTime())) return null;

  const diff = Math.ceil((alvo - new Date()) / 86400000);
  return diff > 0 ? diff : 0;
}

function formatarMoeda(valor) {
  if (valor == null || Number.isNaN(Number(valor))) return "—";
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatarNumero(valor) {
  if (valor == null || Number.isNaN(Number(valor))) return "—";
  return Number(valor).toLocaleString("pt-BR");
}

function formatarPercentual(valor) {
  if (valor == null || Number.isNaN(Number(valor))) return null;
  return `${Number(valor).toLocaleString("pt-BR", {
    maximumFractionDigits: 1,
  })}%`;
}

function formatarData(data) {
  if (!data) return "Sem data";
  const d = new Date(data);
  if (Number.isNaN(d.getTime())) return "Sem data";
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatarPeriodo(inicio, fim) {
  if (!inicio && !fim) return null;

  const curto = (valor) => {
    const d = new Date(valor);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  const di = curto(inicio);
  const df = curto(fim);

  if (di && df) return `${di} – ${df}`;
  if (di) return `A partir de ${di}`;
  if (df) return `Até ${df}`;
  return null;
}

function obterImagem(imagem) {
  if (!imagem) return null;
  if (imagem.startsWith("http://") || imagem.startsWith("https://")) {
    return imagem;
  }
  return `${API_BASE}${imagem}`;
}

// Decide o bloco central do card na ordem:
// agendada > financeiro > performance > básico
function obterMetricas(colecao, status) {
  if (status === "agendada") {
    return { tipo: "agendada", dias: calcularDiasRestantes(colecao.data_inicio) };
  }

  if (colecao.receita != null) {
    return {
      tipo: "financeiro",
      titulo: status === "encerrada" ? "Resultados" : "Desempenho",
      receita: colecao.receita,
      pedidos: colecao.pedidos,
      conversao: colecao.conversao,
      metaPercentual: colecao.meta_percentual,
    };
  }

  if (colecao.visualizacoes !== undefined || colecao.vendidos !== undefined) {
    return {
      tipo: "performance",
      visualizacoes: colecao.visualizacoes,
      vendidos: colecao.vendidos,
      tendenciaVisualizacoes: colecao.tendencia_visualizacoes,
      tendenciaVendidos: colecao.tendencia_vendidos,
    };
  }

  return { tipo: "basico" };
}

// FormData reutilizável para POST/PUT (multipart).
function criarFormData({
  nome = "",
  descricao = "",
  ativo = false,
  destaque = false,
  dataInicio = "",
  dataFim = "",
  categoria = "",
  permanente = false,
  metaReceita = "",
  produtos = [],
  imagem = null,
}) {
  const fd = new FormData();

  fd.append("nome", nome);
  fd.append("descricao", descricao);
  fd.append("ativo", ativo ? "1" : "0");
  fd.append("destaque", destaque ? "1" : "0");
  fd.append("data_inicio", dataInicio || "");
  fd.append("data_fim", dataFim || "");
  fd.append("categoria", categoria || "");
  fd.append("permanente", permanente ? "1" : "0");
  fd.append("meta_receita", metaReceita || "");
  fd.append("produto_ids", JSON.stringify(produtos.map((p) => p.id)));

  if (imagem) fd.append("imagem", imagem);

  return fd;
}

function prepararColecaoParaModal(colecao) {
  if (!colecao) return null;

  const produtos = (colecao.produtos || []).map((produto) => ({
    id: produto.id,
    name: produto.nome,
    category: produto.categoria,
    material: produto.material,
    price: produto.preco != null ? Number(produto.preco) : null,
    imageUrl: obterImagem(produto.imagem),
  }));

  return {
    id: colecao.id,
    name: colecao.nome || "",
    description: colecao.descricao || "",
    imageUrl: obterImagem(colecao.imagem),
    status: colecao.ativo ? "active" : "draft",
    featured: Boolean(colecao.destaque),
    createdAt: colecao.created_at ? String(colecao.created_at).split("T")[0] : "",
    startDate: colecao.data_inicio ? String(colecao.data_inicio).split("T")[0] : "",
    endDate: colecao.data_fim ? String(colecao.data_fim).split("T")[0] : "",
    // GET /colecoes (lista) manda "quantidade_produtos" (COUNT) mas não o array;
    // GET /colecoes/:id manda o array "produtos" mas não recalcula a contagem.
    // Usamos o array quando disponível; senão caímos pro count da listagem.
    productCount: colecao.produtos ? produtos.length : colecao.quantidade_produtos || 0,
    products: produtos,
  };
}

// ============================================================================
//  COMPONENTE PRINCIPAL
// ============================================================================

export default function Colecoes() {
  const [colecoes, setColecoes] = useState([]);
  const [filtroAtivo, setFiltroAtivo] = useState("todas");
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // null | "add" | "details" | "edit" | "delete"
  const [modalAberto, setModalAberto] = useState(null);
  const [colecaoSelecionada, setColecaoSelecionada] = useState(null);

  useEffect(() => {
    carregarColecoes();
  }, []);

  // ---- DADOS ---------------------------------------------------------------

  async function carregarColecoes() {
    try {
      setCarregando(true);
      setErro("");

      const { data } = await api.get("/colecoes");

      setColecoes(
        data.map((colecao) => {
          const base = {
            ...colecao,
            quantidade_produtos: Number(colecao.quantidade_produtos) || 0,
            ativo: Number(colecao.ativo) === 1,
            destaque: Number(colecao.destaque) === 1,
            permanente: Number(colecao.permanente) === 1,
          };
          // Usa o status inteligente calculado pelo backend.
          // Mantém o cálculo local apenas como fallback.
          return { ...base, status: colecao.status || obterStatusColecao(base) };
        })
      );
    } catch (error) {
      console.error("[Colecoes] erro ao carregar:", error);
      setErro(error.response?.data?.erro || "Erro ao carregar coleções.");
    } finally {
      setCarregando(false);
    }
  }

  // ---- MODAIS --------------------------------------------------------------

  // A listagem (GET /colecoes) só traz "quantidade_produtos" (contagem),
  // e não o array de produtos em si — isso vem apenas de GET /colecoes/:id.
  // Por isso, para os modais que precisam listar os produtos (detalhes/edição),
  // buscamos a coleção completa antes de abrir o modal.
  async function abrirModal(tipo, colecao = null) {
    setModalAberto(tipo);
    setColecaoSelecionada(colecao);

    if ((tipo === "details" || tipo === "edit") && colecao?.id) {
      try {
        const { data } = await api.get(`/colecoes/${colecao.id}`);
        setColecaoSelecionada(data);
      } catch (error) {
        console.error("Erro ao carregar detalhes da coleção:", error);
        // mantém os dados resumidos da listagem como fallback
      }
    }
  }

  function fecharModal() {
    setModalAberto(null);
    setColecaoSelecionada(null);
  }

  // ---- CRUD ----------------------------------------------------------------

  // O ModalAddColecoes já faz o POST /colecoes sozinho (ele precisa do
  // multipart/form-data com a imagem + produtos escolhidos passo a passo).
  // Aqui só recebemos a coleção já criada e atualizamos a lista — nunca
  // criamos de novo, senão a coleção fica duplicada no banco.
  async function adicionarColecao() {
    await carregarColecoes();
    fecharModal();
  }

  async function salvarEdicao(dados) {
    if (!colecaoSelecionada) return;

    try {
      // O modal de edição só expõe nome/descrição/datas/status/destaque.
      // Os demais campos (tipo, categoria, meta) não são reenviados por lá,
      // então mantemos os valores que a coleção já tinha para não apagá-los.
      const formData = criarFormData({
        nome: dados.name,
        descricao: dados.description,
        ativo: dados.status === "active",
        destaque: dados.featured,
        dataInicio: dados.startDate,
        dataFim: dados.endDate,
        categoria: dados.category ?? colecaoSelecionada.categoria,
        permanente: dados.permanent ?? colecaoSelecionada.permanente,
        metaReceita: dados.revenueGoal ?? colecaoSelecionada.meta_receita,
      });

      await api.put(`/colecoes/${colecaoSelecionada.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await carregarColecoes();
      fecharModal();
    } catch (error) {
      console.error("[Colecoes] erro ao editar:", error);
      alert(error.response?.data?.erro || "Erro ao editar coleção.");
    }
  }

  async function confirmarExclusao() {
    if (!colecaoSelecionada) return;

    try {
      await api.delete(`/colecoes/${colecaoSelecionada.id}`);
      setColecoes((atual) =>
        atual.filter((item) => item.id !== colecaoSelecionada.id)
      );
      fecharModal();
    } catch (error) {
      console.error("[Colecoes] erro ao excluir:", error);
      alert(error.response?.data?.erro || "Erro ao excluir coleção.");
    }
  }

  async function duplicarColecao(colecao) {
    if (!window.confirm(`Deseja duplicar a coleção "${colecao.nome}"?`)) return;

    try {
      // O backend exige pelo menos 1 produto para criar uma coleção,
      // então buscamos os produtos da coleção original antes de duplicar.
      const { data: colecaoCompleta } = await api.get(`/colecoes/${colecao.id}`);
      const produtosOriginais = (colecaoCompleta.produtos || []).map((p) => ({
        id: p.id,
      }));

      if (produtosOriginais.length === 0) {
        alert("Não é possível duplicar: esta coleção não tem produtos.");
        return;
      }

      const formData = criarFormData({
        nome: `${colecao.nome} - Cópia`,
        descricao: colecao.descricao,
        ativo: false,
        destaque: colecao.destaque,
        dataInicio: colecao.data_inicio,
        dataFim: colecao.data_fim,
        categoria: colecao.categoria,
        permanente: colecao.permanente,
        metaReceita: colecao.meta_receita,
        produtos: produtosOriginais,
      });

      await api.post("/colecoes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await carregarColecoes();
    } catch (error) {
      console.error("[Colecoes] erro ao duplicar:", error);
      alert(error.response?.data?.erro || "Erro ao duplicar coleção.");
    }
  }

  // ---- DERIVADOS -----------------------------------------------------------

  const colecoesFiltradas = useMemo(() => {
    const termo = busca.toLowerCase().trim();
    return colecoes.filter((colecao) => {
      const okFiltro = filtroAtivo === "todas" || colecao.status === filtroAtivo;
      const okBusca = !termo || colecao.nome?.toLowerCase().includes(termo);
      return okFiltro && okBusca;
    });
  }, [colecoes, filtroAtivo, busca]);

  const totalProdutos = useMemo(
    () => colecoes.reduce((total, item) => total + item.quantidade_produtos, 0),
    [colecoes]
  );

  const quantidadeAtivas = colecoes.filter((i) => i.status === "ativa").length;
  const quantidadeEncerradas = colecoes.filter((i) => i.status === "encerrada").length;
  const quantidadeDestaques = colecoes.filter((i) => i.destaque).length;

  const resumo = [
    {
      titulo: "Ativas",
      valor: quantidadeAtivas,
      descricao: "Coleções ativas agora",
      icone: CheckCircle2,
      tone: "tone_verde",
    },
    {
      titulo: "Em destaque",
      valor: quantidadeDestaques,
      descricao: "Coleções destacadas",
      icone: Star,
      tone: "tone_ouro",
    },
    {
      titulo: "Produtos",
      valor: totalProdutos,
      descricao: "Produtos vinculados",
      icone: Gem,
      tone: "tone_ouro",
    },
    {
      titulo: "Encerradas",
      valor: quantidadeEncerradas,
      descricao: "Coleções desativadas",
      icone: Archive,
      tone: "tone_neutro",
    },
  ];

  const proximasColecoes = useMemo(
    () =>
      colecoes
        .filter((item) => item.status === "agendada" && item.data_inicio)
        .sort((a, b) => new Date(a.data_inicio) - new Date(b.data_inicio))
        .slice(0, 3),
    [colecoes]
  );

  const estatisticasGerais = useMemo(() => {
    const comReceita = colecoes.filter((i) => i.receita != null);
    const comConversao = colecoes.filter((i) => i.conversao != null);

    const receitaTotal = comReceita.reduce(
      (t, i) => t + Number(i.receita || 0),
      0
    );
    const pedidosTotal = colecoes.reduce((t, i) => t + Number(i.pedidos || 0), 0);
    const vendidosTotal = colecoes.reduce((t, i) => t + Number(i.vendidos || 0), 0);
    const conversaoMedia = comConversao.length
      ? comConversao.reduce((t, i) => t + Number(i.conversao), 0) / comConversao.length
      : null;

    return {
      temDados: comReceita.length > 0,
      receitaTotal,
      pedidosTotal,
      vendidosTotal,
      conversaoMedia,
    };
  }, [colecoes]);

  // ---- RENDER --------------------------------------------------------------

  return (
    <div className={styles.pagina}>
      {/* CABEÇALHO */}
      <header className={styles.cabecalho}>
        <div className={styles.tituloBloco}>
          <h1 className={styles.titulo}>Coleções</h1>
          <p className={styles.subtitulo}>Gerencie suas coleções e campanhas.</p>
        </div>

        <div className={styles.acoesTopo}>
          <div className={styles.campoPesquisa}>
            <Search size={16} strokeWidth={1.8} />
            <input
              type="text"
              placeholder="Buscar coleção..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <button
            className={styles.botaoNovaColecao}
            onClick={() => abrirModal("add")}
          >
            <Plus size={16} />
            <p>  Nova coleção</p>
          </button>
        </div>
      </header>

      {/* RESUMO */}
      <section className={styles.cartoesResumo}>
        {resumo.map((item) => {
          const Icone = item.icone;
          return (
            <div key={item.titulo} className={styles.cartaoResumo}>
              <div className={styles.cabecalhoResumo}>
                <span className={`${styles.iconeResumo} ${styles[item.tone]}`}>
                  <Icone size={17} strokeWidth={1.8} />
                </span>
                <span className={styles.rotuloResumo}>{item.titulo}</span>
              </div>

              <strong className={styles.numeroResumo}>{item.valor}</strong>
              <p className={styles.descricaoResumo}>{item.descricao}</p>
            </div>
          );
        })}
      </section>

      {/* CORPO */}
      <div className={styles.corpoPrincipal}>
        <div className={styles.colunaEsquerda}>
          {/* FILTROS */}
          <div className={styles.barraFiltros}>
            <div className={styles.filtros}>
              {FILTROS.map((filtro) => (
                <button
                  key={filtro.id}
                  className={`${styles.botaoFiltro} ${
                    filtroAtivo === filtro.id ? styles.botaoFiltroAtivo : ""
                  }`}
                  onClick={() => setFiltroAtivo(filtro.id)}
                >
                  {filtro.label}
                </button>
              ))}
            </div>

            <span className={styles.infoOrdenacao}>
              Ordenação automática
              <Info size={13} />
            </span>
          </div>

          {/* LISTA */}
          <div className={styles.listaColecoes}>
            {carregando && (
              <div className={styles.listaVazia}>Carregando coleções...</div>
            )}

            {!carregando && erro && (
              <div className={styles.listaVazia}>{erro}</div>
            )}

            {!carregando && !erro && colecoesFiltradas.length === 0 && (
              <div className={styles.listaVazia}>
                Nenhuma coleção encontrada para esse filtro.
              </div>
            )}

            {!carregando &&
              !erro &&
              colecoesFiltradas.map((colecao) => {
                const config =
                  STATUS_CONFIG[colecao.status] || STATUS_CONFIG.encerrada;
                const metricas = obterMetricas(colecao, colecao.status);
                const periodo = formatarPeriodo(
                  colecao.data_inicio,
                  colecao.data_fim
                );

                return (
                  <article key={colecao.id} className={styles.cartaoColecao}>
                    {/* IMAGEM */}
                    <div
                      className={`${styles.thumbColecao} ${
                        styles[config.thumbClasse]
                      }`}
                    >
                      {colecao.imagem ? (
                        <img
                          src={obterImagem(colecao.imagem)}
                          alt={colecao.nome}
                          className={styles.imagemColecao}
                        />
                      ) : (
                        <>
                          <span className={styles.thumbOverlay} />
                          <Sparkles className={styles.sparkleThumb} size={16} />
                          <span className={styles.marcaThumb}>AZORY</span>
                        </>
                      )}

                      <span
                        className={`${styles.badgeStatusThumb} ${
                          styles[config.classe]
                        }`}
                      >
                        {config.label}
                      </span>
                    </div>

                    {/* CONTEÚDO */}
                    <div className={styles.conteudoColecao}>
                      <span className={styles.kickerColecao}>
                        {colecao.categoria || config.kickerPadrao}
                      </span>

                      <div className={styles.linhaTitulo}>
                        <h3 className={styles.nomeColecao}>{colecao.nome}</h3>

                        {colecao.destaque && (
                          <span className={styles.tagNova}>
                            <Star size={11} fill="currentColor" />
                            {colecao.status === "permanente"
                              ? "Best-seller"
                              : "Nova"}
                          </span>
                        )}
                      </div>

                      <p className={styles.subtituloColecao}>
                        {colecao.descricao || "Sem descrição cadastrada."}
                      </p>

                      <div className={styles.metaColecao}>
                        <span className={styles.chipMeta}>
                          <Gem size={13} />
                          {colecao.quantidade_produtos} produtos
                        </span>

                        {colecao.status === "permanente" ? (
                          <span className={styles.chipMeta}>
                            <Pin size={13} />
                            Coleção fixa
                          </span>
                        ) : periodo ? (
                          <span className={styles.chipMeta}>
                            <Calendar size={13} />
                            {periodo}
                          </span>
                        ) : (
                          <span className={styles.chipMeta}>
                            <Calendar size={13} />
                            Criada em {formatarData(colecao.created_at)}
                          </span>
                        )}

                        {colecao.visualizacoes != null &&
                          metricas.tipo !== "performance" && (
                            <span className={styles.chipMeta}>
                              <Eye size={13} />
                              {formatarNumero(colecao.visualizacoes)}
                            </span>
                          )}
                      </div>
                    </div>

                    {/* MÉTRICAS */}
                    <div className={styles.metricasColecao}>
                      {metricas.tipo === "agendada" && (
                        <div className={styles.blocoInicioAgendada}>
                          <span className={styles.cabecalhoMetricas}>
                            Lançamento em
                          </span>
                          <strong className={styles.valorInicioAgendada}>
                            {metricas.dias ?? "—"}
                          </strong>
                          <span className={styles.textoMeta}>
                            {metricas.dias === 1 ? "dia" : "dias"}
                          </span>
                        </div>
                      )}

                      {metricas.tipo === "financeiro" && (
                        <>
                          <span className={styles.cabecalhoMetricas}>
                            {metricas.titulo}
                          </span>

                          <div className={styles.linhaMetricasAtiva}>
                            <div className={styles.metricaItem}>
                              <span className={styles.rotuloMetrica}>Receita</span>
                              <span
                                className={`${styles.valorMetrica} ${styles.valorDestaque}`}
                              >
                                {formatarMoeda(metricas.receita)}
                              </span>
                            </div>

                            <div className={styles.miniChip}>
                              <span className={styles.rotuloMetrica}>Pedidos</span>
                              <span className={styles.valorMetrica}>
                                {formatarNumero(metricas.pedidos)}
                              </span>
                            </div>

                            <div className={styles.miniChip}>
                              <span className={styles.rotuloMetrica}>Conv.</span>
                              <span className={styles.valorMetrica}>
                                {formatarPercentual(metricas.conversao) ?? "—"}
                              </span>
                            </div>
                          </div>

                          {metricas.metaPercentual != null && (
                            <>
                              <div className={styles.barraProgresso}>
                                <span
                                  className={styles.barraProgressoFill}
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      Math.max(0, Number(metricas.metaPercentual))
                                    )}%`,
                                  }}
                                />
                              </div>
                              <span className={styles.textoMeta}>
                                {formatarPercentual(metricas.metaPercentual)} da meta
                              </span>
                            </>
                          )}
                        </>
                      )}

                      {metricas.tipo === "performance" && (
                        <>
                          <span className={styles.cabecalhoMetricas}>
                            Performance
                          </span>

                          <div className={styles.linhaMetricas}>
                            <div className={styles.metricaItem}>
                              <span className={styles.rotuloMetrica}>
                                Visualizações
                              </span>
                              <span className={styles.valorMetrica}>
                                {formatarNumero(metricas.visualizacoes)}
                              </span>
                              {metricas.tendenciaVisualizacoes !== undefined && (
                                <span className={styles.tendencia}>
                                  <TrendingUp size={11} />
                                  {formatarPercentual(
                                    metricas.tendenciaVisualizacoes
                                  )}
                                </span>
                              )}
                            </div>

                            <div className={styles.metricaItem}>
                              <span className={styles.rotuloMetrica}>Vendidos</span>
                              <span className={styles.valorMetrica}>
                                {formatarNumero(metricas.vendidos)}
                              </span>
                              {metricas.tendenciaVendidos !== undefined && (
                                <span className={styles.tendencia}>
                                  <TrendingUp size={11} />
                                  {formatarPercentual(metricas.tendenciaVendidos)}
                                </span>
                              )}
                            </div>
                          </div>
                        </>
                      )}

                      {metricas.tipo === "basico" && (
                        <>
                          <span className={styles.cabecalhoMetricas}>
                            Informações
                          </span>

                          <div className={styles.linhaMetricas}>
                            <div className={styles.metricaItem}>
                              <span className={styles.rotuloMetrica}>Produtos</span>
                              <span className={styles.valorMetrica}>
                                {colecao.quantidade_produtos}
                              </span>
                            </div>

                            <div className={styles.metricaItem}>
                              <span className={styles.rotuloMetrica}>Criada em</span>
                              <span className={styles.valorMetrica}>
                                {formatarData(colecao.created_at)}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* AÇÕES */}
                    <div className={styles.colunaAcoes}>
                      <button
                        className={styles.botaoVerDetalhes}
                        onClick={() => abrirModal("details", colecao)}
                      >
                        Ver detalhes
                        <ArrowRight size={15} />
                      </button>

                      <div className={styles.acoesColecao}>
                       

                        <button
                          className={styles.botaoAcao}
                          title="Duplicar"
                          onClick={() => duplicarColecao(colecao)}
                        >
                          <Copy size={16} />
                        </button>

                        <button
                          className={styles.botaoAcao}
                          title="Editar"
                          onClick={() => abrirModal("edit", colecao)}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className={`${styles.botaoAcao} ${styles.botaoAcaoExcluir}`}
                          title="Excluir"
                          onClick={() => abrirModal("delete", colecao)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
          </div>
        </div>

        {/* LATERAL */}
        <aside className={styles.colunaLateral}>
          {/* PRÓXIMAS COLEÇÕES */}
          <div className={styles.blocoLateral}>
            <h3 className={styles.tituloBlocoLateral}>
              <Sparkles size={16} className={styles.iconeTituloLateral} />
              Próximas coleções
            </h3>

            {proximasColecoes.length === 0 ? (
              <p className={styles.descricaoResumo}>
                Nenhuma coleção agendada no momento.
              </p>
            ) : (
              <ul className={styles.listaProximas}>
                {proximasColecoes.map((colecao) => (
                  <li key={colecao.id} className={styles.itemProxima}>
                    <div className={styles.thumbProxima}>
                      {colecao.imagem && (
                        <img src={obterImagem(colecao.imagem)} alt="" />
                      )}
                    </div>

                    <div className={styles.infoProxima}>
                      <span className={styles.nomeProxima}>{colecao.nome}</span>
                      <span className={styles.dataProxima}>
                        {formatarData(colecao.data_inicio)}
                      </span>
                    </div>

                    <span className={styles.badgeDiasProxima}>
                      {calcularDiasRestantes(colecao.data_inicio)} dias
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <button
              className={styles.botaoSecundario}
              onClick={() => setFiltroAtivo("agendada")}
            >
              Ver todas as agendadas
              <ArrowRight size={14} />
            </button>
          </div>

          {/* ESTATÍSTICAS */}
          <div className={styles.blocoLateral}>
            <div className={styles.cabecalhoBlocoLateral}>
              <h3 className={styles.tituloBlocoLateral}>Estatísticas gerais</h3>

              <button className={styles.seletorPeriodo}>
                Este ano
                <ChevronDown size={14} />
              </button>
            </div>

            {estatisticasGerais.temDados ? (
              <div className={styles.gridEstatisticas}>
                <Estatistica
                  icone={DollarSign}
                  titulo="Receita total"
                  valor={formatarMoeda(estatisticasGerais.receitaTotal)}
                  styles={styles}
                />
                <Estatistica
                  icone={ShoppingCart}
                  titulo="Pedidos"
                  valor={formatarNumero(estatisticasGerais.pedidosTotal)}
                  styles={styles}
                />
                <Estatistica
                  icone={Gem}
                  titulo="Produtos vendidos"
                  valor={formatarNumero(estatisticasGerais.vendidosTotal)}
                  styles={styles}
                />
                <Estatistica
                  icone={Percent}
                  titulo="Conversão média"
                  valor={formatarPercentual(estatisticasGerais.conversaoMedia) ?? "—"}
                  styles={styles}
                />
              </div>
            ) : (
              <div className={styles.gridEstatisticas}>
                <Estatistica
                  icone={Gem}
                  titulo="Coleções"
                  valor={colecoes.length}
                  styles={styles}
                />
                <Estatistica
                  icone={ShoppingCart}
                  titulo="Produtos vinculados"
                  valor={totalProdutos}
                  styles={styles}
                />
                <Estatistica
                  icone={Star}
                  titulo="Em destaque"
                  valor={quantidadeDestaques}
                  styles={styles}
                />
                <Estatistica
                  icone={CheckCircle2}
                  titulo="Ativas"
                  valor={quantidadeAtivas}
                  styles={styles}
                />
              </div>
            )}

            <button className={styles.botaoPrimarioLateral}>
              <BarChart3 size={15} />
              Ver relatório completo
            </button>
          </div>
        </aside>
      </div>

      {/* MODAIS */}
      {modalAberto === "add" && (
        <ModalAddColecoes
          aberto
          onFechar={fecharModal}
          onSalvar={adicionarColecao}
        />
      )}

      {modalAberto === "details" && colecaoSelecionada && (
        <CollectionDetailsModal
          collection={prepararColecaoParaModal(colecaoSelecionada)}
          onClose={fecharModal}
          onEdit={() => abrirModal("edit", colecaoSelecionada)}
        />
      )}

      {modalAberto === "edit" && colecaoSelecionada && (
        <EditCollectionModal
          collection={prepararColecaoParaModal(colecaoSelecionada)}
          onCancel={fecharModal}
          onSave={salvarEdicao}
        />
      )}

      {modalAberto === "delete" && colecaoSelecionada && (
        <DeleteCollectionModal
          collection={{
            name: colecaoSelecionada.nome || "",
            productCount: colecaoSelecionada.quantidade_produtos || 0,
          }}
          onCancel={fecharModal}
          onConfirm={confirmarExclusao}
        />
      )}
    </div>
  );
}

// ============================================================================
//  SUBCOMPONENTE — ESTATÍSTICA
// ============================================================================

function Estatistica({ icone: Icone, titulo, valor, styles }) {
  return (
    <div className={styles.estatisticaItem}>
      <span className={styles.cabecalhoEstatistica}>
        <span className={styles.iconeEstatistica}>
          <Icone size={14} />
        </span>
        {titulo}
      </span>

      <span className={styles.valorEstatistica}>{valor}</span>
    </div>
  );
}