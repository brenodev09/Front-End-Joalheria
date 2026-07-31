import { motion, AnimatePresence } from "framer-motion";

import CardProduto from "./CardProduto";
import SkeletonCard from "./SkeletonCard";
import EmptyState from "./EmptyState";

import styles from "../../../styles/User/productGrid.module.css";

export default function ProductGrid({

    produtos = [],

    loading,

    layout,

    onAddCart,

    onFavorite

}){

    if(loading){

        const quantidade =
            layout === "compact"
            ? 8
            : 4;

        return(

            <motion.section
    layout
    transition={{
        layout: {
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
        },
    }}
    className={`
        ${styles.grid}
        ${
            layout === "compact"
                ? styles.compact
                : styles.expanded
        }
    `}
>

                {

                    Array.from({
                        length:quantidade
                    }).map((_,index)=>(

                      <SkeletonCard
        layout={layout}
    />

                    ))

                }

            </motion.section>

        )

    }

    if(produtos.length===0){

        return <EmptyState/>

    }

    return(

        <motion.section

            layout

            className={`${styles.grid}
            ${
                layout==="compact"
                ? styles.compact
                : styles.expanded
            }`}

        >

           <AnimatePresence mode="popLayout">

    {produtos.map((produto) => (

        <motion.div
            key={produto.id}
            layout

            transition={{
                layout: {
                    duration: .45,
                    ease: [0.22,1,0.36,1],
                },
            }}

            initial={{
                opacity:0,
                scale:.96,
            }}

            animate={{
                opacity:1,
                scale:1,
            }}

            exit={{
                opacity:0,
                scale:.95,
            }}
        >

      <CardProduto

    produto={produto}

    layout={layout}

    onAddCart={onAddCart}

/>
        </motion.div>

    ))}

</AnimatePresence>

        </motion.section>

    )

}