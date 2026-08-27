import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Check, ChevronRight, CircleAlert, CloudCog, CreditCard, Database, FlaskConical, History, Save, Settings2, ShieldCheck, ShoppingBag, Store, Truck, X } from "lucide-react";
import { api } from "../../services/api";
import styles from "../../styles/Admin/configuracoes.module.css";
import { useLoja } from "../../context/lojaContext";

const secoes = [
  { id: "geral", nome: "Geral", icone: Store },
  { id: "identidade", nome: "Identidade e experiência", icone: Settings2 },
  { id: "status", nome: "Status da loja", icone: Store },
  { id: "pagamentos", nome: "Pagamentos", icone: CreditCard },
  { id: "estoque", nome: "Estoque e pedidos", icone: ShoppingBag },
  { id: "cupons", nome: "Cupons e benefícios", icone: Check },
  { id: "entrega", nome: "Entrega", icone: Truck },
  { id: "seguranca", nome: "Segurança", icone: ShieldCheck },
  { id: "notificacoes", nome: "Notificações", icone: CircleAlert },
  { id: "avancado", nome: "Avançado", icone: CloudCog },
];

const gruposNavegacao = [
  { titulo: "Base da loja", itens: ["geral", "identidade", "status"] },
  { titulo: "Operação", itens: ["pagamentos", "estoque", "cupons", "entrega"] },
  { titulo: "Controle", itens: ["seguranca", "notificacoes", "avancado"] },
];

const valoresIniciais = {
  store_name: "", store_email: "", store_phone: "", store_address: "", store_cnpj: "", store_currency: "BRL", store_timezone: "America/Sao_Paulo",
  brand_name: "", brand_slogan: "", home_collection_id: "", home_featured_product_id: "", wishlist_enabled: true, reviews_enabled: true, show_out_of_stock_products: true, products_per_page: 12, animations_enabled: true,
  store_status: "online", closed_message: "A loja está fechada para novas compras. Voltaremos em breve.", maintenance_title: "Estamos preparando algo especial", maintenance_message: "Nossa loja está temporariamente indisponível. Voltaremos em breve.", maintenance_image: "", maintenance_start: "", maintenance_end: "", maintenance_countdown: true, maintenance_instagram: "", maintenance_whatsapp: "",
  pix_enabled: true, card_enabled: true, boleto_enabled: false, payment_environment: "sandbox", max_installments: 12, pix_discount: 0, payment_expiration_minutes: 30,
  stock_minimum: 5, low_stock_alerts: true, out_of_stock_alerts: true, allow_out_of_stock_purchase: false, reserve_stock_checkout: true, stock_reservation_minutes: 30, automatic_stock_reduction: true, allow_customer_cancel: true, minimum_order_value: 0, maximum_order_value: 0,
  coupons_enabled: true, multiple_coupons: false, coupons_on_promotions: true, coupons_on_shipping: true, coupon_minimum_value: 0,
  free_shipping_enabled: true, free_shipping_minimum: 500, default_shipping_value: 0, default_shipping_deadline: "", store_pickup_enabled: false,
  session_minutes: 1440, max_login_attempts: 5, temporary_lock_minutes: 15, debug_enabled: false, cache_enabled: true,
};

