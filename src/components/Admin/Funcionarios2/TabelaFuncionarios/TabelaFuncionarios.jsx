import { motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import styles from './TabelaFuncionarios.module.css';
import BadgeStatusFuncionario from '../BadgeStatusFuncionario/BadgeStatusFuncionario';

const variantesLista = {
  oculto: {},
  visivel: { transition: { staggerChildren: 0.05 } },
};

const variantesLinha = {
  oculto: { opacity: 0, y: 12 },
  visivel: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

// Componente 100% de apresentação: quem busca os funcionários é a página
// (FuncionariosPage.jsx), que já cuida de filtro, busca e paginação sobre a
// lista completa. Aqui só recebemos a "fatia" já pronta pra exibir.
export default function TabelaFuncionarios({ funcionarios, carregando, onEditar, onExcluir }) {
  if (carregando) {
    return (
      <div className={styles.envoltorio}>
        <div className={styles.vazio}>
          <span className={styles.vazioIcone}>◇</span>
          <p className={styles.vazioTitulo}>Carregando funcionários…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.envoltorio}>
      <div className={styles.cabecalhoTabela}>
        <span className={styles.colunaFuncionario}>Funcionário</span>
        <span className={styles.colunaEmail}>E-mail</span>
        <span className={styles.colunaCargo}>Cargo</span>
        <span className={styles.colunaAdmissao}>Admissão</span>
        <span className={styles.colunaStatus}>Status</span>
        <span className={styles.colunaAcoes}>Ações</span>
      </div>

      {funcionarios.length > 0 ? (
        <motion.div
          className={styles.corpoTabela}
          variants={variantesLista}
          initial="oculto"
          animate="visivel"
        >
          {funcionarios.map((funcionario) => (
            <motion.div key={funcionario.id} className={styles.linha} variants={variantesLinha}>
              <span className={styles.colunaFuncionario} data-rotulo="Funcionário">
                <img
                  className={styles.avatarFuncionario}
                  src={funcionario.foto}
                  alt={funcionario.nome}
                />
                <span className={styles.nomeFuncionario}>{funcionario.nome}</span>
              </span>

              <span className={styles.colunaEmail} data-rotulo="E-mail">
                {funcionario.email}
              </span>

              <span className={styles.colunaCargo} data-rotulo="Cargo">
                {funcionario.cargo}
              </span>

              <span className={styles.colunaAdmissao} data-rotulo="Admissão">
                {funcionario.dataAdmissao}
              </span>

              <span className={styles.colunaStatus} data-rotulo="Status">
                <BadgeStatusFuncionario status={funcionario.status} />
              </span>

              <span className={styles.colunaAcoes} data-rotulo="Ações">
                <div className={styles.actions}>
                  <button
                    title="Editar"
                    onClick={() => onEditar?.(funcionario)}
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    title="Excluir"
                    className={styles.delete}
                    onClick={() => onExcluir?.(funcionario)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </span>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className={styles.vazio}>
          <span className={styles.vazioIcone}>◇</span>
          <p className={styles.vazioTitulo}>Nenhum funcionário encontrado</p>
          <p className={styles.vazioTexto}>Ajuste a busca ou os filtros para ver outros resultados.</p>
        </div>
      )}
    </div>
  );
}