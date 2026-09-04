import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, Minus, Pause, Play, Plus, ShoppingBag } from "lucide-react";
import { useCarrinho } from "../context/carrinhoContext";
import {
  calculateConfiguration,
  getConfigurator,
  validateConfiguration,
} from "../services/configurator";
import styles from "../styles/Atelier.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function assetUrl(asset) {
  if (!asset || typeof asset !== "string") return "";
  return /^https?:\/\//i.test(asset) ? asset : `${API_URL}${asset.startsWith("/") ? asset : `/${asset}`}`;
}

function chave(grupo) {
  return grupo.chave || grupo.slug || grupo.nome?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, "_") || String(grupo.id);
}

function imagensDo(valor) {
  if (!valor) return [];
  if (Array.isArray(valor)) return valor.flatMap(imagensDo);
  if (typeof valor === "string") return [valor];
  return valor.imagens || valor.images || valor.frames || valor.angulos || valor.galeria || [];
}

function visualDo(valor) {
  if (!valor) return null;
  if (typeof valor === "object") return valor;
  if (typeof valor !== "string") return null;
  try {
    return JSON.parse(valor);
  } catch {
    return null;
  }
}

function valorAdicional(opcao) {
  return Number(opcao?.valorAdicional ?? opcao?.valor_adicional ?? opcao?.acrescimo ?? 0) || 0;
}

function valorCalculo(calculo, ...chaves) {
  for (const chave of chaves) {
    if (calculo?.[chave] !== undefined && calculo?.[chave] !== null) return Number(calculo[chave]) || 0;
  }
  return 0;
}

function nomeOpcao(opcao) {
  const nome = opcao?.nome ?? opcao?.label ?? opcao?.valor;
  return nome === 0 || nome === undefined || nome === null || String(nome).trim() === "0" ? "" : String(nome).trim();
}

function prioridadeGrupo(grupo) {
  const identificador = `${grupo?.slug || ""} ${grupo?.nome || ""}`.toLowerCase();
  if (identificador.includes("tamanho") || identificador.includes("size")) return 0;
  if (identificador.includes("cor") || identificador.includes("metal")) return 1;
  return 2;
}

function framesDoProduto(produto) {
  return imagensDo(produto?.imagens360 || produto?.imagens_360 || produto?.galeria360 || produto?.galeria || produto?.imagens || produto?.imagem)
    .map(assetUrl).filter(Boolean);
}

function visualDaOpcao(opcao, frame) {
  const visual = visualDo(opcao?.visual);
  if (!visual || typeof visual !== "object") return "";
  const frames = imagensDo(visual.frames || visual.imagens || visual.images || visual.angulos);
  return assetUrl(frames[frame] || visual.imagem || visual.image || visual.asset || visual.src);
}

function getGroupKey(grupo) {
  return chave(grupo);
}

function getSelectionValues(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === "") return [];
  return [value];
}

function getOptionLabel(grupo, value) {
  const option = (grupo?.opcoes || []).find((item) => String(item.id) === String(value));
  return option?.nome || value || "Não informado";
}

function isProdutoPersonalizavel(produto) {
  if (!produto) return false;

  const valor = produto.personalizavel ?? produto.personalizable ?? produto.personalizacaoAtiva ?? produto.hasPersonalizacao;

  if (valor === undefined || valor === null || valor === "") {
    return Boolean(
      Array.isArray(produto.personalizacoes) && produto.personalizacoes.length > 0 ||
      Array.isArray(produto.personalizacao) && produto.personalizacao.length > 0 ||
      Array.isArray(produto.configuracao) && produto.configuracao.length > 0 ||
      Array.isArray(produto.personalizacoesConfig) && produto.personalizacoesConfig.length > 0 ||
      Array.isArray(produto.gruposPersonalizacao) && produto.gruposPersonalizacao.length > 0 ||
      Boolean(produto.hasPersonalizacao)
    );
  }

  if (typeof valor === "string") {
    const normalizado = valor.trim().toLowerCase();
    if (["false", "0", "no", "off", "null", "undefined", ""].includes(normalizado)) return false;
    if (["true", "1", "yes", "on"].includes(normalizado)) return true;
    return Boolean(normalizado);
  }

  if (typeof valor === "number") return valor !== 0;

  return Boolean(valor);
}

