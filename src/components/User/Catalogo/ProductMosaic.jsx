import ProductCard from "./ProductCard";

import styles from "../../../styles/User/catalogoAzory.module.css";

// Pequenas rotações artesanais alternadas — mesma assinatura visual do resto do site.
const ROTATIONS = [-0.6, 0.5, -0.3, 0.4, -0.5, 0.3, -0.4, 0.6];

// Grade uniforme para a categoria filtrada (anexo 2): TODOS os produtos no
// mesmo tamanho, sem card de destaque. O destaque (anexo 1) fica só na tela
// "Todas", dentro do CategoryMosaic.
export default function ProductMosaic({ produtos = [] }) {
  if (!produtos.length) return null;

  return (
    <div className={styles.cardsGrid}>
      {produtos.map((produto, index) => (
        <ProductCard
          key={produto.id}
          produto={produto}
          rotate={ROTATIONS[index % ROTATIONS.length]}
        />
      ))}
    </div>
  );
}