import React, { useState } from "react";
import styles from "./styles.module.css";
import { api } from "../../../../services/api"

export default function ModalExcluirFuncionario({
  isOpen,
  fecharModal,
  onExcluir,
  funcionario,
}) {
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState('');

  if (!isOpen || !funcionario) return null;

  function mostrarErro(mensagem) {
    setErro(mensagem);
    setTimeout(() => setErro(''), 3500);
  }

  async function deletarFuncionario() {
    setExcluindo(true);

    try {
      await api.delete(`/funcionarios/deletar-funcionario/${funcionario.id}`);

      onExcluir?.(funcionario.id);
      fecharModal();

    } catch (error) {
      console.error(error);
      mostrarErro(error.response?.data?.erro || "Erro ao excluir funcionário");
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <div
      className={`${styles.sobreposicao} ${
        isOpen
          ? styles.sobreposicaoAberta
          : styles.sobreposicaoFechada
      }`}
    >
      <div
        className={`${styles.modal} ${
          isOpen
            ? styles.modalAberto
            : styles.modalFechado
        }`}
      >
        <button
          type="button"
          className={styles.botaoFechar}
          onClick={fecharModal}
          disabled={excluindo}
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
          Excluir Funcionário
        </h2>

        <p className={styles.mensagem}>
          Tem certeza que deseja excluir o funcionário
          <span className={styles.nomeDestaque}>
            {" "}
            {funcionario?.nome}
          </span>
          ? Essa ação não poderá ser desfeita.
        </p>

        <div className={styles.avisoProdutos}>
          <span className={styles.avisoIcone}>
            !
          </span>

          <span>
            O funcionário será removido permanentemente do
            sistema e não poderá ser recuperado.
          </span>
        </div>

        {erro && <p className={styles.mensagemErro}>{erro}</p>}

        <div className={styles.acoes}>
          <button
            type="button"
            className={`btnPadrao ${styles.botaoCancelar}`}
            onClick={fecharModal}
            disabled={excluindo}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={`btnPadrao ${styles.btnExcluir}`}
            onClick={deletarFuncionario}
            disabled={excluindo}
          >
            {excluindo ? 'Excluindo...' : 'Excluir Funcionário'}
          </button>
        </div>
      </div>
    </div>
  );
}