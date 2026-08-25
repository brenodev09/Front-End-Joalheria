import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import styles from '../../styles/Admin/cupons.module.css';
import { api } from '../../services/api';

import BarraFiltros from '../../components/Admin/Cupons/BarraFiltros/BarraFiltros';
import TabelaCupons from '../../components/Admin/Cupons/TabelaCupons/TabelaCupons';
import ModalAddCupom from '../../components/Admin/Modais/ModalAddCupom/ModalAddCupom';
import ModalEditarCupom from '../../components/Admin/Modais/ModalEditarCupom/ModalEditarCupom';
import ModalDeletarCupom from '../../components/Admin/Modais/ModalDeletarCupom';
import PaginacaoAdmin from '../../components/Admin/PaginacaoAdmin/PaginacaoAdmin';

const ITENS_POR_PAGINA = 5;

// Status possíveis de um cupom.
const STATUS_CUPOM = {
  ATIVO: 'ativo',
  INATIVO: 'inativo',
};

const STATUS_LABEL = {
  ativo: 'Ativo',
  inativo: 'Inativo',
};

const ICONES = {
  total: (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M12 12v9M4 7.5 12 12l8-4.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  ),
  ativos: (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M4 12.5 9.5 18 20 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  inativos: (
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  tipos: (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M20 12.6 12.6 20a1.5 1.5 0 0 1-2.12 0l-6.48-6.48a1.5 1.5 0 0 1 0-2.12L11.4 4H18a2 2 0 0 1 2 2v6.6Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="15" cy="9" r="1.4" stroke="currentColor" strokeWidth="1.3" />
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

const variantesEntrada = {
  oculto: { opacity: 0, y: 18 },
  visivel: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

function normalizarCupom(cupom) {
  const tipo = cupom.tipo === 'percentual' ? 'Percentual' : 'Valor fixo';
  const dataFim = cupom.data_fim ? new Date(cupom.data_fim) : null;
  const diasRestantes = dataFim
    ? Math.max(0, Math.ceil((dataFim.getTime() - Date.now()) / 86400000))
    : null;

  return {
    ...cupom,
    nome: cupom.codigo,
    tipo,
    valor: Number(cupom.valor || 0),
    valorFormatado: tipo === 'Percentual'
      ? `${Number(cupom.valor || 0)}%`
      : `R$ ${Number(cupom.valor || 0).toFixed(2).replace('.', ',')}`,
    usoMaximo: cupom.quantidade_uso ?? '',
    valorMinimo: cupom.valor_minimo ?? 0,
    usos: `${cupom.usado || 0}/${cupom.quantidade_uso ?? '∞'}`,
    expira: dataFim ? (diasRestantes > 0 ? `${diasRestantes} dias` : 'Expirado') : 'Sem expiração',
    validadeDias: diasRestantes || 1,
    status: cupom.ativo ? STATUS_CUPOM.ATIVO : STATUS_CUPOM.INATIVO,
  };
}

export default function GestaoCupons() {
  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('todos');
  const [tipoFiltro, setTipoFiltro] = useState('todos');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [cupons, setCupons] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [modalAdicionarAberto, setModalAdicionarAberto] = useState(false);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [cupomSelecionado, setCupomSelecionado] = useState(null);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);

  async function carregarCupons() {
    try {
      setCarregando(true);
      setErro('');
      const resposta = await api.get('/cupons');
      const dados = Array.isArray(resposta.data) ? resposta.data : resposta.data?.cupons || [];
      setCupons(dados.map(normalizarCupom));
    } catch (error) {
      setErro(error.response?.data?.erro || 'Não foi possível carregar os cupons.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarCupons();
  }, []);

  async function adicionarCupom(dados) {
    await api.post('/cupons', dados);
    await carregarCupons();
  }

  async function editarCupom(id, dados) {
    await api.put(`/cupons/${id}`, dados);
    await carregarCupons();
  }

  function abrirExclusao(cupom) {
    setCupomSelecionado(cupom);
    setModalExcluirAberto(true);
  }

  async function excluirCupom() {
    if (!cupomSelecionado) return;
    try {
      await api.delete(`/cupons/${cupomSelecionado.id}`);
      setModalExcluirAberto(false);
      setCupomSelecionado(null);
      await carregarCupons();
    } catch (error) {
      setErro(error.response?.data?.erro || 'Não foi possível excluir o cupom.');
    }
  }

  async function alternarStatus(cupom) {
    try {
      await api.patch(`/cupons/${cupom.id}/status`, { ativo: cupom.status !== STATUS_CUPOM.ATIVO });
      await carregarCupons();
    } catch (error) {
      setErro(error.response?.data?.erro || 'Não foi possível alterar o status do cupom.');
    }
  }

  const tiposDisponiveis = useMemo(
    () => [...new Set(cupons.map((c) => c.tipo))].sort(),
    [cupons]
  );

  const metricas = useMemo(() => {
    const total = cupons.length;
    const ativos = cupons.filter((c) => c.status === STATUS_CUPOM.ATIVO).length;
    const inativos = cupons.filter((c) => c.status === STATUS_CUPOM.INATIVO).length;
    const tipos = tiposDisponiveis.length;

    return { total, ativos, inativos, tipos };
  }, [cupons, tiposDisponiveis]);

  const cartoes = [
    { chave: 'total', rotulo: 'Total de cupons', valor: metricas.total, tom: 'ouro' },
    { chave: 'ativos', rotulo: 'Cupons ativos', valor: metricas.ativos, tom: 'sucesso' },
    { chave: 'inativos', rotulo: 'Cupons inativos', valor: metricas.inativos, tom: 'neutro' },
    { chave: 'tipos', rotulo: 'Tipos de cupom', valor: metricas.tipos, tom: 'azul' },
  ];

  const cuponsFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return cupons.filter((cupom) => {
      const passaStatus = statusFiltro === 'todos' || cupom.status === statusFiltro;
      if (!passaStatus) return false;

      const passaTipo = tipoFiltro === 'todos' || cupom.tipo === tipoFiltro;
      if (!passaTipo) return false;

      if (!termo) return true;
      return (
        cupom.nome.toLowerCase().includes(termo) ||
        cupom.tipo.toLowerCase().includes(termo)
      );
    });
  }, [cupons, busca, statusFiltro, tipoFiltro]);

  const totalPaginas = Math.max(1, Math.ceil(cuponsFiltrados.length / ITENS_POR_PAGINA));

  const cuponsDaPagina = useMemo(() => {
    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    return cuponsFiltrados.slice(inicio, inicio + ITENS_POR_PAGINA);
  }, [cuponsFiltrados, paginaAtual]);

  function abrirEdicao(cupom) {
    setCupomSelecionado(cupom);
    setModalEditarAberto(true);
  }

  return (
    <div className={styles.pagina}>
      <div className={styles.container}>
        <motion.header
          className={styles.adminProductsHeader}
          variants={variantesEntrada}
          initial="oculto"
          animate="visivel"
        >
          <div>
            <h1>Cupons</h1>
            <p>Gerencie os cupons cadastrados na loja</p>
          </div>

          <button
            className={styles.addFuncionario}
            onClick={() => setModalAdicionarAberto(true)}
          >
            <img
              width="20"
              height="20"
              src="https://img.icons8.com/ios-filled/23/plus-math.png"
              alt="plus-math"
            />
            <p>ADICIONAR CUPOM</p>
          </button>
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
          statusOpcoes={STATUS_CUPOM}
          statusLabel={STATUS_LABEL}
          tipoFiltro={tipoFiltro}
          onTipoChange={setTipoFiltro}
          tiposDisponiveis={tiposDisponiveis}
        />

        {erro && <p role="alert">{erro}</p>}
        {carregando ? <p>Carregando cupons...</p> : <TabelaCupons
          cupons={cuponsDaPagina}
          onEditar={abrirEdicao}
          onExcluir={abrirExclusao}
          onAlternarStatus={alternarStatus}
        />}

        <PaginacaoAdmin
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          totalRegistros={cuponsFiltrados.length}
          onPaginaChange={setPaginaAtual}
        />
      </div>

      <ModalAddCupom
        isOpen={modalAdicionarAberto}
        fecharModal={() => setModalAdicionarAberto(false)}
        onSalvar={adicionarCupom}
      />

      <ModalEditarCupom
        isOpen={modalEditarAberto}
        fecharModal={() => setModalEditarAberto(false)}
        cupom={cupomSelecionado}
        onSalvar={editarCupom}
      />

      <ModalDeletarCupom
        aberto={modalExcluirAberto}
        cupom={cupomSelecionado}
        aoFechar={() => {
          setModalExcluirAberto(false);
          setCupomSelecionado(null);
        }}
        aoConfirmar={excluirCupom}
      />
    </div>
  );
}