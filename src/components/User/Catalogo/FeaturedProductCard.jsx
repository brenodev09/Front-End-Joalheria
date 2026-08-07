import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import CertificateSeal from "./CertificateSeal";
import {
  formatPrice,
  pieceNumber,
  resolveImage
} from "./azoryUtils";

import styles from "../../../styles/User/catalogoAzory.module.css";



export default function FeaturedProductCard({
  produto,
  rotate = 0
}) {


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

    <motion.div


      initial={{
        opacity:0,
        y:20
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
        duration:0.8,
        ease:[
          0.22,
          1,
          0.36,
          1
        ]
      }}



      style={{
        rotate:`${rotate}deg`
      }}



      className={`
        ${styles.featured}
        ${styles.featuredSpan}
      `}



    >



      <Link

        to={`/produto/${produto.id}`}

        className={
          styles.featuredLink
        }

      >




        <div className={styles.featuredImageWrap}>


          <CertificateSeal />



          <span

            className={`
              ${styles.label}
              ${styles.featuredNumber}
            `}

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
              styles.featuredImage
            }


          />



        </div>








        <div className={styles.featuredBody}>


          <p

            className={`
              ${styles.label}
              ${styles.featuredMeta}
            `}

          >

            {
              detalhes
            }


          </p>





          <h3

            className={
              styles.featuredName
            }

          >

            {
              produto.nome
            }


          </h3>







          <div

            className={
              styles.featuredFooter
            }

          >



            <span

              className={
                styles.featuredPrice
              }

            >

              {
                formatPrice(
                  produto.preco
                )
              }


            </span>





            <span

              className={`
                ${styles.labelTight}
                ${styles.featuredCta}
              `}

            >

              Ver peça —

            </span>




          </div>



        </div>





      </Link>



    </motion.div>


  );

}