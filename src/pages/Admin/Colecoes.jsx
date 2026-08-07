
  import styles from "../../styles/Admin/Colecoes.module.css";
import { useState } from "react";
import {
  CheckCircle2,
  CalendarClock,
  Bookmark,
  Archive,
  Search,
  Info,
  Star,
  Gem,
  Calendar,
  Eye,
  BarChart3,
  Copy,
  Pencil,
  Trash2,
  Plus,
  ChevronDown,
} from "lucide-react";


// ---------------------------------------------------------------------------
// Dados mockados
// ---------------------------------------------------------------------------

const resumoData = [
  { id: "ativas", label: "Ativas", valor: 3, descricao: "Coleções ativas agora", Icone: CheckCircle2, cor: "#4ade80" },
  { id: "agendadas", label: "Agendadas", valor: 4, descricao: "Próximas coleções", Icone: CalendarClock, cor: "#f5b544" },
  { id: "permanentes", label: "Permanentes", valor: 6, descricao: "Coleções fixas", Icone: Bookmark, cor: "#5aa9ff" },
  { id: "encerradas", label: "Encerradas", valor: 12, descricao: "Histórico de coleções", Icone: Archive, cor: "#c8a24b" },
];

const colecoesData = [
  {
    id: 1,
    nome: "Dia dos Pais",
    nova: true,
    descricao: "Coleção especial para o Dia dos Pais com peças exclusivas.",
    produtos: 18,
    periodo: "08/08/2026 até 15/08/2026",
    visualizacoes: 8432,
    status: "ativa",
    receita: "R$ 54.380,00",
    pedidos: 217,
    conversao: "3,8%",
    corThumb: "linear-gradient(135deg, #3a2f16 0%, #1a1509 100%)",
  },
  {
    id: 2,
    nome: "Dia das Mães 2026",
    nova: false,
    descricao: "Homenageie com amor. Peças que eternizam momentos.",
    produtos: 22,
    periodo: "10/05/2026 até 17/05/2026",
    status: "agendada",
    diasRestantes: 92,
    corThumb: "linear-gradient(135deg, #8a6d2a 0%, #3a2f16 100%)",
  },
  {
    id: 3,
    nome: "Coleção Clássica",
    nova: false,
    descricao: "Peças atemporais que nunca saem de moda.",
    produtos: 35,
    periodo: "Coleção permanente",
    visualizacoes: 12532,
    produtosVendidos: 1248,
    status: "permanente",
    corThumb: "linear-gradient(135deg, #2a2a2a 0%, #101010 100%)",
  },
  {
    id: 4,
    nome: "Black Friday 2025",
    nova: false,
    descricao: "Ofertas exclusivas de Black Friday.",
    produtos: 28,
    periodo: "20/11/2025 até 30/11/2025",
    status: "encerrada",
    receita: "R$ 78.920,00",
    pedidos: 312,
    conversao: "4,2%",
    corThumb: "linear-gradient(135deg, #1f1f1f 0%, #0a0a0a 100%)",
  },
];

const proximasColecoesData = [
  { id: "p1", nome: "Dia das Mães 2026", inicio: "Início: 10/05/2026 00:00", diasRestantes: 92, corThumb: "linear-gradient(135deg, #8a6d2a 0%, #3a2f16 100%)" },
  { id: "p2", nome: "Namorados 2026", inicio: "Início: 01/06/2026 00:00", diasRestantes: 114, corThumb: "linear-gradient(135deg, #7a2020 0%, #2a0a0a 100%)" },
  { id: "p3", nome: "Coleção Inverno", inicio: "Início: 21/06/2026 00:00", diasRestantes: 134, corThumb: "linear-gradient(135deg, #3a3a3a 0%, #141414 100%)" },
];

const estatisticasGerais = [
  { label: "Receita total", valor: "R$ 325.890,00", destaque: true },
  { label: "Pedidos", valor: "1.248" },
  { label: "Produtos vendidos", valor: "2.847" },
  { label: "Conversão média", valor: "4,1%" },
];

const statusInfo = {
  ativa: { label: "ATIVA", classe: "badgeAtiva" },
  agendada: { label: "AGENDADA", classe: "badgeAgendada" },
  permanente: { label: "PERMANENTE", classe: "badgePermanente" },
  encerrada: { label: "ENCERRADA", classe: "badgeEncerrada" },
};

