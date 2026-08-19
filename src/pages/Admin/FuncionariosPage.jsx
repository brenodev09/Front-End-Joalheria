import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import styles from '../../styles/Admin/FuncionariosPage.module.css';

import BarraFiltros from '../../components/Admin/Funcionarios2/BarraFiltros/BarraFiltros';
import TabelaFuncionarios from '../../components/Admin/Funcionarios2/TabelaFuncionarios/TabelaFuncionarios';
import ModalAdicionarFuncionario from '../../components/Admin/Modais/ModalAddFuncionario/ModalAddFuncionario';
import ModalEditarFuncionario from '../../components/Admin/Modais/ModalEditarFuncionario/ModalEditarFuncionario';
import PaginacaoAdmin from '../../components/Admin/PaginacaoAdmin/PaginacaoAdmin';

const ITENS_POR_PAGINA = 5;

// Status possíveis de um funcionário. Ajuste os valores aqui caso o enum do
// banco use outros nomes (ex.: "afastado", "ferias" etc.).
const STATUS_FUNCIONARIO = {
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
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4.5 20c.9-3.6 4-5.5 7.5-5.5s6.6 1.9 7.5 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
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
  cargos: (
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

// Dados de exemplo — troque pelo fetch real (ex.: GET /funcionarios) quando o
// endpoint estiver pronto. O formato de cada item já é o que a tabela e os
// filtros esperam, então basta normalizar a resposta da API pra esse shape.
const FUNCIONARIOS_MOCK = [
  { id: 1, nome: 'Marina Costa', foto: 'https://i.pravatar.cc/100?img=47', email: 'marina.costa@azory.com', telefone: '(11) 98765-4321', cargo: 'Gerente de Loja', dataAdmissao: '12/03/2022', status: STATUS_FUNCIONARIO.ATIVO },
  { id: 2, nome: 'Rafael Souza', foto: 'https://i.pravatar.cc/100?img=12', email: 'rafael.souza@azory.com', telefone: '(11) 91234-5678', cargo: 'Vendedor', dataAdmissao: '04/07/2023', status: STATUS_FUNCIONARIO.ATIVO },
  { id: 3, nome: 'Beatriz Lima', foto: 'https://i.pravatar.cc/100?img=32', email: 'beatriz.lima@azory.com', telefone: '(11) 99876-5432', cargo: 'Estoquista', dataAdmissao: '19/01/2021', status: STATUS_FUNCIONARIO.INATIVO },
  { id: 4, nome: 'Thiago Almeida', foto: 'https://i.pravatar.cc/100?img=15', email: 'thiago.almeida@azory.com', telefone: '(11) 97654-3210', cargo: 'Vendedor', dataAdmissao: '02/09/2023', status: STATUS_FUNCIONARIO.ATIVO },
  { id: 5, nome: 'Camila Ferreira', foto: 'https://i.pravatar.cc/100?img=45', email: 'camila.ferreira@azory.com', telefone: '(11) 96543-2109', cargo: 'Caixa', dataAdmissao: '28/11/2022', status: STATUS_FUNCIONARIO.ATIVO },
  { id: 6, nome: 'Lucas Martins', foto: 'https://i.pravatar.cc/100?img=51', email: 'lucas.martins@azory.com', telefone: '(11) 95432-1098', cargo: 'Estoquista', dataAdmissao: '15/05/2020', status: STATUS_FUNCIONARIO.INATIVO },
  { id: 7, nome: 'Juliana Ribeiro', foto: 'https://i.pravatar.cc/100?img=25', email: 'juliana.ribeiro@azory.com', telefone: '(11) 94321-0987', cargo: 'Gerente de Loja', dataAdmissao: '30/06/2019', status: STATUS_FUNCIONARIO.ATIVO },
  { id: 8, nome: 'Pedro Henrique', foto: 'https://i.pravatar.cc/100?img=8', email: 'pedro.henrique@azory.com', telefone: '(11) 93210-9876', cargo: 'Caixa', dataAdmissao: '09/02/2024', status: STATUS_FUNCIONARIO.ATIVO },
];

export default function GestaoFuncionarios() {
  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('todos');
  const [cargoFiltro, setCargoFiltro] = useState('todos');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [funcionarios, setFuncionarios] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [modalAdicionarAberto, setModalAdicionarAberto] = useState(false);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);

  // Carrega a lista de funcionários uma única vez, na página — é aqui (e não
  // dentro de TabelaFuncionarios) porque os cards de métrica e os filtros
  // precisam da lista inteira, não só da página atual.
  useEffect(() => {
    setCarregando(true);
    const tempo = setTimeout(() => {
      setFuncionarios(FUNCIONARIOS_MOCK);
      setCarregando(false);
    }, 400);
    return () => clearTimeout(tempo);
  }, []);

  const cargosDisponiveis = useMemo(
    () => [...new Set(funcionarios.map((f) => f.cargo))].sort(),
    [funcionarios]
  );

  const metricas = useMemo(() => {
    const total = funcionarios.length;
    const ativos = funcionarios.filter((f) => f.status === STATUS_FUNCIONARIO.ATIVO).length;
    const inativos = funcionarios.filter((f) => f.status === STATUS_FUNCIONARIO.INATIVO).length;
    const cargos = cargosDisponiveis.length;

    return { total, ativos, inativos, cargos };
  }, [funcionarios, cargosDisponiveis]);

  const cartoes = [
    { chave: 'total', rotulo: 'Total de funcionários', valor: metricas.total, tom: 'ouro' },
    { chave: 'ativos', rotulo: 'Funcionários ativos', valor: metricas.ativos, tom: 'sucesso' },
    { chave: 'inativos', rotulo: 'Funcionários Inativos', valor: metricas.inativos, tom: 'neutro' },
    { chave: 'cargos', rotulo: 'Cargos Cadastrados', valor: metricas.cargos, tom: 'azul' },
  ];

  const funcionariosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return funcionarios.filter((funcionario) => {
      const passaStatus = statusFiltro === 'todos' || funcionario.status === statusFiltro;
      if (!passaStatus) return false;

      const passaCargo = cargoFiltro === 'todos' || funcionario.cargo === cargoFiltro;
      if (!passaCargo) return false;

      if (!termo) return true;
      return (
        funcionario.nome.toLowerCase().includes(termo) ||
        funcionario.email.toLowerCase().includes(termo) ||
        funcionario.cargo.toLowerCase().includes(termo)
      );
    });
  }, [funcionarios, busca, statusFiltro, cargoFiltro]);

  // Sempre que a busca ou os filtros mudam, volta pra primeira página.
  useEffect(() => {
    setPaginaAtual(1);
  }, [busca, statusFiltro, cargoFiltro]);

  const totalPaginas = Math.max(1, Math.ceil(funcionariosFiltrados.length / ITENS_POR_PAGINA));

  const funcionariosDaPagina = useMemo(() => {
    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    return funcionariosFiltrados.slice(inicio, inicio + ITENS_POR_PAGINA);
  }, [funcionariosFiltrados, paginaAtual]);

  // Adiciona o funcionário criado no modal ao topo da listagem local.
  function adicionarFuncionario(novoFuncionario) {
    setFuncionarios((atual) => [novoFuncionario, ...atual]);
  }

  // Atualiza o funcionário editado mantendo a posição/id na listagem.
  function atualizarFuncionario(funcionarioAtualizado) {
    setFuncionarios((atual) =>
      atual.map((f) => (f.id === funcionarioAtualizado.id ? funcionarioAtualizado : f))
    );
  }

  function abrirEdicao(funcionario) {
    setFuncionarioSelecionado(funcionario);
    setModalEditarAberto(true);
  }

  function excluirFuncionario(funcionario) {
    const confirmou = window.confirm(`Remover ${funcionario.nome} da equipe?`);
    if (!confirmou) return;
    setFuncionarios((atual) => atual.filter((f) => f.id !== funcionario.id));
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
            <h1>Funcionários</h1>
            <p>Gerencie os funcionários da empresa.</p>
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
            <p>ADICIONAR FUNCIONARIO</p>
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
          statusOpcoes={STATUS_FUNCIONARIO}
          statusLabel={STATUS_LABEL}
          cargoFiltro={cargoFiltro}
          onCargoChange={setCargoFiltro}
          cargosDisponiveis={cargosDisponiveis}
        />

        <TabelaFuncionarios
          funcionarios={funcionariosDaPagina}
          carregando={carregando}
          onEditar={abrirEdicao}
          onExcluir={excluirFuncionario}
        />

        <PaginacaoAdmin
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          totalRegistros={funcionariosFiltrados.length}
          onPaginaChange={setPaginaAtual}
        />
      </div>

      <ModalAdicionarFuncionario
        isOpen={modalAdicionarAberto}
        fecharModal={() => setModalAdicionarAberto(false)}
        cargosDisponiveis={cargosDisponiveis}
        aoSalvar={adicionarFuncionario}
      />

      <ModalEditarFuncionario
        isOpen={modalEditarAberto}
        fecharModal={() => setModalEditarAberto(false)}
        funcionario={funcionarioSelecionado}
        cargosDisponiveis={cargosDisponiveis}
        aoSalvar={atualizarFuncionario}
      />
    </div>
  );
}