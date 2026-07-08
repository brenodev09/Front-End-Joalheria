import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useAuth } from "../../context/authContext"
import { api } from "../../services/api"
import semFoto from "../../img/semFotoImg.png";
import styles from "../../styles/Admin/infoConta.module.css";
import NotificacaoEdicao from "../../components/Admin/PopUps/PopInfoConta"

/* ─── DADOS ESTÁTICOS (apenas visual) ─────────────────────────── */
// const ATIVIDADES = [
//   {
//     icone: null /* substitua por ícone da sua lib */,
//     cor: "Verde",
//     titulo: "Login realizado com sucesso",
//     sub: "Chrome · Windows · São Paulo, BR",
//     tempo: "Agora",
//   },
//   {
//     icone: null /* substitua por ícone da sua lib */,
//     cor: "Amarelo",
//     titulo: "Perfil atualizado",
//     sub: "Nome e avatar alterados",
//     tempo: "2h atrás",
//   },
//   {
//     icone: null /* substitua por ícone da sua lib */,
//     cor: "Azul",
//     titulo: "Senha alterada",
//     sub: "Via configurações de segurança",
//     tempo: "3 dias",
//   },
//   {
//     icone: null /* substitua por ícone da sua lib */,
//     cor: "Vermelho",
//     titulo: "Tentativa de acesso negada",
//     sub: "IP desconhecido bloqueado",
//     tempo: "1 semana",
//   },
// ];

const COR_ICONE = {
  Verde: styles.atividadeItemIconeVerde,
  Amarelo: styles.atividadeItemIconeAmarelo,
  Azul: styles.atividadeItemIconeAzul,
  Vermelho: styles.atividadeItemIconeVermelho,
};

