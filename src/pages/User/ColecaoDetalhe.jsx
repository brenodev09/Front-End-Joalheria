// ============================================================================
//  DETALHE DE UMA COLEÇÃO — PÁGINA PÚBLICA (CLIENTE)
//  Caminho no seu projeto: src/pages/User/ColecaoDetalhe.jsx
//
//  Usa GET /colecoes/:id, que já existe no backend (e já incrementa
//  "visualizacoes" a cada abertura — métrica usada no admin).
// ============================================================================

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, BellRing } from "lucide-react";

import { api } from "../../services/api";
import { resolveImage } from "../../components/User/Catalogo/azoryUtils";
import { useAuth } from "../../context/authContext";

import Header from "../../components/Header";
import Footer from "../../components/Footer"
import ProductMosaic from "../../components/User/Catalogo/ProductMosaic";

import styles from "../../styles/User/colecoesPublicas.module.css";

export default function ColecaoDetalhe() {
  const { id } = useParams();
  const navegar = useNavigate();
  const { usuario, estaLogado } = useAuth();

  const [colecao, setColecao] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ok | erro | 404
  const [interessado, setInteressado] = useState(false);
  const [processandoInteresse, setProcessandoInteresse] = useState(false);

  useEffect(() => {
    async function carregar() {
      try {
        setStatus("loading");
        const { data } = await api.get(`/colecoes/${id}`);
        setColecao(data);
        setStatus("ok");
      } catch (error) {
        console.error("[ColecaoDetalhe] erro ao carregar:", error);
        setStatus(error?.response?.status === 404 ? "404" : "erro");
      }
    }

    carregar();
  }, [id]);

  useEffect(() => {
    if (!estaLogado || !usuario?.id || !id) return;

    api
      .get(`/colecoes/${id}/interessados/${usuario.id}`)
      .then(({ data }) => setInteressado(Boolean(data?.interessado)))
      .catch((error) =>
        console.error("[ColecaoDetalhe] erro ao verificar interesse:", error)
      );
  }, [estaLogado, usuario?.id, id]);

  async function alternarInteresse() {
    if (!estaLogado || !usuario?.id) {
      navegar("/login");
      return;
    }

    if (processandoInteresse) return;

    setProcessandoInteresse(true);

    try {
      if (interessado) {
        await api.delete(`/colecoes/${id}/interessados/${usuario.id}`);
        setInteressado(false);
      } else {
        await api.post(`/colecoes/${id}/interessados`, {
          usuario_id: usuario.id,
        });
        setInteressado(true);
      }
    } catch (error) {
      console.error("[ColecaoDetalhe] erro ao atualizar interesse:", error);
    } finally {
      setProcessandoInteresse(false);
    }
  }

  if (status === "loading") {
    return (
      <div className={styles.pagina}>
        <Header />
        <p className={styles.estado}>Carregando coleção...</p>
      </div>
    );
  }

  if (status === "404") {
    return (
      <div className={styles.pagina}>
        <Header />
        <p className={styles.estado}>Esta coleção não existe.</p>
      </div>
    );
  }

  if (status === "erro" || !colecao) {
    return (
      <div className={styles.pagina}>
        <Header />
        <p className={styles.estado}>
          Não foi possível carregar esta coleção agora.
        </p>
      </div>
    );
  }

  const produtosAtivos = (colecao.produtos || []).filter(
    (produto) => Number(produto.ativo) === 1
  );

  return (
    <div className={styles.pagina}>
      <Header />

      <section
        className={styles.hero}
        style={
          colecao.imagem
            ? {
                backgroundImage: `linear-gradient(180deg, rgba(10,10,11,0.35), var(--azory-bg) 90%), url(${resolveImage(
                  colecao.imagem
                )})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <button
          type="button"
          onClick={() => navegar("/colecoes")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            color: "var(--azory-text-muted)",
            cursor: "pointer",
            marginBottom: 24,
            fontFamily: "var(--azory-font-body)",
            fontSize: 13,
          }}
        >
          <ArrowLeft size={16} />
          Todas as coleções
        </button>

        <span className={styles.heroEyebrow}>
          {colecao.permanente ? "Linha permanente" : "Coleção"}
          {colecao.categoria ? ` · ${colecao.categoria}` : ""}
        </span>

        <h1 className={styles.heroTitulo}>{colecao.nome}</h1>

        {colecao.descricao && (
          <p className={styles.heroSubtitulo}>{colecao.descricao}</p>
        )}

        {Number(colecao.permitir_interessados) === 1 && (
          <button
            type="button"
            onClick={alternarInteresse}
            disabled={processandoInteresse}
            style={{
              marginTop: 20,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              borderRadius: 999,
              border: "1px solid var(--azory-gold-dim)",
              background: interessado
                ? "var(--azory-gold-soft-strong)"
                : "transparent",
              color: "var(--azory-gold-light)",
              fontFamily: "var(--azory-font-mono)",
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            {interessado ? <BellRing size={14} /> : <Bell size={14} />}
            {processandoInteresse
              ? "Aguarde..."
              : interessado
              ? "Você será avisado"
              : "Quero ser avisado sobre novidades"}
          </button>
        )}
      </section>

      <div className={styles.conteudo}>
        {produtosAtivos.length === 0 ? (
          <p className={styles.estado}>
            Ainda não há produtos publicados nesta coleção.
          </p>
        ) : (
          <ProductMosaic produtos={produtosAtivos} />
        )}
      </div>

      <Footer/>
    </div>
  );
}
