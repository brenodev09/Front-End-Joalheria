import { motion } from "framer-motion"
import styles from "../../../styles/User/catalogoAzory.module.css"

export default function ManifestoQuote() {
  return (
    <section className={styles.manifesto}>
      <span className={styles.manifestoMark} aria-hidden="true">
        {"\u201C"}
      </span>
      <div className={styles.manifestoInner}>
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className={styles.manifestoQuote}>
            Uma joia Azory não é comprada, é herdada.
          </p>
          <footer className={styles.manifestoFooter}>
            <span className={`${styles.label} ${styles.manifestoAuthor}`}>— Manifesto Azory</span>
          </footer>
        </motion.blockquote>
      </div>
    </section>
  )
}
