import { motion } from "framer-motion";
import { Gem } from "lucide-react";

import styles from "../../../styles/User/emptyState.module.css";

export default function EmptyState({

    title="Nenhuma joia encontrada",

    description="Sua busca ou os filtros aplicados não retornaram nenhum resultado.",

    onClearFilters

}){

    return(

        <motion.section

            initial={{
                opacity:0,
                y:30
            }}

            animate={{
                opacity:1,
                y:0
            }}

            transition={{
                duration:.6
            }}

            className={styles.container}

        >

            <motion.div

                animate={{
                    y:[0,-8,0]
                }}

                transition={{
                    repeat:Infinity,
                    duration:3
                }}

                className={styles.iconContainer}

            >

                <Gem
                    size={52}
                    strokeWidth={1.5}
                />

            </motion.div>

            <h2>

                {title}

            </h2>

            <p>

                {description}

            </p>

            {

                onClearFilters && (

                    <button

                        onClick={onClearFilters}

                        className={styles.button}

                    >

                        Limpar filtros

                    </button>

                )

            }

        </motion.section>

    )

}