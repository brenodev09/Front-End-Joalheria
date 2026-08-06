import { motion } from 'framer-motion';
import styles from './TabelaPedidos.module.css';
import BadgeStatusPedido from '../BadgeStatusPedido/BadgeStatusPedido';

const variantesLista = {
  oculto: {},
  visivel: { transition: { staggerChildren: 0.05 } },
};

const variantesLinha = {
  oculto: { opacity: 0, y: 12 },
  visivel: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export default function TabelaPedidos({ pedidos, onVerDetalhes }) {
  return (
    <div className={styles.envoltorio}>
      <div className={styles.cabecalhoTabela}>
        <span className={styles.colunaPedido}>Pedido</span>
        <span className={styles.colunaCliente}>Cliente</span>
        <span className={styles.colunaData}>Data</span>
        <span className={styles.colunaItens}>Itens</span>
        <span className={styles.colunaTotal}>Total</span>
        <span className={styles.colunaStatus}>Status</span>
        <span className={styles.colunaAcoes}>Ações</span>
      </div>

      {pedidos.length > 0 ? (
        <motion.div
          className={styles.corpoTabela}
          variants={variantesLista}
          initial="oculto"
          animate="visivel"
        >
          {pedidos.map((pedido) => (
            <motion.div key={pedido.id} className={styles.linha} variants={variantesLinha}>
              <span className={styles.colunaPedido} data-rotulo="Pedido">
                <span className={styles.numeroPedido}>{pedido.numero}</span>
              </span>

              <span className={styles.colunaCliente} data-rotulo="Cliente">
                <span className={styles.nomeCliente}>{pedido.cliente.nome}</span>
                <span className={styles.emailCliente}>{pedido.cliente.email}</span>
              </span>

              <span className={styles.colunaData} data-rotulo="Data">
                {pedido.dataPedido}
              </span>

              <span className={styles.colunaItens} data-rotulo="Itens">
                {pedido.itens.length} {pedido.itens.length === 1 ? 'peça' : 'peças'}
              </span>

              <span className={styles.colunaTotalTxt} data-rotulo="Total">
                {pedido.total}
              </span>

              <span className={styles.colunaStatus} data-rotulo="Status">
                <BadgeStatusPedido status={pedido.status} />
              </span>

              <span className={styles.colunaAcoes} data-rotulo="Ações">
                <button
                  type="button"
                  className={` ${styles.botaoDetalhes}`}
                  onClick={() => onVerDetalhes(pedido)}
                >
                  Ver detalhes
                  {/* <svg viewBox="0 0 24 24" fill="none" className={styles.iconeSeta}>
                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg> */}
                </button>
              </span>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className={styles.vazio}>
          <span className={styles.vazioIcone}>◇</span>
          <p className={styles.vazioTitulo}>Nenhum pedido encontrado</p>
          <p className={styles.vazioTexto}>Ajuste a busca ou os filtros para ver outros resultados.</p>
        </div>
      )}
    </div>
  );
}
