import { useState, useRef, useMemo, useEffect } from 'react';
import styles from './styles.module.css';



/* ----------------------------------------------------------------------- */
/* CONFIGURAÇÃO DA API                                                     */
/* ----------------------------------------------------------------------- */

const API_URL = 'http://localhost:3000';


/* ----------------------------------------------------------------------- */
/* FILTROS                                                                  */
/* ----------------------------------------------------------------------- */

const CATEGORIAS_FILTRO = [
  'Todas',
  'Anéis',
  'Colares',
  'Brincos',
  'Pulseiras'
];

const STATUS_FILTRO = [
  'Todos',
  'Ativo',
  'Rascunho',
  'Esgotado'
];


/* ----------------------------------------------------------------------- */
/* ETAPAS                                                                   */
/* ----------------------------------------------------------------------- */

const ETAPAS = [
  {
    numero: 1,
    titulo: 'Informações'
  },
  {
    numero: 2,
    titulo: 'Identidade visual'
  },
  {
    numero: 3,
    titulo: 'Produtos'
  },
  {
    numero: 4,
    titulo: 'Revisão'
  }
];


/* ----------------------------------------------------------------------- */
/* ESTADO INICIAL                                                           */
/* ----------------------------------------------------------------------- */

const ESTADO_INICIAL = {
  nome: '',
  descricao: '',
  status: 'Rascunho',
  permanente: false,
  dataInicio: '',
  dataFim: '',
  categoria: '',
  metaReceita: '',
  destaque: false
};


/* ----------------------------------------------------------------------- */
/* FUNÇÕES AUXILIARES                                                       */
/* ----------------------------------------------------------------------- */

function formatarPreco(valor) {

  return Number(valor || 0).toLocaleString(
    'pt-BR',
    {
      style: 'currency',
      currency: 'BRL'
    }
  );

}


function formatarData(data) {

  if (!data) {
    return '—';
  }

  const [ano, mes, dia] = data.split('-');

  if (!ano || !mes || !dia) {
    return data;
  }

  return `${dia}/${mes}/${ano}`;

}


/* ----------------------------------------------------------------------- */
/* ÍCONES                                                                   */
/* ----------------------------------------------------------------------- */

const IconeFechar = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
  >
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);


const IconeCheck = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 13l4 4L19 7" />
  </svg>
);


const IconeImagem = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2"
    />

    <circle
      cx="8.5"
      cy="8.5"
      r="1.5"
    />

    <path d="M21 15l-5-5L5 21" />
  </svg>
);


const IconeBusca = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
  >
    <circle
      cx="11"
      cy="11"
      r="7"
    />

    <path d="M21 21l-4.3-4.3" />
  </svg>
);


const IconeLixeira = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13" />
  </svg>
);


const IconeSucesso = () => (
  <svg
    width="34"
    height="34"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 13l4 4L19 7" />
  </svg>
);


const IconeJoia = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 3h12l3 5-9 13L3 8l3-5Z" />
    <path d="M3 8h18M9 3l3 5 3-5M12 8l-2 5 2 8 2-8-2-5" />
  </svg>
);


/* ----------------------------------------------------------------------- */
/* COMPONENTE PRINCIPAL                                                    */
/* ----------------------------------------------------------------------- */

