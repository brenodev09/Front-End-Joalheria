import React from "react";
import styles from "./styles.module.css";

export default function ModalExcluirProduto({
  aberto = false,
  produto = null,
  aoFechar = () => {},
  aoConfirmar = () => {},
}) {
  if (!aberto) return null;

  return (
    <div
      className={`${styles.sobreposicao} ${
        aberto
          ? styles.sobreposicaoAberta
          : styles.sobreposicaoFechada
      }`}
    >
      <div
        className={`${styles.modal} ${
          aberto
            ? styles.modalAberto
            : styles.modalFechado
        }`}
      >
        <button
          type="button"
          className={styles.botaoFechar}
          onClick={aoFechar}
        >
          ×
        </button>

        <div className={styles.icone}>
          <img
            width="28"
            height="28"
            src="https://img.icons8.com/parakeet-line/48/FF0000/filled-trash.png"
            alt="delete"
          />
        </div>

        <h2 className={styles.titulo}>
          Excluir produto
        </h2>

        <p className={styles.mensagem}>
          Tem certeza que deseja excluir o produto
          <span className={styles.nomeDestaque}>
            {" "}
            {produto?.nome}
          </span>
          ? Essa ação não poderá ser desfeita.
        </p>

        <div className={styles.avisoProdutos}>
          <span className={styles.avisoIcone}>
            !
          </span>

          <span>
            O produto será removido permanentemente do
            sistema e não poderá ser recuperado.
          </span>
        </div>

        <div className={styles.acoes}>
            <button type="button" className={`btnPadrao ${styles.botaoCancelar}`} onClick={aoFechar}>
                      Cancelar
                    </button>
                    <button type="button" className={`btnPadrao ${styles.btnExcluir}`} onClick={aoConfirmar}>
                      Excluir Produto
                    </button>
        </div>
      </div>
    </div>
  );
}