function ImageViewer({ produto, visuais }) {
  const frames = framesDoProduto(produto);
  const [frame, setFrame] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [automatico, setAutomatico] = useState(false);
  const [interagiu, setInteragiu] = useState(false);
  const inicio = useRef(null);
  const pinchDistance = useRef(null);

  useEffect(() => {
    setFrame(0);
  }, [produto?.id, frames.length]);

  useEffect(() => {
    if (!automatico || frames.length < 2) return undefined;
    const timer = setInterval(() => setFrame((atual) => (atual + 1) % frames.length), 180);
    return () => clearInterval(timer);
  }, [automatico, frames.length]);

  function ajustarZoom(valor) {
    setZoom((atual) => Math.min(2.2, Math.max(1, Number((atual + valor).toFixed(2)))));
  }

  function arrastar(event) {
    if (!frames.length) return;
    const clientX = event.touches?.[0]?.clientX ?? event.clientX;
    if (inicio.current == null) inicio.current = clientX;
    const distancia = clientX - inicio.current;
    if (Math.abs(distancia) < 18) return;
    setFrame((atual) => (atual + (distancia < 0 ? 1 : -1) + frames.length) % frames.length);
    inicio.current = clientX;
    setInteragiu(true);
  }

  function handleTouchMove(event) {
    if (!frames.length) return;
    if (event.touches.length === 2) {
      const [a, b] = Array.from(event.touches);
      const distancia = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      if (pinchDistance.current == null) {
        pinchDistance.current = distancia;
        return;
      }
      const delta = (distancia - pinchDistance.current) / 220;
      if (Math.abs(delta) > 0.01) {
        ajustarZoom(delta);
        pinchDistance.current = distancia;
      }
      return;
    }
    arrastar(event);
  }

  const camadas = visuais.map((visual) => {
    const imagem = visualDaOpcao({ visual }, frame);
    return imagem && visual?.camada ? { imagem, opacidade: visual.opacidade ?? 1 } : null;
  }).filter(Boolean);
  const principal = frames[frame] || assetUrl(produto?.imagem);

  return (
    <div
      className={styles.viewer}
      onMouseDown={(event) => { inicio.current = event.clientX; setInteragiu(true); }}
      onMouseMove={(event) => event.buttons && arrastar(event)}
      onMouseUp={() => { inicio.current = null; pinchDistance.current = null; }}
      onMouseLeave={() => { inicio.current = null; pinchDistance.current = null; }}
      onTouchStart={(event) => { if (event.touches.length === 1) inicio.current = event.touches[0].clientX; setInteragiu(true); }}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => { inicio.current = null; pinchDistance.current = null; }}
      onWheel={(event) => { event.preventDefault(); setInteragiu(true); if (event.deltaY < 0) ajustarZoom(0.12); else ajustarZoom(-0.12); }}
    >
      <div className={styles.imageStage} style={{ transform: `scale(${zoom})` }}>
        {principal && <img className={styles.mainImage} src={principal} alt={produto?.nome || "Joia"} draggable="false" />}
        {camadas.map((camada) => <img className={styles.layerImage} style={{ opacity: camada.opacidade }} src={camada.imagem} alt="" key={camada.imagem} draggable="false" />)}
      </div>
      {!principal && <div className={styles.imageFallback}>Imagem da joia indisponível.</div>}
      {!interagiu && frames.length > 1 && <span className={styles.dragHint}>Arraste para visualizar</span>}
      <div className={styles.viewerActions}>
        <button type="button" onClick={() => { setAutomatico((atual) => !atual); setInteragiu(true); }} disabled={frames.length < 2} className={automatico ? styles.active : ""}>{automatico ? <Pause size={15} /> : <Play size={15} />} 360°</button>
        <button type="button" onClick={() => ajustarZoom(0.15)} aria-label="Aumentar zoom"><Plus size={15} /></button>
        <button type="button" onClick={() => ajustarZoom(-0.15)} aria-label="Diminuir zoom"><Minus size={15} /></button>
        <button type="button" onClick={() => { setFrame(0); setZoom(1); setAutomatico(false); setInteragiu(false); }}>Centralizar</button>
      </div>
      {frames.length > 1 && <small className={styles.frameCounter}>{frame + 1} / {frames.length}</small>}
    </div>
  );
}