const campos = {
  geral: [["store_name", "Nome da loja"], ["store_email", "E-mail administrativo", "email"], ["store_phone", "Telefone"], ["store_address", "Endereço"], ["store_cnpj", "CNPJ"], ["store_currency", "Moeda"], ["store_timezone", "Fuso horário"]],
  identidade: [["brand_name", "Nome da marca"], ["brand_slogan", "Slogan"], ["home_collection_id", "ID da coleção principal"], ["home_featured_product_id", "ID do produto em destaque"], ["products_per_page", "Produtos por página", "number"], ["maintenance_image", "Logo ou imagem da manutenção", "url"]],
  pagamentos: [["max_installments", "Parcelamento máximo", "number"], ["pix_discount", "Desconto no Pix (%)", "number"], ["payment_expiration_minutes", "Expiração do pagamento (minutos)", "number"]],
  estoque: [["stock_minimum", "Estoque mínimo padrão", "number"], ["stock_reservation_minutes", "Tempo de reserva (minutos)", "number"], ["minimum_order_value", "Pedido mínimo", "number"], ["maximum_order_value", "Pedido máximo (0 = sem limite)", "number"]],
  cupons: [["coupon_minimum_value", "Valor mínimo global", "number"]],
  entrega: [["free_shipping_minimum", "Valor mínimo do frete grátis", "number"], ["default_shipping_value", "Valor padrão do frete", "number"], ["default_shipping_deadline", "Prazo padrão"]],
  seguranca: [["session_minutes", "Tempo de sessão (minutos)", "number"], ["max_login_attempts", "Máximo de tentativas de login", "number"], ["temporary_lock_minutes", "Bloqueio temporário (minutos)", "number"]],
};

function normalizar(data) { return { ...valoresIniciais, ...(data?.configuracoes || data) }; }
function formatarData(valor) { return valor ? new Date(valor).toLocaleString("pt-BR") : "Nunca"; }

