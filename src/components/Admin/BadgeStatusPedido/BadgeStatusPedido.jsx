import styles from './BadgeStatusPedido.module.css';
import { STATUS_PEDIDO, STATUS_LABEL } from '../../../pages/Admin/mockPedidosAdmin';

const CLASSE_POR_STATUS = {
  [STATUS_PEDIDO.PENDENTE]: styles.selosPendente,
  [STATUS_PEDIDO.PAGO]: styles.seloPago,
  [STATUS_PEDIDO.SEPARACAO]: styles.seloSeparacao,
  [STATUS_PEDIDO.ENVIADO]: styles.seloEnviado,
  [STATUS_PEDIDO.ENTREGUE]: styles.seloEntregue,
  [STATUS_PEDIDO.CANCELADO]: styles.seloCancelado,
};

export default function BadgeStatusPedido({ status }) {
  return (
    <span className={`${styles.selo} ${CLASSE_POR_STATUS[status]}`}>
      <span className={styles.ponto} />
      {STATUS_LABEL[status]}
    </span>
  );
}
