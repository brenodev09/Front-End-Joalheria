import React, { useMemo, useState } from "react";
import styles from "../../styles/Admin/material.module.css";
import AdminModais from "../../components/Admin/AdminModais/AdminModais";

import ouroImg from "../../img/Materiais/Ouro.png";
import prataImg from "../../img/Materiais/Prata.png";
import diamanteImg from "../../img/Materiais/diamante.png";
import rubiImg from "../../img/Materiais/rubi.png";
import safiraImg from "../../img/Materiais/safira.png";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";

const initialMaterials = [
  {
    id: 1,
    name: "Ouro 18k",
    tag: "18K",
    stock: "1.250 g",
    stockLabel: "Estoque",
    averageValue: "R$ 320,00",
    valueLabel: "Valor médio (g)",
    supplier: "Gold Supplier",
    status: "Ativo",
    image: ouroImg,
  },
  {
    id: 2,
    name: "Prata 925",
    tag: "925",
    stock: "900 g",
    stockLabel: "Estoque",
    averageValue: "R$ 16,50",
    valueLabel: "Valor médio (g)",
    supplier: "Prata Fina",
    status: "Ativo",
    image: prataImg,
  },
  {
    id: 3,
    name: "Diamante",
    tag: "DIAM",
    stock: "142 ct",
    stockLabel: "Estoque",
    averageValue: "R$ 2.450,00",
    valueLabel: "Valor médio (ct)",
    supplier: "Diamond Co.",
    status: "Ativo",
    image: diamanteImg,
  },
  {
    id: 4,
    name: "Safira",
    tag: "SAF",
    stock: "38 ct",
    stockLabel: "Estoque",
    averageValue: "R$ 750,00",
    valueLabel: "Valor médio (ct)",
    supplier: "Gem Stones",
    status: "Ativo",
    image: safiraImg,
  },
  {
    id: 5,
    name: "Rubi",
    tag: "RUB",
    stock: "26 ct",
    stockLabel: "Estoque",
    averageValue: "R$ 750,00",
    valueLabel: "Valor médio (ct)",
    supplier: "Gem Stones",
    status: "Ativo",
    image: rubiImg,
  },
  {
    id: 6,
    name: "Ouro Branco 18k",
    tag: "18K",
    stock: "850 g",
    stockLabel: "Estoque",
    averageValue: "R$ 350,00",
    valueLabel: "Valor médio (g)",
    supplier: "Gold Supplier",
    status: "Ativo",
    image: ouroImg,
  },
  {
    id: 7,
    name: "Ouro Rosé 18k",
    tag: "18K",
    stock: "650 g",
    stockLabel: "Estoque",
    averageValue: "R$ 340,00",
    valueLabel: "Valor médio (g)",
    supplier: "Gold Supplier",
    status: "Ativo",
    image: ouroImg,
  },
  {
    id: 8,
    name: "Platina 950",
    tag: "950",
    stock: "320 g",
    stockLabel: "Estoque",
    averageValue: "R$ 180,00",
    valueLabel: "Valor médio (g)",
    supplier: "Platinum Co.",
    status: "Ativo",
    image: prataImg,
  },
  {
    id: 9,
    name: "Esmeralda",
    tag: "ESM",
    stock: "18 ct",
    stockLabel: "Estoque",
    averageValue: "R$ 1.200,00",
    valueLabel: "Valor médio (ct)",
    supplier: "Gem Stones",
    status: "Ativo",
    image: safiraImg,
  },
  {
    id: 10,
    name: "Pérola",
    tag: "PRL",
    stock: "120 un",
    stockLabel: "Estoque",
    averageValue: "R$ 85,00",
    valueLabel: "Valor médio (un)",
    supplier: "Pearl Ocean",
    status: "Ativo",
    image: diamanteImg,
  },
];

