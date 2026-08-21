import { motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import styles from './TabelaCupons.module.css';

const variantesLista = {
  oculto: {},
  visivel: { transition: { staggerChildren: 0.05 } },
};

const variantesLinha = {
  oculto: { opacity: 0, y: 12 },
  visivel: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

// Componente 100% de apresentação: quem busca/filtra/pagina os cupons é a
// página (Cupons.jsx). Aqui só recebemos a "fatia" já pronta pra exibir.
export default function TabelaCupons({ cupons, onEditar, onExcluir }) {
  return (
    <div className={styles.envoltorio}>
      <div className={styles.cabecalhoTabela}>
        <span className={styles.colunaNome}>Cupom</span>
        <span className={styles.colunaTipo}>Tipo</span>
        <span className={styles.colunaValor}>Valor</span>
        <span className={styles.colunaUsos}>Usos</span>
        <span className={styles.colunaExpira}>Expira</span>
        <span className={styles.colunaStatus}>Status</span>
        <span className={styles.colunaAcoes}>Ações</span>
      </div>

      {cupons.length > 0 ? (
        <motion.div
          className={styles.corpoTabela}
          variants={variantesLista}
          initial="oculto"
          animate="visivel"
        >
          {cupons.map((cupom) => (
            <motion.div key={cupom.id} className={styles.linha} variants={variantesLinha}>
              <span className={styles.colunaNome} data-rotulo="Cupom">
                {cupom.nome}
              </span>

              <span className={styles.colunaTipo} data-rotulo="Tipo">
                {cupom.tipo}
              </span>

              <span className={styles.colunaValor} data-rotulo="Valor">
                {cupom.valor}
              </span>

              <span className={styles.colunaUsos} data-rotulo="Usos">
                {cupom.usos}
              </span>

              <span className={styles.colunaExpira} data-rotulo="Expira">
                {cupom.expira}
              </span>

              <span className={styles.colunaStatus} data-rotulo="Status">
                <span className={`${styles.badgeStatus} ${cupom.status === 'ativo' ? styles.badgeAtivo : styles.badgeInativo}`}>
                  {cupom.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </span>
              </span>

              <span className={styles.colunaAcoes} data-rotulo="Ações">
                <div className={styles.actions}>
                  <button
                    title="Editar"
                    onClick={() => onEditar?.(cupom)}
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    title="Excluir"
                    className={styles.delete}
                    onClick={() => onExcluir?.(cupom)}
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
          <p className={styles.vazioTitulo}>Nenhum cupom encontrado</p>
          <p className={styles.vazioTexto}>Ajuste a busca ou os filtros para ver outros resultados.</p>
        </div>
      )}
    </div>
  );
}