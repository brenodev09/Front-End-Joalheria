import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

import ProximasColecoes from "../../components/User/ProximasColecoes";

import MarqueeBar from "../../components/User/Catalogo/MarqueeBar";
import EditorialHero from "../../components/User/Catalogo/EditorialHero";
import CategoryTabs from "../../components/User/Catalogo/CategoryTabs";
import CatalogSearchBar from "../../components/User/Catalogo/CatalogSearchBar";
import SortDropdown from "../../components/User/Catalogo/SortDropdown";
import ProductMosaic from "../../components/User/Catalogo/ProductMosaic";
import CategoryMosaic from "../../components/User/Catalogo/CategoryMosaic";
import CatalogPagination from "../../components/User/Catalogo/CatalogPagination";

import ManifestoQuote from "../../components/User/Catalogo/ManifestoQuote";
import TrustFooter from "../../components/User/Catalogo/TrustFooter";

import {
  SkeletonGrid,
  EmptyState,
  ErrorState,
} from "../../components/User/Catalogo/CatalogStates";

import styles from "../../styles/User/catalogoAzory.module.css";

const PER_PAGE = 9;

function buildLookup(lista = []) {
  const map = {};

  for (const item of lista) {
    if (item?.id != null) {
      map[item.id] =
        item.nome ??
        item.name ??
        String(item.id);
    }
  }

  return map;
}

function normalizeId(value) {
  if (value == null) return null;

  return String(value);
}

