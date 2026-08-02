import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import styles from './PedidoCard.module.css';
import StatusBadge from '../StatusBadge/StatusBadge';
import PedidoDetalhes from '../PedidoDetalhes/PedidoDetalhes';
import ProgressoEntrega from './ProgressoEntrega';

export default function PedidoCard({ pedido }) {
  const [aberto, setAberto] = useState(false);
  const painelRef = useRef(null);
  const conteudoRef = useRef(null);
  const setaRef = useRef(null);

  useGSAP(() => {
    const painel = painelRef.current;
    const conteudo = conteudoRef.current;
    if (!painel || !conteudo) return;

    gsap.killTweensOf(painel);

    if (aberto) {
      gsap.set(painel, { display: 'block' });
      const altura = conteudo.getBoundingClientRect().height;
      gsap.fromTo(
        painel,
        { height: 0, opacity: 0 },
        { height: altura, opacity: 1, duration: 0.55, ease: 'power3.out' }
      );
      gsap.fromTo(
        conteudo,
        { y: -8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.08 }
      );
    } else {
      gsap.to(painel, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => gsap.set(painel, { display: 'none' }),
      });
    }

    gsap.to(setaRef.current, {
      rotate: aberto ? 180 : 0,
      duration: 0.4,
      ease: 'power2.inOut',
    });
  }, [aberto]);

  return (
    <article className={`${styles.card} ${aberto ? styles.cardAberto : ''}`} data-pedido-card>
      <div className={styles.cabecalho}>
        <div className={styles.identificacao}>
          <span className={styles.numeroPedido}>{pedido.id}</span>
          <span className={styles.dataCompra}>Comprado em {pedido.dataCompra}</span>
        </div>
        <StatusBadge status={pedido.status} />
      </div>

      <div className={styles.corpo}>
        <div className={styles.miniaturas}>
          {pedido.itens.slice(0, 4).map((item) => (
            <span key={item.id} className={`${styles.miniatura} ${styles[`tom-${item.tom}`]}`}>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 3 4 9l8 12 8-12-8-6Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
                <path d="M4 9h16M9 9l3 12 3-12" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
              </svg>
            </span>
          ))}
        </div>

        <div className={styles.infoCentral}>
          <span className={styles.qtdItens}>
            {pedido.qtdItens} {pedido.qtdItens === 1 ? 'peça' : 'peças'}
          </span>
          <ProgressoEntrega status={pedido.status} etapaAtual={pedido.etapaAtual} />
        </div>

        <div className={styles.valorBloco}>
          <span className={styles.valorLabel}>Total</span>
          <span className={styles.valorTotal}>{pedido.valorTotal}</span>
        </div>

        <button
          type="button"
          className={styles.botaoDetalhes}
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
        >
          Ver detalhes
          <svg ref={setaRef} viewBox="0 0 24 24" fill="none" className={styles.seta}>
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className={styles.painel} ref={painelRef} style={{ display: 'none', height: 0, overflow: 'hidden' }}>
        <div ref={conteudoRef}>
          <PedidoDetalhes pedido={pedido} />
        </div>
      </div>
    </article>
  );
}
