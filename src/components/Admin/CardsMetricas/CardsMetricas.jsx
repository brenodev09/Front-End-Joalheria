import { motion } from 'framer-motion';
import styles from './CardsMetricas.module.css';

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

export default function CardsMetricas({ metricas }) {
  const cartoes = [
    { chave: 'pedidosHoje', rotulo: 'Pedidos Hoje', valor: metricas.pedidosHoje, tom: 'ouro' },
    { chave: 'faturamento', rotulo: 'Faturamento', valor: metricas.faturamento, tom: 'ivorio' },
    { chave: 'pendentes', rotulo: 'Pendentes', valor: metricas.pendentes, tom: 'neutro' },
    { chave: 'emEntrega', rotulo: 'Em Entrega', valor: metricas.emEntrega, tom: 'azul' },
    { chave: 'concluidos', rotulo: 'Concluídos', valor: metricas.concluidos, tom: 'sucesso' },
  ];

  return (
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
  );
}
