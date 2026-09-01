import React, { useMemo, useState, useEffect } from "react";
import styles from "../../styles/Admin/produtosAdmin.module.css";
import { api } from "../../services/api";
import ModalAddProduto from "../../components/Admin/Modais/ModalAddProduto";
import ModalDeletarProduto from "../../components/Admin/Modais/ModalDeletarProduto";
import ModalEditarProduto from "../../components/Admin/Modais/ModalEditarProduto";

import {
  Search,
  Filter,
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
  Package,
  AlertTriangle,
  Gem,
  X,
} from "lucide-react";



export default function Produtos() {


  useEffect(() => {
    buscarProdutos()
  }, [])

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalExcluirAberto, setModalExcluirAberto] =
    useState(false);


  const [abrirModalEditar, setAbrirModalEditar] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const [search, setSearch] = useState("");
  const [abrirModal, setAbrirModal] = useState(false);
  const [category, setCategory] = useState("");
  const [material, setMaterial] = useState("");
  const [status, setStatus] = useState("");
  const [viewMode, setViewMode] = useState("table");

  const [selectedProduct, setSelectedProduct] = useState(null);
  useEffect(() => {
    buscarProdutos();
  }, []);

  function abrirEditarProduto(produto) {
    setProdutoSelecionado(produto);
    setAbrirModalEditar(true);
  }


  async function excluirProduto() {
    try {
      await api.delete(
        `/produtos/${produtoSelecionado.id}`
      );

      setProducts((produtos) =>
        produtos.filter(
          (produto) =>
            produto.id !== produtoSelecionado.id
        )
      );

      setModalExcluirAberto(false);
      setProdutoSelecionado(null);

    } catch (error) {
      console.error(error);
    }
  }
  async function buscarProdutos() {
    try {
      const response = await api.get("/produtos");
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchMatch =
        product.nome?.toLowerCase().includes(search.toLowerCase()) ||
        String(product.id).includes(search) ||
        product.categoria?.toLowerCase().includes(search.toLowerCase());

      return (
        searchMatch &&
        (!category || product.categoria === category) &&
        (!material || product.material === material) &&
        (!status ||
          getStatusByStock(
            product.estoque,
            product.estoque_minimo
          ) === status)
      );
    });
  }, [
    products,
    search,
    category,
    material,
    status,
  ]);

  const summary = useMemo(() => {
    const totalProducts = products.length;

    const lowStockProducts = products.filter(
      (product) =>
        Number(product.estoque) <=
        Number(product.estoque_minimo)
    ).length;

    const totalValue = products.reduce(
      (sum, product) =>
        sum +
        Number(product.preco) *
        Number(product.estoque),
      0
    );

    const activeProducts = products.filter(
      (product) => product.ativo === 1
    ).length;

    return {
      totalProducts,
      lowStockProducts,
      totalValue,
      activeProducts,
    };
  }, [products]);













  if (loading) {
    return (
      <main className={styles.adminProductsPage}>
        <p className={styles.carregando}>Carregando produtos...</p>
      </main>
    )
  }

  return (
    <main className={styles.adminProductsPage}>


      <div className={styles.adminProductsShell}>
        <section className={styles.adminProductsContent}>
          <header className={styles.adminProductsHeader}>
            <div>


              <h1>
                Produtos
              </h1>

              <p>Gerencie suas peças, coleções, estoques e valores.</p>
            </div>

            <button
              className={`${styles.btnPadrao} ${styles.addProductBtn}`}
              onClick={() => setAbrirModal(true)}
            >
              <img
                width="20"
                height="20"
                src="https://img.icons8.com/ios-filled/23/plus-math.png"
                alt="plus-math"
              />
              <p>ADICIONAR PRODUTO</p>
            </button>
          </header>

          <section className={styles.productsMetrics}>
            <MetricCard
              icon={<Package size={24} />}
              label="Total de Produtos"
              value={summary.totalProducts}
              text={`${summary.activeProducts} ativos`}
            />

            <MetricCard
              icon={<AlertTriangle size={24} />}
              label="Baixo Estoque"
              value={summary.lowStockProducts}
              text="Ver itens"
            />

            <MetricCard
              icon={<Gem size={26} />}
              label="Valor Total Estimado"
              value={formatCurrency(summary.totalValue)}
              text="Atualizado hoje"
            />
          </section>

          <section className={styles.adminProductsFilters}>
            <div className={styles.adminSearch}>
              <input
                type="text"
                placeholder="Buscar produto, coleção ou código..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search size={15} />
            </div>

            <SelectBox
              value={category}
              onChange={setCategory}
              placeholder="Categoria"
            >
              <option value="Anéis">Anéis</option>
              <option value="Colares">Colares</option>
              <option value="Brincos">Brincos</option>
              <option value="Pulseiras">Pulseiras</option>
              <option value="Braceletes">Braceletes</option>
            </SelectBox>

            <SelectBox
              value={material}
              onChange={setMaterial}
              placeholder="Material Principal"
            >
              <option value="Ouro 18k">Ouro 18k</option>
              <option value="Prata 925">Prata 925</option>
              <option value="Ouro Rosé 18k">Ouro Rosé 18k</option>
            </SelectBox>

            <SelectBox value={status} onChange={setStatus} placeholder="Status">
              <option value="Ativo">Ativo</option>
              <option value="Estoque baixo">Estoque baixo</option>
              <option value="Crítico">Crítico</option>
            </SelectBox>

            <button className={styles.moreFiltersBtn}>
              <Filter size={15} />
              Filtros
            </button>

            <button
              className={styles.clearFilterBtn}
              onClick={() => {
                setSearch("");
                setCategory("");
                setMaterial("");
                setStatus("");
              }}
            >
              Limpar
            </button>

          </section>

          <section className={styles.productsTableCard}>
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Coleção</th>
                  <th>Categoria</th>
                  <th>Material</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th>Status</th>
                  <th>Destaque</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className={
                      selectedProduct?.id === product.id ? styles.selectedRow : ""
                    }
                  >
                    <td>
                      <div className={styles.productCell}>
                        <ProductThumb
                          image={
                            product.imagem
                              ? `http://localhost:3000${product.imagem}`
                              : null
                          }
                        />

                        <div>
                          <strong>{product.nome}</strong>
                          <span>ID: PRD-{product.id}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <strong className={styles.collectionName}>

                      </strong>
                      <span className={styles.collectionType}>● Premium</span>
                    </td>

                    <td>{product.categoria}</td>
                    <td>{product.material}</td>
                    <td className={styles.price}>
                      {formatCurrency(product.preco)}
                    </td>
                    <td>{product.estoque} un.</td>
                    <td>
                      <StatusBadge
                        status={getStatusByStock(
                          product.estoque,
                          product.estoque_minimo
                        )}
                      />
                    </td>
                    <td>
                      {product.destaque  ? (
                        <span className={styles.badgeDestaque}>
                          ⭐ Destaque
                        </span>
                      ) : (
                        <span className={styles.badgeNormal}>
                          Normal
                        </span>
                      )}
                    </td>
                    <td>
                      <div className={styles.actions}>


                        <button
                          title="Editar"
                          onClick={() => abrirEditarProduto(product)}
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          title="Excluir"
                          className={styles.delete}
                          onClick={() => {
                            setProdutoSelecionado(product);
                            setModalExcluirAberto(true);
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <footer className={styles.tableFooter}>
              Mostrando 1-{filteredProducts.length} de {products.length} produtos
            </footer>
          </section>
        </section>


      </div>
      <ModalAddProduto
        isOpen={abrirModal}
        fecharModal={() => {
          setAbrirModal(false);
          buscarProdutos();
        }}
      />
      <ModalDeletarProduto
        aberto={modalExcluirAberto}
        produto={produtoSelecionado}
        aoFechar={() => {
          setModalExcluirAberto(false);
          setProdutoSelecionado(null);
        }}
        aoConfirmar={excluirProduto}
      />
      <ModalEditarProduto
        isOpen={abrirModalEditar}
        fecharModal={() => {
          setAbrirModalEditar(false);
          setProdutoSelecionado(null);
        }}
        produto={produtoSelecionado}
        aoSalvar={() => {
          buscarProdutos();
          setAbrirModalEditar(false);
        }}
      />

    </main>
  );
}

function MetricCard({ icon, label, value, text }) {
  return (
    <article className={styles.metricCard}>
      <div className={styles.metricIcon}>{icon}</div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{text}</small>
      </div>
    </article>
  );
}





function SelectBox({ value, onChange, placeholder, children }) {
  return (
    <div className={styles.selectBox}>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{placeholder}</option>
        {children}
      </select>

      <ChevronDown size={14} />
    </div>
  );
}

function StatusBadge({ status }) {
  const className =
    status === "Ativo"
      ? `${styles.statusBadge} ${styles.active}`
      : status === "Estoque baixo"
        ? `${styles.statusBadge} ${styles.low}`
        : `${styles.statusBadge} ${styles.critical}`;

  return <span className={className}>{status}</span>;
}

function ProductThumb({ image }) {
  if (image) {
    return (
      <div className={styles.productThumb}>
        <img src={image} alt="Produto" />
      </div>
    );
  }

  return (
    <div className={styles.productThumb}>
      <div className={styles.thumbRing} />
      <div className={styles.thumbGem} />
    </div>
  );
}

function getStatusByStock(
  estoque,
  estoqueMinimo
) {
  if (estoque <= 1) return "Crítico";

  if (estoque <= estoqueMinimo)
    return "Estoque baixo";

  return "Ativo";
}

function formatCurrency(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",


  });


}
