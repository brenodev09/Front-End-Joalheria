import { Mail, Phone, Briefcase, CalendarDays } from "lucide-react";
import Modal from "../modal/Modal";
import BadgeStatus from "../badge-status/BadgeStatus";
import styles from "./ModalVisualizarFuncionario.module.css";

function formatarData(dataIso) {
  if (!dataIso) return "—";
  return new Date(`${dataIso}T00:00:00`).toLocaleDateString("pt-BR");
}

/**
 * Modal somente-leitura com o resumo dos dados do funcionário.
 * @param {{ aberto: boolean, funcionario?: object | null, onFechar: () => void, onEditar: () => void }} props
 */
function ModalVisualizarFuncionario({ aberto, funcionario, onFechar, onEditar }) {
  if (!funcionario) return null;

  return (
    <Modal
      aberto={aberto}
      onFechar={onFechar}
      titulo="Detalhes do Funcionário"
      rodape={
        <>
          <button type="button" className="btnPadrao" onClick={onFechar}>
            FECHAR
          </button>
          <button type="button" className="addProductBtn" onClick={onEditar}>
            <p>EDITAR DADOS</p>
          </button>
        </>
      }
    >
      <div className={styles.cabecalho}>
        <img
          src={funcionario.avatarUrl}
          alt={`Foto de ${funcionario.nome}`}
          className={styles.avatarGrande}
        />
        <div>
          <h3 className={styles.nome}>{funcionario.nome}</h3>
          <span className={styles.cargo}>{funcionario.cargo}</span>
        </div>
        <BadgeStatus status={funcionario.status} />
      </div>

      <dl className={styles.listaDetalhes}>
        <div className={styles.itemDetalhe}>
          <dt>
            <Mail size={16} aria-hidden="true" /> E-mail
          </dt>
          <dd>{funcionario.email}</dd>
        </div>
        <div className={styles.itemDetalhe}>
          <dt>
            <Phone size={16} aria-hidden="true" /> Telefone
          </dt>
          <dd>{funcionario.telefone}</dd>
        </div>
        <div className={styles.itemDetalhe}>
          <dt>
            <Briefcase size={16} aria-hidden="true" /> Cargo
          </dt>
          <dd>{funcionario.cargo}</dd>
        </div>
        <div className={styles.itemDetalhe}>
          <dt>
            <CalendarDays size={16} aria-hidden="true" /> Cadastrado em
          </dt>
          <dd>{formatarData(funcionario.dataCadastro)}</dd>
        </div>
      </dl>
    </Modal>
  );
}

export default ModalVisualizarFuncionario;
