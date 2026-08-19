import styles from "./BadgeStatus.module.css";

/**
 * Badge visual de status do funcionário.
 * @param {{ status: "Ativo" | "Inativo" }} props
 */
function BadgeStatus({ status }) {
  const ativo = status === "Ativo";

  return (
    <span
      className={`${styles.badgeStatus} ${
        ativo ? styles.badgeStatusAtivo : styles.badgeStatusInativo
      }`}
    >
      <span className={styles.badgeStatusPonto} />
      {status}
    </span>
  );
}

export default BadgeStatus;
