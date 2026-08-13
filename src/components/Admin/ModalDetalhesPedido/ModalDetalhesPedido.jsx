import { AnimatePresence, motion } from 'framer-motion';
import styles from './ModalDetalhesPedido.module.css';
import BadgeStatusPedido from '../BadgeStatusPedido/BadgeStatusPedido';

export default function ModalDetalhesPedido({ pedido, aberto, carregando, onFechar,atualizarStatus }) {
  return (
    <AnimatePresence>
      {aberto && carregando && (
        <motion.div
          className={styles.sobreposicao}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onFechar}
        >
          <motion.div className={styles.painel} onClick={(e) => e.stopPropagation()}>
            <p className={styles.linha}>Carregando pedido…</p>
          </motion.div>
        </motion.div>
      )}

      {aberto && !carregando && pedido && (
        <motion.div
          className={styles.sobreposicao}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onFechar}
        >
          <motion.div
            className={styles.painel}
            initial={{ opacity: 0, y: 26, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className={styles.cabecalhoModal}>
              <div>
                <span className={styles.eyebrowModal}>Detalhes do pedido</span>
                <h3 className={styles.tituloModal}>{pedido.numero}</h3>
              </div>
              <div className={styles.acoesCabecalho}>
                <BadgeStatusPedido status={pedido.status} />
                <button type="button" className={styles.botaoFechar} onClick={onFechar} aria-label="Fechar">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </header>

            <div className={styles.corpoModal}>
              <div className={styles.colunaEsquerda}>
                {/* Cliente */}
                <section className={styles.secao}>
                  <h4 className={styles.tituloSecao}>Cliente</h4>
                  <div className={styles.blocoInfo}>
                    <p className={styles.linhaForte}>{pedido.cliente.nome}</p>
                    <p className={styles.linha}>{pedido.cliente.email}</p>
                    <p className={styles.linha}>{pedido.cliente.telefone}</p>
                  </div>
                </section>

                {/* Endereço */}
                <section className={styles.secao}>
                  <h4 className={styles.tituloSecao}>Endereço de entrega</h4>
                  <div className={styles.blocoInfo}>
                    {/* <p className={styles.linha}>{pedido.endereco.linha1}</p> */}
                    {/* <p className={styles.linha}>{pedido.endereco.linha2}</p> */}
                    {/* <p className={styles.linha}>CEP {pedido.endereco.cep}</p> */}
                  </div>
                </section>

                {/* Produtos */}
                <section className={styles.secao}>
                  <h4 className={styles.tituloSecao}>Produtos</h4>
                  <ul className={styles.listaProdutos}>
                    {(pedido.itens ?? []).map((item) => (
                      <li key={item.id} className={styles.itemProduto}>
                        <span className={styles.thumbProduto}>

                          <svg viewBox="0 0 24 24" fill="none">
                            <path d="M12 3 4 9l8 12 8-12-8-6Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
                            <path d="M4 9h16M9 9l3 12 3-12" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
                          </svg>

                          {item.imagem && (
                            <img src={`http://localhost:3000${item.imagem}`} alt={`Imagem do produto ${item.nome}`}/>
                          )}
                        </span>
                        <span className={styles.infoProduto}>
                          <span className={styles.nomeProduto}>{item.nome}</span>
                          <span className={styles.qtdProduto}>
                            {item.qtd}x {item.precoUnitario}
                          </span>
                        </span>
                        <span className={styles.subtotalProduto}>{item.subtotal}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <div className={styles.colunaDireita}>
                {/* Atualizar status — só visual por enquanto, sem integração */}
                <section className={styles.secao}>
                  <h4 className={styles.tituloSecao}>Atualizar status</h4>
                  <div className={styles.blocoStatusEdit}>
                    <select className={styles.seletorStatus} defaultValue={pedido?.status} onChange={(event) => atualizarStatus(event.target.value)}>
                      <option value="pendente">Pendente</option>  
                      <option value="enviado">Enviado</option>
                      <option value="entregue">Entregue</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                    <button type="button" className={styles.botaoSalvarStatus}>
                      Salvar status
                    </button>
                  </div>
                </section>

                {/* Resumo financeiro */}
                <section className={styles.secao}>
                  <h4 className={styles.tituloSecao}>Resumo financeiro</h4>
                  <div className={styles.blocoResumo}>
                    <div className={styles.linhaResumo}>
                      <span>Subtotal</span>
                      <span>{pedido.subtotal}</span>
                    </div>
                    <div className={styles.linhaResumo}>
                      <span>Desconto</span>
                      <span>{pedido.desconto}</span>
                    </div>
                    <div className={styles.linhaResumo}>
                      <span>Frete</span>
                      <span>{pedido.frete}</span>
                    </div>
                    <div className={styles.linhaResumo}>
                      <span>Pagamento</span>
                      <span className={styles.pagamentoResumo}>{pedido.formaPagamento}</span>
                    </div>
                    <div className={`${styles.linhaResumo} ${styles.linhaTotal}`}>
                      <span>Total</span>
                      <span>{pedido.total}</span>
                    </div>
                  </div>
                </section>

                {/* Timeline */}
                <section className={styles.secao}>
                  <h4 className={styles.tituloSecao}>Linha do tempo</h4>
                  <ul className={styles.timeline}>
                    {(pedido.timeline ?? []).map((etapa, index) => (
                      <li
                        key={`${etapa.etapa}-${index}`}
                        className={`${styles.etapaTimeline} ${etapa.concluido ? styles.etapaConcluida : ''}`}
                      >
                        <span className={styles.marcadorTimeline}>
                          {etapa.concluido && (
                            <svg viewBox="0 0 24 24" fill="none">
                              <path d="M5 12.5 10 17 19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        {index < (pedido.timeline ?? []).length - 1 && <span className={styles.linhaConectora} />}
                        <span className={styles.textoEtapa}>
                          <span className={styles.nomeEtapa}>{etapa.etapa}</span>
                          <span className={styles.dataEtapa}>{etapa.data ?? 'Aguardando'}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}