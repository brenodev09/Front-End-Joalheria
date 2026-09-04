import React, { useMemo, useState, useEffect } from "react";
import styles from "../../styles/Admin/produtosAdmin.module.css";
import { api } from "../../services/api";
import ModalAddProduto from "../../components/Admin/Modais/ModalAddProduto";
import ModalDeletarProduto from "../../components/Admin/Modais/ModalDeletarProduto";
import ModalEditarProduto from "../../components/Admin/Modais/ModalEditarProduto";
import PaginacaoAdmin from "../../components/Admin/PaginacaoAdmin/PaginacaoAdmin";

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


  const [products, setProducts] = useState([]);
  const [materials, setMaterials] = useState([]);
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
  const [featured, setFeatured] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("table");

  const [selectedProduct, setSelectedProduct] = useState(null);
  useEffect(() => {
    async function carregarDados() {
      await Promise.all([buscarProdutos(), buscarMateriais()]);
    }
    carregarDados();
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

  async function buscarMateriais() {
    try {
      const response = await api.get("/materiais");
      const dados = Array.isArray(response.data) ? response.data : response.data?.materiais || [];
      setMaterials(dados);
    } catch (error) {
      console.error("Não foi possível carregar os materiais.", error);
    }
  }

  function materialDoProduto(product) {
    const materialId = product.material_id ?? product.materialId;
    const materialEncontrado = materials.find((item) => String(item.id) === String(materialId));
    return materialEncontrado?.nome || product.material?.nome || product.material || "";
  }

  function produtoEmDestaque(product) {
    return product.destaque === true || product.destaque === 1 || product.destaque === "1" || product.featured === true || product.featured === 1;
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
        (!material || materialDoProduto(product) === material) &&
        (!status ||
          getStatusByStock(
            product.estoque,
            product.estoque_minimo
          ) === status) &&
        (!featured || (featured === "sim" ? produtoEmDestaque(product) : !produtoEmDestaque(product)))
      );
    });
  }, [
    products,
    search,
    category,
    material,
    status,
    featured,
    materials,
  ]);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, material, status, featured]);

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
              {materials.map((item) => (
                <option value={item.nome} key={item.id}>{item.nome}</option>
              ))}
            </SelectBox>

            <SelectBox value={status} onChange={setStatus} placeholder="Status">
              <option value="Ativo">Ativo</option>
              <option value="Estoque baixo">Estoque baixo</option>
              <option value="Crítico">Crítico</option>
            </SelectBox>

            <SelectBox value={featured} onChange={setFeatured} placeholder="Destaque">
              <option value="sim">Em destaque</option>
              <option value="nao">Normais</option>
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
                setFeatured("");
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
                {paginatedProducts.map((product) => (
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
                    <td>{materialDoProduto(product) || "Não informado"}</td>
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
              Mostrando {filteredProducts.length ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, filteredProducts.length)} de {filteredProducts.length} produtos
            </footer>
            <PaginacaoAdmin
              paginaAtual={currentPage}
              totalPaginas={totalPages}
              totalRegistros={filteredProducts.length}
              onPaginaChange={setCurrentPage}
              labelRegistros="produtos"
            />
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