/* ─── COMPONENTE ─────────────────────────────────────────────── */
export default function ContaAdmin() {
  const painelPerfilRef = useRef(null);
  const painelInfoRef = useRef(null);
  const painelSegurancaRef = useRef(null);
  const painelAtividadeRef = useRef(null);
  const painelAparenciaRef = useRef(null);
  const rodapeRef = useRef(null);


  // const [temaEscuro, setTemaEscuro] = useState(true);
  // const [alertasEmail, setAlertasEmail] = useState(false);
  const [erro, setErro] = useState("")

  const { usuario, atualizarUsuario } = useAuth()
  // console.log("USUARIO:", usuario);
  console.log("CRIADO_EM:", usuario?.criado_em);

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [editando, setEditando] = useState(false)
  const [mostrarNotificacao, setMostrarNotificacao] = useState(false)
  const [mostrarSenha, setMostrarSenha] = useState(false)


  function editarPerfil() {
    setEditando(true)

    setNome(usuario?.nome || "")
    setEmail(usuario?.email || "")
  }

  function cancelarEdicao() {
    setEditando(false)
    setNome("")
    setEmail("")
    setSenha("")

    if (erro) {
      setErro("")
    }
  }


  async function salvarAlteracoes(event) {
    event.preventDefault()

    if (!nome || !email) {
      setErro("Por favor, preencha todos os campos!")

      setTimeout(() => {
        setErro("")
      }, 3500)
      return
    }

    try {

      const dados = {
        nome: nome,
        email: email,
        senha: senha
      }

      const resposta = await api.put(`/usuarios/${usuario?.id}`, dados)

      atualizarUsuario({
        ...usuario,
        ...resposta.data
      })

      setMostrarNotificacao(true)

      setTimeout(() => {
        setMostrarNotificacao(false)
      }, 3500);

      setEditando(false)
      setNome("")
      setEmail("")
    } catch (erro) {
      console.log("STATUS:", erro.response?.status)
      console.log("DADOS:", erro.response?.data)

      console.error(erro)
      setErro("Erro ao editar o usuario")
      console.error(erro)
    }
  }


  const inputFotoRef = useRef(null)

  // funcao de enviar a imagem para o back

  async function enviarFoto(event) {
    const arquivo = event.target.files[0]

    if (!arquivo) return

    try {
      const formData = new FormData()

      formData.append("foto", arquivo)

      const resposta = await api.put(
        `/usuarios/${usuario.id}/foto`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      )

      atualizarUsuario({
        foto_perfil: resposta.data.foto_perfil
      });

      console.log(resposta.data)

    } catch (erro) {
      console.error(erro)
    }
  }


  /* ─── ANIMAÇÕES DE ENTRADA COM GSAP ─────────────────── */
  useGSAP(() => {
    const paineis = [
      painelPerfilRef.current,
      painelInfoRef.current,
      painelSegurancaRef.current,
      painelAtividadeRef.current,
      painelAparenciaRef.current,
    ];

    // Painéis em cascata
    gsap.fromTo(
      paineis,
      { y: 32, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.65,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.1,
      },
    );

    // Rodapé
    gsap.fromTo(
      rodapeRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.75 },
    );

    // Avatar com efeito de escala + rotação suave
    gsap.fromTo(
      ".avatarAnim",
      { scale: 0.7, opacity: 0, rotate: -10 },
      {
        scale: 1,
        opacity: 1,
        rotate: 0,
        duration: 0.8,
        ease: "back.out(1.5)",
        delay: 0.3,
      },
    );

    // Nome e badge com slide
    gsap.fromTo(
      ".nomeAnim",
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.55, ease: "power2.out", delay: 0.45 },
    );

    // Anel dourado pulsando ao aparecer
    gsap.fromTo(
      ".anelAnim",
      { boxShadow: "0 0 0px rgba(201, 168, 76, 0)" },
      {
        boxShadow: "0 0 30px rgba(201, 168, 76, 0.35)",
        duration: 1,
        ease: "power2.out",
        delay: 0.8,
      },
    );

    // Campos do formulário com stagger
    gsap.fromTo(
      ".campoAnim",
      { x: -16, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.45,
        ease: "power2.out",
        stagger: 0.06,
        delay: 0.45,
      },
    );

    // Cards de segurança
    gsap.fromTo(
      ".segurancaCardAnim",
      { scale: 0.94, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
        stagger: 0.08,
        delay: 0.55,
      },
    );

    // Itens de atividade
    gsap.fromTo(
      ".atividadeAnim",
      { x: 20, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
        stagger: 0.07,
        delay: 0.65,
      },
    );
  });

  const dataCriacao = usuario?.criado_em
    ? new Date(usuario.criado_em).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }) : ""

  function calcularDias(data) {
    const hoje = new Date()
    const dataAlteracao = new Date(data)

    const diferencaMs = hoje - dataAlteracao

    return Math.floor(
      diferencaMs / (1000 * 60 * 60 * 24)
    )
  }


  const dias = usuario?.atualizado_em
    ? calcularDias(usuario.atualizado_em)
    : 0

  /* ─── RENDER ─────────────────────────────────────────────── */
  return (

    <>



      <div className={styles.pagina}>
        <main className={styles.conteudo}>
          {/* ════ PAINEL PERFIL ════ */}
          <section
            ref={painelPerfilRef}
            className={`${styles.painel} ${styles.painelPerfil}`}
          >
            <div className={styles.painelPerfilFundo} />
            <div className={styles.painelPerfilFundoLinhas} />

            <div className={styles.perfilCorpo}>
              {/* Avatar */}
              <div className={`${styles.perfilAvatarWrapper} avatarAnim`}>
                <div className={`${styles.perfilAvatarAnel} anelAnim`}>
                  <img
                    src={usuario?.foto_perfil ? `http://localhost:3000${usuario.foto_perfil}` : semFoto}
                    alt="Avatar do usuário"
                    className={styles.perfilAvatar}
                  />
                </div>
                <div className={styles.perfilAvatarBadge} />
              </div>

              {/* Info */}
              <div className={`${styles.perfilInfo} nomeAnim`}>
                <h1 className={styles.perfilNome}>{usuario.nome}</h1>

                <div className={styles.perfilBadgeCargo}>
                  {/* substitua por ícone da sua lib */}
                  <span className={styles.perfilBadgeCargoIconePlaceholder} />
                  <span className={styles.perfilBadgeCargoTexto}>
                    Administrador
                  </span>
                </div>

                <div className={styles.perfilMeta}>
                  <div className={styles.perfilMetaItem}>
                    {/* substitua por ícone da sua lib */}
                    <div className={styles.perfilMetaIconePlaceholder}>
                      {/* <img width="10" height="10" src="https://img.icons8.com/parakeet-line/48/ffffff/new-post.png" alt="new-post"/> */}
                    </div>
                    <span>{usuario.email}</span>
                  </div>
                  <span className={styles.perfilMetaSeparador} />
                  <div className={styles.perfilMetaItem}>
                    {/* substitua por ícone da sua lib */}
                    <span className={styles.perfilMetaIconePlaceholder} />
                    <span>Conta criada em {dataCriacao}</span>
                  </div>
                  <span className={styles.perfilMetaSeparador} />

                  {/* <div className={styles.perfilMetaItem}>
                  <span className={styles.perfilMetaIconePlaceholder} />
                  <span>São Paulo, BR</span>
                </div> */}
                </div>
              </div>

              {/* Ações */}
              <div className={styles.perfilAcoes}>
                <button onClick={editarPerfil} className={styles.btnEditarPerfil}>
                  <img
                    width="16"
                    height="16"
                    src="https://img.icons8.com/material-rounded/24/edit--v1.png"
                    alt="edit--v1"
                  />
                  <p>EDITAR PERFIL </p>
                </button>
                <button className={`btnPadrao ${styles.btnTrocarFoto}`} onClick={() => inputFotoRef.current.click()}>
                  {/* substitua por ícone da sua lib */}
                  Alterar foto
                </button>

                <input
                  type="file"
                  accept="image/*"
                  ref={inputFotoRef}
                  style={{ display: "none" }}
                  onChange={enviarFoto}
                />
              </div>
            </div>
          </section>

          {/* ════ INFORMAÇÕES DA CONTA ════ */}
          <section ref={painelInfoRef} className={styles.painel}>

            <div className={styles.secaoTitulo}>
              <div className={styles.secaoTituloLinha} />
              <p className={styles.secaoTituloTexto}>Informações da Conta</p>
              <div className={styles.secaoTituloOrnamento} />

              <div className={styles.acoesForm}>

                <div className={styles.btnsAcoes}>
                  <button onClick={cancelarEdicao} className={`btnPadrao ${styles.btnCancelar}`}>
                    Cancelar alterações
                  </button>
                  <button onClick={salvarAlteracoes} className={styles.btnEditarPerfil}>
                    <img
                      width="22"
                      height="22"
                      src="https://img.icons8.com/sf-regular-filled/48/downloading-updates.png"
                      alt="downloading-updates"
                    />
                    <p>SALVAR ALTERAÇÕES </p>
                  </button>
                </div>

                {erro && <p className={styles.erro}>{erro}</p>}
              </div>


            </div>

            <form action="submit">

              <div className={styles.infoCorpo}>
                {/* Linha 1: 3 campos */}
                <div className={styles.infoGrade}>
                  <div className={`${styles.campoGrupo} campoAnim`}>
                    <label className={styles.campoRotulo}>Nome de usuário</label>
                    <div className={styles.campoWrapper}>
                      <img
                        width="22"
                        height="22"
                        src="https://img.icons8.com/windows/32/ffffff/collaborator-male.png"
                        alt=""
                        aria-hidden="true"
                      />
                      <input
                        className={`${styles.campoInput} ${editando ? styles.campoEditando : ""}`}
                        type="text"
                        value={nome}
                        onChange={(event) => setNome(event.target.value)}
                        placeholder="Nome de usuário"
                        readOnly={!editando}

                      />
                    </div>
                  </div>

                  <div className={`${styles.campoGrupo} campoAnim`}>
                    <label className={styles.campoRotulo}>E-mail</label>
                    <div className={styles.campoWrapper}>
                      <img
                        width="20"
                        height="20"
                        src="https://img.icons8.com/parakeet-line/48/ffffff/new-post.png"
                        alt=""
                        aria-hidden="true"
                      />
                      <input
                        className={`${styles.campoInput} ${editando ? styles.campoEditando : ""}`}
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="usuario@email.com"
                        readOnly={!editando}
                      />
                    </div>
                  </div>

                  {/* <div className={`${styles.campoGrupo} campoAnim`}>
                <label className={styles.campoRotulo}>Número</label>
                <div className={styles.campoWrapper}>
                  <img
                    width="20"
                    height="20"
                    src="https://img.icons8.com/ios/50/ffffff/phone--v1.png"
                    alt=""
                    aria-hidden="true"
                  />
                  <input
                    className={styles.campoInput}
                    type="tel"
                    placeholder="+55 (11) 99999-9999"
                    readOnly
                  />
                </div>
              </div> */}
                </div>

                {/* Linha 2: senha full width */}
                <div className={`${styles.infoGrade} ${styles.infoGradeCompleta}`}>
                  <div className={`${styles.campoGrupo} campoAnim`}>
                    <label className={styles.campoRotulo}>Senha</label>
                    <div className={styles.campoWrapper}>
                      <img
                        width="20"
                        height="20"
                        src="https://img.icons8.com/windows/32/ffffff/lock.png"
                        alt=""
                        aria-hidden="true"
                      />
                      <input
                        className={`${styles.campoInput} ${styles.campoInputSenha} ${editando ? styles.campoEditando : ""}`}
                        type={mostrarSenha ? "text" : "password"}
                        value={senha}
                        onChange={(event) => setSenha(event.target.value)}
                        placeholder="••••••••••••"
                        readOnly={!editando}
                      />
                      <button
                        className={styles.campoOlho}
                        type="button"
                        aria-label="Ver senha"
                        onClick={() => setMostrarSenha(!mostrarSenha)}
                      >
                        <img
                          width="20"
                          height="20"
                          src={mostrarSenha ? "https://img.icons8.com/material-outlined/24/ffffff/invisible.png" : "https://img.icons8.com/fluency-systems-regular/48/ffffff/visible--v1.png"}
                          alt=""
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                    <span className={styles.campoDescricao}>
                      Última alteração há {dias} dias · Use ao menos 8 caracteres com
                      letras, números e símbolos
                    </span>
                  </div>
                </div>
              </div>
            </form>

          </section>

          {/* ════ SEGURANÇA ════ */}
          {/* <section ref={painelSegurancaRef} className={styles.painel}>

            <div className={styles.secaoTitulo}>
              <div className={styles.secaoTituloLinha} />
              <span className={styles.secaoTituloTexto}>Segurança</span>
              <div className={styles.secaoTituloOrnamento} />
            </div>

            <div className={styles.segurancaCorpo}>
              <div className={styles.segurancaGrade}>
                <div className={`${styles.segurancaCard} segurancaCardAnim`}>
                  <div className={styles.segurancaCardIconeWrapper}>
                  </div>
                  <div className={styles.segurancaCardInfo}>
                    <div className={styles.segurancaCardTitulo}>
                      Alterar Senha
                    </div>
                    <div className={styles.segurancaCardDescricao}>
                      Atualize suas credenciais de acesso
                    </div>
                  </div>
                  <span className={styles.segurancaCardSeta}>›</span>
                </div>
              </div>

              <div className={`${styles.segurancaStatus} segurancaCardAnim`}>
                <div className={styles.segurancaStatusIndicador} />
                <span className={styles.segurancaStatusTexto}>
                  Conta protegida · Nenhuma ameaça detectada
                </span>
                <span className={styles.segurancaStatusSub}>
                  Verificado em 18 Mai 2026
                </span>
              </div>
            </div>
          </section> */}

          {/* ════ ATIVIDADE RECENTE ════ */}
          {/* <section ref={painelAtividadeRef} className={styles.painel}>
          <div className={styles.secaoTitulo}>
            <div className={styles.secaoTituloLinha} />
            <span className={styles.secaoTituloTexto}>Atividade Recente</span>
            <div className={styles.secaoTituloOrnamento} />
          </div>

          <div className={styles.atividadeCorpo}>
            <div className={styles.atividadeLista}>
              {ATIVIDADES.map((item, i) => (
                <div
                  key={i}
                  className={`${styles.atividadeItem} atividadeAnim`}
                >
                  <div
                    className={`${styles.atividadeItemIconeWrapper} ${COR_ICONE[item.cor]}`}
                  >
                    {item.icone}
                  </div>
                  <div className={styles.atividadeItemInfo}>
                    <div className={styles.atividadeItemTitulo}>
                      {item.titulo}
                    </div>
                    <div className={styles.atividadeItemSub}>{item.sub}</div>
                  </div>
                  <div className={styles.atividadeItemTempo}>{item.tempo}</div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

          {/* ════ APARÊNCIA & PREFERÊNCIAS ════ */}
          {/* <section ref={painelAparenciaRef} className={styles.painel}>
          <div className={styles.secaoTitulo}>
            <div className={styles.secaoTituloLinha} />
            <p className={styles.secaoTituloTexto}>
              Aparência & Preferências
            </p>
            <div className={styles.secaoTituloOrnamento} />
          </div>

          <div className={styles.aparenciaCorpo}>
            <div className={styles.aparenciaGrade}>
              <div className={styles.aparenciaOpcao}>   
                <div className={styles.aparenciaOpcaoInfo}>
                  <span className={styles.aparenciaOpcaoIconePlaceholder} />
                  <div className={styles.aparenciaOpcaoTextos}>
                    <span className={styles.aparenciaOpcaoTitulo}>
                      Tema Escuro
                    </span>
                    <span className={styles.aparenciaOpcaoSub}>
                      Modo atual da interface
                    </span>
                  </div>
                </div>
                <div
                  className={`${styles.toggle} ${temaEscuro ? styles.toggleAtivo : ""}`}
                  onClick={() => setTemaEscuro((v) => !v)}
                  role="switch"
                  aria-checked={temaEscuro}
                >
                  <div className={styles.toggleBolinha} />
                </div>
              </div>

              <div className={styles.aparenciaOpcao}>
                <div className={styles.aparenciaOpcaoInfo}>
                  <span className={styles.aparenciaOpcaoIconePlaceholder} />
                  <div className={styles.aparenciaOpcaoTextos}>
                    <span className={styles.aparenciaOpcaoTitulo}>
                      Alertas por E-mail
                    </span>
                    <span className={styles.aparenciaOpcaoSub}>
                      Notificações de segurança
                    </span>
                  </div>
                </div>
                <div
                  className={`${styles.toggle} ${alertasEmail ? styles.toggleAtivo : ""}`}
                  onClick={() => setAlertasEmail((v) => !v)}
                  role="switch"
                  aria-checked={alertasEmail}
                >
                  <div className={styles.toggleBolinha} />
                </div>
              </div>

              <div className={styles.aparenciaOpcao}>
                <div className={styles.aparenciaOpcaoInfo}>
                  <span className={styles.aparenciaOpcaoIconePlaceholder} />
                  <div className={styles.aparenciaOpcaoTextos}>
                    <span className={styles.aparenciaOpcaoTitulo}>Idioma</span>
                    <span className={styles.aparenciaOpcaoSub}>
                      Português (Brasil)
                    </span>
                  </div>
                </div>
                <span className={styles.aparenciaOpcaoSeta}>›</span>
              </div>

              <div className={styles.aparenciaOpcao}>
                <div className={styles.aparenciaOpcaoInfo}>
                  <span className={styles.aparenciaOpcaoIconePlaceholder} />
                  <div className={styles.aparenciaOpcaoTextos}>
                    <span className={styles.aparenciaOpcaoTitulo}>
                      Fuso Horário
                    </span>
                    <span className={styles.aparenciaOpcaoSub}>
                      UTC-3 · Brasília
                    </span>
                  </div>
                </div>
                <span className={styles.aparenciaOpcaoSeta}>›</span>
              </div>
            </div>
          </div>
        </section> */}

          {/* ════ RODAPÉ COM AÇÕES ════ */}
          {/* <div ref={rodapeRef} className={styles.rodape}>

            <div className={styles.rodapeAcoes}>
              <span className={styles.rodapeTexto}>Alterações não salvas</span>

            </div>
          </div> */}
        </main>
      </div>

      <NotificacaoEdicao visivel={mostrarNotificacao} />
    </>


  );
}
