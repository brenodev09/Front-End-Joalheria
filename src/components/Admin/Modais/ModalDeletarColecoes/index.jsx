import { X, Trash2, AlertTriangle } from "lucide-react";
import styles from "./styles.module.css";

/**
 * Modal de confirmação de exclusão de coleção.
 *
 * Props:
 * - collection: { name, productCount }
 * - onCancel: () => void
 * - onConfirm: () => void
 */
export default function DeleteCollectionModal({ collection, onCancel, onConfirm }) {
  return (
    <div className={styles["dcm-overlay"]} role="dialog" aria-modal="true" aria-labelledby="dcm-title">
      <div className={styles["dcm-modal"]}>
        <button className={styles["dcm-icon-btn"]} onClick={onCancel} aria-label="Fechar">
          <X size={14} />
        </button>

        <div className={styles["dcm-icon-wrap"]}>
          <Trash2 size={26} />
        </div>

        <h1 id="dcm-title" className={styles["dcm-title"]}>
          Excluir coleção
        </h1>

        <p className={styles["dcm-message"]}>
          Tem certeza que deseja excluir a coleção{" "}
          <span className={styles["dcm-highlight"]}>{collection?.name}</span>? Essa ação não
          poderá ser desfeita.
        </p>

        {collection?.productCount > 0 && (
          <div className={styles["dcm-warning"]}>
            <AlertTriangle size={16} />
            <p>
              Os {collection.productCount} produtos vinculados serão desassociados da coleção,
              mas continuarão disponíveis no catálogo.
            </p>
          </div>
        )}

        <div className={styles["dcm-actions"]}>
          <button className={`${styles["dcm-btn"]} ${styles["dcm-btn--outline"]}`} onClick={onCancel}>
            CANCELAR
          </button>
          <button className={`${styles["dcm-btn"]} ${styles["dcm-btn--danger"]}`} onClick={onConfirm}>
            EXCLUIR COLEÇÃO
          </button>
        </div>
      </div>
    </div>
  );
}