/**
 * ModalAdicionarCategoria
 * Dashboard Admin Premium — Joalheria
 * React JSX + CSS Modules + useGSAP
 *
 * Dependências:
 *   npm install gsap @gsap/react
 *
 * Uso:
 *   <ModalAdicionarCategoria
 *     aberto={true}
 *     aoFechar={() => setAberto(false)}
 *     aoSalvar={(dados) => console.log(dados)}
 *   />
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import styles from './styles.module.css';

/* ── Ícones inline (SVG) ──────────────────────────────── */
const IcFechar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IcUpload = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.iconeUpload}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);
const IcSeta = ({ dir = 'right' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    {dir === 'right'
      ? <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>
      : <><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></>
    }
  </svg>
);
const IcCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IcLixo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
  </svg>
);
const IcInfo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const IcSalvar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

/* ── Dados estáticos ──────────────────────────────────── */
const ETAPAS = [
  { id: 1, rotulo: 'Informações' },
  { id: 2, rotulo: 'Aparência' },
  { id: 3, rotulo: 'Revisão' },
];

const ICONES_DISPONIVEIS = [
  '💍', '💎', '⌚', '📿', '🏆', '👑',
  '✨', '🌟', '🪙', '🔮', '🌹', '🦋',
  '🎀', '🌸', '⚜️', '🔑',
];

const CORES_TEMATICAS = [
  { hex: '#C9A84C', nome: 'Dourado' },
  { hex: '#C0C0C0', nome: 'Prata' },
  { hex: '#B5814F', nome: 'Bronze' },
  { hex: '#E8D5B0', nome: 'Champagne' },
  { hex: '#FF6B6B', nome: 'Rubi' },
  { hex: '#4ECDC4', nome: 'Esmeralda' },
  { hex: '#7B2D8B', nome: 'Ametista' },
  { hex: '#1B4F8A', nome: 'Safira' },
  { hex: '#2E8B57', nome: 'Jade' },
  { hex: '#F5F5F5', nome: 'Platina' },
];

