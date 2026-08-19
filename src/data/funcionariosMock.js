// Dados mockados — nenhuma chamada de API é feita nesta página.
// Substitua por integração real quando o backend estiver disponível.

function gerarAvatar(nome) {
  const iniciais = encodeURIComponent(nome);
  return `https://ui-avatars.com/api/?name=${iniciais}&background=F3E9D8&color=6F552E&font-size=0.38&bold=true`;
}

export const CARGOS = [
  "Gerente de Loja",
  "Vendedor(a)",
  "Joalheiro(a)",
  "Avaliador(a) de Gemas",
  "Atendimento ao Cliente",
  "Analista de Estoque",
  "Designer de Joias",
];

export const STATUS_FUNCIONARIO = ["Ativo", "Inativo"];

export const funcionariosMock = [
  {
    id: "fn-001",
    nome: "Marina Albuquerque",
    email: "marina.albuquerque@joiaraffiné.com",
    telefone: "(11) 98221-3345",
    cargo: "Gerente de Loja",
    status: "Ativo",
    dataCadastro: "2022-03-14",
  },
  {
    id: "fn-002",
    nome: "Rafael Bittencourt",
    email: "rafael.bittencourt@joiaraffiné.com",
    telefone: "(11) 97765-8890",
    cargo: "Joalheiro(a)",
    status: "Ativo",
    dataCadastro: "2021-11-02",
  },
  {
    id: "fn-003",
    nome: "Camila Torres",
    email: "camila.torres@joiaraffiné.com",
    telefone: "(21) 99887-1122",
    cargo: "Vendedor(a)",
    status: "Ativo",
    dataCadastro: "2023-01-19",
  },
  {
    id: "fn-004",
    nome: "Eduardo Nascimento",
    email: "eduardo.nascimento@joiaraffiné.com",
    telefone: "(11) 96654-2210",
    cargo: "Avaliador(a) de Gemas",
    status: "Inativo",
    dataCadastro: "2020-07-08",
  },
  {
    id: "fn-005",
    nome: "Beatriz Lacerda",
    email: "beatriz.lacerda@joiaraffiné.com",
    telefone: "(31) 98456-7723",
    cargo: "Designer de Joias",
    status: "Ativo",
    dataCadastro: "2023-06-27",
  },
  {
    id: "fn-006",
    nome: "Thiago Menezes",
    email: "thiago.menezes@joiaraffiné.com",
    telefone: "(11) 99012-4456",
    cargo: "Analista de Estoque",
    status: "Ativo",
    dataCadastro: "2022-09-30",
  },
  {
    id: "fn-007",
    nome: "Larissa Fontoura",
    email: "larissa.fontoura@joiaraffiné.com",
    telefone: "(41) 98123-9987",
    cargo: "Atendimento ao Cliente",
    status: "Inativo",
    dataCadastro: "2021-04-16",
  },
  {
    id: "fn-008",
    nome: "Gustavo Ramalho",
    email: "gustavo.ramalho@joiaraffiné.com",
    telefone: "(11) 97231-5567",
    cargo: "Vendedor(a)",
    status: "Ativo",
    dataCadastro: "2024-02-05",
  },
].map((f) => ({ ...f, avatarUrl: gerarAvatar(f.nome) }));