export default function Configuracoes() {
  const [formulario, setFormulario] = useState(valoresIniciais);
  const [original, setOriginal] = useState(null);
  const [secao, setSecao] = useState("geral");
  const [alertas, setAlertas] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [testando, setTestando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [confirmacao, setConfirmacao] = useState(null);
  const [pagamentoStatus, setPagamentoStatus] = useState("");
  const [statusEfetivo, setStatusEfetivo] = useState(null);
  const { atualizarStatus } = useLoja();

  const status = statusEfetivo || formulario.store_status || "online";
  const mudou = useMemo(() => JSON.stringify(formulario) !== JSON.stringify(original), [formulario, original]);

  async function carregar() {
    setCarregando(true); setErro("");
    try {
      const [config, statusResposta, alertasResposta, historicoResposta] = await Promise.all([
        api.get("/admin/configuracoes"), api.get("/admin/configuracoes/status"), api.get("/admin/configuracoes/alertas"), api.get("/admin/configuracoes/historico"),
      ]);
      const dados = normalizar(config.data);
      setFormulario(dados);
      setOriginal(dados);
      setStatusEfetivo(statusResposta.data?.status || dados.store_status);
      const alertasDados = alertasResposta.data?.alertas || {};
      const historicoDados = historicoResposta.data?.historico || historicoResposta.data || [];
      setAlertas(Array.isArray(alertasDados) ? alertasDados : [
        ...(alertasDados.baixoEstoque || []),
        ...(alertasDados.esgotados || []),
        ...(alertasDados.mercadoPagoTeste ? [{ id: "mercado-pago-teste" }] : []),
        ...(alertasDados.emailAdministrativoAusente ? [{ id: "email-administrativo" }] : []),
      ]);
      setHistorico(Array.isArray(historicoDados) ? historicoDados : []);
    } catch (error) { setErro(error.response?.data?.erro || "Não foi possível carregar as configurações."); }
    finally { setCarregando(false); }
  }

  useEffect(() => { carregar(); }, []);
  useEffect(() => { const sair = (event) => { if (mudou && !window.confirm("Você possui alterações não salvas. Deseja sair?")) event.preventDefault(); }; window.addEventListener("beforeunload", sair); return () => window.removeEventListener("beforeunload", sair); }, [mudou]);

  function alterar(chave, valor) { setFormulario((atual) => ({ ...atual, [chave]: valor })); setMensagem(""); }
  function pedirConfirmacao(acao, texto) { setConfirmacao({ acao, texto }); }

  async function salvar() {
    setSalvando(true); setErro("");
    try {
      await api.put("/admin/configuracoes", { configuracoes: formulario });
      setOriginal({ ...formulario }); setMensagem("Configurações atualizadas com sucesso.");
    } catch (error) { setErro(error.response?.data?.erro || "Não foi possível salvar as configurações."); }
    finally { setSalvando(false); }
  }

  async function alterarStatus(novoStatus) {
    try { await api.put("/admin/configuracoes/status", { status: novoStatus }); alterar("store_status", novoStatus); setOriginal((atual) => ({ ...atual, store_status: novoStatus })); setStatusEfetivo(novoStatus); await atualizarStatus(); setMensagem("Status da loja atualizado com sucesso."); }
    catch (error) { setErro(error.response?.data?.erro || "Não foi possível alterar o status da loja."); }
    finally { setConfirmacao(null); }
  }

  async function testarPagamento() {
    setTestando(true); setPagamentoStatus("");
    try { const resposta = await api.post("/admin/configuracoes/testar-pagamento"); setPagamentoStatus(resposta.data?.mensagem || "Conexão verificada com sucesso."); }
    catch (error) { setPagamentoStatus(error.response?.data?.erro || "Não foi possível conectar ao Mercado Pago."); }
    finally { setTestando(false); }
  }

  if (carregando) return <main className={styles.pagina}><div className={styles.loading}><Settings2 size={24} /> Carregando configurações...</div></main>;
  if (erro && !original) return <main className={styles.pagina}><div className={styles.erro}>{erro}<button onClick={carregar}>Tentar novamente</button></div></main>;

  const renderCampo = ([chave, rotulo, tipo = "text"]) => <label className={styles.campo} key={chave}><span>{rotulo}</span><input type={tipo} value={formulario[chave] ?? ""} onChange={(event) => alterar(chave, tipo === "number" ? Number(event.target.value) : event.target.value)} /></label>;
  const renderToggle = (chave, rotulo) => <label className={styles.toggle} key={chave}><span>{rotulo}</span><input type="checkbox" checked={Boolean(formulario[chave])} onChange={(event) => alterar(chave, event.target.checked)} /><i /></label>;

  return <main className={styles.pagina}>
    <header className={styles.cabecalho}><div><p className={styles.eyebrow}>CENTRO DE CONTROLE</p><h1>Configurações</h1><p className={styles.subtitulo}>As regras que conduzem a experiência da sua joalheria.</p></div><div className={styles.acoes}>{mudou && <span className={styles.pendente}>Alterações não salvas</span>}<button className={styles.botaoPrincipal} onClick={salvar} disabled={salvando}><Save size={16} />{salvando ? "Salvando..." : "Salvar alterações"}</button></div></header>
    {(mensagem || erro) && <div className={mensagem ? styles.sucesso : styles.erro}>{mensagem || erro}<button onClick={() => { setMensagem(""); setErro(""); }}><X size={16} /></button></div>}
    <section className={styles.resumo}>{[["Loja", status, status === "online" ? "ok" : status === "maintenance" ? "atencao" : "perigo"], ["Pagamentos", pagamentoStatus || "Não testado", pagamentoStatus && !pagamentoStatus.toLowerCase().includes("não") ? "ok" : "neutro"], ["Estoque", alertas.length ? `${alertas.length} alerta(s)` : "Normal", alertas.length ? "atencao" : "ok"], ["Checkout", status === "online" ? "Funcionando" : "Bloqueado", status === "online" ? "ok" : "perigo"], ["Segurança", "Protegida", "ok"]].map(([titulo, valor, classe]) => <div className={styles.resumoItem} key={titulo}><small>{titulo}</small><strong className={styles[classe]}><b />{valor}</strong></div>)}</section>
    <div className={styles.layout}><nav className={styles.navegacao} aria-label="Categorias de configuração"><div className={styles.navCabecalho}><span className={styles.navSelo}><Settings2 size={16} /></span><div><strong>Preferências</strong><small>Controle da operação</small></div></div>{gruposNavegacao.map((grupo) => <div className={styles.navGrupo} key={grupo.titulo}><span className={styles.navGrupoTitulo}>{grupo.titulo}</span>{grupo.itens.map((id, index) => { const item = secoes.find((secaoItem) => secaoItem.id === id); const Icon = item.icone; return <button className={secao === item.id ? styles.navAtiva : ""} onClick={() => setSecao(item.id)} key={item.id}><span className={styles.navNumero}>{String(index + 1).padStart(2, "0")}</span><Icon size={17} /><span className={styles.navTexto}>{item.nome}</span><ChevronRight size={14} /></button>; })}</div>)}</nav>
      <section className={styles.conteudo}>{secao === "status" ? <Status form={formulario} alterar={alterar} alterarStatus={alterarStatus} pedirConfirmacao={pedirConfirmacao} /> : secao === "notificacoes" ? <Notificacoes form={formulario} alterar={alterar} /> : secao === "avancado" ? <Avancado form={formulario} alterar={alterar} historico={historico} /> : <><div className={styles.tituloSecao}><p className={styles.eyebrow}>CONFIGURAÇÃO</p><h2>{secoes.find((item) => item.id === secao)?.nome}</h2></div>{(campos[secao] || []).length > 0 && <div className={styles.grade}>{campos[secao].map(renderCampo)}</div>}{secao === "identidade" && <p className={styles.nota}>Use URLs dos arquivos enviados pelo sistema de upload existente. IDs de produtos e coleções usam os cadastros atuais.</p>}{secao === "pagamentos" && <Pagamentos form={formulario} alterar={alterar} testar={testarPagamento} testando={testando} status={pagamentoStatus} />}{secao === "estoque" && <p className={styles.nota}>O estoque mínimo específico configurado em cada produto continua prevalecendo sobre este valor padrão.</p>}<div className={styles.gradeToggles}>{(secao === "identidade" ? [["wishlist_enabled", "Wishlist ativada"], ["reviews_enabled", "Avaliações ativadas"], ["show_out_of_stock_products", "Exibir produtos esgotados"], ["animations_enabled", "Animações e transições"]] : secao === "estoque" ? [["low_stock_alerts", "Alertas de estoque baixo"], ["out_of_stock_alerts", "Alertas de produto esgotado"], ["allow_out_of_stock_purchase", "Permitir venda sem estoque"], ["reserve_stock_checkout", "Reservar estoque no checkout"], ["automatic_stock_reduction", "Baixa automática após pagamento"], ["allow_customer_cancel", "Permitir cancelamento pelo cliente"]] : secao === "pagamentos" ? [["pix_enabled", "Pix ativado"], ["card_enabled", "Cartão ativado"], ["boleto_enabled", "Boleto ativado"]] : secao === "cupons" ? [["coupons_enabled", "Sistema de cupons ativado"], ["multiple_coupons", "Permitir múltiplos cupons"], ["coupons_on_promotions", "Cupons em produtos promocionais"], ["coupons_on_shipping", "Permitir cupom no frete"]] : secao === "entrega" ? [["free_shipping_enabled", "Frete grátis ativado"], ["store_pickup_enabled", "Retirada na loja"]] : secao === "seguranca" ? [["debug_enabled", "Modo debug"], ["cache_enabled", "Cache ativado"]] : []).map(([chave, rotulo]) => renderToggle(chave, rotulo))}</div></>}</section></div>
    {confirmacao && <div className={styles.overlay}><div className={styles.modal}><AlertTriangle size={30} /><h2>Alteração crítica</h2><p>{confirmacao.texto}</p><div><button onClick={() => setConfirmacao(null)}>Cancelar</button><button className={styles.botaoPrincipal} onClick={() => confirmacao.acao()}>Confirmar</button></div></div></div>}
  </main>;
}

function Status({ form, alterar, alterarStatus, pedirConfirmacao }) { return <><div className={styles.tituloSecao}><p className={styles.eyebrow}>CONTROLE GLOBAL</p><h2>Status da loja</h2><p>O painel administrativo permanece disponível em qualquer estado.</p></div><div className={styles.statusGrid}>{[["online", "Online", "A loja funciona normalmente."], ["maintenance", "Manutenção", "Bloqueia a experiência pública e o checkout."], ["closed", "Fechada", "Bloqueia novas operações comerciais."]].map(([valor, titulo, descricao]) => <button className={`${styles.statusCard} ${form.store_status === valor ? styles.statusSelecionado : ""}`} key={valor} onClick={() => form.store_status !== valor && pedirConfirmacao(() => alterarStatus(valor), `Essa alteração afetará todos os clientes da loja. Deseja colocar a loja em ${titulo.toLowerCase()}?`)}><span className={`${styles.ponto} ${styles[valor]}`} /><strong>{titulo}</strong><small>{descricao}</small></button>)}</div><div className={styles.grade}>{[["maintenance_title", "Título da manutenção"], ["maintenance_message", "Mensagem principal"], ["closed_message", "Mensagem da loja fechada"], ["maintenance_start", "Início programado", "datetime-local"], ["maintenance_end", "Retorno programado", "datetime-local"], ["maintenance_instagram", "Instagram"], ["maintenance_whatsapp", "WhatsApp"]].map(([chave, rotulo, tipo = "text"]) => <label className={styles.campo} key={chave}><span>{rotulo}</span>{chave.includes("message") ? <textarea value={form[chave] || ""} onChange={(event) => alterar(chave, event.target.value)} /> : <input type={tipo} value={form[chave] || ""} onChange={(event) => alterar(chave, event.target.value)} />}</label>)}</div><div className={styles.gradeToggles}><label className={styles.toggle}><span>Contagem regressiva</span><input type="checkbox" checked={Boolean(form.maintenance_countdown)} onChange={(event) => alterar("maintenance_countdown", event.target.checked)} /><i /></label></div></>; }
function Pagamentos({ form, alterar, testar, testando, status }) { return <div className={styles.integracao}><label className={styles.campo}><span>Ambiente Mercado Pago</span><select value={form.payment_environment} onChange={(event) => alterar("payment_environment", event.target.value)}><option value="sandbox">Sandbox / Teste</option><option value="production">Produção</option></select></label><button onClick={testar} disabled={testando} className={styles.botaoSecundario}><FlaskConical size={16} />{testando ? "Testando..." : "Testar conexão"}</button>{status && <p className={styles.nota}>{status}</p>}</div>; }
function Notificacoes({ form, alterar }) { const eventos = [["notify_new_order", "Novo pedido"], ["notify_payment_approved", "Pagamento aprovado"], ["notify_payment_declined", "Pagamento recusado"], ["notify_pix_expired", "Pix expirado"], ["notify_order_cancelled", "Pedido cancelado"], ["notify_low_stock", "Estoque baixo"], ["notify_out_of_stock", "Produto esgotado"], ["notify_critical_error", "Erro crítico do sistema"]]; return <><div className={styles.tituloSecao}><p className={styles.eyebrow}>CENTRAL DE ALERTAS</p><h2>Notificações administrativas</h2></div><div className={styles.gradeToggles}>{eventos.map(([chave, rotulo]) => <label className={styles.toggle} key={chave}><span>{rotulo}</span><input type="checkbox" checked={Boolean(form[chave])} onChange={(event) => alterar(chave, event.target.checked)} /><i /></label>)}</div></>; }
function Avancado({ form, alterar, historico }) { return <><div className={styles.tituloSecao}><p className={styles.eyebrow}>ACESSO RESTRITO</p><h2>Avançado</h2><p>Controles técnicos e histórico de alterações.</p></div><div className={styles.gradeToggles}>{[["debug_enabled", "Modo debug"], ["cache_enabled", "Cache ativado"]].map(([chave, rotulo]) => <label className={styles.toggle} key={chave}><span>{rotulo}</span><input type="checkbox" checked={Boolean(form[chave])} onChange={(event) => alterar(chave, event.target.checked)} /><i /></label>)}</div><div className={styles.historico}><h3><History size={18} /> Histórico recente</h3>{historico.length ? historico.slice(0, 8).map((item, index) => <p key={item.id || index}><strong>{item.chave || item.configuracao}</strong> · {item.usuario || "Administrador"} · {formatarData(item.atualizado_em || item.criado_em)}</p>) : <p>Nenhuma alteração registrada.</p>}</div><div className={styles.statusTecnico}><Database size={18} /> Status do banco e da API são fornecidos pelo backend.</div></>; }
