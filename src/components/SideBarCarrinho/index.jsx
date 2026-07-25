import {
    X,
    Minus,
    Plus,
    Trash2,
    Truck,
    ShieldCheck,
    Award,
    RefreshCcw,
    LockKeyhole,
    ShoppingBag
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import styles from "./styles.module.css";
import { useCarrinho } from "../../context/carrinhoContext";

export default function SideBarCarrinho() {

    const navigate = useNavigate();
    const sidebarRef = useRef(null);
    const overlayRef = useRef(null);



    const {
        itens,
        sidebarAberta,
        fecharSidebar,
        atualizarQuantidade,
        removerProduto,
        subtotal
    } = useCarrinho();





    useEffect(() => {

        if (!sidebarAberta) return;

        gsap.fromTo(
            overlayRef.current,
            { opacity: 0 },
            { opacity: 1, duration: .4, ease: "power2.out" }
        );

        gsap.fromTo(
            sidebarRef.current,
            { x: "100%" },
            { x: 0, duration: .6, ease: "power4.out" }
        );

    }, [sidebarAberta]);



    function formatarPreco(valor) {

        return valor.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

    }







    if (!sidebarAberta) {
        return null;
    }


    return (
        <>


            {/* OVERLAY */}

            <div
                className={styles.overlay}
                ref={overlayRef}
            />



            {/* SIDEBAR */}

            <aside
                className={styles.sidebar}
                ref={sidebarRef}
            >



                {/* HEADER */}

                <header className={styles.header}>

                    <h2>
                        MINHA SACOLA
                    </h2>


                    <button
                        className={styles.closeButton}
                        aria-label="Fechar carrinho"
                        onClick={fecharSidebar}
                    >
                        <X size={22} />
                    </button>


                </header>





                {/* BENEFÍCIOS */}
                {/* 
                <section className={styles.beneficios}>


                    <div className={styles.beneficio}>

                        <Truck size={22} />

                        <div>
                            <strong>
                                Frete Grátis
                            </strong>

                            <span>
                                Todo Brasil
                            </span>
                        </div>

                    </div>




                    <div className={styles.beneficio}>

                        <ShieldCheck size={22} />

                        <div>

                            <strong>
                                Garantia Vitalícia
                            </strong>

                            <span>
                                Todas as peças
                            </span>

                        </div>

                    </div>





                    <div className={styles.beneficio}>

                        <Award size={22} />

                        <div>

                            <strong>
                                Certificado
                            </strong>

                            <span>
                                Autenticidade
                            </span>

                        </div>

                    </div>





                    <div className={styles.beneficio}>

                        <RefreshCcw size={22} />

                        <div>

                            <strong>
                                Troca Fácil
                            </strong>

                            <span>
                                Até 30 dias
                            </span>

                        </div>

                    </div>



                </section> */}






                {/* PRODUTOS */}

                <section className={styles.produtos}>


                    {
                        itens.map(item => (


                            <article
                                className={styles.produto}
                                key={item.id}
                            >



                                <img
                                    src={
                                        item.imagem?.startsWith("http")
                                            ?
                                            item.imagem
                                            :
                                            `http://localhost:3000${item.imagem}`
                                    }
                                    alt={item.nome}
                                />



                                <div className={styles.infoProduto}>


                                    <h3>
                                        {item.nome}
                                    </h3>


                                    <p>
                                        {item.material}
                                    </p>


                                    <span className={styles.preco}>
                                        {
                                            formatarPreco(
                                                item.preco ||
                                                item.produto_preco ||
                                                0
                                            )
                                        }
                                    </span>



                                    <div className={styles.controle}>


                                        <button
                                            onClick={() =>
                                                atualizarQuantidade(
                                                    item.id,
                                                    item.quantidade - 1
                                                )
                                            }
                                        >
                                            <Minus size={14} />
                                        </button>


                                        <span>
                                            {item.quantidade}
                                        </span>


                                        <button
                                            onClick={() =>
                                                atualizarQuantidade(
                                                    item.id,
                                                    item.quantidade + 1
                                                )
                                            }
                                        >
                                            <Plus size={14} />
                                        </button>



                                        <button
                                            className={styles.delete}
                                            onClick={() =>
                                                removerProduto(item.id)
                                            }
                                        >
                                            <Trash2 size={16} />
                                        </button>


                                    </div>


                                </div>



                            </article>


                        ))
                    }


                </section>







                {/* RESUMO */}

                <section className={styles.resumo}>


                    <div>

                        <span>
                            Subtotal
                        </span>

                        <strong>
                            {formatarPreco(subtotal)}
                        </strong>

                    </div>



                    <div>

                        <span>
                            Frete
                        </span>

                        <strong>
                            Grátis
                        </strong>

                    </div>




                    <div className={styles.total}>

                        <span>
                            Total
                        </span>

                        <strong>
                            {formatarPreco(subtotal)}
                        </strong>


                    </div>



                </section>






                {/* SEGURANÇA */}

                {/* <div className={styles.seguro}>


                    <LockKeyhole size={18} />


                    <div>

                        <strong>
                            Ambiente 100% seguro
                        </strong>


                        <span>
                            Seus dados protegidos com criptografia SSL
                        </span>


                    </div>


                </div> */}






                {/* BOTÕES */}

                <footer className={styles.footer}>


                    <button
                        className={styles.finalizar}
                        onClick={() => {
                            fecharSidebar();
                            navigate("/carrinho");
                        }}
                    >
                        <ShoppingBag size={18} />

                        Finalizar Compra

                    </button>



                    {/* <button
                        className={styles.continuar}
                        onClick={fecharSidebar}
                    >
                        Continuar Comprando
                    </button> */}






                </footer>



            </aside>


        </>

    );



}