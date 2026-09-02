// components/FavoritoCardSkeleton.jsx
import estilos from "../FavoritoCard/FavoritoCard.module.css"

import skeletonEstilos from "./FavoritoCardSkeleton.module.css"

export default function FavoritoCardSkeleton() {
    return (
        <div className={estilos.card} aria-hidden="true">
            <div className={`${estilos.imagemContainer} ${skeletonEstilos.pulso}`} />
            <div className={estilos.conteudo}>
                <div className={`${skeletonEstilos.linha} ${skeletonEstilos.linhaCurta} ${skeletonEstilos.pulso}`} />
                <div className={`${skeletonEstilos.linha} ${skeletonEstilos.pulso}`} />
                <div className={`${skeletonEstilos.linha} ${skeletonEstilos.linhaMedia} ${skeletonEstilos.pulso}`} />
                <div className={`${skeletonEstilos.botao} ${skeletonEstilos.pulso}`} />
            </div>
        </div>
    )
}