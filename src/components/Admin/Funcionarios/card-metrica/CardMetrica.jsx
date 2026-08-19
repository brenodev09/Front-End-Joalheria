import styles from "./CardMetrica.module.css";

/**
 * Card de métrica exibido no topo da página.
 * @param {{
 *   icone: React.ReactNode,
 *   titulo: string,
 *   valor: number | string,
 *   tom?: "dourado" | "sucesso" | "neutro" | "info"
 * }} props
 */
function CardMetrica({ icone, titulo, valor, tom = "dourado" }) {
  return (
    <div className={styles.cardMetrica}>
      <div className={`${styles.cardMetricaIcone} ${styles[`tom-${tom}`]}`}>
        {icone}
      </div>
      <div className={styles.cardMetricaTexto}>
        <span className={styles.cardMetricaValor}>{valor}</span>
        <span className={styles.cardMetricaTitulo}>{titulo}</span>
      </div>
    </div>
  );
}

export default CardMetrica;
