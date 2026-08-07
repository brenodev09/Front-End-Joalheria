import styles from "../../../styles/User/catalogoAzory.module.css"

const COLUMNS = [
  { numeral: "I", title: "Envio segurado", text: "Cada peça viaja assegurada e acompanhada de dossiê." },
  { numeral: "II", title: "Garantia vitalícia", text: "Manutenção e restauro pela vida inteira da joia." },
  { numeral: "III", title: "Embalagem de assinatura", text: "Estojo numerado, lacrado no atelier AZORY." },
]

export default function TrustFooter() {
  return (
    <footer className={styles.trust}>
      <div className={styles.trustInner}>
        <div className={styles.trustGrid}>
          {COLUMNS.map((c) => (
            <div key={c.numeral} className={styles.trustCol}>
              <div className={styles.trustNumeral}>{c.numeral}</div>
              <h3 className={styles.trustTitle}>{c.title}</h3>
              <p className={styles.trustText}>{c.text}</p>
            </div>
          ))}
        </div>
        <div className={styles.trustBottom}>
          <span className={styles.trustBrand}>AZORY</span>
          <span className={`${styles.label} ${styles.trustYear}`}>Coleção Eterna — MMXXVI</span>
        </div>
      </div>
    </footer>
  )
}