export default function Materiais() {
  const [materials, setMaterials] = useState(initialMaterials);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 4;

  const filteredMaterials = useMemo(() => {
    return materials.filter(
      (material) =>
        material.name.toLowerCase().includes(search.toLowerCase()) ||
        material.supplier.toLowerCase().includes(search.toLowerCase())
    );
  }, [materials, search]);

  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage);

  const paginatedMaterials = filteredMaterials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function openModal(type, material = null) {
    setModal(type);
    setSelectedMaterial(material);
  }

  function closeModal() {
    setModal(null);
    setSelectedMaterial(null);
  }

  function addMaterial(newMaterial) {
    const material = {
      ...newMaterial,
      id: materials.length + 1,
      tag: "NEW",
      image: newMaterial.image || "",
    };

    setMaterials((prev) => [...prev, material]);
    closeModal();
  }

  function editMaterial(updatedMaterial) {
    setMaterials((prev) =>
      prev.map((material) =>
        material.id === updatedMaterial.id ? updatedMaterial : material
      )
    );

    closeModal();
  }

  function deleteMaterial() {
    setMaterials((prev) =>
      prev.filter((material) => material.id !== selectedMaterial.id)
    );

    closeModal();
  }

  function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }

  function renderPaginationNumbers() {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");

      if (!pages.includes(totalPages)) pages.push(totalPages);
    }

    return pages;
  }

  return (
    <main className={styles.materialsPage}>
      <header className={styles.materialsHeader}>
        <div className={styles.materialsHeaderText}>
          <h1>Materiais</h1>
          <p>Gerencie seus materiais e insumos com precisão e elegância.</p>
        </div>

        <div className={styles.materialsHeaderActions}>
          <button
  className={`${styles.btnPadrao} ${styles.btnAddMaterial}`}
  onClick={() => openModal("add")}
>
  <img width="20" height="20" src="https://img.icons8.com/ios-filled/23/plus-math.png" alt="plus-math" />
  <p>ADICIONAR MATERIAL</p>
</button>

          <button className={styles.materialFilterIcon}>
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </header>

      <section className={styles.materialsToolbar}>
        <div className={styles.materialsSearch}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar material..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.materialsSelects}>
          <div className={styles.selectWrapper}>
            <select>
              <option>Todos os materiais</option>
              <option>Metais</option>
              <option>Pedras</option>
            </select>
            <ChevronDown size={16} className={styles.selectIcon} />
          </div>

          <div className={styles.selectWrapper}>
            <span className={styles.selectLabel}>Ordenar por</span>
            <select>
              <option>Nome A-Z</option>
              <option>Nome Z-A</option>
              <option>Maior Estoque</option>
              <option>Menor Estoque</option>
            </select>
            <ChevronDown size={16} className={styles.selectIcon} />
          </div>
        </div>
      </section>

      <section className={styles.materialsGrid}>
        {paginatedMaterials.map((material) => (
          <article className={styles.materialCard} key={material.id}>
            <div className={styles.materialImageBox}>
              <div className={styles.materialImageWrapper}>
                <img src={material.image} alt={material.name} />
              </div>

              <span className={styles.materialTag}>{material.tag}</span>
            </div>

            <div className={styles.materialCardContent}>
              <div className={styles.materialTitleLine}>
                <h2>{material.name}</h2>
                <StatusBadge status={material.status} />
              </div>

              <InfoLine
                label={material.stockLabel || "Estoque"}
                value={material.stock}
              />

              <InfoLine
                label={material.valueLabel || "Valor médio"}
                value={material.averageValue}
              />

              <InfoLine label="Fornecedor" value={material.supplier} />

              <div className={styles.materialCardActions}>
                <button
                  className={styles.detailsBtn}
                  onClick={() => openModal("view", material)}
                >
                  Ver detalhes
                  <ChevronRight size={16} />
                </button>

                <button
                  className={`${styles.actionBtn} ${styles.editBtn}`}
                  onClick={() => openModal("edit", material)}
                >
                  <Pencil size={16} />
                </button>

                <button
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  onClick={() => openModal("delete", material)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {totalPages > 1 && (
        <nav className={styles.materialsPagination}>
          <button
            className={styles.paginationArrow}
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={18} />
          </button>

          {renderPaginationNumbers().map((page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className={styles.paginationEllipsis}
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                className={`${styles.paginationNumber} ${
                  currentPage === page ? styles.active : ""
                }`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            )
          )}

          <button
            className={styles.paginationArrow}
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={18} />
          </button>
        </nav>
      )}

      <AdminModais
        type={modal}
        context="material"
        item={selectedMaterial}
        onClose={closeModal}
        onSubmitAdd={addMaterial}
        onSubmitEdit={editMaterial}
        onDelete={deleteMaterial}
      />
    </main>
  );
}

function InfoLine({ label, value }) {
  return (
    <div className={styles.materialInfoLine}>
      <span className={styles.infoLabel}>{label}</span>
      <strong className={styles.infoValue}>{value}</strong>
    </div>
  );
}

function StatusBadge({ status }) {
  const isActive = status === "Ativo";

  return (
    <span
      className={`${styles.statusBadge} ${
        isActive ? styles.active : styles.inactive
      }`}
    >
      <span className={styles.statusDot}></span>
      {status}
    </span>
  );
}