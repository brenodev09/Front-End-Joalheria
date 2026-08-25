import { useCallback, useEffect, useState } from "react";
import { Bell, CheckCircle2, Clock3, RefreshCw, XCircle } from "lucide-react";
import { api } from "../../services/api";
import styles from "../../styles/Admin/notificacoes.module.css";

const TIPOS = {
  pagamento_aprovado: {
    titulo: "Pagamento aprovado",
    icone: CheckCircle2,
    classe: "sucesso",
  },
  compra_realizada: {
    titulo: "Nova compra",
    icone: CheckCircle2,
    classe: "sucesso",
  },
  pagamento_pendente: {
    titulo: "Pagamento pendente",
    icone: Clock3,
    classe: "pendente",
  },
  pedido_cancelado: {
    titulo: "Pedido cancelado",
    icone: XCircle,
    classe: "cancelado",
  },
};

function textoAtividade(atividade) {
  if (atividade.mensagem) return atividade.mensagem;

  const cliente = atividade.cliente || atividade.nome_cliente || "Um cliente";
  const produto = atividade.produto || atividade.nome_produto || "um produto";
  const textos = {
    pagamento_aprovado: `${cliente} efetuou o pagamento e comprou ${produto}`,
    compra_realizada: `${cliente} realizou uma nova compra de ${produto}`,
    pagamento_pendente: `${cliente} ainda não efetuou o pagamento do pedido`,
    pedido_cancelado: `${cliente} cancelou o pedido`,
  };

  return textos[atividade.tipo] || "Uma nova atividade foi registrada";
}

function formatarData(data) {
  if (!data) return "Agora";
  return new Date(data).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Notificacoes() {
  const [atividades, setAtividades] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregarAtividades = useCallback(async () => {
    try {
      setErro("");
      const resposta = await api.get("/dashboard/atividades-recentes");
      const dados = Array.isArray(resposta.data)
        ? resposta.data
        : resposta.data?.atividades || [];
      setAtividades(dados);
    } catch (error) {
      setErro("Não foi possível carregar as notificações.");
      console.error("Erro ao carregar notificações:", error.response?.data || error);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarAtividades();
    const intervalo = setInterval(carregarAtividades, 30000);
    return () => clearInterval(intervalo);
  }, [carregarAtividades]);

  return (
    <>
      <main className={styles.pagina}>
        <header className={styles.cabecalhoPagina}>
          <div>
            <p className={styles.rotulo}>CENTRAL DO ADMINISTRADOR</p>
            <h1>Notificações</h1>
            <p className={styles.subtitulo}>
              Acompanhe os principais acontecimentos dos pedidos da loja.
            </p>
          </div>
          <button type="button" className={styles.atualizar} onClick={carregarAtividades} disabled={carregando}>
            <RefreshCw size={16} />
            Atualizar
          </button>
        </header>

        <section className={styles.painel} aria-live="polite">
          <div className={styles.tituloPainel}>
            <span className={styles.iconeTitulo}><Bell size={19} /></span>
            <div>
              <h2>Atividades recentes</h2>
              <p>Novos eventos aparecem automaticamente nesta lista.</p>
            </div>
          </div>

          {carregando ? (
            <p className={styles.estado}>Carregando notificações...</p>
          ) : erro ? (
            <div className={styles.estadoErro}>
              <p>{erro}</p>
              <button type="button" onClick={carregarAtividades}>Tentar novamente</button>
            </div>
          ) : atividades.length === 0 ? (
            <p className={styles.estado}>Nenhuma atividade recente.</p>
          ) : (
            <div className={styles.lista}>
              {atividades.map((atividade, index) => {
                const configuracao = TIPOS[atividade.tipo] || TIPOS.pagamento_pendente;
                const Icone = configuracao.icone;
                return (
                  <article key={atividade.id || `${atividade.criado_em}-${index}`} className={styles.atividade}>
                    <span className={`${styles.iconeAtividade} ${styles[configuracao.classe]}`}>
                      <Icone size={20} />
                    </span>
                    <div className={styles.conteudo}>
                      <div className={styles.linhaTitulo}>
                        <h3>{configuracao.titulo}</h3>
                        <time dateTime={atividade.criado_em || atividade.data}>
                          {formatarData(atividade.criado_em || atividade.data)}
                        </time>
                      </div>
                      <p>{textoAtividade(atividade)}</p>
                      {atividade.pedido_id && <span className={styles.pedido}>Pedido #{atividade.pedido_id}</span>}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