export default function ModalAdicionarColecao({
  aberto = true,
  onFechar,
  onSalvar
}) {

  /* --------------------------------------------------------------------- */
  /* ESTADOS                                                               */
  /* --------------------------------------------------------------------- */

  const [etapaAtual, setEtapaAtual] = useState(1);

  const [dados, setDados] =
    useState(ESTADO_INICIAL);

  const [imagem, setImagem] =
    useState(null);

  const [arrastando, setArrastando] =
    useState(false);

  const [busca, setBusca] =
    useState('');

  const [filtroCategoria, setFiltroCategoria] =
    useState('Todas');

  const [filtroStatus, setFiltroStatus] =
    useState('Todos');

  const [produtos, setProdutos] =
    useState([]);

  const [produtosSelecionados, setProdutosSelecionados] =
    useState([]);

  const [mostrarTodosSelecionados, setMostrarTodosSelecionados] =
    useState(false);

  const [carregando, setCarregando] =
    useState(false);

  const [carregandoProdutos, setCarregandoProdutos] =
    useState(false);

  const [erro, setErro] =
    useState('');

  const [sucesso, setSucesso] =
    useState(false);


  const inputArquivoRef =
    useRef(null);


  /* --------------------------------------------------------------------- */
  /* BUSCAR PRODUTOS                                                        */
  /* --------------------------------------------------------------------- */

  useEffect(() => {

    if (!aberto) {
      return;
    }

    async function carregarProdutos() {

      try {

        setCarregandoProdutos(true);
        setErro('');

        const resposta = await fetch(
          `${API_URL}/produtos`
        );

        if (!resposta.ok) {
          throw new Error(
            'Não foi possível carregar os produtos.'
          );
        }

        const dadosProdutos =
          await resposta.json();

        setProdutos(
          Array.isArray(dadosProdutos)
            ? dadosProdutos
            : dadosProdutos.produtos || []
        );

      } catch (error) {

        console.error(
          'ERRO AO BUSCAR PRODUTOS:',
          error
        );

        setErro(
          'Não foi possível carregar os produtos.'
        );

      } finally {

        setCarregandoProdutos(false);

      }

    }

    carregarProdutos();

  }, [aberto]);


  /* --------------------------------------------------------------------- */
  /* PRODUTOS FILTRADOS                                                    */
  /* --------------------------------------------------------------------- */

  const produtosFiltrados = useMemo(() => {

    return produtos.filter(
      (produto) => {

        const nomeProduto =
          String(
            produto.nome || ''
          ).toLowerCase();

        const correspondeBusca =
          nomeProduto.includes(
            busca.toLowerCase()
          );


        /*
         * Seu backend retorna categoria_id.
         *
         * Caso sua rota /produtos já retorne
         * "categoria" como nome, usamos diretamente.
         */

        const categoriaProduto =
          produto.categoria ||
          produto.categoria_nome ||
          '';


        const correspondeCategoria =
          filtroCategoria === 'Todas' ||
          categoriaProduto === filtroCategoria;


        let statusProduto = 'Ativo';


        if (
          Number(produto.estoque || 0) === 0
        ) {

          statusProduto = 'Esgotado';

        } else if (
          Number(produto.ativo) === 0
        ) {

          statusProduto = 'Rascunho';

        }


        const correspondeStatus =
          filtroStatus === 'Todos' ||
          statusProduto === filtroStatus;


        return (
          correspondeBusca &&
          correspondeCategoria &&
          correspondeStatus
        );

      }
    );

  }, [
    produtos,
    busca,
    filtroCategoria,
    filtroStatus
  ]);


  /* --------------------------------------------------------------------- */
  /* RETURN CONDICIONAL                                                     */
  /* --------------------------------------------------------------------- */

  if (!aberto) {
    return null;
  }


  /* --------------------------------------------------------------------- */
  /* VALIDAÇÕES                                                             */
  /* --------------------------------------------------------------------- */

  const etapa1Valida =
    dados.nome.trim().length > 0 &&
    (dados.permanente || !!dados.dataInicio);


  const etapa2Valida =
    !!imagem;


  const etapa3Valida =
    produtosSelecionados.length > 0;


  const podeAvancar =
    (etapaAtual === 1 && etapa1Valida) ||
    (etapaAtual === 2 && etapa2Valida) ||
    (etapaAtual === 3 && etapa3Valida) ||
    etapaAtual === 4;


  /* --------------------------------------------------------------------- */
  /* NAVEGAÇÃO                                                              */
  /* --------------------------------------------------------------------- */

  function irParaProximaEtapa() {

    if (!podeAvancar) {
      return;
    }

    setErro('');

    setEtapaAtual(
      (atual) =>
        Math.min(
          atual + 1,
          4
        )
    );

  }


  function irParaEtapaAnterior() {

    setErro('');

    setEtapaAtual(
      (atual) =>
        Math.max(
          atual - 1,
          1
        )
    );

  }


  function fecharModal() {

    if (carregando) {
      return;
    }

    onFechar?.();

  }


  /* --------------------------------------------------------------------- */
  /* ETAPA 1                                                                */
  /* --------------------------------------------------------------------- */

  function atualizarCampo(
    campo,
    valor
  ) {

    setDados(
      (atual) => ({
        ...atual,
        [campo]: valor
      })
    );

  }


  /* --------------------------------------------------------------------- */
  /* ETAPA 2 — IMAGEM                                                       */
  /* --------------------------------------------------------------------- */

  function processarArquivo(arquivo) {

    if (!arquivo) {
      return;
    }


    if (!arquivo.type.startsWith('image/')) {

      setErro(
        'Selecione um arquivo de imagem válido.'
      );

      return;

    }


    setErro('');


    const leitor =
      new FileReader();


    leitor.onload = (evento) => {

      setImagem({
        nome: arquivo.name,
        url: evento.target.result,
        arquivo: arquivo
      });

    };


    leitor.readAsDataURL(arquivo);

  }


  function aoSoltarArquivo(evento) {

    evento.preventDefault();

    setArrastando(false);

    const arquivo =
      evento.dataTransfer.files?.[0];

    processarArquivo(arquivo);

  }


  function aoSelecionarArquivo(evento) {

    const arquivo =
      evento.target.files?.[0];

    processarArquivo(arquivo);

  }


  /* --------------------------------------------------------------------- */
  /* ETAPA 3 — PRODUTOS                                                     */
  /* --------------------------------------------------------------------- */

  function alternarSelecaoProduto(produto) {

    setProdutosSelecionados(
      (atual) => {

        const jaSelecionado =
          atual.some(
            (item) =>
              item.id === produto.id
          );


        if (jaSelecionado) {

          return atual.filter(
            (item) =>
              item.id !== produto.id
          );

        }


        return [
          ...atual,
          produto
        ];

      }
    );

  }


  function removerProdutoSelecionado(id) {

    setProdutosSelecionados(
      (atual) =>
        atual.filter(
          (item) =>
            item.id !== id
        )
    );

  }


  /* --------------------------------------------------------------------- */
  /* ETAPA 4 — CRIAR COLEÇÃO                                                */
  /* --------------------------------------------------------------------- */

  async function criarColecao() {

    if (carregando) {
      return;
    }


    try {

      setCarregando(true);
      setErro('');


      /* --------------------------------------------------------------- */
      /* FORM DATA                                                        */
      /* --------------------------------------------------------------- */

      const formData =
        new FormData();


      formData.append(
        'nome',
        dados.nome.trim()
      );


      formData.append(
        'descricao',
        dados.descricao || ''
      );


      /*
       * Seu banco usa "ativo".
       *
       * O frontend trabalha com:
       * Ativa
       * Rascunho
       */

      formData.append(
        'ativo',
        dados.status === 'Ativa'
          ? 'true'
          : 'false'
      );


      formData.append(
        'destaque',
        dados.destaque
          ? 'true'
          : 'false'
      );


      /*
       * Tipo da coleção + datas + categoria + meta.
       *
       * O backend calcula o status sozinho a partir
       * destes campos (ver colecoes.routes.js).
       */

      formData.append(
        'permanente',
        dados.permanente
          ? 'true'
          : 'false'
      );

      formData.append(
        'data_inicio',
        dados.permanente
          ? ''
          : (dados.dataInicio || '')
      );

      formData.append(
        'data_fim',
        dados.permanente
          ? ''
          : (dados.dataFim || '')
      );

      formData.append(
        'categoria',
        dados.categoria || ''
      );

      formData.append(
        'meta_receita',
        dados.metaReceita || ''
      );


      /* --------------------------------------------------------------- */
      /* IMAGEM                                                           */
      /* --------------------------------------------------------------- */

      if (
        imagem &&
        imagem.arquivo
      ) {

        formData.append(
          'imagem',
          imagem.arquivo
        );

      }


      /* --------------------------------------------------------------- */
      /* PRODUTOS                                                         */
      /* --------------------------------------------------------------- */

      const produtoIds =
        produtosSelecionados.map(
          (produto) =>
            Number(produto.id)
        );


      formData.append(
        'produto_ids',
        JSON.stringify(produtoIds)
      );


      /* --------------------------------------------------------------- */
      /* REQUEST                                                          */
      /* --------------------------------------------------------------- */

      const resposta =
        await fetch(
          `${API_URL}/colecoes`,
          {
            method: 'POST',
            body: formData
          }
        );


      const resultado =
        await resposta.json();


      if (!resposta.ok) {

        throw new Error(
          resultado.erro ||
          'Erro ao criar coleção.'
        );

      }


      /* --------------------------------------------------------------- */
      /* SUCESSO                                                          */
      /* --------------------------------------------------------------- */

      setSucesso(true);


      onSalvar?.({
        ...resultado,
        produtos:
          produtosSelecionados
      });


    } catch (error) {

      console.error(
        'ERRO AO CRIAR COLEÇÃO:',
        error
      );


      setErro(
        error.message ||
        'Não foi possível criar a coleção.'
      );

    } finally {

      setCarregando(false);

    }

  }


  /* --------------------------------------------------------------------- */
  /* RENDER                                                                */
  /* --------------------------------------------------------------------- */

  return (

    <div
      className={styles.overlayModal}
      onMouseDown={fecharModal}
    >

      <div
        className={styles.modalColecao}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modal-colecao"
        onMouseDown={(evento) =>
          evento.stopPropagation()
        }
      >

        {/* ============================================================= */}
        {/* CABEÇALHO                                                      */}
        {/* ============================================================= */}

        <div
          className={styles.cabecalhoModal}
        >

          <div>

            <h2
              id="titulo-modal-colecao"
              className={styles.tituloModal}
            >
              Nova coleção
            </h2>


            <p
              className={styles.subtituloModal}
            >
              Crie e organize uma nova coleção para sua loja.
            </p>

          </div>


          <button
            type="button"
            className={styles.fecharModal}
            onClick={fecharModal}
            aria-label="Fechar modal"
            disabled={carregando}
          >
            <IconeFechar />
          </button>

        </div>


        {/* ============================================================= */}
        {/* STEPPER                                                         */}
        {/* ============================================================= */}

        {!sucesso && (

          <div
            className={styles.etapas}
          >

            {ETAPAS.map(
              (etapa, indice) => {

                const concluida =
                  etapaAtual >
                  etapa.numero;

                const ativa =
                  etapaAtual ===
                  etapa.numero;


                return (

                  <div
                    className={styles.blocoEtapa}
                    key={etapa.numero}
                  >

                    <div
                      className={`
                        ${styles.etapa}
                        ${ativa
                          ? styles.etapaAtiva
                          : ''}
                        ${concluida
                          ? styles.etapaConcluida
                          : ''}
                      `}
                    >

                      <span
                        className={styles.marcadorEtapa}
                      >

                        {concluida ? (
                          <IconeCheck />
                        ) : (
                          etapa.numero
                        )}

                      </span>


                      <span
                        className={styles.tituloEtapa}
                      >
                        {etapa.titulo}
                      </span>

                    </div>


                    {indice <
                      ETAPAS.length - 1 && (

                      <div
                        className={`
                          ${styles.linhaEtapa}
                          ${concluida
                            ? styles.linhaEtapaConcluida
                            : ''}
                        `}
                      />

                    )}

                  </div>

                );

              }
            )}

          </div>

        )}


        {/* ============================================================= */}
        {/* ERRO                                                            */}
        {/* ============================================================= */}

        {erro && !sucesso && (

          <div
            style={{
              margin: '12px 24px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: '#fff1f1',
              color: '#a83232',
              fontSize: '13px'
            }}
          >
            {erro}
          </div>

        )}


        {/* ============================================================= */}
        {/* CORPO                                                           */}
        {/* ============================================================= */}

        <div
          className={styles.corpoModal}
        >

          {sucesso ? (

            <TelaSucesso
              onFechar={fecharModal}
            />

          ) : (

            <div
              className={styles.conteudoEtapa}
              key={etapaAtual}
            >

              {etapaAtual === 1 && (

                <EtapaInformacoes
                  dados={dados}
                  atualizarCampo={atualizarCampo}
                />

              )}


              {etapaAtual === 2 && (

                <EtapaIdentidadeVisual
                  imagem={imagem}
                  setImagem={setImagem}
                  arrastando={arrastando}
                  setArrastando={setArrastando}
                  aoSoltarArquivo={aoSoltarArquivo}
                  aoSelecionarArquivo={aoSelecionarArquivo}
                  inputArquivoRef={inputArquivoRef}
                />

              )}


              {etapaAtual === 3 && (

                <EtapaProdutos
                  busca={busca}
                  setBusca={setBusca}
                  filtroCategoria={filtroCategoria}
                  setFiltroCategoria={setFiltroCategoria}
                  filtroStatus={filtroStatus}
                  setFiltroStatus={setFiltroStatus}
                  produtosFiltrados={produtosFiltrados}
                  produtosSelecionados={produtosSelecionados}
                  alternarSelecaoProduto={alternarSelecaoProduto}
                  removerProdutoSelecionado={removerProdutoSelecionado}
                  carregandoProdutos={carregandoProdutos}
                />

              )}


              {etapaAtual === 4 && (

                <EtapaRevisao
                  dados={dados}
                  imagem={imagem}
                  produtosSelecionados={produtosSelecionados}
                  mostrarTodos={mostrarTodosSelecionados}
                  setMostrarTodos={setMostrarTodosSelecionados}
                />

              )}

            </div>

          )}

        </div>


        {/* ============================================================= */}
        {/* RODAPÉ                                                         */}
        {/* ============================================================= */}

        {!sucesso && (

          <div
            className={styles.rodapeModal}
          >

            <div
              className={styles.rodapeEsquerda}
            >

              {etapaAtual === 1 ? (

                <button
                  type="button"
                  className={styles.botaoCancelar}
                  onClick={fecharModal}
                  disabled={carregando}
                >
                  Cancelar
                </button>

              ) : (

                <button
                  type="button"
                  className={styles.botaoVoltar}
                  onClick={irParaEtapaAnterior}
                  disabled={carregando}
                >
                  Voltar
                </button>

              )}

            </div>


            <div
              className={styles.rodapeDireita}
            >

              {etapaAtual < 4 ? (

                <button
                  type="button"
                  className={styles.botaoAvancar}
                  onClick={irParaProximaEtapa}
                  disabled={!podeAvancar}
                >
                  Continuar
                </button>

              ) : (

                <button
                  type="button"
                  className={`
                    ${styles.botaoSalvar}
                    ${carregando
                      ? styles.botaoCarregando
                      : ''}
                  `}
                  onClick={criarColecao}
                  disabled={carregando}
                >

                  {carregando ? (

                    <>
                      <span
                        className={styles.spinner}
                      />

                      Criando coleção...
                    </>

                  ) : (

                    'Criar coleção'

                  )}

                </button>

              )}

            </div>

          </div>

        )}

      </div>

    </div>

  );

}


