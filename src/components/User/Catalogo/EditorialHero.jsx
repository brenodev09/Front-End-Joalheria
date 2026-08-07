import { motion } from "framer-motion"
import styles from "../../../styles/User/catalogoAzory.module.css"

export default function EditorialHero({ totalPieces = 0 }) {
  return (
    <section className={styles.hero}>

<div className={styles.heroBigNumber}>
01
</div>

<div className={styles.heroInner}>

<p className={styles.heroKicker}>
CATÁLOGO EDITORIAL
</p>

<h1 className={styles.heroTitle}>

Arte que
<em> atravessa </em>
gerações.

</h1>

<div className={styles.heroRule}></div>

<p className={styles.heroText}>

<span className={styles.heroDropcap}>A</span>

cada escultura nasce de um processo manual,
utilizando materiais nobres e acabamento
artesanal para criar peças exclusivas.

</p>

</div>

</section>
  )
}
