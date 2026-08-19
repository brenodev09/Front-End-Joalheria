import { Search, X } from "lucide-react";
import styles from "./FiltrosFuncionarios.module.css";

/**
 * Área de filtros: busca por nome/e-mail, cargo e status.
 */
function FiltrosFuncionarios({
  termoBusca,
  onAlterarTermoBusca,
  cargoSelecionado,
  onAlterarCargo,
  statusSelecionado,
  onAlterarStatus,
  cargos,
  onLimparFiltros,
  filtrosAtivos,
}) {
  return (
    <div className={styles.filtros}>
      <div className={styles.filtrosCampoBusca}>
        <Search size={18} className={styles.filtrosIconeBusca} aria-hidden="true" />
        <input
          type="text"
          className={styles.filtrosInputBusca}
          placeholder="Pesquisar por nome ou e-mail..."
          value={termoBusca}
          onChange={(evento) => onAlterarTermoBusca(evento.target.value)}
          aria-label="Pesquisar funcionário por nome ou e-mail"
        />
      </div>

      <select
        className={styles.filtrosSelect}
        value={cargoSelecionado}
        onChange={(evento) => onAlterarCargo(evento.target.value)}
        aria-label="Filtrar por cargo"
      >
        <option value="">Todos os cargos</option>
        {cargos.map((cargo) => (
          <option key={cargo} value={cargo}>
            {cargo}
          </option>
        ))}
      </select>

      <select
        className={styles.filtrosSelect}
        value={statusSelecionado}
        onChange={(evento) => onAlterarStatus(evento.target.value)}
        aria-label="Filtrar por status"
      >
        <option value="">Todos os status</option>
        <option value="Ativo">Ativo</option>
        <option value="Inativo">Inativo</option>
      </select>

      {filtrosAtivos && (
        <button
          type="button"
          className={styles.filtrosBotaoLimpar}
          onClick={onLimparFiltros}
        >
          <X size={16} aria-hidden="true" />
          Limpar filtros
        </button>
      )}
    </div>
  );
}

export default FiltrosFuncionarios;