/* ======================================================================= */
/* ETAPA 1 — INFORMAÇÕES                                                   */
/* ======================================================================= */

function EtapaInformacoes({
  dados,
  atualizarCampo
}) {

  return (

    <div
      className={styles.painelEtapa}
    >

      <h3
        className={styles.tituloPainel}
      >
        Informações da coleção
      </h3>


      <p
        className={styles.descricaoPainel}
      >
        Defina as informações principais da sua nova coleção.
      </p>


      <div
        className={styles.campoFormulario}
      >

        <label
          className={styles.rotuloCampo}
          htmlFor="nome-colecao"
        >
          Nome da coleção
        </label>


        <input
          id="nome-colecao"
          type="text"
          className={styles.entradaTexto}
          placeholder="Ex: Coleção Aurora"
          value={dados.nome}
          onChange={(evento) =>
            atualizarCampo(
              'nome',
              evento.target.value
            )
          }
        />

      </div>


      <div
        className={styles.campoFormulario}
      >

        <label
          className={styles.rotuloCampo}
          htmlFor="descricao-colecao"
        >
          Descrição
        </label>


        <textarea
          id="descricao-colecao"
          className={styles.areaTexto}
          placeholder="Descreva brevemente o conceito desta coleção..."
          rows={4}
          value={dados.descricao}
          onChange={(evento) =>
            atualizarCampo(
              'descricao',
              evento.target.value
            )
          }
        />

      </div>


      <div
        className={styles.campoFormulario}
      >

        <span
          className={styles.rotuloCampo}
        >
          Status
        </span>


        <div
          className={styles.seletorStatus}
        >

          {[
            'Ativa',
            'Rascunho'
          ].map(
            (opcao) => (

              <button
                type="button"
                key={opcao}
                className={`
                  ${styles.opcaoStatus}
                  ${dados.status === opcao
                    ? styles.opcaoStatusAtiva
                    : ''}
                `}
                onClick={() =>
                  atualizarCampo(
                    'status',
                    opcao
                  )
                }
              >

                <span
                  className={`
                    ${styles.pontoStatus}
                    ${opcao === 'Ativa'
                      ? styles.pontoAtivo
                      : styles.pontoRascunho}
                  `}
                />

                {opcao}

              </button>

            )
          )}

        </div>

      </div>


      <div
        className={styles.campoFormulario}
      >

        <span
          className={styles.rotuloCampo}
        >
          Tipo de coleção
        </span>


        <div
          className={styles.seletorStatus}
        >

          <button
            type="button"
            className={`
              ${styles.opcaoStatus}
              ${!dados.permanente
                ? styles.opcaoStatusAtiva
                : ''}
            `}
            onClick={() =>
              atualizarCampo(
                'permanente',
                false
              )
            }
          >
            Campanha (com datas)
          </button>

          <button
            type="button"
            className={`
              ${styles.opcaoStatus}
              ${dados.permanente
                ? styles.opcaoStatusAtiva
                : ''}
            `}
            onClick={() =>
              atualizarCampo(
                'permanente',
                true
              )
            }
          >
            Permanente (linha fixa)
          </button>

        </div>

        <p className={styles.textoAuxiliar}>
          {dados.permanente
            ? 'Coleções permanentes ficam sempre disponíveis na loja, sem data de encerramento.'
            : 'Coleções de campanha precisam de uma data de início (a data de término é opcional).'}
        </p>

      </div>


      {!dados.permanente && (
        <div
          className={styles.linhaCampos}
        >

          <div
            className={styles.campoFormulario}
          >

            <label
              className={styles.rotuloCampo}
              htmlFor="data-inicio"
            >
              Data de início
            </label>


            <input
              id="data-inicio"
              type="date"
              className={styles.entradaTexto}
              value={dados.dataInicio}
              onChange={(evento) =>
                atualizarCampo(
                  'dataInicio',
                  evento.target.value
                )
              }
            />

          </div>


          <div
            className={styles.campoFormulario}
          >

            <label
              className={styles.rotuloCampo}
              htmlFor="data-fim"
            >
              Data de término (opcional)
            </label>


            <input
              id="data-fim"
              type="date"
              className={styles.entradaTexto}
              value={dados.dataFim}
              onChange={(evento) =>
                atualizarCampo(
                  'dataFim',
                  evento.target.value
                )
              }
            />

          </div>

        </div>
      )}


      <div
        className={styles.linhaCampos}
      >

        <div
          className={styles.campoFormulario}
        >

          <label
            className={styles.rotuloCampo}
            htmlFor="categoria-colecao"
          >
            Categoria (opcional)
          </label>


          <input
            id="categoria-colecao"
            type="text"
            className={styles.entradaTexto}
            placeholder="Ex: Dia das Mães, Signature..."
            value={dados.categoria}
            onChange={(evento) =>
              atualizarCampo(
                'categoria',
                evento.target.value
              )
            }
          />

        </div>


        <div
          className={styles.campoFormulario}
        >

          <label
            className={styles.rotuloCampo}
            htmlFor="meta-receita"
          >
            Meta de receita (opcional)
          </label>


          <input
            id="meta-receita"
            type="number"
            min="0"
            step="0.01"
            className={styles.entradaTexto}
            placeholder="Ex: 15000"
            value={dados.metaReceita}
            onChange={(evento) =>
              atualizarCampo(
                'metaReceita',
                evento.target.value
              )
            }
          />

        </div>

      </div>


      <div
        className={styles.campoDestaque}
      >

        <div>

          <p
            className={styles.rotuloDestaque}
          >
            Destacar coleção
          </p>


          <p
            className={styles.textoAuxiliar}
          >
            Coleções em destaque podem receber maior visibilidade na loja.
          </p>

        </div>


        <button
          type="button"
          role="switch"
          aria-checked={dados.destaque}
          className={`
            ${styles.toggle}
            ${dados.destaque
              ? styles.toggleAtivo
              : ''}
          `}
          onClick={() =>
            atualizarCampo(
              'destaque',
              !dados.destaque
            )
          }
        >

          <span
            className={styles.toggleBolinha}
          />

        </button>

      </div>

    </div>

  );

}


