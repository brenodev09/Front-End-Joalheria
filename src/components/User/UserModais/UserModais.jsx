import "./userModais.css";
import { X, ShoppingBag, Heart } from "lucide-react";

export default function UserModais({ type, product, onClose, onAddCart }) {
  if (!type || !product) return null;

  if (type === "view") {
    return (
      <div className="user-modal-overlay">
        <div className="user-product-modal">
          <button className="user-modal-close" onClick={onClose}>
            <X size={18} />
          </button>

          <div className="user-product-content">
            <div className="user-product-image-area">
              <div className="user-product-main-image">
                {product?.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <div className="user-jewel-render">
                    <div className="user-jewel-glow" />
                    <div className="user-jewel-ring" />
                    <div className="user-jewel-prong" />
                    <div className="user-jewel-gem" />
                    <div className="user-jewel-shadow" />
                  </div>
                )}
              </div>
            </div>

            <div className="user-product-info">
              <span className="user-product-label">AZORY COLLECTION</span>

              <h2>{product.name}</h2>

              <p className="user-product-description">
                {product.description ||
                  "Joia premium desenvolvida com acabamento sofisticado, brilho refinado e design exclusivo."}
              </p>

              <div className="user-product-details">
                <div>
                  <span>Categoria</span>
                  <strong>{product.category}</strong>
                </div>

                <div>
                  <span>Material</span>
                  <strong>{product.material}</strong>
                </div>

                <div>
                  <span>Disponibilidade</span>
                  <strong>{product.stock > 0 ? "Em estoque" : "Indisponível"}</strong>
                </div>
              </div>

              <div className="user-product-price">
                R$ {Number(product.price || 0).toLocaleString("pt-BR")}
              </div>

              <div className="user-modal-actions">
                <button className="user-favorite-btn">
                  <Heart size={18} />
                </button>

                <button className="user-cart-btn" onClick={onAddCart}>
                  <ShoppingBag size={18} />
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}