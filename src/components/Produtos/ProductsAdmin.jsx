/**
 * ProductsAdmin — Administração de Produtos
 * Joalheria de Luxo · Dashboard Premium
 *
 * Dependências: gsap, @gsap/react
 * Fonte: Cormorant Garamond + DM Sans (Google Fonts — incluído no CSS Module)
 */

import { useState, useRef, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import s from "./styles.module.css";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const MOCK_PRODUCTS = [
  {
    id: 1, sku: "JW-1042",
    name: "Anel Solitário Ouro 18k",
    category: "Anéis",
    variants: ["P", "M", "G", "GG"],
    stock: 12, minStock: 5,
    price: "R$ 4.200",
    priceNum: 4200,
    status: "active",
    icon: "◈",
    collections: ["Noivado", "Clássica"],
  },
  {
    id: 2, sku: "JW-0881",
    name: "Colar Veneziana Diamante",
    category: "Colares",
    variants: ["40cm", "45cm", "50cm"],
    stock: 4, minStock: 5,
    price: "R$ 9.750",
    priceNum: 9750,
    status: "low",
    icon: "◆",
    collections: ["Alta Joalheria"],
  },
  {
    id: 3, sku: "JW-2207",
    name: "Brinco Argola Ouro Rose",
    category: "Brincos",
    variants: ["18k", "14k"],
    stock: 0, minStock: 3,
    price: "R$ 1.890",
    priceNum: 1890,
    status: "empty",
    icon: "◇",
    collections: ["Casual", "Trend"],
  },
  {
    id: 4, sku: "JW-3315",
    name: "Pulseira Tennis Brilhantes",
    category: "Pulseiras",
    variants: ["16cm", "18cm", "20cm"],
    stock: 7, minStock: 4,
    price: "R$ 6.400",
    priceNum: 6400,
    status: "active",
    icon: "⬡",
    collections: ["Tennis", "Clássica"],
  },
  {
    id: 5, sku: "JW-4490",
    name: "Anel Aparador Esmeralda",
    category: "Anéis",
    variants: ["14", "16", "18", "20"],
    stock: 3, minStock: 5,
    price: "R$ 7.100",
    priceNum: 7100,
    status: "low",
    icon: "◈",
    collections: ["Color", "Alta Joalheria"],
  },
  {
    id: 6, sku: "JW-5502",
    name: "Colar Rubi Pavê 18k",
    category: "Colares",
    variants: ["42cm", "46cm"],
    stock: 1, minStock: 3,
    price: "R$ 12.500",
    priceNum: 12500,
    status: "low",
    icon: "◆",
    collections: ["Alta Joalheria", "Color"],
  },
  {
    id: 7, sku: "JW-6618",
    name: "Pulseira Bracelete Safira",
    category: "Pulseiras",
    variants: ["Único"],
    stock: 15, minStock: 3,
    price: "R$ 3.300",
    priceNum: 3300,
    status: "active",
    icon: "⬡",
    collections: ["Color"],
  },
  {
    id: 8, sku: "JW-7723",
    name: "Brinco Ear Cuff Diamante",
    category: "Brincos",
    variants: ["Esquerdo", "Direito", "Par"],
    stock: 0, minStock: 2,
    price: "R$ 2.750",
    priceNum: 2750,
    status: "empty",
    icon: "◇",
    collections: ["Trend", "Modern"],
  },
  {
    id: 9, sku: "JW-8831",
    name: "Anel Aparador Ouro Branco",
    category: "Anéis",
    variants: ["P", "M", "G"],
    stock: 22, minStock: 5,
    price: "R$ 3.680",
    priceNum: 3680,
    status: "active",
    icon: "◈",
    collections: ["Noivado"],
  },
  {
    id: 10, sku: "JW-9940",
    name: "Relógio Skeleton Ouro",
    category: "Relógios",
    variants: ["36mm", "42mm"],
    stock: 2, minStock: 2,
    price: "R$ 38.000",
    priceNum: 38000,
    status: "low",
    icon: "◎",
    collections: ["Alta Joalheria", "Premium"],
  },
];

const CATEGORIES = ["Todos", "Anéis", "Colares", "Brincos", "Pulseiras", "Relógios"];
const STATUS_FILTERS = [
  { key: "all",   label: "Todos" },
  { key: "active", label: "Disponível" },
  { key: "low",    label: "Estoque Baixo" },
  { key: "empty",  label: "Esgotado" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function statusConfig(status) {
  return {
    active: { label: "Disponível",     cls: s.statusActive,  dotColor: "var(--gold)" },
    low:    { label: "Estoque Baixo",  cls: s.statusLow,     dotColor: "var(--warn)" },
    empty:  { label: "Esgotado",       cls: s.statusEmpty,   dotColor: "var(--danger)" },
    draft:  { label: "Rascunho",       cls: s.statusDraft,   dotColor: "var(--text-muted)" },
  }[status] || {};
}

function stockClass(stock, min) {
  if (stock === 0) return s.stockEmpty;
  if (stock < min) return s.stockLow;
  return s.stockOk;
}

function stockBarColor(stock, min) {
  if (stock === 0) return "var(--danger)";
  if (stock < min) return "var(--warn)";
  return "var(--success)";
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { icon: "⬡", label: "Dashboard",  active: false },
  { icon: "◈", label: "Produtos",   active: true  },
  { icon: "◆", label: "Estoque",    active: false },
  { icon: "◇", label: "Vendas",     active: false },
  { icon: "≡", label: "Relatórios", active: false },
  { icon: "↺", label: "Fornecedores", active: false },
];

function Sidebar() {
  const ref = useRef();

  useGSAP(() => {
    gsap.from(ref.current.querySelectorAll("[data-nav]"), {
      opacity: 0, x: -16, duration: 0.5,
      stagger: 0.07, ease: "power2.out", delay: 0.1,
    });
  }, { scope: ref });

  return (
    <aside ref={ref} className={s.sidebar}>
      <div className={s.sidebarLogo} title="LUXE JOIAS">◆</div>

      <nav className={s.sidebarNav}>
        {NAV_ITEMS.map((item, i) => (
          <div
            key={i}
            data-nav
            className={`${s.navItem} ${item.active ? s.navItemActive : ""}`}
            title={item.label}
          >
            <span className={s.navIcon}>{item.icon}</span>
          </div>
        ))}
      </nav>

      <div className={s.sidebarBottom}>
        <div className={s.avatarBtn} title="Meu Perfil">◎</div>
      </div>
    </aside>
  );
}

// ─── METRIC CARDS ─────────────────────────────────────────────────────────────

function MetricsSection({ products }) {
  const ref = useRef();
  const total   = products.length;
  const low     = products.filter(p => p.status === "low").length;
  const empty   = products.filter(p => p.status === "empty").length;
  const revenue = products.reduce((acc, p) => acc + p.priceNum * (p.stock || 0), 0);
  const fmt = (n) => "R$ " + n.toLocaleString("pt-BR");

  const metrics = [
    { label: "Total de Produtos", value: total,       badge: "+3 este mês",  badgeCls: s.badgeUp,      icon: "◈", sub: "em catálogo" },
    { label: "Estoque Baixo",      value: low,         badge: "Atenção",      badgeCls: s.badgeWarn,    icon: "⚠", sub: "abaixo do mínimo" },
    { label: "Produtos Esgotados", value: empty,       badge: "Crítico",      badgeCls: s.badgeDown,    icon: "◎", sub: "sem estoque" },
    { label: "Valor em Estoque",   value: fmt(revenue),badge: "Atualizado",   badgeCls: s.badgeNeutral, icon: "◆", sub: "valor total" },
  ];

  useGSAP(() => {
    gsap.from(ref.current.querySelectorAll("[data-metric]"), {
      opacity: 0, y: 20, filter: "blur(4px)",
      duration: 0.6, stagger: 0.1, ease: "power2.out", delay: 0.35,
    });
  }, { scope: ref });

  return (
    <div ref={ref} className={s.metricsGrid}>
      {metrics.map((m, i) => (
        <div
          key={i}
          data-metric
          className={s.metricCard}
          onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.015, duration: 0.25, ease: "power2.out" })}
          onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1,     duration: 0.25, ease: "power2.out" })}
        >
          <div className={s.metricHeader}>
            <span className={s.metricLabel}>{m.label}</span>
            <span className={s.metricIcon}>{m.icon}</span>
          </div>
          <div className={s.metricValue}>{m.value}</div>
          <div className={s.metricFooter}>
            <span className={`${s.metricBadge} ${m.badgeCls}`}>{m.badge}</span>
            <span className={s.metricSub}>{m.sub}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── FILTERS BAR ──────────────────────────────────────────────────────────────

function FiltersBar({ search, onSearch, category, onCategory, statusFilter, onStatus, view, onView }) {
  return (
    <div className={s.filtersBar}>
      {/* Search */}
      <div className={s.searchWrapper}>
        <span className={s.searchIcon}>⊘</span>
        <input
          className={s.searchInput}
          placeholder="Buscar produto, SKU, categoria…"
          value={search}
          onChange={e => onSearch(e.target.value)}
        />
      </div>

      {/* Category */}
      <div className={s.filterGroup}>
        <select
          className={s.filterSelect}
          value={category}
          onChange={e => onCategory(e.target.value)}
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Status */}
      <div className={s.filterGroup}>
        {STATUS_FILTERS.map(sf => (
          <button
            key={sf.key}
            className={`${s.filterBtn} ${statusFilter === sf.key ? s.filterBtnActive : ""}`}
            onClick={() => onStatus(sf.key)}
          >
            {sf.label}
          </button>
        ))}
      </div>

      {/* View toggle */}
      <div className={s.viewToggle}>
        <button
          className={`${s.viewBtn} ${view === "list" ? s.viewBtnActive : ""}`}
          onClick={() => onView("list")}
          title="Listagem"
        >≡</button>
        <button
          className={`${s.viewBtn} ${view === "grid" ? s.viewBtnActive : ""}`}
          onClick={() => onView("grid")}
          title="Grade"
        >⊞</button>
      </div>
    </div>
  );
}

// ─── PRODUCT ROW (list view) ──────────────────────────────────────────────────

function ProductRow({ product, onEdit, onDelete }) {
  const ref  = useRef();
  const st   = statusConfig(product.status);
  const pct  = Math.min((product.stock / (product.minStock * 3)) * 100, 100);

  const handleMouseEnter = useCallback(() => {
    gsap.to(ref.current, { x: 3, duration: 0.22, ease: "power2.out" });
  }, []);

  const handleMouseLeave = useCallback(() => {
    gsap.to(ref.current, { x: 0, duration: 0.22, ease: "power2.out" });
  }, []);

  return (
    <div
      ref={ref}
      className={s.productCard}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image */}
      <div className={s.productImageWrap}>
        <div className={s.productImageInner}>{product.icon}</div>
      </div>

      {/* Info */}
      <div className={s.productInfo}>
        <div className={s.productName}>{product.name}</div>
        <div className={s.productMeta}>
          <span>{product.category}</span>
          <span className={s.productMetaDot} />
          <span className={s.productSku}>{product.sku}</span>
          {product.collections.slice(0, 1).map(c => (
            <span key={c} style={{ fontSize: 9, color: "var(--text-muted)", background: "rgba(255,255,255,0.04)", padding: "1px 6px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.07)" }}>{c}</span>
          ))}
        </div>
      </div>

      {/* Variants */}
      <div className={s.productVariants}>
        <span className={s.variantLabel}>Variantes</span>
        <div className={s.variantTags}>
          {product.variants.slice(0, 3).map(v => (
            <span key={v} className={s.variantTag}>{v}</span>
          ))}
          {product.variants.length > 3 && (
            <span className={s.variantTag}>+{product.variants.length - 3}</span>
          )}
        </div>
      </div>

      {/* Stock */}
      <div className={s.productStock}>
        <span className={s.stockLabel}>Estoque</span>
        <span className={`${s.stockValue} ${stockClass(product.stock, product.minStock)}`}>
          {product.stock}
        </span>
        <div className={s.stockBar}>
          <div
            className={s.stockBarFill}
            style={{ width: `${pct}%`, background: stockBarColor(product.stock, product.minStock) }}
          />
        </div>
      </div>

      {/* Price */}
      <div className={s.productPrice}>
        <div className={s.priceLabel}>Preço</div>
        <div className={s.priceValue}>{product.price}</div>
      </div>

      {/* Status */}
      <div className={s.productStatus}>
        <span className={`${s.statusBadge} ${st.cls}`}>
          <span className={s.statusBadgeDot} style={{ background: st.dotColor }} />
          {st.label}
        </span>
      </div>

      {/* Actions */}
      <div className={s.productActions}>
        <button className={s.actionBtn} title="Visualizar">◎</button>
        <button className={`${s.actionBtn} ${s.actionBtnEdit}`} title="Editar" onClick={() => onEdit(product)}>✎</button>
        <button className={`${s.actionBtn} ${s.actionBtnDanger}`} title="Excluir" onClick={() => onDelete(product)}>◉</button>
      </div>
    </div>
  );
}

