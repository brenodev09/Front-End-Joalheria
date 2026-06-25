import React from "react";
import styles from "./styles.module.css";
import {api} from "../../../../services/api"
import { useState } from "react";
import { useNavigate } from "react-router-dom";



export default function ModalExcluirCategoria({
  aberto = false,
  categoria = null,
  aoFechar = () => {},
  aoConfirmar = () => {},
}){


    if (!aberto) return null;

  return (
    <div className={`${styles.sobreposicao} ${aberto ? styles.sobreposicaoAberta : styles.sobreposicaoFechada}`}>
      <div className={`${styles.modal} ${aberto ? styles.modalAberto : styles.modalFechado}`}>
        <button
          type="button"
          className={styles.botaoFechar}
          onClick={aoFechar}
          aria-label="Fechar"
        >
          ×
        </button>

        <div className={styles.icone}>
          <img width="28" height="28" src="https://img.icons8.com/parakeet-line/48/FF0000/filled-trash.png" alt="filled-trash"/>
        </div>

        <h2 className={styles.titulo}>Excluir categoria</h2>

        <p className={styles.mensagem}>
          Tem certeza que deseja excluir a categoria
          <span className={styles.nomeCategoria}> {categoria?.nome}</span>? Essa
          ação não poderá ser desfeita.
        </p>

        
          <div className={styles.avisoProdutos}>
            <span className={styles.avisoProdutosIcone}>!</span>
            <span>
              Quantidade de produtos nesta categoria:
            </span>
          </div>

        <div className={styles.acoes}>
          <button type="button" className={`btnPadrao ${styles.botaoCancelar}`} onClick={aoFechar}>
            Cancelar
          </button>
          <button type="button" className={`btnPadrao ${styles.btnExcluir}`} onClick={aoConfirmar}>
            Excluir categoria
          </button>
        </div>
      </div>
    </div>
  );
}