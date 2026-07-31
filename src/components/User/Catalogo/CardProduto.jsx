import { motion } from "framer-motion";
import {
    ShoppingBag,
    Star
} from "lucide-react";

import styles from "../../../styles/User/cardProduto.module.css";


export default function CardProduto({

    produto,

    layout="compact",

    onAddCart

}) {


    return (

        <motion.article

            layout

            layoutId={`produto-${produto.id}`}

            transition={{
                layout:{
                    duration:.45,
                    ease:[0.22,1,0.36,1]
                }
            }}

            className={`
                productCard
                ${styles.card}
                ${
                    layout==="expanded"
                    ? styles.expanded
                    : styles.compact
                }
            `}

        >


            <div className={styles.imageContainer}>


                <img

                    src={`http://localhost:3000${produto.imagem}`}

                    alt={produto.nome}

                    className={styles.image}

                />



                {
                    produto.badge && (

                        <div className={styles.badge}>

                            {produto.badge}

                        </div>

                    )
                }


            </div>




            <div className={styles.content}>


                <div>


                    <h3 className={styles.nome}>

                        {produto.nome}

                    </h3>



                    <p className={styles.info}>

                        {produto.material}

                        <span>•</span>

                        {produto.categoria}

                    </p>


                </div>





                <div className={styles.rating}>


    <div className={styles.stars}>

        {
            Array.from({
                length:5
            }).map((_,index)=>(

                <Star

                    key={index}

                    size={14}

                    fill="#c7a25b"

                    color="#c7a25b"

                />

            ))
        }


    </div>


    <span>

        ({produto.avaliacoes || 0})

    </span>


</div>





                <div className={styles.priceArea}>


                    <span className={styles.price}>


                        R$ 

                        {Number(produto.preco)
                        .toLocaleString("pt-BR",{

                            minimumFractionDigits:2

                        })}


                    </span>


                </div>





                <motion.button


                    whileTap={{
                        scale:.97
                    }}


                    className={styles.button}


                    onClick={()=>onAddCart?.(produto)}


                >


                    <ShoppingBag size={18}/>


                    Adicionar à Sacola


                </motion.button>



            </div>



        </motion.article>

    )

}