// ─── PRODUCT GRID CARD ────────────────────────────────────────────────────────

function ProductGridCard({ product, onEdit, onDelete }) {
  const ref = useRef();
  const st  = statusConfig(product.status);

  const handleMouseEnter = useCallback(() => {
    gsap.to(ref.current, { y: -4, duration: 0.25, ease: "power2.out" });
  }, []);
  const handleMouseLeave = useCallback(() => {
    gsap.to(ref.current, { y: 0, duration: 0.25, ease: "power2.out" });
  }, []);

  return (
    <div
      ref={ref}
      className={s.productCardGrid}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={s.productCardGridImg}>
        <span style={{ position: "relative", zIndex: 1 }}>{product.icon}</span>
      </div>
      <div className={s.productCardGridBody}>
        <div className={s.productCardGridName}>{product.name}</div>
        <div className={s.productCardGridCat}>{product.category} · {product.sku}</div>
        <span className={`${s.statusBadge} ${st.cls}`} style={{ marginBottom: 12, display: "inline-flex" }}>
          <span className={s.statusBadgeDot} style={{ background: st.dotColor }} />
          {st.label}
        </span>
        <div className={s.productCardGridFooter}>
          <div className={s.productCardGridPrice}>{product.price}</div>
          <div className={s.productCardGridActions}>
            <button className={`${s.actionBtn} ${s.actionBtnEdit}`} title="Editar" onClick={() => onEdit(product)}>✎</button>
            <button className={`${s.actionBtn} ${s.actionBtnDanger}`} title="Excluir" onClick={() => onDelete(product)}>◉</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCT LIST SECTION ─────────────────────────────────────────────────────

function ProductListSection({ products, view, onEdit, onDelete }) {
  const ref = useRef();

  useGSAP(() => {
    gsap.from(ref.current.querySelectorAll("[data-item]"), {
      opacity: 0, y: 18, filter: "blur(3px)",
      duration: 0.55, stagger: 0.06, ease: "power2.out",
    });
  }, { scope: ref, dependencies: [products, view] });

  if (!products.length) {
    return (
      <div className={s.emptyState}>
        <div className={s.emptyIcon}>◈</div>
        <div className={s.emptyTitle}>Nenhum produto encontrado</div>
        <div className={s.emptyDesc}>Tente ajustar os filtros ou adicione um novo produto.</div>
      </div>
    );
  }

  if (view === "grid") {
    return (
      <div ref={ref} className={s.productGrid}>
        {products.map(p => (
          <div key={p.id} data-item>
            <ProductGridCard product={p} onEdit={onEdit} onDelete={onDelete} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className={s.productList}>
      {products.map(p => (
        <div key={p.id} data-item>
          <ProductRow product={p} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ))}
    </div>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────

function ProductModal({ product, onClose, onSave }) {
  const ref    = useRef();
  const isEdit = !!product?.id;
  const [form, setForm] = useState({
    name:     product?.name     || "",
    category: product?.category || "Anéis",
    price:    product?.price    || "",
    stock:    product?.stock    || "",
    status:   product?.status   || "active",
    sku:      product?.sku      || "",
  });

  useGSAP(() => {
    gsap.from(ref.current, { opacity: 0, scale: 0.96, y: 16, duration: 0.3, ease: "power2.out" });
  }, { scope: ref });

  const field = (key) => ({
    value: form[key],
    onChange: e => setForm(prev => ({ ...prev, [key]: e.target.value })),
  });

  return (
    <div className={s.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div ref={ref} className={s.modal}>
        <div className={s.modalHeader}>
          <span className={s.modalTitle}>{isEdit ? "Editar Produto" : "Novo Produto"}</span>
          <button className={s.modalClose} onClick={onClose}>✕</button>
        </div>

        <div className={s.modalBody}>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Nome do Produto</label>
            <input className={s.formInput} placeholder="Ex: Anel Solitário Ouro 18k" {...field("name")} />
          </div>

          <div className={s.formRow}>
            <div className={s.formGroup}>
              <label className={s.formLabel}>Categoria</label>
              <select className={s.formSelect} {...field("category")}>
                {CATEGORIES.filter(c => c !== "Todos").map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className={s.formGroup}>
              <label className={s.formLabel}>SKU</label>
              <input className={s.formInput} placeholder="JW-0000" {...field("sku")} />
            </div>
          </div>

          <div className={s.formRow}>
            <div className={s.formGroup}>
              <label className={s.formLabel}>Preço</label>
              <input className={s.formInput} placeholder="R$ 0,00" {...field("price")} />
            </div>
            <div className={s.formGroup}>
              <label className={s.formLabel}>Estoque</label>
              <input className={s.formInput} placeholder="0" type="number" {...field("stock")} />
            </div>
          </div>

          <div className={s.formGroup}>
            <label className={s.formLabel}>Status</label>
            <select className={s.formSelect} {...field("status")}>
              <option value="active">Disponível</option>
              <option value="low">Estoque Baixo</option>
              <option value="empty">Esgotado</option>
              <option value="draft">Rascunho</option>
            </select>
          </div>
        </div>

        <div className={s.modalFooter}>
          <button className={s.btnSecondary} onClick={onClose}>Cancelar</button>
          <button className={s.btnModalPrimary} onClick={() => onSave(form)}>
            {isEdit ? "Salvar Alterações" : "Criar Produto"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────

function Toast({ message }) {
  const ref = useRef();

  useGSAP(() => {
    gsap.from(ref.current, { opacity: 0, y: 16, duration: 0.35, ease: "power2.out" });
  }, { scope: ref });

  return (
    <div ref={ref} className={s.toast}>
      <span className={s.toastIcon}>◆</span>
      {message}
    </div>
  );
}

// ─── PAGE HEADER ──────────────────────────────────────────────────────────────

function PageHeader({ total, onNew }) {
  const ref = useRef();

  useGSAP(() => {
    gsap.from(ref.current, { opacity: 0, y: -12, filter: "blur(4px)", duration: 0.7, ease: "power3.out" });
  }, { scope: ref });

  return (
    <div ref={ref} className={s.pageHeader}>
      <div className={s.pageHeaderLeft}>
        <div className={s.pageBreadcrumb}>LUXE JOIAS · GESTÃO</div>
        <h1 className={s.pageTitle}>Administração de Produtos</h1>
        <p className={s.pageDesc}>
          {total} {total === 1 ? "item cadastrado" : "itens cadastrados"} no catálogo premium
        </p>
      </div>
      <button className={s.btnPrimary} onClick={onNew}>
        <span className={s.btnPrimaryIcon}>◈</span>
        Novo Produto
      </button>
    </div>
  );
}

// ─── ROOT PAGE ────────────────────────────────────────────────────────────────

export default function ProductsAdmin() {
  const [products, setProducts]       = useState(MOCK_PRODUCTS);
  const [search, setSearch]           = useState("");
  const [category, setCategory]       = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("all");
  const [view, setView]               = useState("list");
  const [modalOpen, setModalOpen]     = useState(false);
  const [editTarget, setEditTarget]   = useState(null);
  const [toast, setToast]             = useState(null);

  // ─── Derived list
  const filtered = products.filter(p => {
    const matchSearch  = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat     = category === "Todos" || p.category === category;
    const matchStatus  = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  // ─── Handlers
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleNew = () => { setEditTarget(null); setModalOpen(true); };
  const handleEdit = (p) => { setEditTarget(p); setModalOpen(true); };

  const handleDelete = (p) => {
    setProducts(prev => prev.filter(x => x.id !== p.id));
    showToast(`"${p.name}" removido do catálogo.`);
  };

  const handleSave = (form) => {
    if (editTarget) {
      setProducts(prev =>
        prev.map(p => p.id === editTarget.id ? { ...p, ...form } : p)
      );
      showToast("Produto atualizado com sucesso.");
    } else {
      const novo = {
        id: Date.now(), icon: "◈",
        variants: [], collections: [],
        minStock: 5, priceNum: 0,
        ...form,
        stock: Number(form.stock) || 0,
      };
      setProducts(prev => [novo, ...prev]);
      showToast("Novo produto adicionado ao catálogo.");
    }
    setModalOpen(false);
  };

  return (
    <>
      {/* Inject font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div className={s.root}>
        <Sidebar />

        <main className={s.main}>
          <PageHeader total={products.length} onNew={handleNew} />
          <MetricsSection products={products} />

          <FiltersBar
            search={search}       onSearch={setSearch}
            category={category}   onCategory={setCategory}
            statusFilter={statusFilter} onStatus={setStatusFilter}
            view={view}           onView={setView}
          />

          <div className={s.resultsBar}>
            <span className={s.resultsCount}>
              Exibindo <strong>{filtered.length}</strong> de {products.length} produtos
            </span>
            <select className={s.sortSelect}>
              <option>Ordenar por: Nome A–Z</option>
              <option>Ordenar por: Preço ↑</option>
              <option>Ordenar por: Preço ↓</option>
              <option>Ordenar por: Estoque</option>
            </select>
          </div>

          <ProductListSection
            products={filtered}
            view={view}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          <div className={s.pagination}>
            {[1, 2, 3].map(n => (
              <button key={n} className={`${s.pageNumBtn} ${n === 1 ? s.pageNumBtnActive : ""}`}>
                {n}
              </button>
            ))}
          </div>
        </main>

        {/* Modal */}
        {modalOpen && (
          <ProductModal
            product={editTarget}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
          />
        )}

        {/* Toast */}
        {toast && <Toast message={toast} />}
      </div>
    </>
  );
}
