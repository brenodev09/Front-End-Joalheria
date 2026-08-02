import styles from './StatusBadge.module.css';
import { STATUS, STATUS_LABEL } from '../../../pages/User/mockPedidos';

const DOT_CLASS = {
  [STATUS.PROCESSANDO]: styles.dotProcessando,
  [STATUS.TRANSPORTE]: styles.dotTransporte,
  [STATUS.ENTREGUE]: styles.dotEntregue,
  [STATUS.CANCELADO]: styles.dotCancelado,
};

const BADGE_CLASS = {
  [STATUS.PROCESSANDO]: styles.badgeProcessando,
  [STATUS.TRANSPORTE]: styles.badgeTransporte,
  [STATUS.ENTREGUE]: styles.badgeEntregue,
  [STATUS.CANCELADO]: styles.badgeCancelado,
};

export default function StatusBadge({ status }) {
  return (
    <span className={`${styles.badge} ${BADGE_CLASS[status]}`}>
      <span className={`${styles.dot} ${DOT_CLASS[status]}`} />
      {STATUS_LABEL[status]}
    </span>
  );
}
