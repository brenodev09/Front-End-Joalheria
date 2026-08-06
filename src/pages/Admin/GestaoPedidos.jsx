import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import styles from '../../styles/Admin/GestaoPedidos.module.css';
import CardsMetricas from '../../components/Admin/CardsMetricas/CardsMetricas';
import BarraFiltros from '../../components/Admin/BarraFiltros/BarraFiltros';
import TabelaPedidos from '../../components/Admin/TabelaPedidos/TabelaPedidos';
import ModalDetalhesPedido from '../../components/Admin/ModalDetalhesPedido/ModalDetalhesPedido';
import PaginacaoAdmin from '../../components/Admin/PaginacaoAdmin/PaginacaoAdmin';
import { mockPedidosAdmin, STATUS_PEDIDO } from './mockPedidosAdmin';

const ITENS_POR_PAGINA = 5;

// "Hoje" fictício, usado só pra o filtro de período funcionar de forma
// consistente com as datas do mock — página 100% visual, sem dados reais.
const REFERENCIA_HOJE = new Date(2026, 7, 5);

function converterDataBr(dataStr) {
  const [dataParte] = dataStr.split(' ');
  const [dia, mes, ano] = dataParte.split('/').map(Number);
  return new Date(ano, mes - 1, dia);
}

function estaNoPeriodo(dataPedido, periodo) {
  if (periodo === 'todos') return true;
  const diffDias = Math.floor((REFERENCIA_HOJE - converterDataBr(dataPedido)) / (1000 * 60 * 60 * 24));
  if (periodo === 'hoje') return diffDias === 0;
  if (periodo === '7dias') return diffDias >= 0 && diffDias <= 7;
  if (periodo === '30dias') return diffDias >= 0 && diffDias <= 30;
  return true;
}

function paraNumero(valorFormatado) {
  return Number(valorFormatado.replace('R$', '').trim().replaceAll('.', '').replace(',', '.'));
}

const formatarMoeda = (valor) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

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

  const metricas = useMemo(() => {
    const pedidosHoje = mockPedidosAdmin.filter((p) => estaNoPeriodo(p.dataPedido, 'hoje')).length;

    const faturamento = mockPedidosAdmin
      .filter((p) => p.status !== STATUS_PEDIDO.CANCELADO)
      .reduce((acc, p) => acc + paraNumero(p.total), 0);

    const pendentes = mockPedidosAdmin.filter((p) => p.status === STATUS_PEDIDO.PENDENTE).length;
    const emEntrega = mockPedidosAdmin.filter((p) => p.status === STATUS_PEDIDO.ENVIADO).length;
    const concluidos = mockPedidosAdmin.filter((p) => p.status === STATUS_PEDIDO.ENTREGUE).length;

    return {
      pedidosHoje,
      faturamento: formatarMoeda(faturamento),
      pendentes,
      emEntrega,
      concluidos,
    };
  }, []);

  const pedidosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return mockPedidosAdmin.filter((pedido) => {
      const passaStatus = statusFiltro === 'todos' || pedido.status === statusFiltro;
      if (!passaStatus) return false;

      const passaPeriodo = estaNoPeriodo(pedido.dataPedido, periodoFiltro);
      if (!passaPeriodo) return false;

      if (!termo) return true;
      return (
        pedido.numero.toLowerCase().includes(termo) ||
        pedido.cliente.nome.toLowerCase().includes(termo) ||
        pedido.cliente.email.toLowerCase().includes(termo)
      );
    });
  }, [busca, statusFiltro, periodoFiltro]);

  // Sempre que a busca ou os filtros mudam, volta pra primeira página.
  useEffect(() => {
    setPaginaAtual(1);
  }, [busca, statusFiltro, periodoFiltro]);

  const totalPaginas = Math.max(1, Math.ceil(pedidosFiltrados.length / ITENS_POR_PAGINA));

  const pedidosDaPagina = useMemo(() => {
    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    return pedidosFiltrados.slice(inicio, inicio + ITENS_POR_PAGINA);
  }, [pedidosFiltrados, paginaAtual]);

  function abrirDetalhes(pedido) {
    setPedidoSelecionado(pedido);
    setModalAberto(true);
  }

  function fecharDetalhes() {
    setModalAberto(false);
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

        <motion.div variants={variantesEntrada} initial="oculto" animate="visivel">
          <CardsMetricas metricas={metricas} />
        </motion.div>

        <BarraFiltros
          busca={busca}
          onBuscaChange={setBusca}
          statusFiltro={statusFiltro}
          onStatusChange={setStatusFiltro}
          periodoFiltro={periodoFiltro}
          onPeriodoChange={setPeriodoFiltro}
        />

        <TabelaPedidos pedidos={pedidosDaPagina} onVerDetalhes={abrirDetalhes} />

        <PaginacaoAdmin
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          totalRegistros={pedidosFiltrados.length}
          onPaginaChange={setPaginaAtual}
        />
      </div>

      <ModalDetalhesPedido pedido={pedidoSelecionado} aberto={modalAberto} onFechar={fecharDetalhes} />
    </div>
  );
}