/* ======================================================================= */
/* ETAPA 2 — IDENTIDADE VISUAL                                             */
/* ======================================================================= */

function EtapaIdentidadeVisual({
  imagem,
  setImagem,
  arrastando,
  setArrastando,
  aoSoltarArquivo,
  aoSelecionarArquivo,
  inputArquivoRef
}) {

  return (

    <div
      className={styles.painelEtapa}
    >

      <h3
        className={styles.tituloPainel}
      >
        Identidade visual
      </h3>


      <p
        className={styles.descricaoPainel}
      >
        Escolha a imagem que representará sua coleção.
      </p>


      <div
        className={styles.grelhaUpload}
      >

        {!imagem ? (

          <div
            className={`
              ${styles.areaUpload}
              ${arrastando
                ? styles.areaUploadArrastando
                : ''}
            `}
            onDragOver={(evento) => {

              evento.preventDefault();

              setArrastando(true);

            }}
            onDragLeave={() =>
              setArrastando(false)
            }
            onDrop={aoSoltarArquivo}
            onClick={() =>
              inputArquivoRef.current?.click()
            }
            role="button"
            tabIndex={0}
          >

            <div
              className={styles.iconeUpload}
            >
              <IconeImagem />
            </div>


            <p
              className={styles.textoUploadPrincipal}
            >
              Arraste uma imagem aqui
            </p>


            <p
              className={styles.textoUploadSecundario}
            >
              ou{' '}

              <span
                className={styles.linkSelecionar}
              >
                selecione um arquivo
              </span>

            </p>


            <p
              className={styles.textoUploadFormatos}
            >
              PNG, JPG ou WEBP
            </p>


            <input
              ref={inputArquivoRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              className={styles.inputArquivoOculto}
              onChange={aoSelecionarArquivo}
            />

          </div>

        ) : (

          <div
            className={styles.previewImagem}
          >

            <img
              src={imagem.url}
              alt="Prévia da coleção"
              className={styles.imagemPreview}
            />


            <div
              className={styles.acoesPreview}
            >

              <button
                type="button"
                className={styles.botaoTrocarImagem}
                onClick={() =>
                  inputArquivoRef.current?.click()
                }
              >
                Trocar imagem
              </button>


              <button
                type="button"
                className={styles.botaoRemoverImagem}
                onClick={() =>
                  setImagem(null)
                }
              >
                Remover
              </button>

            </div>


            <input
              ref={inputArquivoRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              className={styles.inputArquivoOculto}
              onChange={aoSelecionarArquivo}
            />

          </div>

        )}


        <div
          className={styles.infoImagem}
        >

          <p
            className={styles.tituloInfoImagem}
          >
            Imagem da coleção
          </p>


          <p
            className={styles.textoAuxiliar}
          >
            Essa imagem será utilizada como capa e elemento principal de apresentação da coleção.
          </p>

        </div>

      </div>

    </div>

  );

}


/* ======================================================================= */
/* ETAPA 3 — PRODUTOS                                                      */
/* ======================================================================= */

function EtapaProdutos({
  busca,
  setBusca,
  filtroCategoria,
  setFiltroCategoria,
  filtroStatus,
  setFiltroStatus,
  produtosFiltrados,
  produtosSelecionados,
  alternarSelecaoProduto,
  removerProdutoSelecionado,
  carregandoProdutos
}) {

  const idsSelecionados =
    new Set(
      produtosSelecionados.map(
        (produto) => produto.id
      )
    );


  return (

    <div
      className={styles.painelEtapa}
    >

      <h3
        className={styles.tituloPainel}
      >
        Produtos da coleção
      </h3>


      <p
        className={styles.descricaoPainel}
      >
        Selecione os produtos que farão parte desta coleção.
      </p>


      <div
        className={styles.barraFiltrosProdutos}
      >

        <div
          className={styles.campoBusca}
        >

          <IconeBusca />


          <input
            type="text"
            placeholder="Buscar produto..."
            value={busca}
            onChange={(evento) =>
              setBusca(
                evento.target.value
              )
            }
            className={styles.entradaBusca}
          />

        </div>


        <select
          className={styles.seletorFiltro}
          value={filtroCategoria}
          onChange={(evento) =>
            setFiltroCategoria(
              evento.target.value
            )
          }
          aria-label="Categoria"
        >

          {CATEGORIAS_FILTRO.map(
            (categoria) => (

              <option
                key={categoria}
                value={categoria}
              >
                {categoria}
              </option>

            )
          )}

        </select>


        <select
          className={styles.seletorFiltro}
          value={filtroStatus}
          onChange={(evento) =>
            setFiltroStatus(
              evento.target.value
            )
          }
          aria-label="Status"
        >

          {STATUS_FILTRO.map(
            (status) => (

              <option
                key={status}
                value={status}
              >
                {status}
              </option>

            )
          )}

        </select>

      </div>


      {carregandoProdutos ? (

        <div
          className={styles.estadoVazioProdutos}
        >
          Carregando produtos...
        </div>

      ) : (

        <>

          <div
            className={styles.resumoContagem}
          >

            <span>
              {produtosFiltrados.length}{' '}
              produtos encontrados
            </span>


            <span
              className={styles.contagemSelecionados}
            >
              {produtosSelecionados.length}{' '}
              selecionados
            </span>

          </div>


          <p
            className={styles.rotuloSecaoProdutos}
          >
            Produtos disponíveis
          </p>


          <div
            className={styles.listaProdutos}
          >

            {produtosFiltrados.map(
              (produto) => {

                const selecionado =
                  idsSelecionados.has(
                    produto.id
                  );

                const indisponivel =
                  Number(produto.estoque || 0) === 0;


                return (

                  <button
                    type="button"
                    key={produto.id}
                    className={`
                      ${styles.cardProduto}
                      ${selecionado
                        ? styles.produtoSelecionado
                        : ''}
                    `}
                    onClick={() =>
                      alternarSelecaoProduto(
                        produto
                      )
                    }
                  >

                    <span
                      className={`
                        ${styles.checkboxProduto}
                        ${selecionado
                          ? styles.checkboxMarcado
                          : ''}
                      `}
                    >

                      {selecionado && (
                        <IconeCheck />
                      )}

                    </span>


                    <span
                      className={styles.miniaturaProduto}
                    >

                      {produto.imagem ? (

                        <img
                          src={
                            produto.imagem.startsWith('http')
                              ? produto.imagem
                              : `${API_URL}${produto.imagem}`
                          }
                          alt=""
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: 'inherit'
                          }}
                        />

                      ) : (

                        <IconeJoia />

                      )}

                    </span>


                    <span
                      className={styles.infoCardProduto}
                    >

                      <span
                        className={styles.nomeProduto}
                      >
                        {produto.nome}
                      </span>


                      <span
                        className={styles.categoriaProduto}
                      >
                        {produto.categoria ||
                          produto.categoria_nome ||
                          'Sem categoria'}
                      </span>


                      <span
                        className={styles.linhaPrecoEstoque}
                      >

                        <span
                          className={styles.precoProduto}
                        >
                          {formatarPreco(
                            produto.preco
                          )}
                        </span>


                        <span
                          className={
                            indisponivel
                              ? styles.estoqueZerado
                              : styles.estoqueProduto
                          }
                        >

                          {indisponivel
                            ? 'Sem estoque'
                            : `Estoque: ${produto.estoque}`}

                        </span>

                      </span>

                    </span>

                  </button>

                );

              }
            )}


            {produtosFiltrados.length === 0 && (

              <p
                className={styles.estadoVazioProdutos}
              >
                Nenhum produto encontrado para os filtros selecionados.
              </p>

            )}

          </div>


          {produtosSelecionados.length > 0 && (

            <div
              className={styles.secaoSelecionados}
            >

              <p
                className={styles.rotuloSecaoProdutos}
              >
                Produtos selecionados
              </p>


              <div
                className={styles.grelhaSelecionados}
              >

                {produtosSelecionados.map(
                  (produto) => (

                    <div
                      className={styles.chipProdutoSelecionado}
                      key={produto.id}
                    >

                      <span
                        className={styles.miniaturaChip}
                      >
                        <IconeJoia />
                      </span>


                      <span
                        className={styles.nomeChip}
                      >
                        {produto.nome}
                      </span>


                      <button
                        type="button"
                        className={styles.botaoRemoverChip}
                        onClick={() =>
                          removerProdutoSelecionado(
                            produto.id
                          )
                        }
                        aria-label={`Remover ${produto.nome}`}
                      >
                        <IconeLixeira />
                      </button>

                    </div>

                  )
                )}

              </div>

            </div>

          )}

        </>

      )}

    </div>

  );

}