export default function Atelier() {
  const { produtoId } = useParams();
  const { adicionarAoCarrinho } = useCarrinho();
  const [dados, setDados] = useState(null);
  const [configuracao, setConfiguracao] = useState({});
  const [calculo, setCalculo] = useState(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    let ativo = true;

    getConfigurator(produtoId)
      .then((resposta) => { if (ativo) setDados(resposta || {}); })
      .catch((error) => {
        if (!ativo) return;
        setErro(error.response?.data?.erro || error.response?.data?.message || "Não foi possível abrir o Ateliê.");
      })
      .finally(() => { if (ativo) setCarregando(false); });

    return () => { ativo = false; };
  }, [produtoId]);

  const produto = dados?.produto ?? dados ?? {};
  const grupos = useMemo(() => {
    const lista = Array.isArray(dados?.personalizacoes)
      ? dados.personalizacoes
      : Array.isArray(produto?.personalizacoes)
        ? produto.personalizacoes
        : [];

    return lista
      .map((grupo) => ({
        ...grupo,
        opcoes: (grupo.opcoes || []).filter((opcao) => nomeOpcao(opcao)),
      }))
      .sort((a, b) => prioridadeGrupo(a) - prioridadeGrupo(b) || Number(a.ordem || 0) - Number(b.ordem || 0));
  }, [dados, produto]);

  const visuais = useMemo(() => grupos.flatMap((grupo) => {
    const key = getGroupKey(grupo);
    const selecionados = getSelectionValues(configuracao[key]);
    return (grupo.opcoes || []).filter((opcao) => selecionados.some((id) => String(id) === String(opcao.id))).map((opcao) => opcao.visual).filter(Boolean);
  }), [configuracao, grupos]);

  const calculoLocal = useMemo(() => {
    const base = Number(produto?.precoBase ?? produto?.preco_base ?? produto?.preco ?? 0) || 0;
    const adicionais = grupos.reduce((total, grupo) => {
      const selecionados = getSelectionValues(configuracao[getGroupKey(grupo)]);
      return total + (grupo.opcoes || [])
        .filter((opcao) => selecionados.some((id) => String(id) === String(opcao.id)))
        .reduce((subtotal, opcao) => subtotal + valorAdicional(opcao), 0);
    }, 0);
    return { precoBase: base, adicionais, precoFinal: base + adicionais };
  }, [configuracao, grupos, produto]);

  useEffect(() => {
    if (!dados || !grupos.length) return undefined;

    setConfiguracao((atual) => {
      const proximo = { ...atual };
      let mudou = false;

      grupos.forEach((grupo) => {
        const key = getGroupKey(grupo);
        const atualValor = proximo[key];
        const list = getSelectionValues(atualValor);

        if (grupo.obrigatoria && grupo.opcoes?.length && (!atualValor && !list.length)) {
          proximo[key] = grupo.tipo === "checkbox" ? [grupo.opcoes[0].id] : grupo.opcoes[0].id;
          mudou = true;
        }
      });

      return mudou ? proximo : atual;
    });
  }, [dados, grupos]);

  useEffect(() => {
    if (!dados || !Object.keys(configuracao).length) return undefined;
    const timer = setTimeout(async () => {
      try {
        const resposta = await calculateConfiguration(produtoId, configuracao);
        const calculoResposta = resposta?.calculo || resposta?.resultado || resposta || {};
        const adicionalResposta = valorCalculo(calculoResposta, "adicionais", "valor_adicional", "total_adicionais");
        const finalResposta = valorCalculo(calculoResposta, "precoFinal", "preco_final", "total");
        setCalculo({
          ...calculoLocal,
          ...calculoResposta,
          adicionais: Math.max(adicionalResposta, calculoLocal.adicionais),
          precoFinal: Math.max(finalResposta, calculoLocal.precoFinal),
        });
        setErro("");
      } catch (error) {
        setCalculo(calculoLocal);
        const mensagemErro = error.response?.data?.erro || error.response?.data?.message || "";
        setErro(/configurador.*inativ|personaliza[cç][aã]o.*inativ/i.test(mensagemErro) ? "" : mensagemErro || "Essa combinação não está disponível.");
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [configuracao, dados, produtoId, calculoLocal]);

  function alterar(grupo, valor) {
    const nome = getGroupKey(grupo);
    setConfiguracao((atual) => {
      if (grupo.tipo !== "checkbox") return { ...atual, [nome]: valor };
      const selecionados = Array.isArray(atual[nome]) ? atual[nome] : [];
      return { ...atual, [nome]: selecionados.includes(valor) ? selecionados.filter((item) => item !== valor) : [...selecionados, valor] };
    });
  }

  const resumo = useMemo(() => grupos
    .map((grupo) => {
      const key = getGroupKey(grupo);
      const valor = configuracao[key];
      const valores = getSelectionValues(valor);
      const label = valores.length ? valores.map((item) => getOptionLabel(grupo, item)).join(", ") : "";

      if (!label && !grupo.permite_valor_livre) return null;
      if (grupo.permite_valor_livre && typeof valor === "string" && valor.trim()) return { grupo: grupo.nome, valor };
      if (label) return { grupo: grupo.nome, valor: label };
      return null;
    })
    .filter(Boolean), [configuracao, grupos]);

  const etapasConcluidas = grupos.filter((grupo) => getSelectionValues(configuracao[getGroupKey(grupo)]).length > 0).length;
  const faltamObrigatorias = grupos.some((grupo) => grupo.obrigatoria && !getSelectionValues(configuracao[getGroupKey(grupo)]).length);

  async function adicionar() {
    setSalvando(true);
    try {
      try {
        await validateConfiguration(produtoId, configuracao);
      } catch (error) {
        const mensagemErro = error.response?.data?.erro || error.response?.data?.message || "";
        if (!/configurador.*inativ|personaliza[cç][aã]o.*inativ/i.test(mensagemErro)) throw error;
      }
      const precoBase = calculo ? valorCalculo(calculo, "precoBase", "preco_base") : calculoLocal.precoBase;
      const adicionais = calculo ? valorCalculo(calculo, "adicionais", "valor_adicional", "total_adicionais") : calculoLocal.adicionais;
      const precoFinal = calculo ? valorCalculo(calculo, "precoFinal", "preco_final", "total") : calculoLocal.precoFinal;
      const escolhas = grupos.map((grupo) => ({
        grupo_id: grupo.id,
        grupo: grupo.nome,
        chave: getGroupKey(grupo),
        valor: configuracao[getGroupKey(grupo)],
        opcoes: getSelectionValues(configuracao[getGroupKey(grupo)])
          .map((valor) => (grupo.opcoes || []).find((opcao) => String(opcao.id) === String(valor)))
          .filter(Boolean)
          .map((opcao) => ({ id: opcao.id, nome: nomeOpcao(opcao), valor_adicional: valorAdicional(opcao) })),
      }));

      await adicionarAoCarrinho(produtoId, 1, null, {
        ...produto,
        preco: precoFinal,
        preco_personalizado: precoFinal,
        preco_base: precoBase,
        valor_adicional: adicionais,
        configuracao,
        personalizacoes: escolhas,
      }, configuracao);
    } catch (error) {
      setErro(error.response?.data?.erro || error.response?.data?.message || error.message || "Configuração inválida.");
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) return <main className={styles.page}><p>Preparando seu Ateliê...</p></main>;
  if (!dados) return <main className={styles.page}><p>{erro || "Produto não encontrado."}</p></main>;

  const personalizavel = isProdutoPersonalizavel(produto) || grupos.length > 0;

  if (!personalizavel) {
    return (
      <main className={styles.page}>
        <div className={styles.viewer} style={{ display: "grid", placeItems: "center", padding: "40px" }}>
          <div className={styles.emptyState} style={{ maxWidth: "520px", textAlign: "center" }}>
            <p className={styles.eyebrow}>ATELIÊ NÃO DISPONÍVEL</p>
            <h1 style={{ marginTop: "12px", marginBottom: "12px" }}>Esta joia não possui opções de personalização.</h1>
            <Link to={`/produto/${produtoId}`} className={styles.add} style={{ display: "inline-flex", width: "auto", minWidth: "220px" }}>
              <ArrowLeft size={16} /> Voltar para o produto
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}><Link to={`/produto/${produtoId}`}><ArrowLeft size={16} /> Voltar para o produto</Link><span>ATELIÊ DIGITAL</span></header>
      <div className={styles.layout}>
        <ImageViewer produto={dados.produto} visuais={visuais} />
        <section className={styles.panel}>
          <div className={styles.panelIntro}>
            <p className={styles.eyebrow}>ATELIÊ · SOB MEDIDA</p>
            <h1>{produto?.nome || "Sua joia"}</h1>
            <p className={styles.subtitle}>Escolha os detalhes para revelar uma peça só sua.</p>
          </div>
          {grupos.length > 0 && <div className={styles.progress} aria-label={`${etapasConcluidas} de ${grupos.length} etapas concluídas`}>
            <div className={styles.progressTop}><span>PERSONALIZAÇÃO</span><strong>{etapasConcluidas}/{grupos.length}</strong></div>
          </div>}
          {!grupos.length && <div className={styles.emptyState}>Esta joia ainda não possui personalizações cadastradas.</div>}
          {grupos.map((grupo, index) => {
            const nome = getGroupKey(grupo);
            const valor = configuracao[nome] ?? "";
            const selecionados = getSelectionValues(valor);
            const chaveGrupo = nome.toLowerCase();
            const eTamanho = chaveGrupo.includes("tamanho") || chaveGrupo.includes("size");
            const eMetal = chaveGrupo.includes("metal") || chaveGrupo.includes("cor") || grupo.opcoes?.some((opcao) => visualDo(opcao.visual)?.cor);

            return <fieldset className={`${styles.group} ${eTamanho ? styles.sizeGroup : ""} ${eMetal ? styles.metalGroup : ""}`} key={grupo.id}>
              <legend><span><b>{String(index + 1).padStart(2, "0")}</b>{grupo.nome}<em>{grupo.obrigatoria ? "Obrigatório" : "Opcional"}</em></span>{selecionados.length > 0 && <Check size={15} />}</legend>
              <div className={styles.options}>{grupo.opcoes?.map((opcao) => <label key={opcao.id} className={`${selecionados.some((item) => String(item) === String(opcao.id)) ? styles.selected : ""} ${eMetal ? styles.swatchOption : ""} ${eTamanho ? styles.sizeOption : ""}`} title={eMetal ? opcao.nome : undefined}>
                <input type={grupo.tipo === "checkbox" ? "checkbox" : "radio"} name={`grupo-${grupo.id}`} checked={selecionados.some((item) => String(item) === String(opcao.id))} onChange={() => alterar(grupo, opcao.id)} />
                {eMetal && <i style={{ backgroundColor: visualDo(opcao.visual)?.cor || "#c9a24b" }} />}
                <span>{nomeOpcao(opcao) || "Opção"}</span>
                {valorAdicional(opcao) > 0 && <small>+ R$ {valorAdicional(opcao).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</small>}
              </label>)}</div>
              {Boolean(grupo.permite_valor_livre) && <input type="text" value={typeof valor === "string" && !grupo.opcoes?.some((opcao) => String(opcao.id) === valor) ? valor : ""} maxLength={grupo.valor_livre_maximo || undefined} onChange={(event) => alterar(grupo, event.target.value)} placeholder="Personalize sua gravação" />}
            </fieldset>;
          })}

          {resumo.length > 0 && (
            <div className={styles.summaryBox}>
              <span className={styles.summaryTitle}>Resumo da sua criação</span>
              <ul className={styles.summaryList}>
                {resumo.map((item) => (
                  <li key={item.grupo}>
                    <span>{item.grupo}</span>
                    <strong>{item.valor}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {erro && <p className={styles.error} role="alert">{erro}</p>}
          <div className={styles.panelFooter}>
            <div className={styles.total}><span>Preço da sua joia</span><strong>R$ {(calculo ? valorCalculo(calculo, "precoFinal", "preco_final", "total") : Number(produto?.precoBase ?? produto?.preco_base ?? 0)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong>{calculo && <small>Base R$ {valorCalculo(calculo, "precoBase", "preco_base").toLocaleString("pt-BR", { minimumFractionDigits: 2 })} · Adicionais R$ {valorCalculo(calculo, "adicionais", "valor_adicional", "total_adicionais").toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</small>}</div>
            <button type="button" className={styles.add} onClick={adicionar} disabled={salvando || faltamObrigatorias}><ShoppingBag size={17} /> {salvando ? "Validando..." : "Adicionar ao carrinho"}</button>
          </div>
        </section>
      </div>
    </main>
  );
}