import styles from "../../../styles/User/catalogoAzory.module.css"

export default function CertificateSeal() {
  return (
    <div className={styles.seal} aria-hidden="true">
      <div className={styles.sealInner}>
        <span className={styles.sealTop}>Certificado</span>
        <span className={styles.sealName}>Azory</span>
        <span className={styles.sealYear}>MMXXVI</span>
      </div>
    </div>
  )
}
