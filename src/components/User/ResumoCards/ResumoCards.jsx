import styles from './ResumoCards.module.css';

const ICONS = {
  total: (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M12 2 3 6.5 12 11l9-4.5L12 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M3 6.5V17l9 5 9-5V6.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M12 11v11" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
  entregue: (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M4 12.5 9.5 18 20 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  transporte: (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M3 7h11v9H3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M14 10h4l3 3v3h-7v-6Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="7.5" cy="18.5" r="1.6" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="17" cy="18.5" r="1.6" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
  cancelado: (
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
};

export default function ResumoCards({ resumo, className }) {
  const cards = [
    { key: 'total', label: 'Total de pedidos', valor: resumo.total, icon: ICONS.total, tone: 'ivory' },
    { key: 'entregue', label: 'Entregues', valor: resumo.entregues, icon: ICONS.entregue, tone: 'success' },
    { key: 'transporte', label: 'Em transporte', valor: resumo.transporte, icon: ICONS.transporte, tone: 'gold' },
    { key: 'cancelado', label: 'Cancelados', valor: resumo.cancelados, icon: ICONS.cancelado, tone: 'danger' },
  ];

  return (
    <div className={`${styles.grid} ${className || ''}`}>
      {cards.map((card) => (
        <div className={styles.card} data-resumo-card key={card.key}>
          <div className={`${styles.iconWrap} ${styles[`tone-${card.tone}`]}`}>{card.icon}</div>
          <div className={styles.info}>
            <span className={styles.valor}>{card.valor}</span>
            <span className={styles.label}>{card.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
