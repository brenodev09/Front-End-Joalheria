// Dados fictícios — nenhuma chamada de API é feita nesta página.

export const STATUS = {
  PROCESSANDO: 'processando',
  TRANSPORTE: 'transporte',
  ENTREGUE: 'entregue',
  CANCELADO: 'cancelado',
};

export const STATUS_LABEL = {
  [STATUS.PROCESSANDO]: 'Em preparação',
  [STATUS.TRANSPORTE]: 'Em transporte',
  [STATUS.ENTREGUE]: 'Entregue',
  [STATUS.CANCELADO]: 'Cancelado',
};

// Etapas exibidas na barra de progresso (pedidos cancelados não usam etapas)
export const ETAPAS = ['Confirmado', 'Preparando', 'Enviado', 'Entregue'];

const formatBRL = (valor) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const mockPedidos = [
  {
    id: 'AZY-83291',
    dataCompra: '12 de junho de 2026',
    status: STATUS.ENTREGUE,
    etapaAtual: 4,
    valorTotal: formatBRL(18490),
    itens: [
      { id: 1, nome: 'Anel Solitário Ouro 18k', preco: 'R$ 9.890,00', qtd: 1, tom: 'a' },
      { id: 2, nome: 'Aliança Eternity Cravejada', preco: 'R$ 8.600,00', qtd: 1, tom: 'b' },
    ],
    qtdItens: 2,
    endereco: {
      nome: 'Isabela Martins',
      linha1: 'Rua das Palmeiras, 482, apto 61',
      linha2: 'Jardim Paulista — São Paulo, SP',
      cep: '01415-001',
    },
    pagamento: { metodo: 'Cartão de crédito', bandeira: 'Visa', final: '4471', parcelas: '3x sem juros' },
    rastreio: 'AZY7788299BR',
    transportadora: 'AZORY Express',
  },
  {
    id: 'AZY-83105',
    dataCompra: '29 de junho de 2026',
    status: STATUS.TRANSPORTE,
    etapaAtual: 3,
    valorTotal: formatBRL(6290),
    itens: [
      { id: 3, nome: 'Colar Trelícia Ouro Rosé', preco: 'R$ 6.290,00', qtd: 1, tom: 'c' },
    ],
    qtdItens: 1,
    endereco: {
      nome: 'Isabela Martins',
      linha1: 'Rua das Palmeiras, 482, apto 61',
      linha2: 'Jardim Paulista — São Paulo, SP',
      cep: '01415-001',
    },
    pagamento: { metodo: 'Pix', bandeira: null, final: null, parcelas: 'Pagamento único' },
    rastreio: 'AZY7791420BR',
    transportadora: 'AZORY Express',
  },
  {
    id: 'AZY-82977',
    dataCompra: '14 de julho de 2026',
    status: STATUS.PROCESSANDO,
    etapaAtual: 2,
    valorTotal: formatBRL(4150),
    itens: [
      { id: 4, nome: 'Brincos Argola Diamante', preco: 'R$ 4.150,00', qtd: 1, tom: 'd' },
    ],
    qtdItens: 1,
    endereco: {
      nome: 'Isabela Martins',
      linha1: 'Av. Higienópolis, 901, cobertura',
      linha2: 'Higienópolis — São Paulo, SP',
      cep: '01238-000',
    },
    pagamento: { metodo: 'Cartão de crédito', bandeira: 'Mastercard', final: '2209', parcelas: '6x sem juros' },
    rastreio: 'Aguardando postagem',
    transportadora: 'AZORY Express',
  },
  {
    id: 'AZY-82650',
    dataCompra: '02 de julho de 2026',
    status: STATUS.CANCELADO,
    etapaAtual: 0,
    valorTotal: formatBRL(3290),
    itens: [
      { id: 5, nome: 'Pulseira Elos Cravejada', preco: 'R$ 3.290,00', qtd: 1, tom: 'e' },
    ],
    qtdItens: 1,
    endereco: {
      nome: 'Isabela Martins',
      linha1: 'Rua das Palmeiras, 482, apto 61',
      linha2: 'Jardim Paulista — São Paulo, SP',
      cep: '01415-001',
    },
    pagamento: { metodo: 'Cartão de crédito', bandeira: 'Visa', final: '4471', parcelas: 'Estorno em processamento' },
    rastreio: 'Cancelado antes do envio',
    transportadora: '—',
  },
  {
    id: 'AZY-82304',
    dataCompra: '18 de maio de 2026',
    status: STATUS.ENTREGUE,
    etapaAtual: 4,
    valorTotal: formatBRL(24980),
    itens: [
      { id: 6, nome: 'Colar Ponto de Luz', preco: 'R$ 12.490,00', qtd: 1, tom: 'a' },
      { id: 7, nome: 'Brincos Ponto de Luz', preco: 'R$ 12.490,00', qtd: 1, tom: 'b' },
    ],
    qtdItens: 2,
    endereco: {
      nome: 'Isabela Martins',
      linha1: 'Av. Higienópolis, 901, cobertura',
      linha2: 'Higienópolis — São Paulo, SP',
      cep: '01238-000',
    },
    pagamento: { metodo: 'Cartão de crédito', bandeira: 'Amex', final: '1027', parcelas: '10x sem juros' },
    rastreio: 'AZY7765310BR',
    transportadora: 'AZORY Express',
  },
];
