// Utils compartilhados entre as páginas de Admin que lidam com pedidos
// (GestaoPedidos.jsx e dashboard.jsx). Centraliza o enum de status, labels
// e as funções de formatação/normalização dos dados que vêm da API
// (GET /pedidos/pedidos-admin e GET /pedidos/pedidos-admin/:id).
//
// Antes esse arquivo se chamava "mockPedidosAdmin.js" e só tinha o enum de
// status. As funções de normalização/formatação viviam duplicadas (ou
// faltando) em cada página — foram movidas pra cá pra evitar isso.

export const STATUS_PEDIDO = {
  PENDENTE: 'pendente',
  PAGO: 'pago',
  SEPARACAO: 'separacao',
  ENVIADO: 'enviado',
  ENTREGUE: 'entregue',
  CANCELADO: 'cancelado',
};

// Rótulo genérico de cada status (usado em filtros, badges, etc.)
export const STATUS_LABEL = {
  [STATUS_PEDIDO.PENDENTE]: 'Pendente',
  [STATUS_PEDIDO.PAGO]: 'Pago',
  [STATUS_PEDIDO.SEPARACAO]: 'Em Separação',
  [STATUS_PEDIDO.ENVIADO]: 'Enviado',
  [STATUS_PEDIDO.ENTREGUE]: 'Entregue',
  [STATUS_PEDIDO.CANCELADO]: 'Cancelado',
};

// Rótulo de cada status quando exibido na timeline do modal de detalhes
// (frase no particípio, ex: "Pagamento aprovado" em vez de "Pago").
export const STATUS_LABEL_TIMELINE = {
  pendente: 'Pedido realizado',
  pago: 'Pagamento aprovado',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
};

export const formatarMoeda = (valor) =>
  Number(valor ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function converterDataBr(dataStr) {
  const [dataParte] = dataStr.split(' ');
  const [dia, mes, ano] = dataParte.split('/').map(Number);
  return new Date(ano, mes - 1, dia);
}

export function estaNoPeriodo(dataPedido, periodo, referenciaHoje) {
  if (periodo === 'todos') return true;
  const diffDias = Math.floor((referenciaHoje - converterDataBr(dataPedido)) / (1000 * 60 * 60 * 24));
  if (periodo === 'hoje') return diffDias === 0;
  if (periodo === '7dias') return diffDias >= 0 && diffDias <= 7;
  if (periodo === '30dias') return diffDias >= 0 && diffDias <= 30;
  return true;
}

// Verifica se a data de um pedido (no formato "dd/mm/aaaa hh:mm") cai no
// mesmo mês/ano da data de referência. Usado pra calcular métricas do tipo
// "faturamento mensal", "vendas do mês", etc.
export function estaNoMesAtual(dataPedido, referenciaHoje = new Date()) {
  const data = converterDataBr(dataPedido);
  return (
    data.getMonth() === referenciaHoje.getMonth() &&
    data.getFullYear() === referenciaHoje.getFullYear()
  );
}

// Data + hora no formato "dd/mm/aaaa hh:mm", que é o que estaNoPeriodo/converterDataBr
// esperam (eles fazem split(' ') e depois split('/')).
export function formatarDataPedido(dataIso) {
  const data = new Date(dataIso);
  const dataParte = data.toLocaleDateString('pt-BR');
  const horaParte = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${dataParte} ${horaParte}`;
}

// Converte cada linha vinda de GET /pedidos/pedidos-admin (ver pedidos.routes.js)
// para o formato que a UI (cards de métrica, filtros, tabela, dashboard) espera.
// OBS: ajuste STATUS_PEDIDO acima caso os valores não sejam exatamente iguais
// aos do enum status_pedido do banco (pendente/enviado/entregue/cancelado).
export function normalizarPedidoAdmin(pedidoApi) {
  return {
    id: pedidoApi.id,
    numero: `AZY-${String(pedidoApi.id).padStart(6, '0')}`,
    cliente: {
      nome: pedidoApi.cliente_nome,
      email: pedidoApi.cliente_email,
    },
    dataPedido: formatarDataPedido(pedidoApi.criado_em),
    quantidadeItens: Number(pedidoApi.quantidade_itens ?? 0),
    totalNumero: Number(pedidoApi.total ?? 0),
    total: formatarMoeda(pedidoApi.total),
    status: pedidoApi.status_pedido,
  };
}

// Converte a resposta de GET /pedidos/pedidos-admin/:id ({ pedido, itens, timeline })
// pro formato completo que ModalDetalhesPedido.jsx precisa. É um objeto bem
// mais rico que o da listagem — por isso é buscado só quando o modal abre,
// e não já na listagem.
export function normalizarDetalhePedido(resposta) {
  const { pedido, itens, timeline } = resposta;

  return {
    id: pedido.id,
    numero: `AZY-${String(pedido.id).padStart(6, '0')}`,
    status: pedido.status_pedido,
    cliente: {
      nome: pedido.cliente_nome,
      email: pedido.cliente_email,
      // A tabela usuarios/pedidos não tem telefone nem endereço hoje — se
      // isso for adicionado no banco, é só incluir aqui.
      telefone: pedido.cliente_telefone ?? '—',
    },
    // Endereço de entrega salvo no próprio pedido — não existe quando o
    // cliente escolheu retirada na loja. Dados de cartão de propósito NÃO
    // entram aqui: o admin só deve ver o endereço, nunca o cartão do cliente.
    endereco: pedido.tipo_entrega !== 'retirada' ? {
      nome: pedido.endereco_nome_destinatario,
      telefone: pedido.endereco_telefone,
      rua: pedido.endereco_rua,
      numero: pedido.endereco_numero,
      complemento: pedido.endereco_complemento,
      bairro: pedido.endereco_bairro,
      cidade: pedido.endereco_cidade,
      estado: pedido.endereco_estado,
      cep: pedido.endereco_cep,
    } : null,
    tipoEntregaLabel: pedido.tipo_entrega === 'retirada' ? 'Retirada na loja' : null,
    itens: itens.map((item) => ({
      id: item.produto_id,
      nome: item.nome,
      imagem: item.imagem,
      qtd: item.quantidade,
      precoUnitario: formatarMoeda(item.preco_unitario),
      subtotal: formatarMoeda(item.subtotal),
    })),
    subtotal: formatarMoeda(pedido.subtotal),
    desconto: formatarMoeda(pedido.desconto),
    frete: formatarMoeda(pedido.frete),
    formaPagamento: pedido.forma_pagamento,
    total: formatarMoeda(pedido.total),
    // historico_pedidos vem em ordem cronológica crescente — cada linha já
    // é um evento que aconteceu de fato, então todas entram "concluídas".
    timeline: (timeline ?? []).map((evento) => ({
      etapa: STATUS_LABEL_TIMELINE[evento.status] ?? evento.status,
      data: formatarDataPedido(evento.criado_em),
      concluido: true,
    })),
  };
}