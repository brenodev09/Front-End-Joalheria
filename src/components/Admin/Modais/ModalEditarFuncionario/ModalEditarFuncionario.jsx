import { useEffect, useState } from 'react';
import style from './styles.module.css';
import {api} from "../../../../services/api"

const ETAPAS = [
  { numero: 1, rotulo: 'Informações' },
  { numero: 2, rotulo: 'Revisão' },
];

// Converte a data de admissão vinda do funcionário (pode chegar como ISO
// "aaaa-mm-ddTHH:MM:ss.000Z" da API, ou como "dd/mm/aaaa" em telas antigas)
// pro formato "aaaa-mm-dd" que o <input type="date"> espera.
function paraInputDate(valor) {
  if (!valor) return '';

  if (/^\d{4}-\d{2}-\d{2}/.test(valor)) {
    return valor.slice(0, 10);
  }

  if (valor.includes('/')) {
    const [dia, mes, ano] = valor.split('/');
    return `${ano}-${mes}-${dia}`;
  }

  return '';
}

// Converte "aaaa-mm-dd" (valor do <input type="date">) pra "dd/mm/aaaa",
// usado só na tela de revisão.
function formatarDataAdmissao(valorIso) {
  if (!valorIso) return '—';
  const [ano, mes, dia] = valorIso.split('-');
  return `${dia}/${mes}/${ano}`;
}

// Monta a URL da foto pro <img>: se for um preview novo (blob: local), usa
// direto; se for o caminho relativo salvo no banco (ex.: "/uploads/x.png"),
// prefixa com o host da API.
function resolverFotoUrl(caminho) {
  if (!caminho) return null;
  if (caminho.startsWith('blob:') || caminho.startsWith('http')) return caminho;
  return `http://localhost:3000${caminho}`;
}

