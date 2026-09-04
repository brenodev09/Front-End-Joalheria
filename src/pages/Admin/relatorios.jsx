import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import estilos from "../../styles/Admin/relatorios.module.css"


// ================================================================
// CONFIGURAÇÃO DE API
// Ajuste URL_BASE_API e a chave do token para o padrão do seu projeto.
// ================================================================

const URL_BASE_API =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
    "http://localhost:3333"

const CHAVE_TOKEN = "token"

function montarCabecalhos() {
    const token = localStorage.getItem(CHAVE_TOKEN)
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
}

async function apiJson(caminho) {
    const resposta = await fetch(`${URL_BASE_API}${caminho}`, {
        headers: montarCabecalhos()
    })

    const dados = await resposta.json().catch(() => ({}))

    if (!resposta.ok) {
        throw new Error(dados?.erro || "Não foi possível carregar os dados do relatório")
    }

    return dados
}

async function apiPost(caminho, corpo) {
    const resposta = await fetch(`${URL_BASE_API}${caminho}`, {
        method: "POST",
        headers: montarCabecalhos(),
        body: JSON.stringify(corpo)
    })

    const dados = await resposta.json().catch(() => ({}))

    if (!resposta.ok) {
        throw new Error(dados?.erro || "Não foi possível gerar o relatório")
    }

    return dados
}

async function baixarArquivoProtegido(caminho, nomeArquivo) {
    const resposta = await fetch(`${URL_BASE_API}${caminho}`, {
        headers: montarCabecalhos()
    })

    if (!resposta.ok) {
        throw new Error("Não foi possível baixar o arquivo do relatório")
    }

    const blob = await resposta.blob()
    const urlObjeto = window.URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = urlObjeto
    link.download = nomeArquivo
    document.body.appendChild(link)
    link.click()
    link.remove()

    window.URL.revokeObjectURL(urlObjeto)
}


// ================================
// FORMATADORES
// ================================

function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })
}

function formatarMoedaAbreviada(valor) {
    const numero = Number(valor || 0)
    if (numero >= 1000) {
        return `R$ ${(numero / 1000).toFixed(1).replace(".0", "")}k`
    }
    return formatarMoeda(numero)
}

function formatarNumero(valor) {
    return Number(valor || 0).toLocaleString("pt-BR")
}

function formatarDataCurta(data) {
    if (!data) return "-"
    const d = new Date(`${String(data).slice(0, 10)}T00:00:00`)
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
}

function formatarDataEntrada(data) {
    return new Date(data).toISOString().slice(0, 10)
}


// ================================
// TIPOS DE RELATÓRIO (espelha TIPOS_RELATORIO do backend)
// ================================

const TIPOS_RELATORIO = [
    { valor: "resumo-executivo", rotulo: "Resumo executivo" },
    { valor: "financeiro", rotulo: "Financeiro" },
    { valor: "vendas-periodo", rotulo: "Vendas por período" },
    { valor: "produtos-mais-vendidos", rotulo: "Produtos mais vendidos" },
    { valor: "categorias-mais-vendidas", rotulo: "Categorias mais vendidas" },
    { valor: "clientes-top", rotulo: "Clientes que mais compraram" },
    { valor: "estoque-baixo", rotulo: "Estoque baixo" },
    { valor: "produtos-sem-movimentacao", rotulo: "Produtos sem movimentação" },
    { valor: "evolucao-mensal", rotulo: "Evolução mensal" }
]

const PERIODOS_PRESET = [
    { id: "7", rotulo: "7 dias", dias: 7 },
    { id: "30", rotulo: "30 dias", dias: 30 },
    { id: "90", rotulo: "90 dias", dias: 90 },
    { id: "custom", rotulo: "Personalizado", dias: null }
]


// ================================
// COMPONENTE: BADGE DE VARIAÇÃO
// ================================

function BadgeVariacao({ valor }) {
    if (valor === null || valor === undefined || Number.isNaN(valor)) {
        return <span className={estilos.variacaoNeutra}>sem histórico</span>
    }

    if (valor === 0) {
        return <span className={estilos.variacaoNeutra}>estável</span>
    }

    const classe = valor > 0 ? estilos.variacaoPositiva : estilos.variacaoNegativa
    const seta = valor > 0 ? "▲" : "▼"

    return (
        <span className={classe}>
            {seta} {Math.abs(valor).toFixed(1)}%
        </span>
    )
}


