import styles from './PedidoDetalhes.module.css';
import ProgressoEntrega, { STATUS_LABELS } from './ProgressoEntrega';

function formatarDataHora(dataIso) {
  const data = new Date(dataIso);
  const dataParte = data.toLocaleDateString('pt-BR');
  const horaParte = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${dataParte} · ${horaParte}`;
}

export default function PedidoDetalhes({ pedido }) {
  return (
    <div className={styles.wrap}>
      {/* Acompanhamento: barra de progresso + timeline real (historico_pedidos) */}
      <div className={styles.acompanhamento}>
        <h4 className={styles.tituloColuna}>Acompanhamento do pedido</h4>
        <ProgressoEntrega status={pedido.statusPedido ?? pedido.status} />

        {pedido.timeline?.length > 0 && (
          <ul className={styles.linhaTempoStatus}>
            {pedido.timeline.map((evento, index) => (
              <li key={`${evento.status}-${index}`} className={styles.eventoStatus}>
                <span className={styles.pontoEvento} />
                <span className={styles.textoEvento}>
                  {STATUS_LABELS[evento.status] ?? evento.status}
                </span>
                <span className={styles.dataEvento}>{formatarDataHora(evento.criado_em)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.colunas}>
        <div className={styles.coluna}>
          <h4 className={styles.tituloColuna}>Peças do pedido</h4>
          {pedido.itens.length > 0 ? (
            <ul className={styles.listaItens}>
              {pedido.itens.map((item) => (
                <li key={item.id} className={styles.item}>
                  <span className={`${styles.thumb} ${styles[`tom-${item.tom}`]}`}>
                    {/* Ícone de fallback — some por trás da foto real quando ela carrega */}
                    <svg viewBox="0 0 24 24" fill="none" className={styles.thumbFallback}>
                      <path d="M12 3 4 9l8 12 8-12-8-6Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
                      <path d="M4 9h16M9 9l3 12 3-12" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
                    </svg>
                    {item.imagem && (
                      <img
                        src={item.imagem}
                        alt={item.nome}
                        className={styles.thumbImg}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                  </span>
                  <span className={styles.itemInfo}>
                    <span className={styles.itemNome}>{item.nome}</span>
                    <span className={styles.itemQtd}>Qtd. {item.qtd}</span>
                  </span>
                  <span className={styles.itemPreco}>{item.preco}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.linha}>Nenhuma peça encontrada para este pedido.</p>
          )}
        </div>

        <div className={styles.coluna}>
          <h4 className={styles.tituloColuna}>Entrega</h4>
          <div className={styles.blocoInfo}>
            <p className={styles.linhaForte}>{pedido.entrega.tipoLabel}</p>
            {pedido.entrega.prazo && <p className={styles.linha}>{pedido.entrega.prazo}</p>}
          </div>

          <h4 className={styles.tituloColuna} style={{ marginTop: 18 }}>
            Rastreio
          </h4>
          <div className={styles.blocoInfo}>
            {pedido.entrega.tipoLabel === 'Retirada na loja' ? (
              <p className={styles.linha}>
                O código de rastreio não está disponível, pois este pedido será retirado na loja.
              </p>
            ) : pedido.rastreio ? (
              <>
                <p className={styles.codigo}>{pedido.rastreio}</p>
                <p className={styles.linha}>{pedido.transportadora}</p>
              </>
            ) : (
              <p className={styles.linha}>
                O código de rastreio fica disponível assim que o pedido é enviado.
              </p>
            )}
          </div>
        </div>

        <div className={styles.coluna}>
          <h4 className={styles.tituloColuna}>Pagamento</h4>
          <div className={styles.blocoInfo}>
            <p className={styles.linhaForte}>{pedido.pagamento.metodo}</p>
            {pedido.pagamento.bandeira && (
              <p className={styles.linha}>
                {pedido.pagamento.bandeira} •••• {pedido.pagamento.final}
              </p>
            )}
            {pedido.pagamento.parcelas && <p className={styles.linha}>{pedido.pagamento.parcelas}</p>}
          </div>

          <h4 className={styles.tituloColuna} style={{ marginTop: 18 }}>
            Resumo
          </h4>
          <div className={styles.blocoInfo}>
            <div className={styles.resumoLinha}>
              <span>Pedido</span>
              <span className={styles.codigo}>{pedido.numero}</span>
            </div>
            <div className={styles.resumoLinha}>
              <span>Total</span>
              <span className={styles.totalDestaque}>{pedido.valorTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}