import "./adminModais.css";
import { X, Save, AlertTriangle, ImagePlus } from "lucide-react";

export default function AdminModais({
  type,
  product,
  formData,
  setFormData,
  onClose,
  onSave,
  onDelete,
}) {
  const data = product || formData || {};

  if (!type) return null;

  if (type === "delete") {
    return (
      <div className="admin-modal-overlay">
        <div className="admin-delete-modal">
          <AlertTriangle size={46} />

          <h2>Excluir Produto</h2>

          <p>
            Tem certeza que deseja excluir{" "}
            <strong>{data?.name || "este produto"}</strong>? Essa ação não
            poderá ser desfeita.
          </p>

          <div className="admin-modal-actions center">
            <button className="admin-cancel-btn" onClick={onClose}>
              Cancelar
            </button>

            <button className="admin-delete-btn" onClick={onDelete}>
              Excluir Produto
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (type === "view") {
    return (
      <div className="admin-modal-overlay">
        <div className="admin-product-modal admin-product-view-modal">
          <div className="admin-modal-header">
            <h2>VISUALIZAR PRODUTO</h2>
            <button onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <div className="admin-product-view-body">
            <div className="admin-product-view-gallery">
              <div className="admin-product-main-image">
                {data?.image ? (
                  <img src={data.image} alt={data.name} />
                ) : (
                  <div className="admin-jewel-render">
                    <div className="admin-jewel-glow" />
                    <div className="admin-jewel-ring" />
                    <div className="admin-jewel-prong" />
                    <div className="admin-jewel-gem" />
                    <div className="admin-jewel-shadow" />
                  </div>
                )}
              </div>
            </div>

            <div className="admin-product-view-info">
              <div className="admin-product-view-head">
                <div>
                  <h1>{data?.name}</h1>
                  <span>ID: {data?.id}</span>
                </div>

                <em>{data?.status || "Ativo"}</em>
              </div>

              <div className="admin-product-info-list">
                <div className="admin-product-info-row">
                  <span>Categoria</span>
                  <strong>{data?.category}</strong>
                </div>

                <div className="admin-product-info-row">
                  <span>Material</span>
                  <strong>{data?.material}</strong>
                </div>

                <div className="admin-product-info-row">
                  <span>Preço</span>
                  <strong>R$ {Number(data?.price || 0).toLocaleString("pt-BR")}</strong>
                </div>

                <div className="admin-product-info-row">
                  <span>Estoque</span>
                  <strong>{data?.stock}</strong>
                </div>
              </div>

              <div className="admin-product-description">
                <span>Descrição</span>
                <p>{data?.description}</p>
              </div>

              <div className="admin-modal-actions">
                <button className="admin-cancel-btn" onClick={onClose}>
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "add" || type === "edit") {
    const isEdit = type === "edit";

    function handleChange(e) {
      const { name, value } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    return (
      <div className="admin-modal-overlay">
        <div className="admin-product-modal admin-premium-form-modal">
          <div className="admin-modal-header">
            <h2>{isEdit ? "EDITAR PRODUTO" : "ADICIONAR PRODUTO"}</h2>

            <button onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <div className="admin-premium-modal-body">
            <div className="admin-modal-title-block">
              <span>AZORY ADMIN</span>
              <h3>{isEdit ? "Editar joia" : "Nova joia"}</h3>
              <p>
                Preencha as informações principais do produto para o catálogo.
              </p>
            </div>

            <div className="admin-premium-form-layout">
              <div className="admin-premium-form-card">
                <div className="admin-field">
                  <span>Nome do produto</span>
                  <input
                    name="name"
                    value={formData?.name || ""}
                    onChange={handleChange}
                    placeholder="Ex: Anel Imperial Gold"
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-field">
                    <span>Categoria</span>
                    <input
                      name="category"
                      value={formData?.category || ""}
                      onChange={handleChange}
                      placeholder="Ex: Anéis"
                    />
                  </div>

                  <div className="admin-field">
                    <span>Material</span>
                    <input
                      name="material"
                      value={formData?.material || ""}
                      onChange={handleChange}
                      placeholder="Ex: Ouro 18k"
                    />
                  </div>
                </div>

                <div className="admin-form-row">
                  <div className="admin-field">
                    <span>Preço</span>
                    <input
                      name="price"
                      type="number"
                      value={formData?.price || ""}
                      onChange={handleChange}
                      placeholder="2890"
                    />
                  </div>

                  <div className="admin-field">
                    <span>Estoque</span>
                    <input
                      name="stock"
                      type="number"
                      value={formData?.stock || ""}
                      onChange={handleChange}
                      placeholder="12"
                    />
                  </div>
                </div>

                <div className="admin-field">
                  <span>Status</span>
                  <input
                    name="status"
                    value={formData?.status || ""}
                    onChange={handleChange}
                    placeholder="Ativo"
                  />
                </div>

                <div className="admin-field">
                  <span>Descrição</span>
                  <textarea
                    name="description"
                    value={formData?.description || ""}
                    onChange={handleChange}
                    placeholder="Descrição premium da joia..."
                  />
                </div>

                <div className="admin-modal-actions">
                  <button className="admin-cancel-btn" onClick={onClose}>
                    Cancelar
                  </button>

                  <button className="admin-save-btn" onClick={onSave}>
                    <Save size={17} />
                    Salvar Produto
                  </button>
                </div>
              </div>

              <div className="admin-premium-image-panel">
                <div className="admin-image-panel-head">
                  <div>
                    <span>Imagem</span>
                    <strong>Render do produto</strong>
                  </div>
                </div>

                <div className="admin-upload-premium">
                  <div className="admin-upload-icon">
                    <ImagePlus size={28} />
                  </div>

                  <h4>Adicionar imagem</h4>
                  <p>
                    Aqui você pode futuramente integrar upload real das imagens
                    do produto.
                  </p>
                </div>

                {formData?.image && (
                  <div className="admin-modal-image-list">
                    <div className="admin-modal-image-preview">
                      <img src={formData.image} alt="Preview" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}