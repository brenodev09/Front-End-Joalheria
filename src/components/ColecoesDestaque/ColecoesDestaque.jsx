import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { buscarColecoesDestaque } from "./colecoesApi";
import styles from "./ColecoesDestaque.module.css";

const DURACAO_SLIDE_MS = 7000;
const LIMIAR_SWIPE_PX = 50;

// ============================================================
// Hook: contagem regressiva para coleções agendadas.
// Recalcula a cada segundo até a data de início zerar.
// ============================================================

/**
 * O backend pode devolver data_inicio como "YYYY-MM-DD" ou como
 * ISO completo ("YYYY-MM-DDTHH:mm:ss.000Z", comum quando a coluna
 * é DATE/DATETIME e o driver já serializa em UTC). Concatenar
 * "T00:00:00" direto num ISO que já tem "T" gera uma string
 * inválida e o Date vira NaN — por isso extraímos só a parte da
 * data antes de montar o alvo da contagem.
 */
function normalizarDataAlvo(dataInicio) {
    if (!dataInicio) return null;

    const somenteData = String(dataInicio).split("T")[0];
    const data = new Date(`${somenteData}T00:00:00`);

    return Number.isNaN(data.getTime()) ? null : data;
}

function calcularTempoRestante(dataInicio) {
    const alvo = normalizarDataAlvo(dataInicio);
    if (!alvo) return null;

    const diferenca = Math.max(0, alvo.getTime() - Date.now());

    return {
        dias: Math.floor(diferenca / 86400000),
        horas: Math.floor((diferenca % 86400000) / 3600000),
        minutos: Math.floor((diferenca % 3600000) / 60000),
        segundos: Math.floor((diferenca % 60000) / 1000),
        encerrado: diferenca <= 0
    };
}

/**
 * Formata a data alvo por extenso em pt-BR (ex: "5 de setembro de 2026")
 * para exibir junto ao contador, além dos números regressivos.
 */
