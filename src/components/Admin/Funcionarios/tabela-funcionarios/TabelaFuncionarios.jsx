import { Eye, Pencil, Trash2, Users } from "lucide-react";
import BadgeStatus from "../badge-status/BadgeStatus";
import styles from "./TabelaFuncionarios.module.css";

function formatarData(dataIso) {
  const data = new Date(`${dataIso}T00:00:00`);
  return data.toLocaleDateString("pt-BR");
}

/**
 * Tabela principal com a lista de funcionários.
 */
function TabelaFuncionarios({ funcionarios, onVisualizar, onEditar, onExcluir }) {
  if (funcionarios.length === 0) {
    return (
      <div className={styles.tabelaVazia}>
        <div className={styles.tabelaVaziaIcone}>
          <Users size={28} aria-hidden="true" />
        </div>
        <p className={styles.tabelaVaziaTitulo}>Nenhum funcionário encontrado</p>
        <p className={styles.tabelaVaziaTexto}>
          Ajuste os filtros ou cadastre um novo funcionário.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.tabelaContainer}>
      <table className={styles.tabela}>
        <thead>
          <tr>
            <th scope="col">Funcionário</th>
            <th scope="col">Cargo</th>
            <th scope="col">E-mail</th>
            <th scope="col">Telefone</th>
            <th scope="col">Status</th>
            <th scope="col">Data de Cadastro</th>
            <th scope="col" className={styles.colunaAcoes}>
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {funcionarios.map((funcionario) => (
            <tr key={funcionario.id}>
              <td>
                <div className={styles.celulaFuncionario}>
                  <img
                    src={funcionario.avatarUrl}
                    alt={`Foto de ${funcionario.nome}`}
                    className={styles.avatar}
                  />
                  <div className={styles.celulaFuncionarioTexto}>
                    <span className={styles.nomeFuncionario}>{funcionario.nome}</span>
                    <span className={styles.idFuncionario}>#{funcionario.id}</span>
                  </div>
                </div>
              </td>
              <td>
                <span className={styles.cargoFuncionario}>{funcionario.cargo}</span>
              </td>
              <td className={styles.textoSecundario}>{funcionario.email}</td>
              <td className={styles.textoSecundario}>{funcionario.telefone}</td>
              <td>
                <BadgeStatus status={funcionario.status} />
              </td>
              <td className={styles.textoSecundario}>
                {formatarData(funcionario.dataCadastro)}
              </td>
              <td>
                <div className={styles.acoes}>
                  <button
                    type="button"
                    className={styles.botaoAcao}
                    onClick={() => onVisualizar(funcionario)}
                    aria-label={`Visualizar ${funcionario.nome}`}
                    title="Visualizar"
                  >
                    <Eye size={17} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className={styles.botaoAcao}
                    onClick={() => onEditar(funcionario)}
                    aria-label={`Editar ${funcionario.nome}`}
                    title="Editar"
                  >
                    <Pencil size={17} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className={`${styles.botaoAcao} ${styles.botaoAcaoPerigo}`}
                    onClick={() => onExcluir(funcionario)}
                    aria-label={`Excluir ${funcionario.nome}`}
                    title="Excluir"
                  >
                    <Trash2 size={17} aria-hidden="true" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TabelaFuncionarios;
