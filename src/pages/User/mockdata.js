// mockData.js
// Dados fictícios para a página "Minha Conta" — AZORY

export const usuario = {
  nome: "Isabela Martins",
  iniciais: "IM",
  email: "isabela.martins@email.com",
  telefone: "(21) 98765-4321",
  nascimento: "1994-03-18",
  membroDesde: "12 de mar. de 2023",
  badge: "Cliente Premium",
};

export const resumoo = [
  { id: "pedidos", label: "Pedidos realizados", valor: "12", icone: "bag" },
  { id: "favoritos", label: "Favoritos", valor: "8", icone: "heart" },
  { id: "carrinho", label: "Itens no carrinho", valor: "3", icone: "cart" },
  { id: "gasto", label: "Total investido", valor: "R$ 24.850", icone: "gem" },
];

export const pedidosRecentes = [
  {
    id: "AZ-10482",
    data: "24 de jul. de 2026",
    itens: "Colar Aurora + Brincos Lumière",
    total: "R$ 6.290,00",
    status: "Entregue",
  },
  {
    id: "AZ-10437",
    data: "09 de jul. de 2026",
    itens: "Anel Solstice Ouro 18k",
    total: "R$ 4.150,00",
    status: "Enviado",
  },
  {
    id: "AZ-10391",
    data: "28 de jun. de 2026",
    itens: "Pulseira Constelar",
    total: "R$ 2.980,00",
    status: "Processando",
  },
  {
    id: "AZ-10322",
    data: "02 de jun. de 2026",
    itens: "Relógio Meridian Prata",
    total: "R$ 8.430,00",
    status: "Entregue",
  },
];

export const favoritosRecentes = [
  { id: 1, nome: "Colar Aurora", categoria: "Colares", preco: "R$ 3.290,00" },
  { id: 2, nome: "Anel Solstice", categoria: "Anéis", preco: "R$ 4.150,00" },
  { id: 3, nome: "Brincos Lumière", categoria: "Brincos", preco: "R$ 2.180,00" },
  { id: 4, nome: "Pulseira Constelar", categoria: "Pulseiras", preco: "R$ 2.980,00" },
];

export const timelineAtividades = [
  {
    id: 1,
    titulo: "Pedido realizado",
    descricao: "Pedido AZ-10482 confirmado com sucesso.",
    data: "24 de jul. de 2026 · 14:32",
  },
  {
    id: 2,
    titulo: "Pagamento aprovado",
    descricao: "Pagamento processado via cartão final 4821.",
    data: "24 de jul. de 2026 · 14:35",
  },
  {
    id: 3,
    titulo: "Pedido enviado",
    descricao: "Saiu do ateliê AZORY rumo ao endereço de entrega.",
    data: "26 de jul. de 2026 · 09:10",
  },
  {
    id: 4,
    titulo: "Pedido entregue",
    descricao: "Recebido e assinado no endereço de destino.",
    data: "29 de jul. de 2026 · 16:47",
  },
];