// Modal de edição de funcionário, no mesmo padrão em duas etapas do modal de
// adicionar (Informações -> Revisão), só que já chega com os dados do
// funcionário selecionado preenchidos.
export default function ModalEditarFuncionario({ isOpen, fecharModal, funcionario, cargosDisponiveis = [], aoSalvar }) {
  const [etapa, setEtapa] = useState(1);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cargo, setCargo] = useState("");
  const [dataAdmissao, setDataAdmissao] = useState("");
  const [ativo, setAtivo] = useState(true);

  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Preenche o formulário com os dados do funcionário sempre que o modal abre.
  useEffect(() => {
    if (!isOpen || !funcionario) return;

    setEtapa(1);
    setNome(funcionario.nome || '');
    setEmail(funcionario.email || '');
    setTelefone(funcionario.telefone && funcionario.telefone !== '—' ? funcionario.telefone : '');
    setCargo(funcionario.cargo || '');
    setDataAdmissao(paraInputDate(funcionario.data_admissao));
    setAtivo(funcionario.ativo === 1 || funcionario.ativo === true);
    setFoto(null);
    setFotoPreview(funcionario.foto || null);
    setErro('');
    setSalvando(false);
  }, [isOpen, funcionario]);

  useEffect(() => {
    return () => {
      if (fotoPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(fotoPreview);
      }
    };
  }, [fotoPreview]);

  function capturarFoto(event) {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;

    if (fotoPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(fotoPreview);
    }

    setFoto(arquivo);
    setFotoPreview(URL.createObjectURL(arquivo));
  }

  function mostrarErro(mensagem) {
    setErro(mensagem);
    setTimeout(() => setErro(''), 3500);
  }

  function avancar() {
    if (!nome.trim() || !email.trim() || !cargo.trim()) {
      mostrarErro('Preencha nome, e-mail e cargo para continuar.');
      return;
    }
    setEtapa(2);
  }

  function voltar() {
    setEtapa(1);
  }

  async function salvarAlteracoes(event) {
    event.preventDefault();
    setSalvando(true);

    try {
      const formData = new FormData();

      formData.append("nome", nome);
      formData.append("email", email);
      formData.append("cargo", cargo);
      formData.append("telefone", telefone);
      formData.append("data_admissao", dataAdmissao);
      formData.append("ativo", ativo);
      if (foto) formData.append("foto", foto);

      const resposta = await api.put(`/funcionarios/editar-funcionario/${funcionario.id}`, formData);

      fecharModal();
      aoSalvar?.(resposta.data);

    } catch (error) {
      console.error(error);
      mostrarErro(error.response?.data?.erro || "Erro ao editar funcionário");
    } finally {
      setSalvando(false);
    }
  }

  if (!isOpen || !funcionario) return null;

  const fotoPreviewUrl = resolverFotoUrl(fotoPreview);

  return (
    <main className={style.overlayModal}>
      <section className={style.containerModal}>
        {/* HEADER */}
        <div className={style.cabecalhoModal}>
          <div>
            <h1 className={style.tituloModal}>EDITAR FUNCIONÁRIO</h1>
            <p className={style.subtituloModal}>Atualize os dados do funcionário selecionado</p>
          </div>

          <div className={style.etapasModal}>
            {ETAPAS.map((item, indice) => (
              <div key={item.numero} className={style.itemEtapa}>
                <div className={`${style.circuloEtapa} ${etapa >= item.numero ? style.etapaAtiva : ''}`}>
                  {item.numero}
                </div>
                <span className={`${style.textoEtapa} ${etapa >= item.numero ? style.textoEtapaAtiva : ''}`}>
                  {item.rotulo}
                </span>
                {indice < ETAPAS.length - 1 && (
                  <div className={`${style.linhaEtapa} ${etapa > item.numero ? style.linhaPreenchida : ''}`} />
                )}
              </div>
            ))}
          </div>

          <button type="button" onClick={fecharModal} className={style.botaoFechar} disabled={salvando}>
            X
          </button>
        </div>

        <div className={style.contentModal}>
          {/* PREVIEW */}
          <aside className={style.containerPreview}>
            <p>PREVIEW EM TEMPO REAL</p>

            <div className={style.cardPreview}>
              <div className={style.fotoPreviewCard}>
                {fotoPreviewUrl ? (
                  <img src={fotoPreviewUrl} alt={nome} className={style.imagemPreview} />
                ) : (
                  <span className={style.iconeAvatarVazio}>?</span>
                )}
              </div>

              <div className={style.textCard}>
                <h1>{nome || 'Nome do funcionário'}</h1>
                <p>{cargo || 'Cargo não informado'}</p>
                <p className={style.emailPreview}>{email || 'email@azory.com'}</p>
              </div>

              <span className={`${style.badgeStatusPreview} ${ativo ? style.badgeAtivo : style.badgeInativo}`}>
                {ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            {erro && <p className={style.mensagemErro}>{erro}</p>}

            <div className={style.botoesAcao}>
              {etapa === 1 ? (
                <>
                  <button type="button" className={style.btnCancelar} onClick={fecharModal} disabled={salvando}>
                    CANCELAR
                  </button>
                  <button type="button" className={style.btnAvancar} onClick={avancar}>
                    AVANÇAR
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className={style.btnCancelar} onClick={voltar} disabled={salvando}>
                    VOLTAR
                  </button>
                  <button type="button" className={style.btnSalvar} onClick={salvarAlteracoes} disabled={salvando}>
                    {salvando ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
                  </button>
                </>
              )}
            </div>
          </aside>

          {/* ETAPA 1 — INFORMAÇÕES */}
          {etapa === 1 && (
            <div className={style.containerFormulario}>
              <div className={style.cabecalhoSecao}>
                <p className={style.tituloSecao}>DADOS DO FUNCIONÁRIO</p>
                <div className={style.linhaTitulo} />
              </div>

              <div className={style.grupoCampo}>
                <p className={style.labelCampo}>NOME COMPLETO</p>
                <input
                  type="text"
                  className={style.inputCampo}
                  placeholder="Digite o nome do funcionário"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className={style.formGrid}>
                <div className={style.grupoCampo}>
                  <p className={style.labelCampo}>E-MAIL</p>
                  <input
                    type="email"
                    className={style.inputCampo}
                    placeholder="email@azory.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className={style.grupoCampo}>
                  <p className={style.labelCampo}>TELEFONE</p>
                  <input
                    type="tel"
                    className={style.inputCampo}
                    placeholder="(00) 00000-0000"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                  />
                </div>
              </div>

              <div className={style.formGrid}>
                <div className={style.grupoCampo}>
                  <p className={style.labelCampo}>CARGO</p>
                  <input
                    list="cargos-disponiveis-edicao"
                    type="text"
                    className={style.inputCampo}
                    placeholder="Ex.: Vendedor"
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                  />
                  <datalist id="cargos-disponiveis-edicao">
                    {cargosDisponiveis.map((cargoDisponivel) => (
                      <option key={cargoDisponivel} value={cargoDisponivel} />
                    ))}
                  </datalist>
                </div>

                <div className={style.grupoCampo}>
                  <p className={style.labelCampo}>DATA DE ADMISSÃO</p>
                  <input
                    type="date"
                    className={style.inputCampo}
                    value={dataAdmissao}
                    onChange={(e) => setDataAdmissao(e.target.value)}
                  />
                </div>
              </div>

              <div className={style.grupoCampo}>
                <p className={style.labelCampo}>FOTO DO FUNCIONÁRIO</p>

                <div className={style.areaUpload}>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className={style.inputArquivo}
                    onChange={capturarFoto}
                  />

                  <div className={style.conteudoUpload}>
                    {fotoPreviewUrl ? (
                      <div className={style.arquivoSelecionado}>
                        <img src={fotoPreviewUrl} alt="Foto selecionada" className={style.avatarSelecionado} />
                        <p>{foto ? foto.name : 'Clique para trocar a foto'}</p>
                      </div>
                    ) : (
                      <>
                        <img
                          width="40"
                          height="40"
                          src="https://img.icons8.com/pastel-glyph/64/C9A962/upload--v1.png"
                          alt="Upload"
                        />
                        <span className={style.textoUpload}>Clique aqui para adicionar a foto</span>
                        <span className={style.textoAuxiliar}>PNG, JPG, Webp — imagem quadrada de rosto</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className={style.cabecalhoSecao}>
                <p className={style.tituloSecao}>STATUS DO FUNCIONÁRIO</p>
                <div className={style.linhaTitulo} />
              </div>

              <div className={style.cardStatus}>
                <span>Funcionário ativo</span>
                <label className={style.switch}>
                  <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} />
                  <span className={style.slider} />
                </label>
              </div>
            </div>
          )}

          {/* ETAPA 2 — REVISÃO */}
          {etapa === 2 && (
            <div className={style.containerFormulario}>
              <div className={style.cabecalhoSecao}>
                <p className={style.tituloSecao}>CONFIRA OS DADOS ANTES DE SALVAR</p>
                <div className={style.linhaTitulo} />
              </div>

              <div className={style.gridRevisao}>
                <div className={style.itemRevisao}>
                  <p>NOME</p>
                  <span>{nome || '—'}</span>
                </div>

                <div className={style.itemRevisao}>
                  <p>CARGO</p>
                  <span>{cargo || '—'}</span>
                </div>

                <div className={style.itemRevisao}>
                  <p>E-MAIL</p>
                  <span>{email || '—'}</span>
                </div>

                <div className={style.itemRevisao}>
                  <p>TELEFONE</p>
                  <span>{telefone || '—'}</span>
                </div>

                <div className={style.itemRevisao}>
                  <p>DATA DE ADMISSÃO</p>
                  <span>{formatarDataAdmissao(dataAdmissao)}</span>
                </div>

                <div className={style.itemRevisao}>
                  <p>STATUS</p>
                  <span>{ativo ? 'Ativo' : 'Inativo'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}