/* ======================================================================= */
/* ETAPA 4 — REVISÃO                                                       */
/* ======================================================================= */

function EtapaRevisao({
  dados,
  imagem,
  produtosSelecionados,
  mostrarTodos,
  setMostrarTodos
}) {

  const produtosVisiveis =
    mostrarTodos
      ? produtosSelecionados
      : produtosSelecionados.slice(
        0,
        6
      );


  return (

    <div
      className={styles.painelEtapa}
    >

      <h3
        className={styles.tituloPainel}
      >
        Revisar coleção
      </h3>


      <p
        className={styles.descricaoPainel}
      >
        Confira todas as informações antes de criar sua coleção.
      </p>


      <div
        className={styles.resumoColecao}
      >

        {/* =========================================================== */}
        {/* INFORMAÇÕES                                                   */}
        {/* =========================================================== */}

        <div
          className={styles.cardResumo}
        >

          <p
            className={styles.tituloCardResumo}
          >
            Informações
          </p>


          <div
            className={styles.grelhaResumo}
          >

            <div>

              <p
                className={styles.rotuloResumo}
              >
                Nome
              </p>


              <p
                className={styles.valorResumo}
              >
                {dados.nome || '—'}
              </p>

            </div>


            <div>

              <p
                className={styles.rotuloResumo}
              >
                Status
              </p>


              <p
                className={styles.valorResumo}
              >
                {dados.status}
              </p>

            </div>


            <div
              className={styles.spanCompleto}
            >

              <p
                className={styles.rotuloResumo}
              >
                Descrição
              </p>


              <p
                className={styles.valorResumo}
              >
                {dados.descricao ||
                  'Nenhuma descrição informada.'}
              </p>

            </div>


            <div>

              <p
                className={styles.rotuloResumo}
              >
                Período
              </p>


              <p
                className={styles.valorResumo}
              >
                {formatarData(
                  dados.dataInicio
                )}{' '}
                —{' '}
                {formatarData(
                  dados.dataFim
                )}
              </p>

            </div>


            <div>

              <p
                className={styles.rotuloResumo}
              >
                Destaque
              </p>


              <p
                className={styles.valorResumo}
              >
                {dados.destaque
                  ? 'Sim'
                  : 'Não'}
              </p>

            </div>

          </div>

        </div>


        {/* =========================================================== */}
        {/* IMAGEM                                                        */}
        {/* =========================================================== */}

        <div
          className={styles.cardResumo}
        >

          <p
            className={styles.tituloCardResumo}
          >
            Identidade visual
          </p>


          {imagem ? (

            <img
              src={imagem.url}
              alt="Capa da coleção"
              className={styles.imagemResumo}
            />

          ) : (

            <p
              className={styles.valorResumo}
            >
              Nenhuma imagem selecionada.
            </p>

          )}

        </div>


        {/* =========================================================== */}
        {/* PRODUTOS                                                       */}
        {/* =========================================================== */}

        <div
          className={styles.cardResumo}
        >

          <div
            className={styles.cabecalhoCardResumo}
          >

            <p
              className={styles.tituloCardResumo}
            >
              Produtos
            </p>


            {produtosSelecionados.length > 6 && (

              <button
                type="button"
                className={styles.botaoVerProdutos}
                onClick={() =>
                  setMostrarTodos(
                    (valor) => !valor
                  )
                }
              >
                {mostrarTodos
                  ? 'Ver menos'
                  : 'Ver produtos'}
              </button>

            )}

          </div>


          <p
            className={styles.valorResumo}
          >
            {produtosSelecionados.length}{' '}
            produtos selecionados
          </p>


          <div
            className={styles.grelhaThumbnails}
          >

            {produtosVisiveis.map(
              (produto) => (

                <div
                  className={styles.thumbnailProduto}
                  key={produto.id}
                  title={produto.nome}
                >

                  {produto.imagem ? (

                    <img
                      src={
                        produto.imagem.startsWith('http')
                          ? produto.imagem
                          : `${API_URL}${produto.imagem}`
                      }
                      alt={produto.nome}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 'inherit'
                      }}
                    />

                  ) : (

                    <IconeJoia />

                  )}

                </div>

              )
            )}

          </div>

        </div>


        {/* =========================================================== */}
        {/* CONFIRMAÇÃO                                                   */}
        {/* =========================================================== */}

        <div
          className={styles.cardConfirmacao}
        >

          <span
            className={styles.iconeConfirmacao}
          >
            <IconeSucesso />
          </span>


          <div>

            <p
              className={styles.tituloConfirmacao}
            >
              Tudo pronto!
            </p>


            <p
              className={styles.textoConfirmacao}
            >
              Confira as informações acima e crie sua nova coleção.
            </p>

          </div>

        </div>

      </div>

    </div>

  );

}


/* ======================================================================= */
/* TELA DE SUCESSO                                                         */
/* ======================================================================= */

function TelaSucesso({
  onFechar
}) {

  return (

    <div
      className={styles.telaSucesso}
    >

      <span
        className={styles.circuloSucesso}
      >
        <IconeSucesso />
      </span>


      <p
        className={styles.tituloSucesso}
      >
        Coleção criada com sucesso!
      </p>


      <p
        className={styles.textoSucesso}
      >
        Sua nova coleção já está disponível no painel administrativo.
      </p>


      <button
        type="button"
        className={styles.botaoSalvar}
        onClick={onFechar}
      >
        Concluir
      </button>

    </div>

  );

}