// ================================
// COMPONENTE: CARTÃO DE INDICADOR (KPI)
// ================================

function CartaoIndicador({ rotulo, valor, variacao, nota, carregando }) {
    return (
        <div className={estilos.cartaoIndicador}>
            <p className={estilos.rotuloIndicador}>{rotulo}</p>

            {carregando ? (
                <div className={estilos.esqueletoLinha} style={{ width: "70%", height: 28 }} />
            ) : (
                <p className={estilos.valorIndicador}>{valor}</p>
            )}

            <div className={estilos.rodapeIndicador}>
                {carregando ? (
                    <div className={estilos.esqueletoLinha} style={{ width: "50%", height: 10, marginBottom: 0 }} />
                ) : variacao !== undefined ? (
                    <BadgeVariacao valor={variacao} />
                ) : (
                    <span className={estilos.notaIndicador}>{nota}</span>
                )}
            </div>
        </div>
    )
}


// ================================
// COMPONENTE: GRÁFICO DE EVOLUÇÃO (SVG PRÓPRIO, SEM DEPENDÊNCIAS)
// ================================

function GraficoEvolucao({ vendas, carregando }) {

    const larguraViewBox = 960
    const alturaViewBox = 300
    const margem = { topo: 18, direita: 16, base: 34, esquerda: 16 }

    const [indiceFoco, setIndiceFoco] = useState(null)
    const referenciaSvg = useRef(null)

    const pontos = useMemo(() => {
        if (!vendas || vendas.length === 0) return []

        const larguraUtil = larguraViewBox - margem.esquerda - margem.direita
        const alturaUtil = alturaViewBox - margem.topo - margem.base
        const maiorValor = Math.max(...vendas.map(v => v.faturamento), 1)

        return vendas.map((v, indice) => {
            const x = vendas.length === 1
                ? margem.esquerda + larguraUtil / 2
                : margem.esquerda + (indice / (vendas.length - 1)) * larguraUtil
            const y = margem.topo + alturaUtil - (v.faturamento / maiorValor) * alturaUtil

            return { ...v, x, y }
        })
    }, [vendas])

    const maiorValor = useMemo(
        () => Math.max(...(vendas || []).map(v => v.faturamento), 1),
        [vendas]
    )

    const caminhoLinha = useMemo(() => {
        if (pontos.length === 0) return ""
        return pontos.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ")
    }, [pontos])

    const caminhoArea = useMemo(() => {
        if (pontos.length === 0) return ""
        const base = alturaViewBox - margem.base
        const inicio = `M ${pontos[0].x.toFixed(1)} ${base}`
        const linha = pontos.map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ")
        const fim = `L ${pontos[pontos.length - 1].x.toFixed(1)} ${base} Z`
        return `${inicio} ${linha} ${fim}`
    }, [pontos])

    function aoMoverMouse(evento) {
        if (!referenciaSvg.current || pontos.length === 0) return

        const retangulo = referenciaSvg.current.getBoundingClientRect()
        const fracaoX = (evento.clientX - retangulo.left) / retangulo.width
        const posicaoAproximada = fracaoX * (pontos.length - 1)
        const indice = Math.min(pontos.length - 1, Math.max(0, Math.round(posicaoAproximada)))

        setIndiceFoco(indice)
    }

    if (carregando) {
        return <div className={estilos.esqueletoBloco} style={{ height: 300 }} />
    }

    if (!vendas || vendas.length === 0) {
        return <p className={estilos.estadoVazio}>Nenhuma venda registrada no período selecionado.</p>
    }

    const pontoFoco = indiceFoco !== null ? pontos[indiceFoco] : null

    return (
        <div className={estilos.areaGrafico}>
            <svg
                ref={referenciaSvg}
                className={estilos.svgGrafico}
                viewBox={`0 0 ${larguraViewBox} ${alturaViewBox}`}
                onMouseMove={aoMoverMouse}
                onMouseLeave={() => setIndiceFoco(null)}
            >
                <defs>
                    <linearGradient id="gradienteDourado" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#C9A227" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {[0, 0.5, 1].map(fracao => {
                    const y = margem.topo + (alturaViewBox - margem.topo - margem.base) * fracao
                    return (
                        <g key={fracao}>
                            <line
                                x1={margem.esquerda}
                                x2={larguraViewBox - margem.direita}
                                y1={y}
                                y2={y}
                                className={estilos.linhaGrade}
                            />
                            <text x={0} y={y - 4} className={estilos.rotuloEixo}>
                                {formatarMoedaAbreviada(maiorValor * (1 - fracao))}
                            </text>
                        </g>
                    )
                })}

                <path d={caminhoArea} className={estilos.preenchimentoArea} />
                <path d={caminhoLinha} className={estilos.tracoArea} />

                <text x={margem.esquerda} y={alturaViewBox - 8} className={estilos.rotuloEixo}>
                    {formatarDataCurta(vendas[0].data)}
                </text>
                <text x={larguraViewBox - margem.direita} y={alturaViewBox - 8} textAnchor="end" className={estilos.rotuloEixo}>
                    {formatarDataCurta(vendas[vendas.length - 1].data)}
                </text>

                {pontoFoco && (
                    <g>
                        <line
                            x1={pontoFoco.x}
                            x2={pontoFoco.x}
                            y1={margem.topo}
                            y2={alturaViewBox - margem.base}
                            className={estilos.linhaFoco}
                        />
                        <circle cx={pontoFoco.x} cy={pontoFoco.y} r={4} className={estilos.pontoFoco} />
                    </g>
                )}
            </svg>

            {pontoFoco && (
                <div
                    className={estilos.dicaFlutuante}
                    style={{
                        left: `${(pontoFoco.x / larguraViewBox) * 100}%`,
                        top: `${(pontoFoco.y / alturaViewBox) * 100}%`
                    }}
                >
                    <span>{formatarDataCurta(pontoFoco.data)}</span>
                    <strong>{formatarMoeda(pontoFoco.faturamento)}</strong>
                </div>
            )}
        </div>
    )
}


