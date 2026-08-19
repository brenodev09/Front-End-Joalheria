import { useEffect, useState } from "react";
import { User } from "lucide-react";
import Modal from "../modal/Modal";
import { CARGOS } from "../../../../data/funcionariosMock";
import styles from "./ModalFuncionario.module.css";

const FUNCIONARIO_VAZIO = {
  nome: "",
  email: "",
  telefone: "",
  cargo: "",
  status: "Ativo",
};

function gerarAvatarPreview(nome) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    nome
  )}&background=C9A962&color=0D0D0D&font-size=0.38&bold=true`;
}

/**
 * Modal de cadastro/edição de funcionário — layout de preview em tempo
 * real + formulário, no mesmo padrão do modal de Produtos. Usa o mesmo
 * componente para os dois modos: só muda o título, os textos e se os
 * campos já vêm preenchidos.
 *
 * @param {{
 *   aberto: boolean,
 *   modo: "adicionar" | "editar",
 *   funcionario?: object | null,
 *   onFechar: () => void,
 *   onSalvar: (dados: object) => void
 * }} props
 */
function ModalFuncionario({ aberto, modo, funcionario, onFechar, onSalvar }) {
  const [dados, setDados] = useState(FUNCIONARIO_VAZIO);

  useEffect(() => {
    if (aberto) {
      setDados(funcionario ? { ...funcionario } : FUNCIONARIO_VAZIO);
    }
  }, [aberto, funcionario]);

  function atualizarCampo(campo, valor) {
    setDados((atual) => ({ ...atual, [campo]: valor }));
  }

  function handleSubmit(evento) {
    evento.preventDefault();
    onSalvar(dados);
  }

  const ehEdicao = modo === "editar";
  const nomePreenchido = dados.nome.trim().length > 0;

  return (
    <Modal
      aberto={aberto}
      onFechar={onFechar}
      largura="larga"
      titulo={ehEdicao ? "Editar Funcionário" : "Adicionar Funcionário"}
      subtitulo={
        ehEdicao
          ? "Atualize os dados cadastrais deste funcionário."
          : "Cadastre um novo colaborador no time."
      }
    >
      <div className={styles.corpo}>
        {/* Coluna esquerda: preview em tempo real + ações */}
        <div className={styles.colunaPreview}>
          <span className={styles.rotuloColuna}>Preview em tempo real</span>

          <div className={styles.cardPreview}>
            {nomePreenchido ? (
              <img
                src={gerarAvatarPreview(dados.nome)}
                alt={`Foto de ${dados.nome}`}
                className={styles.avatarPreview}
              />
            ) : (
              <div className={styles.avatarPreviewVazio}>
                <User size={28} aria-hidden="true" />
              </div>
            )}

            <p className={`${styles.previewNome} ${!nomePreenchido ? styles.previewNomeVazio : ""}`}>
              {nomePreenchido ? dados.nome : "Nome do funcionário"}
            </p>

            <span
              className={`${styles.previewCargo} ${!dados.cargo ? styles.previewCargoVazio : ""}`}
            >
              {dados.cargo || "Cargo não selecionado"}
            </span>

            {(dados.email || dados.telefone) && (
              <div className={styles.previewContato}>
                {dados.email && <span>{dados.email}</span>}
                {dados.telefone && <span>{dados.telefone}</span>}
              </div>
            )}
          </div>

          <div className={styles.botoesPreview}>
            <button type="button" className="btnPadrao" onClick={onFechar}>
              CANCELAR
            </button>
            <button type="submit" form="formulario-funcionario" className="addProductBtn">
              <p>{ehEdicao ? "SALVAR ALTERAÇÕES" : "CADASTRAR FUNCIONÁRIO"}</p>
            </button>
          </div>
        </div>

        {/* Coluna direita: formulário */}
        <div className={styles.colunaForm}>
          <div className={styles.cabecalhoSecao}>
            <span className={styles.tituloSecao}>
              {ehEdicao ? "Dados do Funcionário" : "Informe os Dados do Funcionário"}
            </span>
            <span className={styles.linhaSecao} />
          </div>

          <form id="formulario-funcionario" className={styles.formulario} onSubmit={handleSubmit}>
            <div className={`${styles.campo} ${styles.campoCompleto}`}>
              <label className={styles.rotulo} htmlFor="campo-nome">
                Nome completo
              </label>
              <input
                id="campo-nome"
                type="text"
                className={styles.entrada}
                placeholder="Digite o nome do funcionário"
                value={dados.nome}
                onChange={(evento) => atualizarCampo("nome", evento.target.value)}
                required
              />
            </div>

            <div className={styles.campo}>
              <label className={styles.rotulo} htmlFor="campo-email">
                E-mail
              </label>
              <input
                id="campo-email"
                type="email"
                className={styles.entrada}
                placeholder="nome@empresa.com"
                value={dados.email}
                onChange={(evento) => atualizarCampo("email", evento.target.value)}
                required
              />
            </div>

            <div className={styles.campo}>
              <label className={styles.rotulo} htmlFor="campo-telefone">
                Telefone
              </label>
              <input
                id="campo-telefone"
                type="tel"
                className={styles.entrada}
                placeholder="(00) 00000-0000"
                value={dados.telefone}
                onChange={(evento) => atualizarCampo("telefone", evento.target.value)}
                required
              />
            </div>

            <div className={styles.campo}>
              <label className={styles.rotulo} htmlFor="campo-cargo">
                Cargo
              </label>
              <select
                id="campo-cargo"
                className={styles.selecao}
                value={dados.cargo}
                onChange={(evento) => atualizarCampo("cargo", evento.target.value)}
                required
              >
                <option value="" disabled>
                  Selecione
                </option>
                {CARGOS.map((cargo) => (
                  <option key={cargo} value={cargo}>
                    {cargo}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.campo}>
              <label className={styles.rotulo} htmlFor="campo-status">
                Status
              </label>
              <select
                id="campo-status"
                className={styles.selecao}
                value={dados.status}
                onChange={(evento) => atualizarCampo("status", evento.target.value)}
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}

export default ModalFuncionario;
