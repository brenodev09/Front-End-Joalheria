import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import styles from "./PedidoDetalhes.module.css";
import { ETAPAS, STATUS } from '../../../pages/User/mockPedidos';

// Barra estilo "fio de ouro": trilho fino com marcador em formato de gema
// que se move até a etapa atual. Pedidos cancelados exibem trilho rompido.
export default function ProgressoEntrega({ status, etapaAtual }) {
  const fillRef = useRef(null);
  const markerRef = useRef(null);

  const totalEtapas = ETAPAS.length;
  const percentual = ((etapaAtual - 1) / (totalEtapas - 1)) * 100;

  useGSAP(() => {
    if (status === STATUS.CANCELADO) return;
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
  }, [status, percentual]);

  if (status === STATUS.CANCELADO) {
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