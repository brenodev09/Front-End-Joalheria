import styles from "./styles.module.css";

export default function ModalDeletarCupom({
  aberto = false,
  cupom = null,
  aoFechar = () => {},
  aoConfirmar = () => {},
}) {
  if (!aberto) return null;

  return (
    <div className={`${styles.sobreposicao} ${styles.sobreposicaoAberta}`}>
      <div className={`${styles.modal} ${styles.modalAberto}`}>
        <button
          type="button"
          className={styles.botaoFechar}
          onClick={aoFechar}
          aria-label="Fechar"
        >
          ×
        </button>

        <div className={styles.icone}>
          <img
            width="28"
            height="28"
            src="https://img.icons8.com/parakeet-line/48/FF0000/filled-trash.png"
            alt="Excluir cupom"
          />
        </div>

        <h2 className={styles.titulo}>Excluir cupom</h2>

        <p className={styles.mensagem}>
          Tem certeza que deseja excluir o cupom
          <span className={styles.nomeDestaque}> {cupom?.nome}</span>?
          Essa ação não poderá ser desfeita.
        </p>

        <div className={styles.avisoProdutos}>
          <span className={styles.avisoIcone}>!</span>
          <span>O cupom deixará de estar disponível para novos pedidos.</span>
        </div>

        <div className={styles.acoes}>
          <button type="button" className={`btnPadrao ${styles.botaoCancelar}`} onClick={aoFechar}>
            Cancelar
          </button>
          <button type="button" className={`btnPadrao ${styles.btnExcluir}`} onClick={aoConfirmar}>
            Excluir cupom
          </button>
        </div>
      </div>
    </div>
  );
}
