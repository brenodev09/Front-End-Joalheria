import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "../services/api";

const CarrinhoContext = createContext();

export function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState([]);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [carregando, setCarregando] = useState(false);

  // produto usado pelo toast futuramente
  const [produtoAdicionado, setProdutoAdicionado] = useState(null);

  /*
  ==========================================
      TOKEN
  ==========================================
  */
  function pegarToken() {
    return localStorage.getItem("token");
  }

  /*
  ==========================================
      CARREGAR CARRINHO
  ==========================================
  */
  async function carregarCarrinho() {
    try {
      const token = pegarToken();

      if (!token) {
        setItens([]);
        return;
      }

      setCarregando(true);

      const resposta = await api.get("/carrinho", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("CARRINHO:", resposta.data);

      setItens(resposta.data);
    } catch (error) {
      console.error(
        "Erro ao carregar carrinho",
        error.response?.data || error
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarCarrinho();
  }, []);

  /*
  ==========================================
      ADICIONAR PRODUTO
  ==========================================
  */
  async function adicionarAoCarrinho(
    produtoId,
    quantidade = 1,
    variacaoId = null,
    produtoInfo = null
) {

    console.log("DADOS ENVIO CARRINHO:", {
        produtoId,
        quantidade,
        variacaoId,
        produtoInfo,
        token: pegarToken()
    });


    try {

        const token = pegarToken();

        if (!token) {
            throw new Error("Usuário precisa estar logado");
        }


        const resposta = await api.post(
            "/carrinho",
            {
                produto_id: produtoId,
                quantidade,
                variacao_id: variacaoId,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );


        console.log("RESPOSTA BACKEND:", resposta.data);


        await carregarCarrinho();


        if (produtoInfo) {
            setProdutoAdicionado(produtoInfo);
        }


        abrirSidebar();


        return resposta.data;


    } catch (error) {

        console.error(
            "ERRO CARRINHO:",
            error.response?.data || error
        );

        throw error;

    }

}
  /*
  ==========================================
      ALTERAR QUANTIDADE
  ==========================================
  */
  async function atualizarQuantidade(itemId, quantidade) {
    try {
      const token = pegarToken();

      if (quantidade <= 0) {
        return removerProduto(itemId);
      }

      await api.put(
        `/carrinho/item/${itemId}`,
        { quantidade },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await carregarCarrinho();
    } catch (error) {
      console.error(
        "Erro quantidade",
        error.response?.data || error
      );
    }
  }

  /*
  ==========================================
      REMOVER
  ==========================================
  */
  async function removerProduto(itemId) {
    try {
      const token = pegarToken();

      await api.delete(`/carrinho/item/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await carregarCarrinho();
    } catch (error) {
      console.error(
        "Erro remover",
        error.response?.data || error
      );
    }
  }

  /*
  ==========================================
      LIMPAR
  ==========================================
  */
  async function limparCarrinho() {
    try {
      const token = pegarToken();

      await api.delete("/carrinho/limpar", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setItens([]);
    } catch (error) {
      console.error(
        "Erro limpar",
        error.response?.data || error
      );
    }
  }

  /*
  ==========================================
      SIDEBAR
  ==========================================
  */
  function abrirSidebar() {
    carregarCarrinho();
    setSidebarAberta(true);
  }

  function fecharSidebar() {
    setSidebarAberta(false);
  }

  /*
  ==========================================
      VALORES
  ==========================================
  */
  const totalItens = itens.reduce(
    (total, item) => total + Number(item.quantidade || 0),
    0
  );

  const subtotal = itens.reduce((total, item) => {
    const preco =
      Number(item.preco) ||
      Number(item.produto_preco) ||
      Number(item.valor) ||
      0;

    const qtd = Number(item.quantidade || 0);

    return total + preco * qtd;
  }, 0);

  const frete = 0;
  const total = subtotal + frete;

  return (
    <CarrinhoContext.Provider
      value={{
        // dados
        itens,
        carregando,
        produtoAdicionado,
        setProdutoAdicionado,

        // valores
        totalItens,
        subtotal,
        frete,
        total,

        // ações
        carregarCarrinho,
        adicionarAoCarrinho,
        atualizarQuantidade,
        removerProduto,
        limparCarrinho,

        // sidebar
        sidebarAberta,
        abrirSidebar,
        fecharSidebar,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  return useContext(CarrinhoContext);
}