// ================================
// COMPONENTE: PAINEL DE RANKING
// ================================

function PainelRanking({ titulo, subtitulo, itens, carregando, renderizarLinha, chaveMaxima }) {

    const maiorValor = useMemo(() => {
        if (!itens || itens.length === 0) return 1
        return Math.max(...itens.map(item => Number(item[chaveMaxima]) || 0), 1)
    }, [itens, chaveMaxima])

    return (
        <div>
            <div className={estilos.painelCabecalho}>
                <div>
                    <h2>{titulo}</h2>
                    {subtitulo && <p className={estilos.painelSubtitulo}>{subtitulo}</p>}
                </div>
            </div>

            <div className={estilos.listaRanking}>
                {carregando &&
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} style={{ padding: "13px 0" }}>
                            <div className={estilos.esqueletoLinha} style={{ width: `${90 - i * 8}%` }} />
                        </div>
                    ))}

                {!carregando && (!itens || itens.length === 0) && (
                    <p className={estilos.estadoVazio}>Nenhum dado encontrado para este período.</p>
                )}

                {!carregando &&
                    itens?.map((item, indice) =>
                        renderizarLinha(item, indice, Math.max(6, (Number(item[chaveMaxima]) / maiorValor) * 100))
                    )}
            </div>
        </div>
    )
}


// ================================
// COMPONENTE: PAINEL DE ALERTA (ESTOQUE)
// ================================

function PainelAlerta({ titulo, total, itens, carregando, silencioso, renderizarLinha }) {
    return (
        <div>
            <div className={estilos.painelCabecalho}>
                <h2>{titulo}</h2>
                {!carregando && <span className={estilos.contadorAlerta}>{formatarNumero(total)}</span>}
            </div>

            <div className={estilos.listaAlerta}>
                {carregando &&
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} style={{ padding: "12px 0" }}>
                            <div className={estilos.esqueletoLinha} style={{ width: `${85 - i * 6}%` }} />
                        </div>
                    ))}

                {!carregando && (!itens || itens.length === 0) && (
                    <p className={estilos.estadoVazio}>
                        {silencioso ? "Todos os produtos tiveram movimentação no período." : "Nenhum produto abaixo do estoque mínimo."}
                    </p>
                )}

                {!carregando && itens?.map(renderizarLinha)}
            </div>
        </div>
    )
}


// ================================
// COMPONENTE PRINCIPAL
// ================================

