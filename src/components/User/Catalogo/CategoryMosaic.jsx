import { motion } from "framer-motion";

import CertificateSeal from "./CertificateSeal";
import styles from "../../../styles/User/catalogoAzory.module.css";
import { resolveImage } from "./azoryUtils";

// Tela "Todas": reaproveita o MESMO visual de card do ProductMosaic
// (.mosaic / .featured / .card), só que os cards representam categorias,
// não produtos individuais. Clicar em qualquer card troca a categoria
// selecionada (via onSelect), que já filtra a lista de produtos.
export default function CategoryMosaic({ categorias = [], onSelect }) {
  if (!categorias.length) return null;

  const [destaque, ...resto] = categorias;

  function handleSelect(categoria) {
    onSelect(categoria.nome);
  }

  function getCategoryImage(categoria) {
    return categoria.imagem ? resolveImage(categoria.imagem) : "/placeholder.svg";
  }

  function pecasLabel(categoria) {
    if (!categoria.totalProdutos) return "Coleção em breve";
    return `${categoria.totalProdutos} ${categoria.totalProdutos === 1 ? "peça" : "peças"}`;
  }

  return (
    <div className={styles.mosaic}>
      {/* Categoria em destaque — mesmo card grande do produto destaque */}
      <motion.article
        className={`${styles.featured} ${styles.featuredSpan}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <button
          type="button"
          className={styles.featuredLink}
          onClick={() => handleSelect(destaque)}
        >
          <div className={styles.featuredImageWrap}>
            <CertificateSeal />
            <span className={`${styles.label} ${styles.featuredNumber}`}>
              Coleção
            </span>
            <img
              src={getCategoryImage(destaque)}
              alt={destaque.nome}
              loading="lazy"
              className={styles.featuredImage}
            />
          </div>

          <div className={styles.featuredBody}>
            <p className={`${styles.label} ${styles.featuredMeta}`}>
              {pecasLabel(destaque)}
            </p>
            <h3 className={styles.featuredName}>{destaque.nome}</h3>
            <div className={styles.featuredFooter}>
              <span className={styles.featuredPrice}>Explorar coleção</span>
              <span className={`${styles.labelTight} ${styles.featuredCta}`}>
                Ver peças —
              </span>
            </div>
          </div>
        </button>
      </motion.article>

      {/* Demais categorias — mesmo card pequeno usado no ProductCard */}
      {resto.map((categoria, index) => (
        <motion.article
          key={categoria.id}
          className={styles.card}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            duration: 0.7,
            delay: index * 0.06,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <button
            type="button"
            className={styles.cardLink}
            onClick={() => handleSelect(categoria)}
          >
            <div className={styles.cardImageWrap}>
              <span className={styles.cardNumber}>Coleção</span>
              <img
                src={getCategoryImage(categoria)}
                alt={categoria.nome}
                loading="lazy"
                className={styles.cardImage}
              />
            </div>

            <div className={styles.cardBody}>
              <span className={styles.cardMeta}>{pecasLabel(categoria)}</span>
              <h3 className={styles.cardName}>{categoria.nome}</h3>
              <span className={styles.cardPrice}>Explorar →</span>
            </div>
          </button>
        </motion.article>
      ))}
    </div>
  );
}