/* ── Utilitários ──────────────────────────────────────── */
function gerarSlug(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function formatarTamanhoArquivo(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ── Componente ToggleStatus ─────────────────────────── */
function ToggleStatus({ ativo, aoAlternar }) {
  return (
    <div className={styles.toggleWrapper}>
      <div className={styles.toggleInfo}>
        <span className={styles.toggleTitulo}>Status da categoria</span>
        <span className={styles.toggleDescricao}>
          {ativo ? 'Visível no catálogo e loja' : 'Oculta — não aparece para clientes'}
        </span>
      </div>
      <button
        type="button"
        className={`${styles.toggleBotao} ${ativo ? styles.toggleBotaoAtivo : ''}`}
        onClick={aoAlternar}
        aria-label={ativo ? 'Desativar categoria' : 'Ativar categoria'}
        aria-checked={ativo}
        role="switch"
      >
        <span className={styles.toggleIndicador} />
      </button>
    </div>
  );
}

/* ── Componente CartaoPreview ─────────────────────────── */
function CartaoPreview({ dados }) {
  const { nome, descricao, imagemUrl, status, cor, icone } = dados;
  const temNome = nome && nome.trim().length > 0;
  const temDescricao = descricao && descricao.trim().length > 0;

  return (
    <div className={styles.cartaoPreview}>
      <div className={styles.cartaoPreviewImagem}>
        {imagemUrl ? (
          <img
            src={imagemUrl}
            alt="Preview da categoria"
            className={styles.cartaoPreviewImagemFundo}
          />
        ) : (
          <div className={styles.cartaoPreviewImagemPlaceholder}>
            <span className={styles.iconePreviewGrande}>{icone || '💎'}</span>
            <span className={styles.textoPlaceholderImg}>Sem imagem</span>
          </div>
        )}
        <div className={styles.cartaoPreviewOverlay} />
        <span className={`${styles.badgeStatusPreview} ${status ? styles.badgeAtivo : styles.badgeInativo}`}>
          {status ? 'Ativo' : 'Inativo'}
        </span>
      </div>
      <div className={styles.cartaoPreviewInfo}>
        <span className={`${styles.cartaoPreviewNome} ${!temNome ? styles.cartaoPreviewNomePlaceholder : ''}`}>
          {temNome ? nome : 'Nome da categoria'}
        </span>
        {temDescricao && (
          <span className={styles.cartaoPreviewDescricao}>
            {descricao}
          </span>
        )}
      </div>
      <div
        className={styles.barraCorPreview}
        style={{ backgroundColor: cor || '#C9A84C' }}
      />
    </div>
  );
}

/* ── Etapa 1: Informações ────────────────────────────── */
function EtapaInformacoes({ dados, aoAtualizar }) {
  const handleNome = (e) => {
    const nome = e.target.value;
    aoAtualizar({ nome, slug: gerarSlug(nome) });
  };

  return (
    <div className={styles.etapaFormulario}>
      <div className={styles.separadorSecao}>
        <span className={styles.separadorLabel}>Identificação</span>
        <div className={styles.separadorLinha} />
      </div>

      <div className={styles.campoFormulario}>
        <label className={styles.campoLabel}>
          Nome da categoria <span className={styles.campoObrigatorio}>*</span>
        </label>
        <input
          type="text"
          value={dados.nome}
          onChange={handleNome}
          placeholder="Ex: Anéis de Ouro, Colares Finos..."
          className={styles.campoInput}
          maxLength={60}
        />
        <span className={styles.campoHint}>
          {dados.nome.length}/60 caracteres
        </span>
      </div>

      <div className={styles.campoFormulario}>
        <label className={styles.campoLabel}>Slug (URL)</label>
        <div className={styles.campoSlugWrapper}>
          <span className={styles.campoSlugPrefixo}>/cat/</span>
          <input
            type="text"
            value={dados.slug}
            onChange={(e) => aoAtualizar({ slug: e.target.value })}
            placeholder="gerado-automaticamente"
            className={`${styles.campoInput} ${styles.campoInputSlug}`}
          />
        </div>
        <span className={styles.campoHint}>
          Gerado automaticamente. Você pode editar manualmente.
        </span>
      </div>

      <div className={styles.campoFormulario}>
        <label className={styles.campoLabel}>
          Descrição <span className={styles.campoObrigatorio}>*</span>
        </label>
        <textarea
          value={dados.descricao}
          onChange={(e) => aoAtualizar({ descricao: e.target.value })}
          placeholder="Descreva brevemente esta categoria de joias..."
          className={`${styles.campoInput} ${styles.campoTextarea}`}
          rows={3}
          maxLength={200}
        />
        <span className={styles.campoHint}>
          {dados.descricao.length}/200 caracteres
        </span>
      </div>

      <div className={styles.separadorSecao}>
        <span className={styles.separadorLabel}>Configurações</span>
        <div className={styles.separadorLinha} />
      </div>

      <ToggleStatus
        ativo={dados.status}
        aoAlternar={() => aoAtualizar({ status: !dados.status })}
      />
    </div>
  );
}

/* ── Etapa 2: Aparência ──────────────────────────────── */
function EtapaAparencia({ dados, aoAtualizar }) {
  const [arrastando, setArrastando] = useState(false);
  const inputRef = useRef(null);

  const processarArquivo = (arquivo) => {
    if (!arquivo || !arquivo.type.startsWith('image/')) return;
    const url = URL.createObjectURL(arquivo);
    aoAtualizar({
      imagemUrl: url,
      imagemNome: arquivo.name,
      imagemTamanho: arquivo.size,
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setArrastando(false);
    const arquivo = e.dataTransfer.files[0];
    processarArquivo(arquivo);
  };

  const handleChange = (e) => {
    processarArquivo(e.target.files[0]);
  };

  const removerImagem = (e) => {
    e.stopPropagation();
    aoAtualizar({ imagemUrl: null, imagemNome: null, imagemTamanho: null });
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={styles.etapaFormulario}>
      <div className={styles.separadorSecao}>
        <span className={styles.separadorLabel}>Imagem de capa</span>
        <div className={styles.separadorLinha} />
      </div>

      <div className={styles.campoFormulario}>
        <div
          className={`
            ${styles.areaUpload}
            ${dados.imagemUrl ? styles.areaUploadComImagem : ''}
            ${arrastando ? styles.areaUploadArrastando : ''}
          `}
          onDragOver={(e) => { e.preventDefault(); setArrastando(true); }}
          onDragLeave={() => setArrastando(false)}
          onDrop={handleDrop}
          onClick={() => !dados.imagemUrl && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className={styles.inputFileOculto}
            onChange={handleChange}
            style={{ display: 'none' }}
          />

          {dados.imagemUrl ? (
            <>
              <img
                src={dados.imagemUrl}
                alt="Thumbnail"
                className={styles.thumbUpload}
              />
              <div className={styles.infoArquivoUpload}>
                <div className={styles.nomeArquivoUpload}>{dados.imagemNome}</div>
                <div className={styles.tamanhoArquivoUpload}>
                  {formatarTamanhoArquivo(dados.imagemTamanho)}
                </div>
              </div>
              <button
                type="button"
                className={styles.botaoRemoverImagem}
                onClick={removerImagem}
                aria-label="Remover imagem"
              >
                <IcLixo />
              </button>
            </>
          ) : (
            <>
              <IcUpload />
              <span className={styles.textoUploadPrincipal}>
                {arrastando ? 'Solte a imagem aqui' : 'Arraste ou clique para enviar'}
              </span>
              <span className={styles.textoUploadSecundario}>
                PNG, JPG, WebP — máx. 8 MB — recomendado 800×600px
              </span>
              <button
                type="button"
                className={styles.botaoSecundario}
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                style={{ marginTop: 4, padding: '6px 14px', fontSize: 12 }}
              >
                Escolher arquivo
              </button>
            </>
          )}
        </div>
      </div>

      <div className={styles.separadorSecao}>
        <span className={styles.separadorLabel}>Ícone representativo</span>
        <div className={styles.separadorLinha} />
      </div>

      <div className={styles.campoFormulario}>
        <label className={styles.campoLabel}>Escolha um ícone</label>
        <div className={styles.gradeIcones}>
          {ICONES_DISPONIVEIS.map((icone) => (
            <button
              key={icone}
              type="button"
              className={`${styles.botaoIcone} ${dados.icone === icone ? styles.botaoIconeSelecionado : ''}`}
              onClick={() => aoAtualizar({ icone })}
              aria-label={`Ícone ${icone}`}
              title={icone}
            >
              {icone}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.separadorSecao}>
        <span className={styles.separadorLabel}>Cor temática</span>
        <div className={styles.separadorLinha} />
      </div>

      <div className={styles.campoFormulario}>
        <label className={styles.campoLabel}>Cor da categoria</label>
        <div className={styles.seletorCores}>
          {CORES_TEMATICAS.map((cor) => (
            <button
              key={cor.hex}
              type="button"
              className={`${styles.botaoCor} ${dados.cor === cor.hex ? styles.botaoCorSelecionada : ''}`}
              style={{ backgroundColor: cor.hex }}
              onClick={() => aoAtualizar({ cor: cor.hex })}
              aria-label={`Cor ${cor.nome}`}
              title={cor.nome}
            />
          ))}
          <input
            type="color"
            value={dados.cor}
            onChange={(e) => aoAtualizar({ cor: e.target.value })}
            className={styles.inputCorCustom}
            title="Cor personalizada"
          />
        </div>
        <span className={styles.campoHint}>
          Usada na barra inferior do card e destaques visuais da categoria.
        </span>
      </div>
    </div>
  );
}

/* ── Etapa 3: Revisão ────────────────────────────────── */
function EtapaRevisao({ dados }) {
  const itens = [
    { label: 'Nome', valor: dados.nome, vazio: !dados.nome },
    { label: 'Slug (URL)', valor: `/cat/${dados.slug}`, vazio: !dados.slug, ouro: true },
    { label: 'Status', valor: dados.status ? 'Ativo' : 'Inativo', vazio: false },
    { label: 'Ícone', valor: dados.icone, vazio: !dados.icone },
    { label: 'Imagem', valor: dados.imagemNome || null, vazio: !dados.imagemUrl },
    { label: 'Cor', valor: dados.cor, vazio: !dados.cor, cor: true },
    { label: 'Descrição', valor: dados.descricao, vazio: !dados.descricao, larga: true },
  ];

  const camposObrigatoriosFaltando = !dados.nome || !dados.descricao;

  return (
    <div className={styles.etapaFormulario}>
      <div className={styles.separadorSecao}>
        <span className={styles.separadorLabel}>Resumo da categoria</span>
        <div className={styles.separadorLinha} />
      </div>

      <div className={styles.revisaoGrade}>
        {itens.map((item) => (
          item.larga ? (
            <div
              key={item.label}
              className={styles.revisaoItem}
              style={{ gridColumn: '1 / -1' }}
            >
              <span className={styles.revisaoItemLabel}>{item.label}</span>
              {item.vazio ? (
                <span className={styles.revisaoItemValorVazio}>Não informado</span>
              ) : (
                <span className={styles.revisaoItemValor} style={{ fontSize: 12, lineHeight: 1.5 }}>
                  {item.valor}
                </span>
              )}
            </div>
          ) : (
            <div key={item.label} className={styles.revisaoItem}>
              <span className={styles.revisaoItemLabel}>{item.label}</span>
              {item.vazio ? (
                <span className={styles.revisaoItemValorVazio}>—</span>
              ) : item.cor ? (
                <span className={`${styles.revisaoItemValor} ${styles.revisaoCorBadge}`}>
                  <span
                    className={styles.revisaoCorDot}
                    style={{ backgroundColor: item.valor }}
                  />
                  {item.valor}
                </span>
              ) : item.ouro ? (
                <span className={styles.revisaoItemValorOuro}>{item.valor}</span>
              ) : (
                <span className={styles.revisaoItemValor}>{item.valor}</span>
              )}
            </div>
          )
        ))}

        {camposObrigatoriosFaltando && (
          <div className={styles.avisoRevisao}>
            <IcInfo />
            Preencha os campos obrigatórios (nome e descrição) antes de salvar.
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Componente principal ────────────────────────────── */
export default function ModalAdicionarCategoria({
  aberto = true,
  aoFechar,
  aoSalvar,
// isOpen,
// fecharModal
}) {
  const overlayRef = useRef(null);
  const containerRef = useRef(null);
  const barraRef = useRef(null);

  const [etapaAtual, setEtapaAtual] = useState(1);
  const [dados, setDados] = useState({
    nome: '',
    slug: '',
    descricao: '',
    status: true,
    imagemUrl: null,
    imagemNome: null,
    imagemTamanho: null,
    icone: '💎',
    cor: '#C9A84C',
  });

  const atualizarDados = useCallback((parcial) => {
    setDados((prev) => ({ ...prev, ...parcial }));
  }, []);

  /* ── Animação de entrada ──────────────────────────── */
  useGSAP(() => {
    if (!aberto) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.28 }
    )
    .fromTo(
      containerRef.current,
      { opacity: 0, y: 28, scale: 0.975 },
      { opacity: 1, y: 0, scale: 1, duration: 0.38 },
      '-=0.16'
    );
  }, { scope: overlayRef, dependencies: [aberto] });

  /* ── Animação de saída e fechar ───────────────────── */
  const fecharComAnimacao = useCallback(() => {
    const tl = gsap.timeline({
      onComplete: () => aoFechar?.(),
    });
    tl.to(containerRef.current, {
      opacity: 0,
      y: 18,
      scale: 0.975,
      duration: 0.22,
      ease: 'power2.in',
    })
    .to(overlayRef.current, { opacity: 0, duration: 0.18, ease: 'linear' }, '-=0.12');
  }, [aoFechar]);

  /* ── Animação de transição de etapa ───────────────── */
  useEffect(() => {
    if (!barraRef.current) return;
    gsap.fromTo(
      barraRef.current.querySelectorAll('[data-etapa-conteudo]'),
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.22, stagger: 0.04, ease: 'power2.out' }
    );
  }, [etapaAtual]);

  /* ── Navegação ─────────────────────────────────────── */
  const irParaEtapa = (nova) => {
    if (nova < 1 || nova > ETAPAS.length) return;
    setEtapaAtual(nova);
  };

  const avancar = () => irParaEtapa(etapaAtual + 1);
  const voltar = () => irParaEtapa(etapaAtual - 1);

  const salvar = () => {
    aoSalvar?.({ ...dados, criadoEm: new Date().toISOString() });
    fecharComAnimacao();
  };

  const podeSalvar = dados.nome.trim() && dados.descricao.trim();

  /* ── Porcentagem da barra ────────────────────────── */
  const porcentagemBarra = ((etapaAtual - 1) / (ETAPAS.length - 1)) * 100;

  if (!aberto) return null;

  return (
    <div className={styles.modalCategoria}>
      {/* Overlay com blur */}
      <div ref={overlayRef} className={styles.overlay}>
        {/* Container do modal */}
        <div ref={containerRef} className={styles.container} role="dialog" aria-modal="true" aria-labelledby="titulo-modal">

          {/* ── Cabeçalho ─────────────────────────────── */}
          <div className={styles.cabecalho}>
            <div className={styles.cabecalhoEsquerda}>
              <span className={styles.labelSuperior}>Dashboard Admin · Catálogo</span>
              <h2 id="titulo-modal" className={styles.tituloPrincipal}>Nova Categoria</h2>
            </div>
            <button
              type="button"
              className={styles.botaoFechar}
              onClick={fecharComAnimacao}
              aria-label="Fechar modal"
            >
              <IcFechar />
            </button>
          </div>

          {/* ── Barra de progresso ──────────────────── */}
          <div className={styles.barraProgresso} ref={barraRef}>
            <div className={styles.etapasContainer}>
              {ETAPAS.map((etapa, idx) => {
                const concluida = etapa.id < etapaAtual;
                const ativa = etapa.id === etapaAtual;
                const ehUltima = idx === ETAPAS.length - 1;

                return (
                  <React.Fragment key={etapa.id}>
                    <div
                      className={`
                        ${styles.etapaItem}
                        ${ativa ? styles.etapaAtiva : ''}
                        ${concluida ? styles.etapaConcluida : ''}
                      `}
                      onClick={() => concluida && irParaEtapa(etapa.id)}
                      data-etapa-conteudo
                    >
                      <div className={styles.etapaConteudo}>
                        <div className={styles.etapaNumero}>
                          {concluida ? <IcCheck /> : etapa.id}
                        </div>
                        <span className={styles.etapaLabel}>{etapa.rotulo}</span>
                      </div>
                    </div>

                    {!ehUltima && (
                      <div className={styles.etapaConector}>
                        <div
                          className={styles.etapaConectorPreenchimento}
                          style={{
                            width: etapa.id < etapaAtual ? '100%' : '0%',
                          }}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* ── Corpo principal (Preview + Formulário) ── */}
          <div className={styles.corpo}>

            {/* Painel esquerdo: Preview em tempo real */}
            <div className={styles.painelPreview}>
              <span className={styles.labelPreview}>Preview em tempo real</span>
              <div className={styles.cartaoPreviewWrapper}>
                <CartaoPreview dados={dados} />

                {/* Mini cards de stats */}
                <div className={styles.previewMiniStats}>
                  <div className={styles.miniStatCard}>
                    <span className={styles.miniStatLabel}>Produtos</span>
                    <span className={styles.miniStatValor}>—</span>
                  </div>
                  <div className={styles.miniStatCard}>
                    <span className={styles.miniStatLabel}>Visualizações</span>
                    <span className={styles.miniStatValor}>—</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Painel direito: Formulário multi-etapas */}
            <div className={styles.painelFormulario}>
              <div className={styles.formularioScroll}>
                {etapaAtual === 1 && (
                  <EtapaInformacoes dados={dados} aoAtualizar={atualizarDados} />
                )}
                {etapaAtual === 2 && (
                  <EtapaAparencia dados={dados} aoAtualizar={atualizarDados} />
                )}
                {etapaAtual === 3 && (
                  <EtapaRevisao dados={dados} />
                )}
              </div>

              {/* ── Botões de ação ──────────────────── */}
              <div className={styles.botoesAcao}>
                <div className={styles.botoesAcaoEsquerda}>
                  {etapaAtual > 1 && (
                    <button
                      type="button"
                      className={styles.botaoSecundario}
                      onClick={voltar}
                    >
                      <IcSeta dir="left" />
                      Voltar
                    </button>
                  )}
                  <button
                    type="button"
                    className={styles.botaoSecundario}
                    onClick={fecharComAnimacao}
                  >
                    Cancelar
                  </button>
                </div>

                <div className={styles.botoesAcaoDireita}>
                  {etapaAtual < ETAPAS.length ? (
                    <button
                      type="button"
                      className={styles.botaoPrimario}
                      onClick={avancar}
                    >
                      Próximo
                      <IcSeta dir="right" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={styles.botaoSalvar}
                      onClick={salvar}
                      disabled={!podeSalvar}
                      style={{ opacity: podeSalvar ? 1 : 0.45, cursor: podeSalvar ? 'pointer' : 'not-allowed' }}
                    >
                      <IcSalvar />
                      Salvar categoria
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}