export default function RelatoriosGerenciais() {

    const [periodoPreset, setPeriodoPreset] = useState("30")
    const [dataInicioCustom, setDataInicioCustom] = useState(() =>
        formatarDataEntrada(new Date(Date.now() - 29 * 86400000))
    )
    const [dataFimCustom, setDataFimCustom] = useState(() => formatarDataEntrada(new Date()))

    const { dataInicio, dataFim } = useMemo(() => {
        if (periodoPreset === "custom") {
            return { dataInicio: dataInicioCustom, dataFim: dataFimCustom }
        }

        const preset = PERIODOS_PRESET.find(p => p.id === periodoPreset)
        const fim = new Date()
        const inicio = new Date(Date.now() - (preset.dias - 1) * 86400000)

        return {
            dataInicio: formatarDataEntrada(inicio),
            dataFim: formatarDataEntrada(fim)
        }
    }, [periodoPreset, dataInicioCustom, dataFimCustom])

    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState(null)

    const [financeiro, setFinanceiro] = useState(null)
    const [vendasPeriodo, setVendasPeriodo] = useState([])
    const [produtosMaisVendidos, setProdutosMaisVendidos] = useState([])
    const [categoriasMaisVendidas, setCategoriasMaisVendidas] = useState([])
    const [clientesTop, setClientesTop] = useState([])
    const [estoqueBaixo, setEstoqueBaixo] = useState([])
    const [produtosParados, setProdutosParados] = useState([])

    const [tipoSelecionado, setTipoSelecionado] = useState("resumo-executivo")
    const [gerandoPdf, setGerandoPdf] = useState(null)
    const [retorno, setRetorno] = useState(null)

    const carregarDados = useCallback(async () => {
        setCarregando(true)
        setErro(null)

        const query = `data_inicio=${dataInicio}&data_fim=${dataFim}`

        try {
            const [
                resFinanceiro,
                resVendas,
                resProdutos,
                resCategorias,
                resClientes,
                resEstoqueBaixo,
                resParados
            ] = await Promise.all([
                apiJson(`/relatorios/financeiro?${query}`),
                apiJson(`/relatorios/vendas-periodo?${query}`),
                apiJson(`/relatorios/produtos-mais-vendidos?${query}&limite=100`),
                apiJson(`/relatorios/categorias-mais-vendidas?${query}&limite=8`),
                apiJson(`/relatorios/clientes-top?${query}&limite=100`),
                apiJson(`/relatorios/estoque-baixo`),
                apiJson(`/relatorios/produtos-sem-movimentacao?${query}`)
            ])

            setFinanceiro(resFinanceiro)
            setVendasPeriodo(resVendas.vendas || [])
            setProdutosMaisVendidos(resProdutos.produtos || [])
            setCategoriasMaisVendidas(resCategorias.categorias || [])
            setClientesTop(resClientes.clientes || [])
            setEstoqueBaixo(resEstoqueBaixo.produtos || [])
            setProdutosParados(resParados.produtos || [])

        } catch (erroCapturado) {
            setErro(erroCapturado.message || "Erro ao carregar os relatórios")
        } finally {
            setCarregando(false)
        }
    }, [dataInicio, dataFim])

    useEffect(() => {
        carregarDados()
    }, [carregarDados])

    async function gerarRelatorioPdf(tipo) {
        setGerandoPdf(tipo)
        setRetorno(null)

        try {
            const resultado = await apiPost("/relatorios/gerar-pdf", {
                tipo,
                data_inicio: dataInicio,
                data_fim: dataFim
            })

            await baixarArquivoProtegido(resultado.urlDownload, resultado.relatorio.arquivo_pdf)

            setRetorno({ tipo: "sucesso", texto: "Relatório gerado e baixado com sucesso." })

        } catch (erroCapturado) {
            setRetorno({ tipo: "erro", texto: erroCapturado.message || "Erro ao gerar o relatório em PDF." })
        } finally {
            setGerandoPdf(null)
        }
    }

    const totalProdutosVendidos = useMemo(
        () => produtosMaisVendidos.reduce((total, p) => total + Number(p.totalVendas || 0), 0),
        [produtosMaisVendidos]
    )

    const insights = useMemo(() => {
        if (!financeiro) return []

        const lista = []

        const variacaoFat = financeiro.variacao?.faturamento
        if (variacaoFat !== undefined) {
            lista.push(
                variacaoFat >= 0
                    ? <>O faturamento do período <strong>cresceu {Math.abs(variacaoFat).toFixed(1)}%</strong> em relação ao intervalo anterior.</>
                    : <>O faturamento do período <strong>recuou {Math.abs(variacaoFat).toFixed(1)}%</strong> em relação ao intervalo anterior.</>
            )
        }

        if (produtosMaisVendidos[0]) {
            lista.push(
                <>
                    <strong>{produtosMaisVendidos[0].nome}</strong> foi o produto mais vendido, com {formatarNumero(produtosMaisVendidos[0].totalVendas)} unidades e {formatarMoeda(produtosMaisVendidos[0].faturamento)} em faturamento.
                </>
            )
        }

        if (categoriasMaisVendidas[0]) {
            lista.push(
                <>
                    A categoria <strong>{categoriasMaisVendidas[0].categoria}</strong> liderou o faturamento por categoria, somando {formatarMoeda(categoriasMaisVendidas[0].faturamento)}.
                </>
            )
        }

        if (clientesTop[0]) {
            lista.push(
                <>
                    <strong>{clientesTop[0].nome}</strong> foi o cliente que mais investiu na joalheria neste período, com {formatarMoeda(clientesTop[0].totalGasto)} em compras.
                </>
            )
        }

        if (estoqueBaixo.length > 0) {
            lista.push(
                <><strong>{estoqueBaixo.length} {estoqueBaixo.length === 1 ? "produto está" : "produtos estão"}</strong> com estoque igual ou abaixo do mínimo recomendado.</>
            )
        }

        if (produtosParados.length > 0) {
            lista.push(
                <><strong>{produtosParados.length} {produtosParados.length === 1 ? "produto não teve" : "produtos não tiveram"}</strong> nenhuma venda registrada no período selecionado.</>
            )
        }

        return lista
    }, [financeiro, produtosMaisVendidos, categoriasMaisVendidas, clientesTop, estoqueBaixo, produtosParados])

    return (
        <div className={estilos.pagina}>

            <header className={`${estilos.cabecalho} ${estilos.secao}`}>
                <div className={estilos.cabecalhoTitulo}>
                    {/* <span className={estilos.marcaOrnamento} /> */}
                    <h1>Relatórios Gerenciais</h1>
                    <p>
                        Acompanhe o desempenho comercial da joalheria, identifique oportunidades de estoque
                        e exporte relatórios completos em PDF para sua gestão.
                    </p>
                </div>

                <div className={estilos.acoesCabecalho}>
                    <select
                        className={estilos.seletorTipo}
                        value={tipoSelecionado}
                        onChange={evento => setTipoSelecionado(evento.target.value)}
                    >
                        {TIPOS_RELATORIO.map(tipo => (
                            <option key={tipo.valor} value={tipo.valor}>{tipo.rotulo}</option>
                        ))}
                    </select>

                    <button
                        className={`btnPadrao`}
                        onClick={() => gerarRelatorioPdf(tipoSelecionado)}
                        disabled={gerandoPdf !== null}
                    >
                        {gerandoPdf === tipoSelecionado ? "Gerando..." : "Gerar relatório"}
                    </button>

                    <button
                        className={estilos.botaoPrimario}
                        onClick={() => gerarRelatorioPdf("resumo-executivo")}
                        disabled={gerandoPdf !== null}
                    >
                        {gerandoPdf === "resumo-executivo" ? "Exportando..." : "Exportar PDF"}
                    </button>
                </div>
            </header>

            {retorno && (
                <div className={`${estilos.mensagemRetorno} ${retorno.tipo === "sucesso" ? estilos.sucesso : estilos.erro}`}>
                    {retorno.texto}
                </div>
            )}

            {erro && (
                <div className={estilos.faixaErro}>
                    <span>{erro}</span>
                    <button className={estilos.linkRepetir} onClick={carregarDados}>Tentar novamente</button>
                </div>
            )}

            <div className={`${estilos.filtros} ${estilos.secao}`} style={{ "--atraso": "60ms" }}>
                <div className={estilos.grupoPeriodo}>
                    {PERIODOS_PRESET.map(preset => (
                        <button
                            key={preset.id}
                            className={periodoPreset === preset.id ? estilos.opcaoPeriodoAtiva : estilos.opcaoPeriodo}
                            onClick={() => setPeriodoPreset(preset.id)}
                        >
                            {preset.rotulo}
                        </button>
                    ))}
                </div>

                {periodoPreset === "custom" ? (
                    <div className={estilos.intervaloCustom}>
                        <input
                            type="date"
                            value={dataInicioCustom}
                            max={dataFimCustom}
                            onChange={evento => setDataInicioCustom(evento.target.value)}
                        />
                        <span>até</span>
                        <input
                            type="date"
                            value={dataFimCustom}
                            min={dataInicioCustom}
                            max={formatarDataEntrada(new Date())}
                            onChange={evento => setDataFimCustom(evento.target.value)}
                        />
                    </div>
                ) : (
                    <p className={estilos.rotuloPeriodo}>
                        Exibindo <strong>{formatarDataCurta(dataInicio)} — {formatarDataCurta(dataFim)}</strong>
                    </p>
                )}
            </div>

            <div className={`${estilos.gradeIndicadores} ${estilos.secao}`} style={{ "--atraso": "100ms" }}>
                <CartaoIndicador
                    rotulo="Faturamento"
                    valor={financeiro && formatarMoeda(financeiro.atual.faturamento)}
                    variacao={financeiro?.variacao.faturamento}
                    carregando={carregando}
                />
                <CartaoIndicador
                    rotulo="Pedidos entregues"
                    valor={financeiro && formatarNumero(financeiro.atual.quantidadePedidos)}
                    variacao={financeiro?.variacao.quantidadePedidos}
                    carregando={carregando}
                />
                <CartaoIndicador
                    rotulo="Ticket médio"
                    valor={financeiro && formatarMoeda(financeiro.atual.ticketMedio)}
                    variacao={financeiro?.variacao.ticketMedio}
                    carregando={carregando}
                />
                <CartaoIndicador
                    rotulo="Clientes atendidos"
                    valor={formatarNumero(clientesTop.length)}
                    nota="no período"
                    carregando={carregando}
                />
                <CartaoIndicador
                    rotulo="Produtos vendidos"
                    valor={formatarNumero(totalProdutosVendidos)}
                    nota="unidades no período"
                    carregando={carregando}
                />
            </div>

            <section className={`${estilos.painel} ${estilos.secao}`} style={{ "--atraso": "140ms" }}>
                <div className={estilos.painelCabecalho}>
                    <div>
                        <h2>Evolução do faturamento</h2>
                        <p className={estilos.painelSubtitulo}>Faturamento diário de pedidos entregues no período selecionado</p>
                    </div>
                </div>
                <GraficoEvolucao vendas={vendasPeriodo} carregando={carregando} />
            </section>

            <section className={`${estilos.gradeRankings} ${estilos.secao}`} style={{ "--atraso": "180ms" }}>

                <PainelRanking
                    titulo="Produtos mais vendidos"
                    subtitulo="Por quantidade vendida"
                    itens={produtosMaisVendidos.slice(0, 6)}
                    carregando={carregando}
                    chaveMaxima="faturamento"
                    renderizarLinha={(produto, indice, percentual) => (
                        <div className={estilos.linhaRanking} key={produto.id}>
                            <span className={estilos.posicaoRanking}>{String(indice + 1).padStart(2, "0")}</span>
                            <div className={estilos.infoRanking}>
                                <p className={estilos.nomeRanking}>{produto.nome}</p>
                                <div className={estilos.legendaRanking}>
                                    <span>{formatarNumero(produto.totalVendas)} un.</span>
                                    <span className={estilos.barraRanking}>
                                        <span
                                            className={estilos.barraRankingPreenchimento}
                                            style={{ transform: `scaleX(${percentual / 100})` }}
                                        />
                                    </span>
                                </div>
                            </div>
                            <span className={estilos.valorRanking}>{formatarMoeda(produto.faturamento)}</span>
                        </div>
                    )}
                />

                <PainelRanking
                    titulo="Categorias mais vendidas"
                    subtitulo="Por faturamento"
                    itens={categoriasMaisVendidas.slice(0, 6)}
                    carregando={carregando}
                    chaveMaxima="faturamento"
                    renderizarLinha={(categoria, indice, percentual) => (
                        <div className={estilos.linhaRanking} key={categoria.id}>
                            <span className={estilos.posicaoRanking}>{String(indice + 1).padStart(2, "0")}</span>
                            <div className={estilos.infoRanking}>
                                <p className={estilos.nomeRanking}>{categoria.categoria}</p>
                                <div className={estilos.legendaRanking}>
                                    <span>{formatarNumero(categoria.produtosVendidos)} un.</span>
                                    <span className={estilos.barraRanking}>
                                        <span
                                            className={estilos.barraRankingPreenchimento}
                                            style={{ transform: `scaleX(${percentual / 100})` }}
                                        />
                                    </span>
                                </div>
                            </div>
                            <span className={estilos.valorRanking}>{formatarMoeda(categoria.faturamento)}</span>
                        </div>
                    )}
                />

                <PainelRanking
                    titulo="Clientes que mais compraram"
                    subtitulo="Por valor total gasto"
                    itens={clientesTop.slice(0, 6)}
                    carregando={carregando}
                    chaveMaxima="totalGasto"
                    renderizarLinha={(cliente, indice, percentual) => (
                        <div className={estilos.linhaRanking} key={cliente.id}>
                            <span className={estilos.posicaoRanking}>{String(indice + 1).padStart(2, "0")}</span>
                            <div className={estilos.infoRanking}>
                                <p className={estilos.nomeRanking}>{cliente.nome}</p>
                                <div className={estilos.legendaRanking}>
                                    <span>{formatarNumero(cliente.quantidadePedidos)} pedidos</span>
                                    <span className={estilos.barraRanking}>
                                        <span
                                            className={estilos.barraRankingPreenchimento}
                                            style={{ transform: `scaleX(${percentual / 100})` }}
                                        />
                                    </span>
                                </div>
                            </div>
                            <span className={estilos.valorRanking}>{formatarMoeda(cliente.totalGasto)}</span>
                        </div>
                    )}
                />
            </section>

            <section className={`${estilos.gradeAlertas} ${estilos.secao}`} style={{ "--atraso": "220ms" }}>

                <div className={estilos.painel}>
                    <PainelAlerta
                        titulo="Estoque baixo"
                        total={estoqueBaixo.length}
                        itens={estoqueBaixo.slice(0, 6)}
                        carregando={carregando}
                        renderizarLinha={produto => (
                            <div className={estilos.linhaAlerta} key={produto.id}>
                                <div className={estilos.infoAlerta}>
                                    <p className={estilos.nomeAlerta}>{produto.nome}</p>
                                    <p className={estilos.legendaAlerta}>{produto.categoria || "Sem categoria"}</p>
                                </div>
                                <span className={estilos.metricaAlerta}>
                                    {produto.estoque} / {produto.estoque_minimo} un.
                                </span>
                            </div>
                        )}
                    />
                </div>

                <div className={estilos.painel}>
                    <PainelAlerta
                        titulo="Sem movimentação"
                        total={produtosParados.length}
                        itens={produtosParados.slice(0, 6)}
                        carregando={carregando}
                        silencioso
                        renderizarLinha={produto => (
                            <div className={`${estilos.linhaAlerta} ${estilos.silenciosa}`} key={produto.id}>
                                <div className={estilos.infoAlerta}>
                                    <p className={estilos.nomeAlerta}>{produto.nome}</p>
                                    <p className={estilos.legendaAlerta}>{produto.categoria || "Sem categoria"}</p>
                                </div>
                                <span className={`${estilos.metricaAlerta} ${estilos.silenciosa}`}>
                                    {formatarMoeda(produto.preco)}
                                </span>
                            </div>
                        )}
                    />
                </div>
            </section>

            <section className={`${estilos.painelInsights} ${estilos.secao}`} style={{ "--atraso": "260ms" }}>
                <div className={estilos.painelCabecalho}>
                    <h2>Resumo automático</h2>
                </div>

                {carregando ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className={estilos.esqueletoLinha} style={{ width: `${88 - i * 10}%` }} />
                        ))}
                    </div>
                ) : insights.length === 0 ? (
                    <p className={estilos.estadoVazio}>Ainda não há dados suficientes para gerar insights neste período.</p>
                ) : (
                    <ul className={estilos.listaInsights} style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {insights.map((insight, indice) => (
                            <li className={estilos.itemInsight} key={indice}>{insight}</li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    )
}