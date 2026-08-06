import { motion } from 'framer-motion';
import styles from './BarraFiltros.module.css';
import { STATUS_PEDIDO, STATUS_LABEL } from '../../../pages/Admin/mockPedidosAdmin';

const OPCOES_PERIODO = [
  { valor: 'todos', rotulo: 'Todo o período' },
  { valor: 'hoje', rotulo: 'Hoje' },
  { valor: '7dias', rotulo: 'Últimos 7 dias' },
  { valor: '30dias', rotulo: 'Últimos 30 dias' },
];

export default function BarraFiltros({
  busca,
  onBuscaChange,
  statusFiltro,
  onStatusChange,
  periodoFiltro,
  onPeriodoChange,
}) {
  return (
    <motion.div
      className={styles.barra}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.campoBusca}>
        <svg viewBox="0 0 24 24" fill="none" className={styles.iconeBusca}>
          <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M20 20l-4.6-4.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
          placeholder="Buscar por número do pedido, cliente ou e-mail"
          className={styles.inputBusca}
        />
      </div>

      <div className={styles.gruposFiltro}>
        <div className={styles.campoSelect}>
          {/* <label className={styles.rotuloSelect}>Status</label> */}
          <select
            value={statusFiltro}
            onChange={(e) => onStatusChange(e.target.value)}
            className={styles.select}
          >
            <option value="todos">Todos os status</option>
            {Object.values(STATUS_PEDIDO).map((status) => (
              <option key={status} value={status}>
                {STATUS_LABEL[status]}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.campoSelect}>
          {/* <label className={styles.rotuloSelect}>Período</label> */}
          <select
            value={periodoFiltro}
            onChange={(e) => onPeriodoChange(e.target.value)}
            className={styles.select}
          >
            {OPCOES_PERIODO.map((opcao) => (
              <option key={opcao.valor} value={opcao.valor}>
                {opcao.rotulo}
              </option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>
  );
}
