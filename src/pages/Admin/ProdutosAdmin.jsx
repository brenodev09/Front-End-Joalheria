import React, { useMemo, useState } from "react";
import styles from "../../styles/Admin/produtosAdmin.module.css";
import AdminModais from "../../components/Admin/AdminModais/AdminModais";

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

const initialProducts = [
  {
    id: "A1201",
    name: "Anel Imperial Gold",
    collection: "Imperial",
    category: "Anéis",
    material: "Ouro 18k",
    price: 2890,
    stock: 12,
    minStock: 5,
    location: "Vitrine 01",
    status: "Ativo",
    description: "Anel em ouro 18k com acabamento premium e design exclusivo.",
    images: [],
  },
  {
    id: "A1202",
    name: "Colar Brilho Eterno",
    collection: "Eterno",
    category: "Colares",
    material: "Ouro 18k",
    price: 4120,
    stock: 8,
    minStock: 4,
    location: "Vitrine 02",
    status: "Ativo",
    description: "Colar delicado com brilho sofisticado para ocasiões especiais.",
    images: [],
  },
  {
    id: "A1204",
    name: "Brinco Ponto de Luz",
    collection: "Clássicos",
    category: "Brincos",
    material: "Ouro 18k",
    price: 1890,
    stock: 3,
    minStock: 5,
    location: "Vitrine 03",
    status: "Estoque baixo",
    description: "Brinco clássico com ponto de luz elegante.",
    images: [],
  },
];

export default function Produtos() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [material, setMaterial] = useState("");
  const [status, setStatus] = useState("");
  const [modal, setModal] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(initialProducts[0]);
  const [toast, setToast] = useState(null);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchMatch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.id.toLowerCase().includes(search.toLowerCase()) ||
        product.collection.toLowerCase().includes(search.toLowerCase());

      return (
        searchMatch &&
        (!category || product.category === category) &&
        (!material || product.material === material) &&
        (!status || product.status === status)
      );
    });
  }, [products, search, category, material, status]);

  const summary = useMemo(() => {
    const totalProducts = products.length;

    const lowStockProducts = products.filter(
      (product) => Number(product.stock) <= Number(product.minStock)
    ).length;

    const totalValue = products.reduce(
      (sum, product) => sum + Number(product.price) * Number(product.stock),
      0
    );

    const activeProducts = products.filter(
      (product) => product.status === "Ativo"
    ).length;

    return {
      totalProducts,
      lowStockProducts,
      totalValue,
      activeProducts,
    };
  }, [products]);

  function showToast(title, text, variant = "success") {
    setToast({ title, text, variant });
    setTimeout(() => setToast(null), 2800);
  }

  function openModal(type, product = null) {
    if (type === "view") {
      setSelectedProduct(product);
      return;
    }

    setSelectedProduct(product);
    setModal(type);
  }

  function closeModal() {
    setModal(null);
  }

  function addProduct(product) {
    const newProduct = {
      ...product,
      id: `A${1201 + products.length}`,
      collection: product.collection || "Nova Coleção",
      price: Number(product.price),
      stock: Number(product.stock),
      minStock: Number(product.minStock || 5),
      location: product.location || "Estoque",
      status: getStatusByStock(Number(product.stock)),
      images: product.images || [],
    };

    setProducts((prev) => [...prev, newProduct]);
    setSelectedProduct(newProduct);
    closeModal();

    showToast(
      "Produto adicionado",
      `${newProduct.name} foi cadastrado com sucesso.`
    );
  }

  function updateProduct(updatedProduct) {
    const normalizedProduct = {
      ...updatedProduct,
      price: Number(updatedProduct.price),
      stock: Number(updatedProduct.stock),
      minStock: Number(updatedProduct.minStock || 5),
      status: getStatusByStock(Number(updatedProduct.stock)),
      images: updatedProduct.images || [],
    };

    setProducts((prev) =>
      prev.map((item) =>
        item.id === normalizedProduct.id ? normalizedProduct : item
      )
    );

    setSelectedProduct(normalizedProduct);
    closeModal();

    showToast(
      "Produto atualizado",
      `${normalizedProduct.name} foi editado com sucesso.`
    );
  }

  function deleteProduct() {
    const deletedName = selectedProduct?.name || "Produto";

    setProducts((prev) => prev.filter((item) => item.id !== selectedProduct.id));
    setSelectedProduct(null);
    closeModal();

    showToast(
      "Produto excluído",
      `${deletedName} foi removido da coleção.`,
      "danger"
    );
  }

  return (
    <main className={styles.adminProductsPage}>
      {toast && (
        <div className={styles.toastStack}>
          <div
            className={`${styles.premiumToast} ${
              toast.variant === "danger" ? styles.dangerToast : ""
            }`}
          >
            <strong>{toast.title}</strong>
            <span>{toast.text}</span>
          </div>
        </div>
      )}

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
              onClick={() => openModal("add")}
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
                        <ProductThumb image={product.images?.[0]?.url} />

                        <div>
                          <strong>{product.name}</strong>
                          <span>ID: PRD-{product.id}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <strong className={styles.collectionName}>
                        {product.collection}
                      </strong>
                      <span className={styles.collectionType}>● Premium</span>
                    </td>

                    <td>{product.category}</td>
                    <td>{product.material}</td>
                    <td className={styles.price}>
                      {formatCurrency(product.price)}
                    </td>
                    <td>{product.stock} un.</td>
                    <td>
                      <StatusBadge status={product.status} />
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          title="Visualizar"
                          onClick={() => openModal("view", product)}
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          title="Editar"
                          onClick={() => openModal("edit", product)}
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          title="Excluir"
                          className={styles.delete}
                          onClick={() => openModal("delete", product)}
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

      <AdminModais
        type={modal}
        context="product-admin"
        item={selectedProduct}
        product={selectedProduct}
        onClose={closeModal}
        onSubmitAdd={addProduct}
        onSubmitEdit={updateProduct}
        onDelete={deleteProduct}
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

function DetailSection({ title, children }) {
  return (
    <section className={styles.detailSection}>
      <h3>{title}</h3>
      <div className={styles.detailSectionGrid}>{children}</div>
    </section>
  );
}

function DetailGrid({ label, value }) {
  return (
    <div className={styles.detailItem}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
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

function getStatusByStock(stock) {
  if (stock <= 1) return "Crítico";
  if (stock <= 5) return "Estoque baixo";
  return "Ativo";
}

function formatCurrency(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}