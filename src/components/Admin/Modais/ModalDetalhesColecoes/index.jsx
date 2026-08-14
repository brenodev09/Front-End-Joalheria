import { X, Pencil } from "lucide-react";
import styles from "./styles.module.css";

/**
 * Modal de visualização de detalhes da coleção.
 *
 * Props:
 * - collection: {
 *     name, description, imageUrl, status, featured, createdAt,
 *     startDate, endDate, products: [{ id, name, category, material, price, imageUrl }]
 *   }
 * - onClose: () => void
 * - onEdit: () => void
 */
export default function CollectionDetailsModal({ collection, onClose, onEdit }) {
  if (!collection) return null;

  const {
    name,
    description,
    imageUrl,
    status,
    featured,
    createdAt,
    startDate,
    endDate,
    products = [],
  } = collection;

  const visibleProducts = products.slice(0, 3);
  const remaining = products.length - visibleProducts.length;

  const statusClass =
    status === "active"
      ? `${styles["cdm-status"]} ${styles["cdm-status--active"]}`
      : `${styles["cdm-status"]} ${styles["cdm-status--draft"]}`;

  return (
    <div className={styles["cdm-overlay"]} role="dialog" aria-modal="true" aria-labelledby="cdm-title">
      <div className={styles["cdm-modal"]}>
        <header className={styles["cdm-header"]}>
          <div>
            <p className={styles["cdm-eyebrow"]}>DETALHES DA COLEÇÃO</p>
            <h1 id="cdm-title" className={styles["cdm-title"]}>
              {name}
            </h1>
          </div>
          <div className={styles["cdm-header-actions"]}>
            <span className={statusClass}>
              ● {status === "active" ? "Ativa" : "Rascunho"}
            </span>
            <button className={styles["cdm-icon-btn"]} onClick={onClose} aria-label="Fechar">
              <X size={16} />
            </button>
          </div>
        </header>

        <div className={styles["cdm-body"]}>
          <div className={styles["cdm-left"]}>
            <div
              className={styles["cdm-banner"]}
              style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
            />

            <p className={styles["cdm-section-label"]}>INFORMAÇÕES GERAIS</p>
            <div className={styles["cdm-info-grid"]}>
              <div>
                <p className={styles["cdm-info-key"]}>Período</p>
                <p className={styles["cdm-info-value"]}>
                  {formatDate(startDate)} — {formatDate(endDate)}
                </p>
              </div>
              <div>
                <p className={styles["cdm-info-key"]}>Destaque</p>
                <p className={styles["cdm-info-value"]}>{featured ? "Sim" : "Não"}</p>
              </div>
              <div>
                <p className={styles["cdm-info-key"]}>Criada em</p>
                <p className={styles["cdm-info-value"]}>{formatDate(createdAt)}</p>
              </div>
              <div>
                <p className={styles["cdm-info-key"]}>Produtos</p>
                <p className={styles["cdm-info-value"]}>{products.length} itens</p>
              </div>
            </div>

            <p className={styles["cdm-section-label"]} style={{ marginTop: 20 }}>
              DESCRIÇÃO
            </p>
            <p className={styles["cdm-description"]}>{description || "Sem descrição."}</p>
          </div>

          <div className={styles["cdm-right"]}>
            <p className={styles["cdm-section-label"]}>PRODUTOS NESTA COLEÇÃO</p>
            <div className={styles["cdm-product-list"]}>
              {visibleProducts.map((product) => (
                <div className={styles["cdm-product-item"]} key={product.id}>
                  <div
                    className={styles["cdm-product-thumb"]}
                    style={product.imageUrl ? { backgroundImage: `url(${product.imageUrl})` } : undefined}
                  />
                  <div className={styles["cdm-product-info"]}>
                    <p className={styles["cdm-product-name"]}>{product.name}</p>
                    <p className={styles["cdm-product-meta"]}>
                      {product.category} · {product.material}
                    </p>
                  </div>
                  <p className={styles["cdm-product-price"]}>{formatPrice(product.price)}</p>
                </div>
              ))}
              {remaining > 0 && (
                <p className={styles["cdm-product-more"]}>+ {remaining} produtos</p>
              )}
              {products.length === 0 && (
                <p className={styles["cdm-product-more"]}>Nenhum produto nesta coleção.</p>
              )}
            </div>
          </div>
        </div>

        <footer className={styles["cdm-footer"]}>
          <button className={`${styles["cdm-btn"]} ${styles["cdm-btn--outline"]}`} onClick={onClose}>
            FECHAR
          </button>
          <button className={`${styles["cdm-btn"]} ${styles["cdm-btn--primary"]}`} onClick={onEdit}>
            <Pencil size={15} />
            EDITAR COLEÇÃO
          </button>
        </footer>
      </div>
    </div>
  );
}

function formatDate(isoDate) {
  if (!isoDate) return "—";
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

function formatPrice(value) {
  if (typeof value !== "number") return "—";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}