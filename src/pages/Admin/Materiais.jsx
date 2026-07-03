import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import ModalAddMaterial from "../../components/Admin/Modais/ModalAddMaterial";
import styles from "../../styles/Admin/material.module.css";
import {
  Search,
  Pencil,
  Trash2,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";

export default function Materiais() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [modalAdd, setModalAdd] = useState(false);

  const [selectedMaterial, setSelectedMaterial] = useState(null);

  async function carregarMateriais() {
    try {
      const response = await api.get("/materiais");

      setMaterials(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarMateriais();
  }, []);

  const filteredMaterials = useMemo(() => {
    return materials.filter(
      (material) =>
        material.nome?.toLowerCase().includes(search.toLowerCase()) ||
        material.fornecedor?.toLowerCase().includes(search.toLowerCase())
    );
  }, [materials, search]);

  const itemsPerPage = 4;

  const totalPages = Math.ceil(
    filteredMaterials.length / itemsPerPage
  );

  const paginatedMaterials = filteredMaterials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  }

  if (loading) {
    return (
      <main className={styles.materialsPage}>
        <h2>Carregando materiais...</h2>
      </main>
    );
  }

  return (
    <main className={styles.materialsPage}>
      <header className={styles.materialsHeader}>
        <div className={styles.materialsHeaderText}>
          <h1>Materiais</h1>
          <p>
            Gerencie seus materiais e insumos com precisão e elegância.
          </p>
        </div>

        <div className={styles.materialsHeaderActions}>
          <button
            className={`${styles.btnPadrao} ${styles.btnAddMaterial}`}
            onClick={() => setModalAdd(true)}
          >
            <img
              width="20"
              height="20"
              src="https://img.icons8.com/ios-filled/23/plus-math.png"
              alt="plus"
            />
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
            </select>

            <ChevronDown
              size={16}
              className={styles.selectIcon}
            />
          </div>
        </div>
      </section>

      <section className={styles.materialsGrid}>
        {paginatedMaterials.map((material) => (
          <article
            className={styles.materialCard}
            key={material.id}
          >
            <div className={styles.materialImageBox}>
              <div className={styles.materialImageWrapper}>
                <img
                  src={
                    material.imagem
                      ? `http://localhost:3000${material.imagem}`
                      : "/sem-imagem.png"
                  }
                  alt={material.nome}
                />
              </div>
            </div>

            <div className={styles.materialCardContent}>
              <div className={styles.materialTitleLine}>
                <h2>{material.nome}</h2>

                <StatusBadge
                  status={
                    material.ativo
                      ? "Ativo"
                      : "Inativo"
                  }
                />
              </div>

              <InfoLine
                label="Estoque"
                value={`${material.estoque} ${material.unidade}`}
              />

              <InfoLine
                label="Valor Médio"
                value={`R$ ${Number(
                  material.valor_medio
                ).toFixed(2)}`}
              />

              <InfoLine
                label="Fornecedor"
                value={material.fornecedor || "-"}
              />

              <div className={styles.materialCardActions}>
                <button
                  className={styles.detailsBtn}
                  onClick={() =>
                    setSelectedMaterial(material)
                  }
                >
                  Ver detalhes
                  <ChevronRight size={16} />
                </button>

                <button
                  className={`${styles.actionBtn} ${styles.editBtn}`}
                >
                  <Pencil size={16} />
                </button>

                <button
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
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
            onClick={() =>
              goToPage(currentPage - 1)
            }
            disabled={currentPage === 1}
          >
            <ChevronLeft size={18} />
          </button>

          {renderPaginationNumbers().map(
            (page, index) =>
              page === "..." ? (
                <span
                  key={index}
                  className={
                    styles.paginationEllipsis
                  }
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  className={`${styles.paginationNumber} ${
                    currentPage === page
                      ? styles.active
                      : ""
                  }`}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              )
          )}

          <button
            className={styles.paginationArrow}
            onClick={() =>
              goToPage(currentPage + 1)
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={18} />
          </button>
        </nav>
      )}

      <ModalAddMaterial
        isOpen={modalAdd}
        fecharModal={() => {
          setModalAdd(false);
          carregarMateriais();
        }}
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