function formatarDataLancamento(dataInicio) {
    const alvo = normalizarDataAlvo(dataInicio);
    if (!alvo) return null;

    return new Intl.DateTimeFormat("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(alvo);
}

function useContagemRegressiva(dataInicio) {
    const [tempo, setTempo] = useState(() => calcularTempoRestante(dataInicio));

    useEffect(() => {
        if (!dataInicio) return undefined;

        setTempo(calcularTempoRestante(dataInicio));
        const id = setInterval(() => {
            setTempo(calcularTempoRestante(dataInicio));
        }, 1000);

        return () => clearInterval(id);
    }, [dataInicio]);

    return tempo;
}

function ContadorLancamento({ dataInicio }) {
    const tempo = useContagemRegressiva(dataInicio);
    const dataFormatada = formatarDataLancamento(dataInicio);

    if (!tempo || tempo.encerrado) return null;

    const unidades = [
        { valor: tempo.dias, rotulo: "dias" },
        { valor: tempo.horas, rotulo: "hrs" },
        { valor: tempo.minutos, rotulo: "min" },
        { valor: tempo.segundos, rotulo: "seg" }
    ];

    return (
        <div className={styles.blocoContador}>
            <div className={styles.contador} aria-label="Tempo até o lançamento">
                {unidades.map((unidade) => (
                    <div className={styles.contadorUnidade} key={unidade.rotulo}>
                        <span className={styles.contadorValor}>
                            {String(unidade.valor).padStart(2, "0")}
                        </span>
                        <span className={styles.contadorRotulo}>{unidade.rotulo}</span>
                    </div>
                ))}
            </div>
            {dataFormatada && (
                <span className={styles.dataLancamento}>
                    Lançamento em {dataFormatada}
                </span>
            )}
        </div>
    );
}

// ============================================================
// Componente principal
// ============================================================
export default function ColecoesDestaque() {
    const [colecoes, setColecoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    const [indiceAtual, setIndiceAtual] = useState(0);
    const [progresso, setProgresso] = useState(0);
    const [pausado, setPausado] = useState(false);
    const [secaoVisivel, setSecaoVisivel] = useState(true);
    const [reduzirMovimento, setReduzirMovimento] = useState(false);

    const secaoRef = useRef(null);
    const toqueInicioX = useRef(null);

    // Refs que sustentam o loop de autoplay via requestAnimationFrame.
    // Ficam fora do useEffect de propósito: o loop não deve reiniciar
    // a cada troca de slide, só quando pausa/retoma/visibilidade mudam.
    const tempoAcumuladoRef = useRef(0); // ms já decorridos no slide atual
    const ultimoTimestampRef = useRef(null); // timestamp do último frame
    const quadroAnimacaoRef = useRef(null);

    // --------------------------------------------------------
    // Busca as coleções na API ao montar o componente.
    // --------------------------------------------------------
    useEffect(() => {
        let ativo = true;

        async function carregar() {
            try {
                setCarregando(true);
                const dados = await buscarColecoesDestaque();
                if (ativo) {
                    setColecoes(dados);
                    setErro(null);
                }
            } catch (erroCapturado) {
                if (ativo) {
                    setErro(erroCapturado);
                }
            } finally {
                if (ativo) setCarregando(false);
            }
        }

        carregar();
        return () => {
            ativo = false;
        };
    }, []);

    // --------------------------------------------------------
    // Respeita a preferência de movimento reduzido do usuário.
    // --------------------------------------------------------
    useEffect(() => {
        const consulta = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReduzirMovimento(consulta.matches);

        const ouvinte = (evento) => setReduzirMovimento(evento.matches);
        consulta.addEventListener("change", ouvinte);
        return () => consulta.removeEventListener("change", ouvinte);
    }, []);

    // --------------------------------------------------------
    // Pausa o autoplay quando a seção sai da viewport ou a aba
    // fica em segundo plano — economiza processamento.
    // --------------------------------------------------------
    useEffect(() => {
        const elemento = secaoRef.current;
        if (!elemento) return undefined;

        const observador = new IntersectionObserver(
            ([entrada]) => setSecaoVisivel(entrada.isIntersecting),
            { threshold: 0.3 }
        );
        observador.observe(elemento);

        const aoMudarVisibilidade = () => {
            setSecaoVisivel(!document.hidden);
        };
        document.addEventListener("visibilitychange", aoMudarVisibilidade);

        return () => {
            observador.disconnect();
            document.removeEventListener("visibilitychange", aoMudarVisibilidade);
        };
    }, []);

    const totalSlides = colecoes.length;

    const irParaSlide = useCallback(
        (novoIndice) => {
            if (totalSlides === 0) return;
            const indiceCircular = (novoIndice + totalSlides) % totalSlides;
            tempoAcumuladoRef.current = 0;
            ultimoTimestampRef.current = null;
            setProgresso(0);
            setIndiceAtual(indiceCircular);
        },
        [totalSlides]
    );

    const proximoSlide = useCallback(
        () => irParaSlide(indiceAtual + 1),
        [indiceAtual, irParaSlide]
    );

    const slideAnterior = useCallback(
        () => irParaSlide(indiceAtual - 1),
        [indiceAtual, irParaSlide]
    );

    // --------------------------------------------------------
    // Autoplay controlado por barra de progresso.
    //
    // Importante: este efeito NÃO depende de `indiceAtual`. Antes,
    // o loop usava setInterval e recriava o timer a cada troca de
    // slide (porque `indiceAtual` estava nas dependências) — isso
    // fazia o progresso avançar em passos fixos por tick, o que
    // desalinha com o tempo real sempre que o navegador engasga
    // (aba em segundo plano, imagem pesada carregando, etc.), e
    // podia deixar a barra parada até o próximo re-render disparar
    // o efeito de novo.
    //
    // Agora é um único loop de requestAnimationFrame que só é
    // recriado quando pausa, visibilidade ou total de slides mudam.
    // Ele mede o tempo real decorrido a cada frame (delta), então
    // se um frame atrasar, o próximo simplesmente compensa a
    // diferença — sem "engasgo" visível e sem depender de o React
    // re-executar o efeito para continuar rodando.
    // --------------------------------------------------------
    useEffect(() => {
        if (totalSlides <= 1) return undefined;

        if (pausado || !secaoVisivel) {
            // Ao pausar, zera a referência de timestamp — na retomada,
            // o primeiro frame vira o novo "ponto zero" do delta, sem
            // saltar o tempo que ficou pausado.
            ultimoTimestampRef.current = null;
            return undefined;
        }

        function avancar(agora) {
            if (ultimoTimestampRef.current === null) {
                ultimoTimestampRef.current = agora;
            }

            const delta = agora - ultimoTimestampRef.current;
            ultimoTimestampRef.current = agora;
            tempoAcumuladoRef.current += delta;

            let percentual = (tempoAcumuladoRef.current / DURACAO_SLIDE_MS) * 100;

            if (percentual >= 100) {
                tempoAcumuladoRef.current = 0;
                percentual = 0;
                setIndiceAtual((atual) => (atual + 1) % totalSlides);
            }

            setProgresso(percentual);
            quadroAnimacaoRef.current = requestAnimationFrame(avancar);
        }

        quadroAnimacaoRef.current = requestAnimationFrame(avancar);

        return () => {
            if (quadroAnimacaoRef.current !== null) {
                cancelAnimationFrame(quadroAnimacaoRef.current);
            }
        };
    }, [pausado, secaoVisivel, totalSlides]);

    // --------------------------------------------------------
    // Navegação por teclado (setas) quando o mouse está sobre a seção.
    // --------------------------------------------------------
    useEffect(() => {
        function aoTeclar(evento) {
            if (evento.key === "ArrowRight") proximoSlide();
            if (evento.key === "ArrowLeft") slideAnterior();
        }

        const elemento = secaoRef.current;
        if (!elemento) return undefined;

        elemento.addEventListener("keydown", aoTeclar);
        return () => elemento.removeEventListener("keydown", aoTeclar);
    }, [proximoSlide, slideAnterior]);

    // --------------------------------------------------------
    // Swipe para mobile.
    // --------------------------------------------------------
    const aoTocarInicio = (evento) => {
        toqueInicioX.current = evento.touches[0].clientX;
    };

    const aoTocarFim = (evento) => {
        if (toqueInicioX.current === null) return;
        const deltaX = evento.changedTouches[0].clientX - toqueInicioX.current;

        if (Math.abs(deltaX) > LIMIAR_SWIPE_PX) {
            if (deltaX < 0) proximoSlide();
            else slideAnterior();
        }
        toqueInicioX.current = null;
    };

    const colecaoAtual = colecoes[indiceAtual];

    const rotuloAria = useMemo(() => {
        if (!colecaoAtual) return "";
        return `Slide ${indiceAtual + 1} de ${totalSlides}: coleção ${colecaoAtual.nome}`;
    }, [colecaoAtual, indiceAtual, totalSlides]);

    // --------------------------------------------------------
    // Estados de carregamento / erro / vazio.
    // Se não houver coleções ativas ou agendadas com imagem de
    // capa, a seção simplesmente não é renderizada.
    // --------------------------------------------------------
    if (!carregando && (erro || totalSlides === 0)) {
        return null;
    }

    return (
        <section
            ref={secaoRef}
            className={styles.heroSection}
            aria-roledescription="carrossel"
            aria-label="Coleções em destaque"
            tabIndex={-1}
            onMouseEnter={() => setPausado(true)}
            onMouseLeave={() => setPausado(false)}
            onFocus={() => setPausado(true)}
            onBlur={() => setPausado(false)}
            onTouchStart={aoTocarInicio}
            onTouchEnd={aoTocarFim}
        >
            {carregando ? (
                <div className={styles.skeleton} aria-hidden="true" />
            ) : (
                <>
                    {colecoes.map((colecao, indice) => {
                        const estaAtivo = indice === indiceAtual;
                        return (
                            <div
                                key={colecao.id}
                                className={[
                                    styles.slide,
                                    estaAtivo ? styles.slideAtivo : ""
                                ].join(" ")}
                                aria-hidden={!estaAtivo}
                            >
                                <div
                                    className={[
                                        styles.fundoImagem,
                                        estaAtivo && !reduzirMovimento
                                            ? styles.efeitoZoom
                                            : ""
                                    ].join(" ")}
                                    style={{
                                        backgroundImage: `url(${colecao.imagemUrl})`
                                    }}
                                />
                                <div className={styles.overlay} />

                                {estaAtivo && (
                                    <div className={styles.conteudo} key={colecao.id}>
                                        {colecao.status === "agendada" && (
                                            <span className={styles.selo}>Em Breve</span>
                                        )}

                                        <h2 className={styles.titulo}>{colecao.nome}</h2>

                                        {colecao.descricao && (
                                            <p className={styles.descricao}>
                                                {colecao.descricao}
                                            </p>
                                        )}

                                        {colecao.status === "agendada" && (
                                            <ContadorLancamento
                                                dataInicio={colecao.dataInicio}
                                            />
                                        )}

                                        <a
                                            href={`/colecoes/${colecao.id}`}
                                            className={styles.botao}
                                        >
                                            <span>Explorar Coleção</span>
                                            <svg
                                                className={styles.botaoIcone}
                                                width="16"
                                                height="16"
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5"
                                                    stroke="currentColor"
                                                    strokeWidth="1.4"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </a>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Região viva para leitores de tela anunciarem a troca de slide */}
                    <p className={styles.somenteLeitor} aria-live="polite">
                        {rotuloAria}
                    </p>

                    {totalSlides > 1 && (
                        <>
                            <button
                                type="button"
                                className={[styles.seta, styles.setaEsquerda].join(" ")}
                                onClick={slideAnterior}
                                aria-label="Coleção anterior"
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                                    <path
                                        d="M12.5 4L6.5 10L12.5 16"
                                        stroke="currentColor"
                                        strokeWidth="1.4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                            <button
                                type="button"
                                className={[styles.seta, styles.setaDireita].join(" ")}
                                onClick={proximoSlide}
                                aria-label="Próxima coleção"
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                                    <path
                                        d="M7.5 4L13.5 10L7.5 16"
                                        stroke="currentColor"
                                        strokeWidth="1.4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>

                            <div
                                className={styles.indicadores}
                                role="tablist"
                                aria-label="Selecionar coleção"
                            >
                                {colecoes.map((colecao, indice) => (
                                    <button
                                        key={colecao.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={indice === indiceAtual}
                                        aria-label={`Ir para coleção ${colecao.nome}`}
                                        className={styles.indicador}
                                        onClick={() => irParaSlide(indice)}
                                    >
                                        <span
                                            className={styles.indicadorPreenchimento}
                                            style={{
                                                width:
                                                    indice === indiceAtual
                                                        ? `${progresso}%`
                                                        : indice < indiceAtual
                                                        ? "100%"
                                                        : "0%"
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {/* <div className={styles.scrollDica} aria-hidden="true">
                        <span className={styles.scrollLinha} />
                        <span className={styles.scrollTexto}>Role para descobrir</span>
                    </div> */}
                </>
            )}
        </section>
    );
}