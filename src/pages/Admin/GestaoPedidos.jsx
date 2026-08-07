import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import styles from '../../styles/Admin/GestaoPedidos.module.css';
// import CardsMetricas from '../../components/Admin/CardsMetricas/CardsMetricas';

import BarraFiltros from '../../components/Admin/BarraFiltros/BarraFiltros';
import TabelaPedidos from '../../components/Admin/TabelaPedidos/TabelaPedidos';
import ModalDetalhesPedido from '../../components/Admin/ModalDetalhesPedido/ModalDetalhesPedido';
import PaginacaoAdmin from '../../components/Admin/PaginacaoAdmin/PaginacaoAdmin';
import { STATUS_PEDIDO } from './mockPedidosAdmin';
import { api } from '../../services/api';

const ITENS_POR_PAGINA = 5;

const ICONES = {
  pedidosHoje: (
    <svg viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="5" width="17" height="15" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M3.5 9.5h17M8 3v3.2M16 3v3.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  faturamento: (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M4 17.5 9.5 12l4 3 6-7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.5 8h4v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  pendentes: (
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  emEntrega: (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M3 7h11v9H3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M14 10h4l3 3v3h-7v-6Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="7.5" cy="18.5" r="1.6" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="17" cy="18.5" r="1.6" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
  concluidos: (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M4 12.5 9.5 18 20 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const variantesLista = {
  oculto: {},
  visivel: { transition: { staggerChildren: 0.08 } },
};

const variantesCard = {
  oculto: { opacity: 0, y: 18 },
  visivel: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function converterDataBr(dataStr) {
  const [dataParte] = dataStr.split(' ');
  const [dia, mes, ano] = dataParte.split('/').map(Number);
  return new Date(ano, mes - 1, dia);
}

function estaNoPeriodo(dataPedido, periodo, referenciaHoje) {
  if (periodo === 'todos') return true;
  const diffDias = Math.floor((referenciaHoje - converterDataBr(dataPedido)) / (1000 * 60 * 60 * 24));
  if (periodo === 'hoje') return diffDias === 0;
  if (periodo === '7dias') return diffDias >= 0 && diffDias <= 7;
  if (periodo === '30dias') return diffDias >= 0 && diffDias <= 30;
  return true;
}

const formatarMoeda = (valor) =>
  Number(valor ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// Data + hora no formato "dd/mm/aaaa hh:mm", que é o que estaNoPeriodo/converterDataBr
// esperam (eles fazem split(' ') e depois split('/')).
function formatarDataPedido(dataIso) {
  const data = new Date(dataIso);
  const dataParte = data.toLocaleDateString('pt-BR');
  const horaParte = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${dataParte} ${horaParte}`;
}

// Converte cada linha vinda de GET /pedidos/pedidos-admin (ver pedidos.routes.js)
// para o formato que a UI (cards de métrica, filtros, tabela) espera.
// OBS: ajuste STATUS_PEDIDO em mockPedidosAdmin.js caso os valores não sejam
// exatamente iguais aos do enum status_pedido do banco (pendente/enviado/entregue/cancelado).
function normalizarPedidoAdmin(pedidoApi) {
  return {
    id: pedidoApi.id,
    numero: `AZY-${String(pedidoApi.id).padStart(6, '0')}`,
    cliente: {
      nome: pedidoApi.cliente_nome,
      email: pedidoApi.cliente_email,
    },
    dataPedido: formatarDataPedido(pedidoApi.criado_em),
    quantidadeItens: Number(pedidoApi.quantidade_itens ?? 0),
    totalNumero: Number(pedidoApi.total ?? 0),
    total: formatarMoeda(pedidoApi.total),
    status: pedidoApi.status_pedido,
  };
}

// Converte a resposta de GET /pedidos/pedidos-admin/:id ({ pedido, itens })
// pro formato completo que ModalDetalhesPedido.jsx precisa. É um objeto bem
// mais rico que o da listagem — por isso é buscado só quando o modal abre,
// e não já na listagem.
function normalizarDetalhePedido(resposta) {
  const { pedido, itens } = resposta;

  return {
    id: pedido.id,
    numero: `AZY-${String(pedido.id).padStart(6, '0')}`,
    status: pedido.status_pedido,
    tipo_entrega: pedido.tipo_entrega,
    cliente: {
      nome: pedido.cliente_nome,
      email: pedido.cliente_email,
      // A tabela usuarios/pedidos não tem telefone nem endereço hoje — se
      // isso for adicionado no banco, é só incluir aqui.
      telefone: pedido.cliente_telefone ?? '—',
    },
    itens: itens.map((item) => ({
      id: item.produto_id,
      nome: item.nome,
      imagem: item.imagem,
      qtd: item.quantidade,
      precoUnitario: formatarMoeda(item.preco_unitario),
      subtotal: formatarMoeda(item.subtotal),
    })),
    subtotal: formatarMoeda(pedido.subtotal),
    desconto: formatarMoeda(pedido.desconto),
    frete: formatarMoeda(pedido.frete),
    formaPagamento: pedido.forma_pagamento,
    total: formatarMoeda(pedido.total),
    // Não existe uma tabela de eventos/timeline no banco ainda — a lista
    // fica vazia até isso existir; a seção só mostra o que vier aqui.
    timeline: [],
  };
}

const variantesEntrada = {
  oculto: { opacity: 0, y: 18 },
  visivel: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function GestaoPedidos() {
  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('todos');
  const [periodoFiltro, setPeriodoFiltro] = useState('todos');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Busca a lista de pedidos uma única vez, na página — é aqui (e não dentro
  // de TabelaPedidos) porque os cards de métrica, os filtros e a busca
  // precisam da lista inteira, não só da página atual.
  useEffect(() => {
    async function carregarPedidos() {
      try {
        setCarregando(true);
        const resposta = await api.get('/pedidos/pedidos-admin');
        setPedidos(resposta.data.map(normalizarPedidoAdmin));
      } catch (error) {
        console.error(error);
        setPedidos([]);
      } finally {
        setCarregando(false);
      }
    }
    carregarPedidos();
  }, []);

  const referenciaHoje = useMemo(() => new Date(), []);

  const metricas = useMemo(() => {
    const pedidosHoje = pedidos.filter((p) => estaNoPeriodo(p.dataPedido, 'hoje', referenciaHoje)).length;

    const faturamento = pedidos
      .filter((p) => p.status !== STATUS_PEDIDO.CANCELADO)
      .reduce((acc, p) => acc + p.totalNumero, 0);

    const pendentes = pedidos.filter((p) => p.status === STATUS_PEDIDO.PENDENTE).length;
    const emEntrega = pedidos.filter((p) => p.status === STATUS_PEDIDO.ENVIADO).length;
    const concluidos = pedidos.filter((p) => p.status === STATUS_PEDIDO.ENTREGUE).length;

    return {
      pedidosHoje,
      faturamento: formatarMoeda(faturamento),
      pendentes,
      emEntrega,
      concluidos,
    };
  }, [pedidos, referenciaHoje]);

  const cartoes = [
    { chave: 'pedidosHoje', rotulo: 'Pedidos Hoje', valor: metricas.pedidosHoje, tom: 'ouro' },
    { chave: 'faturamento', rotulo: 'Faturamento', valor: metricas.faturamento, tom: 'ivorio' },
    { chave: 'pendentes', rotulo: 'Pendentes', valor: metricas.pendentes, tom: 'neutro' },
    { chave: 'emEntrega', rotulo: 'Em Entrega', valor: metricas.emEntrega, tom: 'azul' },
    { chave: 'concluidos', rotulo: 'Concluídos', valor: metricas.concluidos, tom: 'sucesso' },
  ];

  const pedidosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return pedidos.filter((pedido) => {
      const passaStatus = statusFiltro === 'todos' || pedido.status === statusFiltro;
      if (!passaStatus) return false;

      const passaPeriodo = estaNoPeriodo(pedido.dataPedido, periodoFiltro, referenciaHoje);
      if (!passaPeriodo) return false;

      if (!termo) return true;
      return (
        pedido.numero.toLowerCase().includes(termo) ||
        pedido.cliente.nome.toLowerCase().includes(termo) ||
        pedido.cliente.email.toLowerCase().includes(termo)
      );
    });
  }, [pedidos, busca, statusFiltro, periodoFiltro, referenciaHoje]);

  // Sempre que a busca ou os filtros mudam, volta pra primeira página.
  useEffect(() => {
    setPaginaAtual(1);
  }, [busca, statusFiltro, periodoFiltro]);

  const totalPaginas = Math.max(1, Math.ceil(pedidosFiltrados.length / ITENS_POR_PAGINA));

  const pedidosDaPagina = useMemo(() => {
    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    return pedidosFiltrados.slice(inicio, inicio + ITENS_POR_PAGINA);
  }, [pedidosFiltrados, paginaAtual]);

  async function abrirDetalhes(pedido) {
    setModalAberto(true);
    setCarregandoDetalhe(true);
    try {
      const resposta = await api.get(`/pedidos/pedidos-admin/${pedido.id}`);
      setPedidoSelecionado(normalizarDetalhePedido(resposta.data));
    } catch (error) {
      console.error(error);
      setModalAberto(false);
      setPedidoSelecionado(null);
    } finally {
      setCarregandoDetalhe(false);
    }
  }

  function fecharDetalhes() {
    setModalAberto(false);
  }


  async function atualizarStatusPedido(novoStatus) {
    
    try{
      
        await api.put(`/pedidos/pedidos-admin/${pedidoSelecionado.id}/status`, {status:novoStatus})

        setPedidoSelecionado(prev =>  ({
          ...prev,
          status:novoStatus
        }))

        setPedidos (prev => prev.map(p => p.id === pedidoSelecionado.id ? {...p, status:novoStatus}: p ))

    } catch(error){
      console.error(error)
    }
  }


  return (
    <div className={styles.pagina}>
      <div className={styles.container}>
        <motion.header
          className={styles.cabecalho}
          variants={variantesEntrada}
          initial="oculto"
          animate="visivel"
        >
          {/* <span className={styles.eyebrow}>AZORY · Painel administrativo</span> */}
          <h1 className={styles.titulo}>Gestão de Pedidos</h1>
          <p className={styles.descricao}>
            Acompanhe, filtre e consulte os detalhes de todos os pedidos da loja em um só lugar.
          </p>
        </motion.header>

         <motion.div
            className={styles.gradeMetricas}
            variants={variantesLista}
            initial="oculto"
            animate="visivel"
          >
            {cartoes.map((cartao) => (
              <motion.div
                key={cartao.chave}
                className={styles.cartaoMetrica}
                variants={variantesCard}
                whileHover={{ y: -4, transition: { duration: 0.25, ease: 'easeOut' } }}
              >
                <div className={`${styles.iconeMetrica} ${styles[`tom-${cartao.tom}`]}`}>
                  {ICONES[cartao.chave]}
                </div>
                <div className={styles.textoMetrica}>
                  <span className={styles.valorMetrica}>{cartao.valor}</span>
                  <span className={styles.rotuloMetrica}>{cartao.rotulo}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

        <BarraFiltros
          busca={busca}
          onBuscaChange={setBusca}
          statusFiltro={statusFiltro}
          onStatusChange={setStatusFiltro}
          periodoFiltro={periodoFiltro}
          onPeriodoChange={setPeriodoFiltro}
        />

        <TabelaPedidos pedidos={pedidosDaPagina} carregando={carregando} onVerDetalhes={abrirDetalhes} />

        <PaginacaoAdmin
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          totalRegistros={pedidosFiltrados.length}
          onPaginaChange={setPaginaAtual}
        />
      </div>

      <ModalDetalhesPedido
        pedido={pedidoSelecionado}
        aberto={modalAberto}
        carregando={carregandoDetalhe}
        onFechar={fecharDetalhes}
        atualizarStatus = {atualizarStatusPedido}
      />
    </div>
  );
}