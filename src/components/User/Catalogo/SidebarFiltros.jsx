import { useState } from "react";
import { ChevronDown, RotateCcw, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import styles from "../../../styles/User/sidebarFiltros.module.css";

export default function SidebarFiltros({
    filtros,
    setFiltros,
    categorias = [],
    materiais = [],
    loading = true,
}) {

    const [sections, setSections] = useState({
        categorias: true,
        materiais: true,
        preco: true,
    });

    function toggleSection(section) {
        setSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    }

    function limparFiltros() {
        setFiltros({
            categorias: [],
            materiais: [],
            preco: [0, 0],
        });
    }

    function toggleCategoria(id) {

        const existe = filtros.categorias.includes(id);

        setFiltros(prev => ({
            ...prev,
            categorias: existe
                ? prev.categorias.filter(item => item !== id)
                : [...prev.categorias, id]
        }));

    }

    function toggleMaterial(id) {

        const existe = filtros.materiais.includes(id);

        setFiltros(prev => ({
            ...prev,
            materiais: existe
                ? prev.materiais.filter(item => item !== id)
                : [...prev.materiais, id]
        }));

    }

    return (

        <aside className={styles.sidebar}>

            <div className={styles.header}>

                <h3>Filtros</h3>

                <button
                    className={styles.reset}
                    onClick={limparFiltros}
                >
                    <RotateCcw size={16}/>
                    Limpar
                </button>

            </div>

            <Section
                title="Categorias"
                open={sections.categorias}
                toggle={() => toggleSection("categorias")}
            >

                {loading ? (
                    <SkeletonList />
                ) : (

                    <div className={styles.list}>

                        {categorias.map(categoria => (

                            <Checkbox
                                key={categoria.id}
                                checked={filtros.categorias.includes(categoria.id)}
                                label={categoria.nome}
                                onClick={() => toggleCategoria(categoria.id)}
                            />

                        ))}

                    </div>

                )}

            </Section>

            <Section
                title="Materiais"
                open={sections.materiais}
                toggle={() => toggleSection("materiais")}
            >

                {loading ? (
                    <SkeletonList />
                ) : (

                    <div className={styles.list}>

                        {materiais.map(material => (

                            <Checkbox
                                key={material.id}
                                checked={filtros.materiais.includes(material.id)}
                                label={material.nome}
                                onClick={() => toggleMaterial(material.id)}
                            />

                        ))}

                    </div>

                )}

            </Section>

            <Section
                title="Preço"
                open={sections.preco}
                toggle={() => toggleSection("preco")}
            >

                <div className={styles.priceCard}>
                    Em breve
                </div>

            </Section>

        </aside>

    );

}

function Section({
    title,
    open,
    toggle,
    children
}) {

    return (

        <section className={styles.section}>

            <button
                className={styles.sectionHeader}
                onClick={toggle}
            >

                <span>{title}</span>

                <motion.div
                    animate={{
                        rotate: open ? 180 : 0
                    }}
                    transition={{
                        duration:.3
                    }}
                >
                    <ChevronDown size={18}/>
                </motion.div>

            </button>

            <AnimatePresence initial={false}>

                {open && (

                    <motion.div
                        initial={{
                            height:0,
                            opacity:0
                        }}
                        animate={{
                            height:"auto",
                            opacity:1
                        }}
                        exit={{
                            height:0,
                            opacity:0
                        }}
                        transition={{
                            duration:.35
                        }}
                        className={styles.body}
                    >
                        {children}
                    </motion.div>

                )}

            </AnimatePresence>

        </section>

    );

}

function Checkbox({
    checked,
    label,
    onClick
}){

    return(

        <button
            className={styles.checkbox}
            onClick={onClick}
            type="button"
        >

            <motion.div

                className={`${styles.square} ${checked ? styles.checked : ""}`}

                animate={{
                    scale:checked ? 1 : .95
                }}

            >

                {checked && <Check size={12}/>}

            </motion.div>

            <span>{label}</span>

        </button>

    )

}

function SkeletonList(){

    return(

        <div className={styles.skeletonList}>

            {Array.from({length:5}).map((_,i)=>(

                <div
                    key={i}
                    className={styles.skeleton}
                />

            ))}

        </div>

    )

}