import { useEffect } from "react";
import { X } from "lucide-react";
import styles from "./Modal.module.css";

/**
 * Wrapper genérico de modal, usado por todos os modais da página
 * (Adicionar/Editar, Visualizar e Excluir Funcionário).
 * @param {{
 *   aberto: boolean,
 *   titulo: string,
 *   subtitulo?: string,
 *   onFechar: () => void,
 *   children: React.ReactNode,
 *   rodape?: React.ReactNode,
 *   largura?: "padrao" | "estreita" | "larga"
 * }} props
 */
function Modal({ aberto, titulo, subtitulo, onFechar, children, rodape, largura = "padrao" }) {
  useEffect(() => {
    if (!aberto) return undefined;

    function handleEsc(evento) {
      if (evento.key === "Escape") onFechar();
    }

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [aberto, onFechar]);

  if (!aberto) return null;

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) onFechar();
      }}
    >
      <div
        className={`${styles.modal} ${largura === "estreita" ? styles.modalEstreita : ""} ${
          largura === "larga" ? styles.modalLarga : ""
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
      >
        <header className={styles.modalCabecalho}>
          <div>
            <h2 id="modal-titulo" className={styles.modalTitulo}>
              {titulo}
            </h2>
            {subtitulo && <p className={styles.modalSubtitulo}>{subtitulo}</p>}
          </div>
          <button
            type="button"
            className={styles.modalFechar}
            onClick={onFechar}
            aria-label="Fechar modal"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className={styles.modalCorpo}>{children}</div>

        {rodape && <footer className={styles.modalRodape}>{rodape}</footer>}
      </div>
    </div>
  );
}

export default Modal;