const filtrosDisponiveis = [
  { id: "todas", label: "Todas" },
  { id: "ativa", label: "Ativas" },
  { id: "agendada", label: "Agendadas" },
  { id: "permanente", label: "Permanentes" },
  { id: "encerrada", label: "Encerradas" },
];

export default function Colecoes() {
  const [filtroAtivo, setFiltroAtivo] = useState("todas");
  const [busca, setBusca] = useState("");

  const colecoesFiltradas = colecoesData.filter((c) => {
    const combinaFiltro = filtroAtivo === "todas" || c.status === filtroAtivo;
    const combinaBusca = c.nome.toLowerCase().includes(busca.toLowerCase());
    return combinaFiltro && combinaBusca;
  });

  return (
    <div className={styles.pagina}>
      {/* ================= CABEÇALHO ================= */}
      <header className={styles.cabecalho}>
        <div>
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

          <button className={styles.botaoNovaColecao}>
            <Plus size={16} strokeWidth={2.2} />
            Nova coleção
          </button>
        </div>
      </header>

      {/* ================= CARTÕES DE RESUMO ================= */}
      <section className={styles.cartoesResumo}>
        {resumoData.map((item) => {
          const Icone = item.Icone;
          return (
            <div key={item.id} className={styles.cartaoResumo}>
              <div className={styles.cabecalhoResumo}>
                <Icone size={18} strokeWidth={1.8} style={{ color: item.cor }} />
                <span className={styles.rotuloResumo} style={{ color: item.cor }}>
                  {item.label}
                </span>
              </div>
              <strong className={styles.numeroResumo}>{item.valor}</strong>
              <p className={styles.descricaoResumo}>{item.descricao}</p>
            </div>
          );
        })}
      </section>

      {/* ================= CORPO PRINCIPAL ================= */}
      <div className={styles.corpoPrincipal}>
        {/* ---------- COLUNA ESQUERDA ---------- */}
        <div className={styles.colunaEsquerda}>
          {/* Filtros */}
          <div className={styles.barraFiltros}>
            <div className={styles.filtros}>
              {filtrosDisponiveis.map((f) => (
                <button
                  key={f.id}
                  className={`${styles.botaoFiltro} ${
                    filtroAtivo === f.id ? styles.botaoFiltroAtivo : ""
                  }`}
                  onClick={() => setFiltroAtivo(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <span className={styles.infoOrdenacao}>
              Ordenação automática
              <Info size={13} strokeWidth={1.8} />
            </span>
          </div>

          {/* Lista de coleções */}
          <div className={styles.listaColecoes}>
            {colecoesFiltradas.length === 0 && (
              <div className={styles.listaVazia}>
                Nenhuma coleção encontrada para esse filtro.
              </div>
            )}

            {colecoesFiltradas.map((colecao) => {
              const status = statusInfo[colecao.status];
              return (
                <article key={colecao.id} className={styles.cartaoColecao}>
                  {/* Thumbnail */}
                  <div
                    className={styles.thumbColecao}
                    style={{ background: colecao.corThumb }}
                  >
                    <span
                      className={`${styles.badgeStatusThumb} ${styles[status.classe]}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  {/* Conteúdo */}
                  <div className={styles.conteudoColecao}>
                    <div className={styles.linhaTitulo}>
                      <h3 className={styles.nomeColecao}>{colecao.nome}</h3>
                      {colecao.nova && (
                        <span className={styles.tagNova}>
                          <Star size={11} strokeWidth={2} fill="currentColor" />
                          NOVA
                        </span>
                      )}
                    </div>

                    <p className={styles.descricaoColecao}>{colecao.descricao}</p>

                    <div className={styles.metaColecao}>
                      <span className={styles.metaItem}>
                        <Gem size={13} />
                        {colecao.produtos} produtos
                      </span>

                      <span className={styles.metaItem}>
                        <Calendar size={13} />
                        {colecao.periodo}
                      </span>

                      {colecao.status === "ativa" && (
                        <span className={styles.metaItem}>
                          <Eye size={13} />
                          {colecao.visualizacoes.toLocaleString("pt-BR")}
                        </span>
                      )}

                      {colecao.status === "agendada" && (
                        <span className={styles.pillFaltam}>
                          Faltam {colecao.diasRestantes} dias
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Métricas */}
                  <div className={styles.metricasColecao}>
                    {colecao.status === "agendada" && (
                      <div className={styles.blocoInicioAgendada}>
                        <span className={styles.rotuloMetrica}>Início em</span>
                        <strong className={styles.valorInicioAgendada}>
                          {colecao.diasRestantes} dias
                        </strong>
                      </div>
                    )}

                    {(colecao.status === "ativa" || colecao.status === "encerrada") && (
                      <>
                        <div className={styles.metricaItem}>
                          <span className={styles.rotuloMetrica}>Receita</span>
                          <span className={`${styles.valorMetrica} ${styles.valorDestaque}`}>
                            {colecao.receita}
                          </span>
                        </div>
                        <div className={styles.metricaItem}>
                          <span className={styles.rotuloMetrica}>Pedidos</span>
                          <span className={styles.valorMetrica}>{colecao.pedidos}</span>
                        </div>
                        <div className={styles.metricaItem}>
                          <span className={styles.rotuloMetrica}>Conversão</span>
                          <span className={styles.valorMetrica}>{colecao.conversao}</span>
                        </div>
                      </>
                    )}

                    {colecao.status === "permanente" && (
                      <>
                        <div className={styles.metricaItem}>
                          <span className={styles.rotuloMetrica}>Visualizações</span>
                          <span className={styles.valorMetrica}>
                            {colecao.visualizacoes.toLocaleString("pt-BR")}
                          </span>
                        </div>
                        <div className={styles.metricaItem}>
                          <span className={styles.rotuloMetrica}>Vendidos</span>
                          <span className={styles.valorMetrica}>
                            {colecao.produtosVendidos.toLocaleString("pt-BR")}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Ações */}
                  <div className={styles.acoesColecao}>
                    <button className={styles.botaoAcao}>
                      <BarChart3 size={16} />
                    </button>
                    <button className={styles.botaoAcao}>
                      <Copy size={16} />
                    </button>
                    <button className={styles.botaoAcao}>
                      <Pencil size={16} />
                    </button>
                    <button className={`${styles.botaoAcao} ${styles.botaoAcaoExcluir}`}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* ---------- COLUNA LATERAL ---------- */}
        <aside className={styles.colunaLateral}>
          {/* Próximas coleções */}
          <div className={styles.blocoLateral}>
            <h3 className={styles.tituloBlocoLateral}>Próximas coleções</h3>

            <ul className={styles.listaProximas}>
              {proximasColecoesData.map((c) => (
                <li key={c.id} className={styles.itemProxima}>
                  <div
                    className={styles.thumbProxima}
                    style={{ background: c.corThumb }}
                  />
                  <div className={styles.infoProxima}>
                    <span className={styles.nomeProxima}>{c.nome}</span>
                    <span className={styles.dataProxima}>{c.inicio}</span>
                  </div>
                  <span className={styles.badgeDiasProxima}>
                    Faltam {c.diasRestantes} dias
                  </span>
                </li>
              ))}
            </ul>

            <button className={styles.botaoVerTodas}>Ver todas agendadas</button>
          </div>

          {/* Estatísticas gerais */}
          <div className={styles.blocoLateral}>
            <div className={styles.cabecalhoBlocoLateral}>
              <h3 className={styles.tituloBlocoLateral}>Estatísticas gerais</h3>
              <button className={styles.seletorPeriodo}>
                Este ano
                <ChevronDown size={14} strokeWidth={2} />
              </button>
            </div>

            <div className={styles.gridEstatisticas}>
              {estatisticasGerais.map((item) => (
                <div key={item.label} className={styles.estatisticaItem}>
                  <span className={styles.rotuloEstatistica}>{item.label}</span>
                  <span
                    className={`${styles.valorEstatistica} ${
                      item.destaque ? styles.valorEstatisticaDestaque : ""
                    }`}
                  >
                    {item.valor}
                  </span>
                </div>
              ))}
            </div>

            <button className={styles.botaoRelatorio}>Ver relatório completo</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

