import { motion } from 'framer-motion';
import styles from './BarraFiltros.module.css';

// Recebe os status/labels e a lista de cargos disponíveis vindos da página,
// que é quem tem a lista completa de funcionários carregada.
export default function BarraFiltros({
  busca,
  onBuscaChange,
  statusFiltro,
  onStatusChange,
  statusOpcoes,
  statusLabel,
  cargoFiltro,
  onCargoChange,
  cargosDisponiveis,
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
          placeholder="Buscar por nome, e-mail ou cargo"
          className={styles.inputBusca}
        />
      </div>

      <div className={styles.gruposFiltro}>
        <div className={styles.campoSelect}>
          <select
            value={statusFiltro}
            onChange={(e) => onStatusChange(e.target.value)}
            className={styles.select}
          >
            <option value="todos">Todos os status</option>
            {Object.values(statusOpcoes).map((status) => (
              <option key={status} value={status}>
                {statusLabel[status]}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.campoSelect}>
          <select
            value={cargoFiltro}
            onChange={(e) => onCargoChange(e.target.value)}
            className={styles.select}
          >
            <option value="todos">Todos os cargos</option>
            {cargosDisponiveis.map((cargo) => (
              <option key={cargo} value={cargo}>
                {cargo}
              </option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>
  );
}