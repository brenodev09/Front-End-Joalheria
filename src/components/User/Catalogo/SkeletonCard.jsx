import { motion } from "framer-motion";
import styles from "../../../styles/User/skeletonCard.module.css";

export default function SkeletonCard({ layout = "compact" }) {
    return (
        <motion.article
            layout
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.35,
                ease: [0.25, 1, 0.5, 1],
            }}
            className={`
                ${styles.card}
                ${layout === "expanded" ? styles.expanded : styles.compact}
            `}
        >
            {/* Imagem */}
            <div className={styles.imageWrapper}>
                <div className={`${styles.shimmer} ${styles.image}`} />

                <div className={styles.badges}>
                    <div className={`${styles.shimmer} ${styles.badge}`} />
                    <div className={`${styles.shimmer} ${styles.favorite}`} />
                </div>
            </div>

            {/* Conteúdo */}
            <div className={styles.content}>
                <div className={`${styles.shimmer} ${styles.title}`} />

                <div className={styles.description}>
                    <div className={`${styles.shimmer} ${styles.line}`} />
                    <div className={`${styles.shimmer} ${styles.smallLine}`} />
                </div>

                <div className={`${styles.shimmer} ${styles.price}`} />

                <div className={`${styles.shimmer} ${styles.button}`} />
            </div>
        </motion.article>
    );
}