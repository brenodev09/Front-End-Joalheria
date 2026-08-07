import styles from "../../../styles/User/catalogoAzory.module.css"

function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonImage} />
      <div className={styles.skeletonBody}>
        <div className={`${styles.skeletonLine} ${styles.skeletonLineSm}`} />
        <div className={`${styles.skeletonLine} ${styles.skeletonLineMd}`} />
        <div className={`${styles.skeletonLine} ${styles.skeletonLineXs}`} />
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 9 }) {
  return (
    <div className={styles.skeletonGrid}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function EmptyState({ title = "Nenhuma peça neste arquivo", text }) {
  return (
    <div className={styles.state}>
      <div className={styles.stateSeal} aria-hidden="true">
        <span className={styles.stateSealText}>Az</span>
      </div>
      <h2 className={styles.stateTitle}>{title}</h2>
      <p className={styles.stateText}>
        {text ||
          "O atelier não localizou peças com estes critérios. Ajuste a busca para revelar outras raridades da coleção."}
      </p>
    </div>
  )
}

export function ErrorState({ onRetry }) {
  return (
    <div className={styles.state}>
      <span className={`${styles.label} ${styles.stateKicker}`}>Interrupção no arquivo</span>
      <h2 className={styles.stateTitle}>Não foi possível abrir esta gaveta</h2>
      <p className={styles.stateText}>
        Houve uma falha discreta ao consultar a coleção. Tente novamente em instantes.
      </p>
      {onRetry ? (
        <button type="button" onClick={onRetry} className={`${styles.labelTight} ${styles.stateAction}`}>
          Tentar novamente —
        </button>
      ) : null}
    </div>
  )
}
