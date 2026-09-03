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
const INTERVALO_PROGRESSO_MS = 50;
const LIMIAR_SWIPE_PX = 50;

// ============================================================
// Hook: contagem regressiva para coleções agendadas.
// Recalcula a cada segundo até a data de início zerar.
// ============================================================
function calcularTempoRestante(dataInicio) {
    if (!dataInicio) return null;

    const alvo = new Date(`${dataInicio}T00:00:00`).getTime();
    const diferenca = Math.max(0, alvo - Date.now());

    return {
        dias: Math.floor(diferenca / 86400000),
        horas: Math.floor((diferenca % 86400000) / 3600000),
        minutos: Math.floor((diferenca % 3600000) / 60000),
        segundos: Math.floor((diferenca % 60000) / 1000),
        encerrado: diferenca <= 0
    };
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

    if (!tempo || tempo.encerrado) return null;

    const unidades = [
        { valor: tempo.dias, rotulo: "dias" },
        { valor: tempo.horas, rotulo: "hrs" },
        { valor: tempo.minutos, rotulo: "min" },
        { valor: tempo.segundos, rotulo: "seg" }
    ];

    return (
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
    const progressoRef = useRef(0);
    const toqueInicioX = useRef(null);

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
            setIndiceAtual(indiceCircular);
            progressoRef.current = 0;
            setProgresso(0);
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
    // Autoplay controlado por barra de progresso (permite pausar
    // sem perder o ponto exato em que o slide estava).
    // --------------------------------------------------------
    useEffect(() => {
        if (totalSlides <= 1) return undefined;
        if (pausado || !secaoVisivel) return undefined;

        const passo = (INTERVALO_PROGRESSO_MS / DURACAO_SLIDE_MS) * 100;

        const id = setInterval(() => {
            progressoRef.current += passo;

            if (progressoRef.current >= 100) {
                progressoRef.current = 0;
                setProgresso(0);
                setIndiceAtual((atual) => (atual + 1) % totalSlides);
            } else {
                setProgresso(progressoRef.current);
            }
        }, INTERVALO_PROGRESSO_MS);

        return () => clearInterval(id);
    }, [pausado, secaoVisivel, totalSlides, indiceAtual]);

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

                    <div className={styles.scrollDica} aria-hidden="true">
                        <span className={styles.scrollLinha} />
                        <span className={styles.scrollTexto}>Role para descobrir</span>
                    </div>
                </>
            )}
        </section>
    );
}