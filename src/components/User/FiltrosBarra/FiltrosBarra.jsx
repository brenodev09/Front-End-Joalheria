import styles from './FiltrosBarra.module.css';

const FILTROS = [
  { key: 'todos', label: 'Todos' },
  { key: 'andamento', label: 'Em andamento' },
  { key: 'entregues', label: 'Entregues' },
  { key: 'cancelados', label: 'Cancelados' },
];

export default function FiltrosBarra({ filtroAtivo, onFiltroChange, busca, onBuscaChange, className }) {
  return (
    <div className={`${styles.barra} ${className || ''}`}>
      <div className={styles.tabs} role="tablist" aria-label="Filtrar pedidos">
        {FILTROS.map((filtro) => (
          <button
            key={filtro.key}
            role="tab"
            aria-selected={filtroAtivo === filtro.key}
            className={`${styles.tab} ${filtroAtivo === filtro.key ? styles.tabAtiva : ''}`}
            onClick={() => onFiltroChange(filtro.key)}
            type="button"
          >
            {filtro.label}
          </button>
        ))}
      </div>

      <div className={styles.busca}>
        <svg viewBox="0 0 24 24" fill="none" className={styles.buscaIcon}>
          <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M20 20l-4.6-4.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
          placeholder="Buscar por número do pedido ou peça"
          className={styles.buscaInput}
        />
      </div>
    </div>
  );
}
