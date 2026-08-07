import styles from "../../../styles/User/catalogoAzory.module.css"

const PHRASE =
  "COLEÇÃO ETERNA · LAPIDAÇÃO ARTESANAL · GARANTIA VITALÍCIA · PEÇAS NUMERADAS · "

const CONTENT = PHRASE.repeat(6)

export default function MarqueeBar() {
  return (
    <div className={styles.marquee}>
      <div className={styles.marqueeTrack}>
        <div className={styles.marqueeContent}>
          <span className={styles.marqueeText}>
            {CONTENT}
          </span>
        </div>

        <div className={styles.marqueeContent} aria-hidden="true">
          <span className={styles.marqueeText}>
            {CONTENT}
          </span>
        </div>
      </div>

      <span className={styles.srOnly}>
        Coleção eterna, lapidação artesanal, garantia vitalícia, peças numeradas.
      </span>
    </div>
  )
}