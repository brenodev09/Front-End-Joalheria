import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import styles from './PedidoDetalhes.module.css';

// Rótulos das etapas da barra + tradução do status_pedido (enum do banco)
// pra cada uma delas. Antes vinha de pages/User/mockPedidos — agora é tudo
// derivado direto do status real, sem mock.
export const ETAPAS = ['Pedido realizado', 'Pagamento aprovado', 'Enviado', 'Entregue'];

export const STATUS_LABELS = {
  pendente: 'Pedido realizado',
  pago: 'Pagamento aprovado',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
};

const ETAPA_POR_STATUS = {
  // O sistema não verifica pagamento separadamente — ao criar o pedido
  // (status "pendente") já consideramos as duas primeiras etapas cumpridas,
  // pra timeline não ficar "esperando" um evento que nunca vai acontecer.
  pendente: 2,
  pago: 2,
  enviado: 3,
  entregue: 4,
};

// Barra estilo "fio de ouro": trilho fino com marcador em formato de gema
// que se move até a etapa atual. Pedidos cancelados exibem trilho rompido.
// Recebe só o `status` (valor de status_pedido) — a etapa é calculada aqui.
export default function ProgressoEntrega({ status }) {
  const fillRef = useRef(null);
  const markerRef = useRef(null);

  const statusNormalizado = String(status ?? '').trim().toLowerCase();
  const cancelado = statusNormalizado === 'cancelado';
  const etapaAtual = ETAPA_POR_STATUS[statusNormalizado] ?? 1;
  const totalEtapas = ETAPAS.length;
  const percentual = ((etapaAtual - 1) / (totalEtapas - 1)) * 100;

  useGSAP(() => {
    if (cancelado) return;
    gsap.fromTo(
      fillRef.current,
      { width: '0%' },
      { width: `${percentual}%`, duration: 1.1, ease: 'power3.out', delay: 0.15 }
    );
    gsap.fromTo(
      markerRef.current,
      { left: '0%', opacity: 0 },
      { left: `${percentual}%`, opacity: 1, duration: 1.1, ease: 'power3.out', delay: 0.15 }
    );
  }, [cancelado, percentual]);

  if (cancelado) {
    return (
      <div className={styles.progressoCancelado}>
        <span className={styles.linhaRompida} />
        <span className={styles.textoCancelado}>Pedido cancelado antes do envio</span>
      </div>
    );
  }

  return (
    <div className={styles.progresso}>
      <div className={styles.trilho}>
        <div className={styles.trilhoFill} ref={fillRef} />
        <span className={styles.marcador} ref={markerRef}>
          <span className={styles.gema} />
        </span>
      </div>
      <div className={styles.etapas}>
        {ETAPAS.map((etapa, i) => (
          <span
            key={etapa}
            className={`${styles.etapaLabel} ${i < etapaAtual ? styles.etapaAtiva : ''}`}
          >
            {etapa}
          </span>
        ))}
      </div>
    </div>
  );
}