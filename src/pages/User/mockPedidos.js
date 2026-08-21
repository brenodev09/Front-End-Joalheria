export const STATUS = {
  PROCESSANDO: 'processando',
  TRANSPORTE: 'transporte',
  ENTREGUE: 'entregue',
  CANCELADO: 'cancelado',
};

export const STATUS_LABEL = {
  processando: 'Em preparação',
  transporte: 'Em transporte',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
};

export const FILTROS_PEDIDOS = {
  todos: null,
  andamento: [
    STATUS.PROCESSANDO,
    STATUS.TRANSPORTE,
  ],
  entregues: [
    STATUS.ENTREGUE,
  ],
  cancelados: [
    STATUS.CANCELADO,
  ],
};