import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

import styles from "../../../styles/User/pagination.module.css";

export default function Pagination({

    page,

    totalPages,

    onChange

}){

    if(totalPages<=1){

        return null;

    }

    return(

        <nav className={styles.pagination}>

            <motion.button

                whileTap={{scale:.92}}

                whileHover={{scale:1.05}}

                disabled={page===1}

                onClick={()=>onChange(page-1)}

                className={styles.arrow}

            >

                <ChevronLeft size={18}/>

            </motion.button>

            {

                Array.from({

                    length:totalPages

                }).map((_,index)=>(

                    <motion.button

                        key={index}

                        whileHover={{y:-3}}

                        whileTap={{scale:.9}}

                        onClick={()=>onChange(index+1)}

                        className={

                            page===index+1

                            ?

                            styles.active

                            :

                            styles.page

                        }

                    >

                        {index+1}

                    </motion.button>

                ))

            }

            <motion.button

                whileTap={{scale:.92}}

                whileHover={{scale:1.05}}

                disabled={page===totalPages}

                onClick={()=>onChange(page+1)}

                className={styles.arrow}

            >

                <ChevronRight size={18}/>

            </motion.button>

        </nav>

    )

}