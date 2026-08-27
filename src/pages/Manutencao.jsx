import { useEffect, useState } from "react";
import { Clock3, Link2, MessageCircle, RefreshCw } from "lucide-react";
import { useLoja } from "../context/lojaContext";
import styles from "../styles/manutencao.module.css";
import Logo from "../img/logo.svg";

function formatarContagem(valor) {
  if (!valor) return null;
  const totalSegundos = Math.max(0, Math.floor((new Date(valor).getTime() - Date.now()) / 1000));
  const dias = Math.floor(totalSegundos / 86400);
  const horas = Math.floor((totalSegundos % 86400) / 3600);
  const minutos = Math.floor((totalSegundos % 3600) / 60);
  const segundos = totalSegundos % 60;
  return { dias, horas, minutos, segundos };
}

export default function Manutencao() {
  const { dados, status } = useLoja();
  const erro = !dados && status === "online";
  const [contagem, setContagem] = useState(() => formatarContagem(dados?.retorno));

  useEffect(() => {
    const primeiraAtualizacao = window.setTimeout(() => setContagem(formatarContagem(dados?.retorno)), 0);
    if (!dados?.retorno || !dados?.contador) return () => window.clearTimeout(primeiraAtualizacao);
    const intervalo = window.setInterval(() => setContagem(formatarContagem(dados.retorno)), 1000);
    return () => { window.clearTimeout(primeiraAtualizacao); window.clearInterval(intervalo); };
  }, [dados]);
  if (erro) return <main className={styles.pagina}><RefreshCw /><h1>Voltaremos em instantes</h1><p>Não foi possível consultar o status da loja.</p></main>;
  if (!dados) return <main className={styles.pagina}><span className={styles.carregando}>Consultando a loja...</span></main>;
  return <main className={styles.pagina} style={dados.imagem ? { backgroundImage: `linear-gradient(90deg, rgba(5,5,5,.96) 0%, rgba(5,5,5,.76) 48%, rgba(5,5,5,.38) 100%), url(${dados.imagem})` } : undefined}>
    <div className={styles.topo}><img src={Logo} alt="Azory Joalheria" className={styles.logo} /><span className={styles.status}><i />{status === "closed" ? "Loja fechada" : "Em breve"}</span></div>
    <div className={styles.conteudo}><span className={styles.eyebrow}>UMA PAUSA PARA O EXTRAORDINÁRIO</span><h1>{dados.titulo || "Estamos preparando algo especial"}</h1><p>{dados.mensagem || "Nossa loja está temporariamente indisponível. Voltaremos em breve."}</p>
      {dados.retorno && <div className={styles.retorno}><div><Clock3 size={18} /><span>Retorno previsto</span></div><time>{new Date(dados.retorno).toLocaleString("pt-BR", { dateStyle: "long", timeStyle: "short" })}</time></div>}
      {dados.contador && contagem && <div className={styles.contagem} aria-label="Contagem regressiva para o retorno"><div><strong>{String(contagem.dias).padStart(2, "0")}</strong><small>dias</small></div><b>:</b><div><strong>{String(contagem.horas).padStart(2, "0")}</strong><small>horas</small></div><b>:</b><div><strong>{String(contagem.minutos).padStart(2, "0")}</strong><small>min</small></div><b>:</b><div><strong>{String(contagem.segundos).padStart(2, "0")}</strong><small>seg</small></div></div>}
      <div className={styles.links}>{dados.instagram && <a href={dados.instagram} target="_blank" rel="noreferrer"><Link2 size={17} /> Instagram</a>}{dados.whatsapp && <a href={dados.whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp</a>}</div>
    </div><footer>ATELIÊ AZORY <span>·</span> JOALHERIA CONTEMPORÂNEA</footer>
  </main>;
}
