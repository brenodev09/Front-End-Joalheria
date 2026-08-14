import { useState } from "react";
import { X, Check } from "lucide-react";
import styles from "./styles.module.css";

/**
 * Modal de edição de coleção.
 *
 * Props:
 * - collection: { id, name, description, startDate, endDate, status, featured, imageUrl, productCount }
 * - onCancel: () => void
 * - onSave: (updatedCollection) => void
 */
export default function EditCollectionModal({ collection, onCancel, onSave }) {
    const [form, setForm] = useState({
        name: collection?.name ?? "",
        description: collection?.description ?? "",
        startDate: collection?.startDate ?? "",
        endDate: collection?.endDate ?? "",
        status: collection?.status ?? "draft",
        featured: collection?.featured ?? false,
        imageUrl: collection?.imageUrl ?? "",
    });

    const handleChange = (field) => (e) => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave?.({ ...collection, ...form });
    };

    const formattedRange =
        form.startDate && form.endDate
            ? `${formatDate(form.startDate)} — ${formatDate(form.endDate)}`
            : "Período não definido";

    const badgeClass =
        form.status === "active"
            ? `${styles["ecm-badge"]} ${styles["ecm-badge--active"]}`
            : `${styles["ecm-badge"]} ${styles["ecm-badge--draft"]}`;

    const toggleClass = `${styles["ecm-toggle"]} ${form.featured ? styles["is-on"] : ""}`;

    return (
        <div className={styles["ecm-overlay"]} role="dialog" aria-modal="true" aria-labelledby="ecm-title">
            <div className={styles["ecm-modal"]}>
                <header className={styles["ecm-header"]}>
                    <div>
                        <h1 id="ecm-title" className={styles["ecm-title"]}>
                            EDITAR COLEÇÃO: {collection?.name || "—"}
                        </h1>
                        <p className={styles["ecm-subtitle"]}>Atualize os dados da coleção selecionada</p>
                    </div>
                    <button className={styles["ecm-icon-btn"]} onClick={onCancel} aria-label="Fechar">
                        <X size={16} />
                    </button>
                </header>

                <div className={styles["ecm-body"]}>
                    <aside className={styles["ecm-preview-col"]}>
                        <p className={styles["ecm-eyebrow"]}>PREVIEW EM TEMPO REAL</p>
                        <div className={styles["ecm-preview-card"]}>
                            <div
                                className={styles["ecm-preview-image"]}
                                style={form.imageUrl ? { backgroundImage: `url(${form.imageUrl})` } : undefined}
                            />
                            <div className={styles["ecm-preview-info"]}>
                                <p className={styles["ecm-preview-name"]}>{form.name || "Nome da coleção"}</p>
                                <p className={styles["ecm-preview-range"]}>{formattedRange}</p>
                                <p className={styles["ecm-preview-count"]}>{collection?.productCount ?? 0} produtos</p>
                                <span className={badgeClass}>
                                    {form.status === "active" ? "Ativa" : "Rascunho"}
                                </span>
                            </div>
                        </div>

                        <button className={`${styles["ecm-btn"]} ${styles["ecm-btn--outline"]}`} onClick={onCancel}>
                            CANCELAR
                        </button>
                        <button className={`${styles["ecm-btn"]} ${styles["ecm-btn--primary"]}`} onClick={handleSave}>
                            <Check size={15} />
                            SALVAR ALTERAÇÕES
                        </button>
                    </aside>

                    <section className={styles["ecm-form-col"]}>
                        <p className={styles["ecm-section-label"]}>DADOS DA COLEÇÃO</p>

                        <label className={styles["ecm-label"]} htmlFor="ecm-name">
                            NOME DA COLEÇÃO
                        </label>
                        <input
                            id="ecm-name"
                            type="text"
                            className={styles["ecm-input"]}
                            value={form.name}
                            onChange={handleChange("name")}
                        />

                        <label className={styles["ecm-label"]} htmlFor="ecm-description">
                            DESCRIÇÃO
                        </label>
                        <textarea
                            id="ecm-description"
                            className={styles["ecm-textarea"]}
                            rows={2}
                            value={form.description}
                            onChange={handleChange("description")}
                        />

                        <div className={styles["ecm-row"]}>
                            <div>
                                <label className={styles["ecm-label"]} htmlFor="ecm-start">
                                    DATA DE INÍCIO
                                </label>
                                <input
                                    id="ecm-start"
                                    type="date"
                                    className={styles["ecm-input"]}
                                    value={form.startDate}
                                    onChange={handleChange("startDate")}
                                />
                            </div>
                            <div>
                                <label className={styles["ecm-label"]} htmlFor="ecm-end">
                                    DATA DE TÉRMINO
                                </label>
                                <input
                                    id="ecm-end"
                                    type="date"
                                    className={styles["ecm-input"]}
                                    value={form.endDate}
                                    onChange={handleChange("endDate")}
                                />
                            </div>
                        </div>

                        <div className={styles["ecm-row"]}>
                            <div>
                                <label className={styles["ecm-label"]} htmlFor="ecm-status">
                                    STATUS
                                </label>
                                <select
                                    id="ecm-status"
                                    className={styles["ecm-input"]}
                                    value={form.status}
                                    onChange={handleChange("status")}
                                >
                                    <option value="active">Ativa</option>
                                    <option value="draft">Rascunho</option>
                                </select>
                            </div>

                            <div className={styles["ecm-toggle-field"]}>
                                <span>Destacar coleção</span>
                                <button
                                    type="button"
                                    className={toggleClass}
                                    onClick={() => setForm((prev) => ({ ...prev, featured: !prev.featured }))}
                                    role="switch"
                                    aria-checked={form.featured}
                                >
                                    <span className={styles["ecm-toggle-knob"]} />
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

function formatDate(isoDate) {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
}