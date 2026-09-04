import { motion } from 'framer-motion';
import styles from './PaginacaoAdmin.module.css';

export default function PaginacaoAdmin({ paginaAtual, totalPaginas, totalRegistros, onPaginaChange, labelRegistros = 'registros' }) {
  if (totalPaginas <= 1) return null;

  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  return (
    <motion.div
      className={styles.paginacao}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <span className={styles.contagem}>
        Página {paginaAtual} de {totalPaginas} · {totalRegistros} {labelRegistros}
      </span>

      <div className={styles.controles}>
        <button
          type="button"
          className={styles.botaoNav}
          onClick={() => onPaginaChange(paginaAtual - 1)}
          disabled={paginaAtual === 1}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {paginas.map((pagina) => (
          <button
            key={pagina}
            type="button"
            className={`${styles.botaoPagina} ${pagina === paginaAtual ? styles.botaoPaginaAtiva : ''}`}
            onClick={() => onPaginaChange(pagina)}
          >
            {pagina}
          </button>
        ))}

        <button
          type="button"
          className={styles.botaoNav}
          onClick={() => onPaginaChange(paginaAtual + 1)}
          disabled={paginaAtual === totalPaginas}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
