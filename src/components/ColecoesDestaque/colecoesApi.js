// ============================================================
// colecoesApi.js
// ------------------------------------------------------------
// Integração com a API já existente do backend (colecoes_routes.js).
// Usa os dois endpoints públicos:
//   GET /colecoes/publicas/ativas   -> coleções ativas/permanentes
//   GET /colecoes/publicas/proximas -> coleções agendadas (contador)
//
// AJUSTE NECESSÁRIO:
// Troque API_BASE_URL pela forma como seu projeto já resolve a URL
// da API (ex: uma constante em src/config, uma variável de ambiente
// do CRA `process.env.REACT_APP_API_URL`, etc). Deixei suporte a
// Vite (import.meta.env.VITE_API_URL) com fallback para localhost.
// ============================================================

const API_BASE_URL =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
    "http://localhost:3001";

const MAX_SLIDES = 6;

/**
 * Monta a URL completa da imagem de capa.
 * O backend salva o caminho relativo (ex: "/uploads/arquivo.jpg").
 */
export function montarUrlImagem(caminho) {
    if (!caminho) return null;
    if (/^https?:\/\//i.test(caminho)) return caminho;
    return `${API_BASE_URL}${caminho.startsWith("/") ? "" : "/"}${caminho}`;
}

async function buscarJson(endpoint) {
    const resposta = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: { Accept: "application/json" }
    });

    if (!resposta.ok) {
        throw new Error(
            `Falha ao buscar ${endpoint} (status ${resposta.status})`
        );
    }

    return resposta.json();
}

/**
 * Busca e combina as coleções que devem aparecer no hero de destaque:
 * - Ativas/permanentes primeiro (priorizando as marcadas como "destaque")
 * - Depois as agendadas (ordenadas pela data de lançamento mais próxima)
 * Só entram coleções com imagem de capa definida (obrigatória no hero
 * fullscreen) e o total é limitado a MAX_SLIDES para manter o carrossel
 * enxuto e performático.
 */
export async function buscarColecoesDestaque() {
    const [ativas, proximas] = await Promise.all([
        buscarJson("/colecoes/publicas/ativas"),
        buscarJson("/colecoes/publicas/proximas")
    ]);

    const destaquesAtivas = ativas
        .filter((c) => c.status === "ativa" || c.status === "permanente")
        .sort((a, b) => Number(b.destaque) - Number(a.destaque));

    const destaquesProximas = proximas
        .filter((c) => c.status === "agendada")
        .sort((a, b) => new Date(a.data_inicio) - new Date(b.data_inicio));

    const combinadas = [...destaquesAtivas, ...destaquesProximas]
        .filter((colecao) => Boolean(colecao.imagem))
        .slice(0, MAX_SLIDES)
        .map((colecao) => ({
            id: colecao.id,
            nome: colecao.nome,
            descricao: colecao.descricao,
            imagemUrl: montarUrlImagem(colecao.imagem),
            status: colecao.status,
            dataInicio: colecao.data_inicio,
            diasParaLancamento: colecao.dias_para_lancamento
        }));

    return combinadas;
}