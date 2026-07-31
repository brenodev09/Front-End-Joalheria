import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import styles from "../../../styles/User/heroCatalogo.module.css";

export default function HeroCatalogo() {

    const hero = useRef(null);

    useGSAP(() => {

        const tl = gsap.timeline();

        tl.from(".catalogBadge",{
            y:20,
            opacity:0,
            duration:.5
        })

        .from(".catalogTitle",{
            y:40,
            opacity:0,
            duration:.8
        },"<0.1")

        .from(".catalogDescription",{
            y:30,
            opacity:0,
            duration:.7
        },"<0.2")

        .from(".catalogButton",{
            y:20,
            opacity:0,
            duration:.5
        },"<0.2")

    },{scope:hero})

    return (

        <section
            ref={hero}
            className={styles.hero}
        >

            <div className={styles.overlay}></div>

            <div className={styles.content}>

                <span className={`catalogBadge ${styles.badge}`}>
                    COLEÇÃO PREMIUM
                </span>

                <h1 className={`catalogTitle ${styles.title}`}>
                    Catálogo de Joias
                </h1>

                <p className={`catalogDescription ${styles.description}`}>
                    Descubra peças cuidadosamente selecionadas para quem valoriza elegância, autenticidade e acabamento impecável.
                </p>

                <button className={`catalogButton ${styles.button}`}>
                    Explorar Coleção
                </button>

            </div>

        </section>

    );

}