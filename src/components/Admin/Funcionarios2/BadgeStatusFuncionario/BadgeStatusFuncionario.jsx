import styles from './BadgeStatusFuncionario.module.css';

// Ajuste aqui caso surjam outros status de funcionário além de
// ativo/inativo (ex.: "ferias", "afastado").
const CONFIG_STATUS = {
  ativo: { rotulo: 'Ativo', tom: 'sucesso' },
  inativo: { rotulo: 'Inativo', tom: 'neutro' },
};

export default function BadgeStatusFuncionario({ status }) {
  const config = CONFIG_STATUS[status] ?? { rotulo: status, tom: 'neutro' };

  return (
    <span className={`${styles.badge} ${styles[`tom-${config.tom}`]}`}>
      <span className={styles.ponto} />
      {config.rotulo}
    </span>
  );
}