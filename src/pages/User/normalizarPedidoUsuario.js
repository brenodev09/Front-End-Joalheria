const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

const TIPO_ENTREGA_LABELS = {
  padrão: "Entrega padrão",
  expressa: "Entrega expressa",
  retirada: "Retirada na loja",
};

const FORMA_PAGAMENTO_LABELS = {
  cartao: "Cartão de crédito",
  pix: "Pix",
  boleto: "Boleto",
};

const TONS = [
  "a",
  "b",
  "c",
  "d",
  "e",
];

const formatarMoeda = (valor) =>
  Number(valor ?? 0).toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    }
  );

const formatarData = (data) => {
  if (!data) return "";

  const dataConvertida =
    new Date(data);

  if (
    Number.isNaN(
      dataConvertida.getTime()
    )
  ) {
    return "";
  }

  return dataConvertida.toLocaleDateString(
    "pt-BR",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
};

function montarUrlImagem(
  imagem
) {
  if (!imagem) {
    return null;
  }

  if (
    imagem.startsWith(
      "http://"
    ) ||
    imagem.startsWith(
      "https://"
    )
  ) {
    return imagem;
  }

  return `${API_BASE_URL}${
    imagem.startsWith("/")
      ? imagem
      : `/${imagem}`
  }`;
}

export function normalizarPedidoUsuario(
  pedidoApi
) {
  const itens =
    Array.isArray(
      pedidoApi?.itens
    )
      ? pedidoApi.itens
      : [];

  return {
    id: pedidoApi.id,

    numero: `AZY-${String(
      pedidoApi.id
    ).padStart(6, "0")}`,

    status:
      pedidoApi.status_pedido,

    statusPedido:
      pedidoApi.status_pedido,

    dataCompra:
      formatarData(
        pedidoApi.criado_em
      ),

    valorTotal:
      formatarMoeda(
        pedidoApi.total
      ),

    timeline:
      Array.isArray(
        pedidoApi.timeline
      )
        ? pedidoApi.timeline
        : [],

    itens: itens.map(
      (item, index) => ({
        id: item.produto_id,

        nome:
          item.nome ??
          "Produto",

        imagem:
          montarUrlImagem(
            item.imagem
          ),

        preco:
          formatarMoeda(
            item.preco_unitario ??
              item.subtotal
          ),

        quantidade:
          Number(
            item.quantidade ?? 0
          ),

        tom:
          TONS[
            index %
              TONS.length
          ],
      })
    ),

    entrega: {
      tipo:
        pedidoApi.tipo_entrega,

      tipoLabel:
        TIPO_ENTREGA_LABELS[
          pedidoApi.tipo_entrega
        ] ??
        pedidoApi.tipo_entrega ??
        "Entrega",

      prazo:
        pedidoApi.prazo_entrega ??
        null,

      endereco:
        pedidoApi.tipo_entrega !==
        "retirada"
          ? {
              nome:
                pedidoApi.endereco_nome_destinatario,

              telefone:
                pedidoApi.endereco_telefone,

              rua:
                pedidoApi.endereco_rua,

              numero:
                pedidoApi.endereco_numero,

              complemento:
                pedidoApi.endereco_complemento,

              bairro:
                pedidoApi.endereco_bairro,

              cidade:
                pedidoApi.endereco_cidade,

              estado:
                pedidoApi.endereco_estado,

              cep:
                pedidoApi.endereco_cep,
            }
          : null,
    },

    pagamento: {
      metodo:
        FORMA_PAGAMENTO_LABELS[
          pedidoApi.forma_pagamento
        ] ??
        pedidoApi.forma_pagamento ??
        "Não informado",

      bandeira:
        pedidoApi.cartao_bandeira ??
        null,

      final:
        pedidoApi.cartao_final ??
        null,

      nomeTitular:
        pedidoApi.cartao_nome_titular ??
        null,

      parcelas:
        pedidoApi.parcelas ??
        null,
    },

    rastreio:
      pedidoApi.rastreio ??
      null,

    transportadora:
      pedidoApi.transportadora ??
      null,
  };
}