export default function Catalogo() {
  const [produtos, setProdutos] = useState([]);

  const [categoriasBanco, setCategoriasBanco] = useState([]);

  const [categoriaMap, setCategoriaMap] = useState({});
  const [materialMap, setMaterialMap] = useState({});

  const [status, setStatus] = useState("loading");
const navegar = useNavigate();
  const [busca, setBusca] = useState("");

  const [sort, setSort] = useState("recentes");

  const [pagina, setPagina] = useState(1);

  const [
    categoriaSelecionada,
    setCategoriaSelecionada,
  ] = useState("Todas");

  async function carregarDados() {
    try {
      setStatus("loading");

      const [
        produtosResponse,
        categoriasResponse,
        materiaisResponse,
      ] = await Promise.all([
        api.get("/produtos"),
        api.get("/categorias"),
        api.get("/materiais"),
      ]);

      const produtosData =
        Array.isArray(produtosResponse.data)
          ? produtosResponse.data
          : [];

      const categoriasData =
        Array.isArray(categoriasResponse.data)
          ? categoriasResponse.data
          : [];

      const materiaisData =
        Array.isArray(materiaisResponse.data)
          ? materiaisResponse.data
          : [];

      const produtosComNumero =
        produtosData.map((produto, index) => ({
          ...produto,
          numero: index + 1,
        }));

      setProdutos(produtosComNumero);

      setCategoriasBanco(categoriasData);

      setCategoriaMap(
        buildLookup(categoriasData)
      );

      setMaterialMap(
        buildLookup(materiaisData)
      );

      setStatus("ready");
    } catch (error) {
      console.error(
        "Erro ao carregar catálogo:",
        error
      );

      setStatus("error");
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  /*
    RESET DA PAGINAÇÃO
  */

  useEffect(() => {
    setPagina(1);
  }, [
    busca,
    sort,
    categoriaSelecionada,
  ]);

  /*
    PREPARAR PRODUTOS
  */

  const produtosPreparados = useMemo(() => {
    return produtos.map((produto) => {
      const categoriaId =
        normalizeId(produto.categoria);

      const materialId =
        normalizeId(produto.material);

      return {
        ...produto,

        categoria:
          categoriaMap[categoriaId] ??
          categoriaMap[produto.categoria] ??
          produto.categoria,

        material:
          materialMap[materialId] ??
          materialMap[produto.material] ??
          produto.material,
      };
    });
  }, [
    produtos,
    categoriaMap,
    materialMap,
  ]);

  /*
    CATEGORIAS
  */

  const categorias = useMemo(() => {
    return categoriasBanco
      .filter(
        (categoria) =>
          categoria?.id != null
      )
      .map((categoria) => {
        const imagemCategoria =
          categoria.imagem ??
          categoria.image ??
          categoria.foto ??
          categoria.capa ??
          categoria.image_url ??
          null;

        return {
          id: categoria.id,

          nome:
            categoria.nome ??
            categoria.name ??
            `Categoria ${categoria.id}`,

          imagem: imagemCategoria,

          totalProdutos:
            produtos.filter((produto) => {
              return (
                normalizeId(
                  produto.categoria
                ) ===
                normalizeId(
                  categoria.id
                )
              );
            }).length,
        };
      });
  }, [
    categoriasBanco,
    produtos,
  ]);

  /*
    NOMES DAS CATEGORIAS
  */

  const nomesCategorias = useMemo(() => {
    return [
      "Todas",
      ...categorias.map(
        (categoria) =>
          categoria.nome
      ),
    ];
  }, [categorias]);

  /*
    PRODUTOS FILTRADOS
  */

  const produtosFiltrados =
    useMemo(() => {
      let lista = [
        ...produtosPreparados,
      ];

      /*
        FILTRO DE CATEGORIA
      */

      if (
        categoriaSelecionada !==
        "Todas"
      ) {
        lista = lista.filter(
          (produto) => {
            return (
              String(
                produto.categoria
              ).toLowerCase() ===
              String(
                categoriaSelecionada
              ).toLowerCase()
            );
          }
        );
      }

      /*
        BUSCA
      */

      if (busca.trim()) {
        const termo =
          busca.trim().toLowerCase();

        lista = lista.filter(
          (produto) => {
            const nome =
              String(
                produto.nome ?? ""
              ).toLowerCase();

            const material =
              String(
                produto.material ?? ""
              ).toLowerCase();

            return (
              nome.includes(termo) ||
              material.includes(termo)
            );
          }
        );
      }

      /*
        ORDENAÇÃO
      */

      switch (sort) {
        case "preco-asc":
          lista.sort(
            (a, b) =>
              Number(a.preco) -
              Number(b.preco)
          );
          break;

        case "preco-desc":
          lista.sort(
            (a, b) =>
              Number(b.preco) -
              Number(a.preco)
          );
          break;

        case "nome":
          lista.sort(
            (a, b) =>
              String(
                a.nome ?? ""
              ).localeCompare(
                String(
                  b.nome ?? ""
                ),
                "pt-BR"
              )
          );
          break;

        default:
          lista.sort(
            (a, b) =>
              Number(b.numero) -
              Number(a.numero)
          );
          break;
      }

      return lista;
    }, [
      produtosPreparados,
      categoriaSelecionada,
      busca,
      sort,
    ]);

  /*
    PAGINAÇÃO
  */

  const totalPages = Math.max(
    1,
    Math.ceil(
      produtosFiltrados.length /
        PER_PAGE
    )
  );

  const paginaSegura = Math.min(
    pagina,
    totalPages
  );

  const inicio =
    (paginaSegura - 1) *
    PER_PAGE;

  const itensPagina =
    produtosFiltrados.slice(
      inicio,
      inicio + PER_PAGE
    );

  /*
    RENDER
  */

  return (
    <main className={styles.page}>

      <Header />

      <MarqueeBar />

      <section
        className={styles.container}
      >

        {/* CATEGORIAS */}

        <CategoryTabs
          categorias={
            nomesCategorias
          }
          active={
            categoriaSelecionada
          }
          onChange={
            setCategoriaSelecionada
          }
        />

        {/* BUSCA E ORDENAÇÃO */}

        <div
          className={styles.toolbar}
        >
          <CatalogSearchBar
            value={busca}
            onChange={setBusca}
          />

          <SortDropdown
            value={sort}
            onChange={setSort}
          />
        </div>

        {/* CATÁLOGO */}

        <div
          className={styles.gridArea}
        >

          {/* LOADING */}

          {status === "loading" && (
            <SkeletonGrid
              count={PER_PAGE}
            />
          )}

          {/* ERRO */}

          {status === "error" && (
            <ErrorState
              onRetry={
                carregarDados
              }
            />
          )}

          {/* PRONTO */}

          {status === "ready" && (
            categoriaSelecionada ===
            "Todas" ? (

              categorias.length > 0 ? (

                <CategoryMosaic
                  categorias={
                    categorias
                  }
                  onSelect={
                    setCategoriaSelecionada
                  }
                />

              ) : (

                <EmptyState />

              )

            ) : (

              itensPagina.length > 0 ? (

                <ProductMosaic
                  produtos={
                    itensPagina
                  }
                />

              ) : (

                <EmptyState />

              )

            )
          )}

        </div>

        {/* PAGINAÇÃO */}

        {status === "ready" &&
          categoriaSelecionada !==
            "Todas" &&
          produtosFiltrados.length >
            0 && (

            <CatalogPagination
              page={
                paginaSegura
              }
              totalPages={
                totalPages
              }
              onChange={
                setPagina
              }
            />

          )}

      </section>

      {/* =====================================================
          PRÓXIMAS COLEÇÕES
          ===================================================== */}

<ProximasColecoes
    onLoginNecessario={() => {
        window.location.href = "/Login";
    }}
/>

    </main>
  );
}