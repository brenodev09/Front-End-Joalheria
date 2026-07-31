import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import Header from "../../components/Header";
import HeroCatalogo from "../../components/User/Catalogo/HeroCatalogo";
import ToolbarCatalogo from "../../components/User/Catalogo/ToolbarCatalogo";
import SidebarFiltros from "../../components/User/Catalogo/SidebarFiltros";
import ProductGrid from "../../components/User/Catalogo/ProductGrid";
import Pagination from "../../components/User/Catalogo/Pagination";
import { useCarrinho } from "../../context/carrinhoContext";

import { useCatalogAnimations } from "../../hooks/useCatalogAnimations";

import styles from "../../styles/User/catalogo.module.css";


export default function Catalogo() {


    const [produtos, setProdutos] = useState([]);

    const [loading, setLoading] = useState(true);


    const [layout, setLayout] = useState("compact");

const { adicionarAoCarrinho } = useCarrinho();
    const [pagina, setPagina] = useState(1);


    const [busca, setBusca] = useState("");


    const [filtros, setFiltros] = useState({

        categorias: [],

        materiais: [],

        preco: [0, 0]

    });



    const [categorias, setCategorias] = useState([]);

    const [materiais, setMateriais] = useState([]);



    const {

        heroRef,

        toolbarRef,

        sidebarRef,

        gridRef


    } = useCatalogAnimations();



    async function carregarDados() {


        try {


            setLoading(true);



            const [

                produtosResponse,

                categoriasResponse,

                materiaisResponse


            ] = await Promise.all([


                api.get("/produtos"),

                api.get("/categorias"),

                api.get("/materiais")


            ]);



            setProdutos(
                produtosResponse.data
            );


            setCategorias(
                categoriasResponse.data
            );


            setMateriais(
                materiaisResponse.data
            );



        } catch (error) {


            console.error(
                "Erro ao carregar catálogo:",
                error
            );


        } finally {


            setLoading(false);


        }


    }





    useEffect(() => {


        carregarDados();


    }, []);







    const produtosFiltrados = useMemo(() => {


        let lista = [...produtos];



        // BUSCA POR NOME

        if (busca) {


            lista = lista.filter(produto =>

                produto.nome
                    .toLowerCase()
                    .includes(
                        busca.toLowerCase()
                    )

            );


        }



        // FILTRO CATEGORIA

        if (
            filtros.categorias.length > 0
        ) {


            lista = lista.filter(produto =>

                filtros.categorias.includes(
                    produto.categoria
                )

            );


        }




        // FILTRO MATERIAL

        if (
            filtros.materiais.length > 0
        ) {


            lista = lista.filter(produto =>

                filtros.materiais.includes(
                    produto.material
                )

            );


        }




        // FILTRO PREÇO

        const [min, max] = filtros.preco;



        if (max > 0) {


            lista = lista.filter(produto =>

                produto.preco >= min &&
                produto.preco <= max

            );


        }




        return lista;


    }, [
        produtos,
        busca,
        filtros
    ]);





async function adicionarProduto(produto){

    try{

        await adicionarAoCarrinho(
            produto.id,
            1,
            null,
            produto
        );


    }catch(error){

        console.error(
            "Erro ao adicionar produto:",
            error
        );

    }

}


    return (


        <main className={styles.catalogo}>
  <Header />

            <div ref={heroRef}>

                <HeroCatalogo />

            </div>





            <section className={styles.container}>



                <div ref={toolbarRef}>


                    <ToolbarCatalogo


                        busca={busca}

                        setBusca={setBusca}

                        layout={layout}

                        setLayout={setLayout}

                        quantidade={
                            produtosFiltrados.length
                        }


                    />


                </div>







                <div className={styles.content}>


                    <aside

                        ref={sidebarRef}

                        className={styles.sidebar}

                    >


                        <SidebarFiltros


                            filtros={filtros}

                            setFiltros={setFiltros}

                            categorias={categorias}

                            materiais={materiais}


                        />


                    </aside>







                    <section


                        ref={gridRef}

                        className={styles.products}


                    >



       <ProductGrid

    produtos={produtosFiltrados}

    loading={loading}

    layout={layout}

    onAddCart={adicionarProduto}

/>




                        <Pagination


                            page={pagina}

                            totalPages={
                                Math.ceil(
                                    produtosFiltrados.length / 12
                                )
                            }

                            onChange={setPagina}


                        />



                    </section>


                </div>



            </section>


        </main>


    );


}