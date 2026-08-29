// ============================================================================
//  COLEÇÕES — PÁGINA PÚBLICA (CLIENTE)
//  Caminho no seu projeto: src/pages/User/Colecoes.jsx
//
//  Lista as coleções que já estão disponíveis na loja (ativas + permanentes),
//  usando a mesma rota pública que o backend já expõe:
//  GET /colecoes/publicas/ativas
// ============================================================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../../services/api";
import { resolveImage } from "../../components/User/Catalogo/azoryUtils";

import Header from "../../components/Header";
import ProximasColecoes from "../../components/User/ProximasColecoes";
import Footer from "../../components/Footer"

import styles from "../../styles/User/colecoesPublicas.module.css";

export default function ColecoesPublicas() {
  const navegar = useNavigate();

  const [colecoes, setColecoes] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ok | erro

  useEffect(() => {
    async function carregar() {
      try {
        setStatus("loading");
        const { data } = await api.get("/colecoes/publicas/ativas");
        setColecoes(Array.isArray(data) ? data : []);
        setStatus("ok");
      } catch (error) {
        console.error("[ColecoesPublicas] erro ao carregar:", error);
        setStatus("erro");
      }
    }

    carregar();
  }, []);

  return (
    <div className={styles.pagina}>
      <Header />

      <section className={styles.hero}>
        <span className={styles.heroEyebrow}>AZORY</span>
        <h1 className={styles.heroTitulo}>Coleções</h1>
        <p className={styles.heroSubtitulo}>
          Peças reunidas por conceito, ocasião e temporada. Explore as
          coleções disponíveis agora na loja.
        </p>
      </section>

      <div className={styles.conteudo}>
        {status === "loading" && (
          <p className={styles.estado}>Carregando coleções...</p>
        )}

        {status === "erro" && (
          <p className={styles.estado}>
            Não foi possível carregar as coleções agora. Tente novamente em
            instantes.
          </p>
        )}

        {status === "ok" && colecoes.length === 0 && (
          <p className={styles.estado}>
            Nenhuma coleção disponível no momento. Fique de olho nas próximas
            coleções abaixo.
          </p>
        )}

        {status === "ok" && colecoes.length > 0 && (
          <div className={styles.grid}>
            {colecoes.map((colecao) => (
              <article
                key={colecao.id}
                className={styles.card}
                onClick={() => navegar(`/colecoes/${colecao.id}`)}
              >
                <div className={styles.cardImagem}>
                  {colecao.imagem && (
                    <img
                      src={resolveImage(colecao.imagem)}
                      alt={colecao.nome}
                    />
                  )}

                  <span
                    className={`${styles.cardBadge} ${
                      colecao.permanente ? styles.cardBadgePermanente : ""
                    }`}
                  >
                    {colecao.permanente ? "Linha permanente" : "Coleção"}
                  </span>
                </div>

                <div className={styles.cardInfo}>
                  <h2 className={styles.cardNome}>{colecao.nome}</h2>

                  {colecao.descricao && (
                    <p className={styles.cardDescricao}>
                      {colecao.descricao}
                    </p>
                  )}

                  <div className={styles.cardRodape}>
                    <span>
                      {colecao.quantidade_produtos}{" "}
                      {Number(colecao.quantidade_produtos) === 1
                        ? "peça"
                        : "peças"}
                    </span>

                    <span>Ver coleção →</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Contador regressivo das próximas coleções (já existia no projeto) */}
        <ProximasColecoes />
      </div>

      <Footer/>
    </div>
  );
}
