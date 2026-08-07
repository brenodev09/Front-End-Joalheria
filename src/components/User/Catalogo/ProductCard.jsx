import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
    formatPrice,
    pieceNumber,
    resolveImage
} from "./azoryUtils";

import styles from "../../../styles/User/catalogoAzory.module.css";



export default function ProductCard({ produto }) {


    if(!produto) return null;



    const imagem =

        resolveImage(produto.imagem)

        ||

        "/placeholder.svg";





    const detalhes =

        [

            produto.categoria,

            produto.material

        ]

        .filter(Boolean)

        .join(" · ");






    return (

        <motion.article


            className={
                styles.card
            }



            initial={{

                opacity:0,

                y:30

            }}




            whileInView={{

                opacity:1,

                y:0

            }}




            viewport={{

                once:true,

                margin:"-40px"

            }}




            transition={{

                duration:.6,

                ease:[
                    0.22,
                    1,
                    0.36,
                    1
                ]

            }}



        >





            <Link


                className={
                    styles.cardLink
                }


                to={`/produto/${produto.id}`}


            >





                <div

                    className={
                        styles.cardImageWrap
                    }

                >





                    <span

                        className={
                            styles.cardNumber
                        }

                    >

                        {
                            pieceNumber(
                                produto.numero
                            )
                        }


                    </span>







                    <img


                        src={imagem}


                        alt={
                            `${produto.nome} ${
                                produto.material ?? ""
                            }`
                        }


                        loading="lazy"


                        className={
                            styles.cardImage
                        }


                    />



                </div>








                <div

                    className={
                        styles.cardBody
                    }

                >





                    <span

                        className={
                            styles.cardMeta
                        }

                    >

                        {
                            detalhes
                        }


                    </span>








                    <h3

                        className={
                            styles.cardName
                        }

                    >

                        {
                            produto.nome
                        }


                    </h3>








                    <span

                        className={
                            styles.cardPrice
                        }

                    >

                        {
                            formatPrice(
                                produto.preco
                            )
                        }


                    </span>





                </div>






            </Link>





        </motion.article>

    );


}