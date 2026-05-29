import React, { useMemo, useState } from "react";
import "../../styles/Admin/produtosAdmin.css";
import AdminModais from "../../components/Admin/AdminModais/AdminModais";

import {
  Plus,
  Search,
  Filter,
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

const initialProducts = [
  {
    id: "A1201",
    name: "Anel Imperial Gold",
    category: "Anéis",
    material: "Ouro 18k",
    price: 2890,
    stock: 12,
    status: "Ativo",
    description: "Anel em ouro 18k com acabamento premium e design exclusivo.",
    images: [],
  },
  {
    id: "A1202",
    name: "Colar Brilho Eterno",
    category: "Colares",
    material: "Ouro 18k",
    price: 4120,
    stock: 8,
    status: "Ativo",
    description: "Colar delicado com brilho sofisticado para ocasiões especiais.",
    images: [],
  },
  {
    id: "A1204",
    name: "Brinco Ponto de Luz",
    category: "Brincos",
    material: "Ouro 18k",
    price: 1890,
    stock: 15,
    status: "Ativo",
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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState(null);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchMatch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.id.toLowerCase().includes(search.toLowerCase());

      return (
        searchMatch &&
        (!category || product.category === category) &&
        (!material || product.material === material) &&
        (!status || product.status === status)
      );
    });
  }, [products, search, category, material, status]);

  function showToast(title, text, variant = "success") {
    setToast({ title, text, variant });

    setTimeout(() => {
      setToast(null);
    }, 2800);
  }

  function openModal(type, product = null) {
    setSelectedProduct(product);
    setModal(type);
  }

  function closeModal() {
    setModal(null);
    setSelectedProduct(null);
  }

  function addProduct(product) {
    const newProduct = {
      ...product,
      id: `A${1201 + products.length}`,
      price: Number(product.price),
      stock: Number(product.stock),
      status: getStatusByStock(Number(product.stock)),
      images: product.images || [],
    };

    setProducts((prev) => [...prev, newProduct]);
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
      status: getStatusByStock(Number(updatedProduct.stock)),
      images: updatedProduct.images || [],
    };

    setProducts((prev) =>
      prev.map((item) =>
        item.id === normalizedProduct.id ? normalizedProduct : item
      )
    );

    closeModal();

    showToast(
      "Produto atualizado",
      `${normalizedProduct.name} foi editado com sucesso.`
    );
  }

  function deleteProduct() {
    const deletedName = selectedProduct?.name || "Produto";

    setProducts((prev) => prev.filter((item) => item.id !== selectedProduct.id));
    closeModal();

    showToast("Produto excluído", `${deletedName} foi removido da coleção.`, "danger");
  }

  return (
    <main className="admin-products-page">
      {toast && (
        <div className="toast-stack">
          <div className={`premium-toast ${toast.variant}`}>
            <strong>{toast.title}</strong>
            <span>{toast.text}</span>
          </div>
        </div>
      )}

      <header className="admin-products-header">
        <div>
          <h1>Produtos</h1>
          <p>Gerencie todos os produtos da sua coleção.</p>
        </div>

        <button className="add-product-btn" onClick={() => openModal("add")}>
          <Plus size={17} />
          Adicionar Produto
        </button>
      </header>

      <section className="admin-products-filters">
        <div className="admin-search">
          <Search size={15} />
          <input
            type="text"
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <SelectBox value={category} onChange={setCategory} placeholder="Categoria">
          <option value="Anéis">Anéis</option>
          <option value="Colares">Colares</option>
          <option value="Brincos">Brincos</option>
          <option value="Pulseiras">Pulseiras</option>
          <option value="Braceletes">Braceletes</option>
        </SelectBox>

        <SelectBox value={material} onChange={setMaterial} placeholder="Material">
          <option value="Ouro 18k">Ouro 18k</option>
          <option value="Prata 925">Prata 925</option>
          <option value="Ouro Rosé 18k">Ouro Rosé 18k</option>
        </SelectBox>

        <SelectBox value={status} onChange={setStatus} placeholder="Status">
          <option value="Ativo">Ativo</option>
          <option value="Estoque baixo">Estoque baixo</option>
          <option value="Crítico">Crítico</option>
        </SelectBox>

        <button
          className="more-filters-btn"
          onClick={() => {
            setSearch("");
            setCategory("");
            setMaterial("");
            setStatus("");
          }}
        >
          <Filter size={15} />
          Limpar Filtros
        </button>
      </section>

      <section className="products-table-card">
        <table>
          <thead>
            <tr>
              <th>Produtos</th>
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
              <tr key={product.id}>
                <td>
                  <div className="product-cell">
                    <ProductThumb image={product.images?.[0]?.url} />
                    <div>
                      <strong>{product.name}</strong>
                      <span>ID: #{product.id}</span>
                    </div>
                  </div>
                </td>

                <td>{product.category}</td>
                <td>{product.material}</td>
                <td className="price">{formatCurrency(product.price)}</td>
                <td>{product.stock} un.</td>
                <td>
                  <StatusBadge status={product.status} />
                </td>
                <td>
                  <div className="actions">
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
                      className="delete"
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

        <footer className="table-footer">
          Mostrando 1-{filteredProducts.length} de {products.length} produtos
        </footer>
      </section>

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

function SelectBox({ value, onChange, placeholder, children }) {
  return (
    <div className="select-box">
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
      ? "status-badge active"
      : status === "Estoque baixo"
      ? "status-badge low"
      : "status-badge critical";

  return <span className={className}>{status}</span>;
}

function ProductThumb({ image }) {
  if (image) {
    return (
      <div className="product-thumb">
        <img src={image} alt="Produto" />
      </div>
    );
  }

  return (
    <div className="product-thumb">
      <div className="thumb-ring" />
      <div className="thumb-gem" />
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