import { AlertTriangle } from "lucide-react";
import Modal from "../modal/Modal";
import styles from "./ModalExcluirFuncionario.module.css";

/**
 * Modal de confirmação para exclusão de um funcionário.
 * @param {{
 *   aberto: boolean,
 *   funcionario?: object | null,
 *   onFechar: () => void,
 *   onConfirmar: () => void
 * }} props
 */
function ModalExcluirFuncionario({ aberto, funcionario, onFechar, onConfirmar }) {
  return (
    <Modal
      aberto={aberto}
      onFechar={onFechar}
      titulo="Excluir Funcionário"
      largura="estreita"
      rodape={
        <>
          <button type="button" className="btnPadrao" onClick={onFechar}>
            CANCELAR
          </button>
          <button type="button" className={styles.botaoPerigo} onClick={onConfirmar}>
            <p>SIM, EXCLUIR</p>
          </button>
        </>
      }
    >
      <div className={styles.conteudo}>
        <div className={styles.iconeAlerta}>
          <AlertTriangle size={24} aria-hidden="true" />
        </div>
        <p className={styles.mensagem}>
          Tem certeza de que deseja excluir{" "}
          <strong>{funcionario?.nome ?? "este funcionário"}</strong>? Esta ação não
          pode ser desfeita e todos os dados cadastrais serão removidos.
        </p>
      </div>
    </Modal>
  );
}

export default ModalExcluirFuncionario;
