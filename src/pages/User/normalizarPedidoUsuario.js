// Converte cada item de GET /pedidos/meus-pedidos (pedido + itens + timeline,
// direto do banco) pro formato que PedidoDetalhes.jsx espera. Sem mock —
// tudo calculado a partir do que a API manda.

const TIPO_ENTREGA_LABELS = {
  'padrão': 'Entrega padrão',
  expressa: 'Entrega expressa',
  retirada: 'Retirada na loja',
};

const FORMA_PAGAMENTO_LABELS = {
  cartao: 'Cartão de crédito',
  pix: 'Pix',
  boleto: 'Boleto',
};

const formatarMoeda = (valor) =>
  Number(valor ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// Só pra variar o tom do fundo de cada thumb (a/b/c/d/e) — puramente
// decorativo, não vem do banco.
const TONS = ['a', 'b', 'c', 'd', 'e'];

export function normalizarPedidoUsuario(pedidoApi) {
  return {
    numero: `AZY-${String(pedidoApi.id).padStart(6, '0')}`,
    status: pedidoApi.status_pedido,
    itens: (pedidoApi.itens ?? []).map((item, index) => ({
      id: item.produto_id,
      nome: item.nome,
      imagem: item.imagem ? `http://localhost:3000${item.imagem}` : null,
      qtd: item.quantidade,
      preco: formatarMoeda(item.subtotal),
      tom: TONS[index % TONS.length],
    })),
    entrega: {
      tipoLabel: TIPO_ENTREGA_LABELS[pedidoApi.tipo_entrega] ?? pedidoApi.tipo_entrega,
      prazo: pedidoApi.prazo_entrega,
    },
    // Não existe rastreio/transportadora no banco ainda — fica undefined até
    // isso ser adicionado (o componente já trata esse caso mostrando o aviso
    // "fica disponível assim que o pedido é enviado").
    rastreio: undefined,
    transportadora: undefined,
    pagamento: {
      metodo: FORMA_PAGAMENTO_LABELS[pedidoApi.forma_pagamento] ?? pedidoApi.forma_pagamento,
      // bandeira/final/parcelas também não existem no banco — não são
      // exibidos (o JSX já só renderiza se vierem preenchidos).
    },
    valorTotal: formatarMoeda(pedidoApi.total),
    timeline: pedidoApi.timeline ?? [],
  };
}