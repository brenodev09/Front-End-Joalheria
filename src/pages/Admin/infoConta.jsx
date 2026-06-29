import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {useAuth} from "../../context/authContext"
import breno from "../../img/breno.jpeg";
import styles from "../../styles/Admin/infoConta.module.css";

/* ─── DADOS ESTÁTICOS (apenas visual) ─────────────────────────── */
const ATIVIDADES = [
  {
    icone: null /* substitua por ícone da sua lib */,
    cor: "Verde",
    titulo: "Login realizado com sucesso",
    sub: "Chrome · Windows · São Paulo, BR",
    tempo: "Agora",
  },
  {
    icone: null /* substitua por ícone da sua lib */,
    cor: "Amarelo",
    titulo: "Perfil atualizado",
    sub: "Nome e avatar alterados",
    tempo: "2h atrás",
  },
  {
    icone: null /* substitua por ícone da sua lib */,
    cor: "Azul",
    titulo: "Senha alterada",
    sub: "Via configurações de segurança",
    tempo: "3 dias",
  },
  {
    icone: null /* substitua por ícone da sua lib */,
    cor: "Vermelho",
    titulo: "Tentativa de acesso negada",
    sub: "IP desconhecido bloqueado",
    tempo: "1 semana",
  },
];

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
  

  const [temaEscuro, setTemaEscuro] = useState(true);
  const [alertasEmail, setAlertasEmail] = useState(false);
  const [erro, setErro] = useState("")

  const {usuario} = useAuth()
  console.log("USUARIO:", usuario);

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

 


  /* ─── RENDER ─────────────────────────────────────────────── */
  return (

    <>


      {erro &&  <p>{erro}</p>}

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
                  src={breno}
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
                  <span className={styles.perfilMetaIconePlaceholder} />
                  <span>{usuario.email}</span>
                </div>
                <span className={styles.perfilMetaSeparador} />
                <div className={styles.perfilMetaItem}>
                  {/* substitua por ícone da sua lib */}
                  <span className={styles.perfilMetaIconePlaceholder} />
                  <span>Conta criada em Jun 2026</span>
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
              <button className={styles.btnEditarPerfil}>
                <img
                  width="16"
                  height="16"
                  src="https://img.icons8.com/material-rounded/24/edit--v1.png"
                  alt="edit--v1"
                />
                <p>EDITAR PERFIL </p>
              </button>
              <button className={`btnPadrao ${styles.btnTrocarFoto}`}>
                {/* substitua por ícone da sua lib */}
                Alterar foto
              </button>
            </div>
          </div>
        </section>

        {/* ════ INFORMAÇÕES DA CONTA ════ */}
        <section ref={painelInfoRef} className={styles.painel}>
          <div className={styles.secaoTitulo}>
            <div className={styles.secaoTituloLinha} />
            <p className={styles.secaoTituloTexto}>Informações da Conta</p>
            <div className={styles.secaoTituloOrnamento} />
          </div>

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
                    className={styles.campoInput}
                    type="text"
                    placeholder="Breno Nunes"
                    readOnly
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
                    className={styles.campoInput}
                    type="email"
                    placeholder="brenadmin1010@gmail.com"
                    readOnly
                  />
                </div>
              </div>

              <div className={`${styles.campoGrupo} campoAnim`}>
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
              </div>
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
                    className={`${styles.campoInput} ${styles.campoInputSenha}`}
                    type="password"
                    placeholder="••••••••••••"
                    readOnly
                  />
                  <button
                    className={styles.campoOlho}
                    type="button"
                    aria-label="Ver senha"
                  >
                    <img
                      width="20"
                      height="20"
                      src="https://img.icons8.com/fluency-systems-regular/48/ffffff/visible--v1.png"
                      alt=""
                      aria-hidden="true"
                    />
                  </button>
                </div>
                <span className={styles.campoDescricao}>
                  Última alteração há 3 dias · Use ao menos 8 caracteres com
                  letras, números e símbolos
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ════ SEGURANÇA ════ */}
        <section ref={painelSegurancaRef} className={styles.painel}>
          <div className={styles.secaoTitulo}>
            <div className={styles.secaoTituloLinha} />
            <span className={styles.secaoTituloTexto}>Segurança</span>
            <div className={styles.secaoTituloOrnamento} />
          </div>

          <div className={styles.segurancaCorpo}>
            <div className={styles.segurancaGrade}>
              {/* Card: Alterar Senha */}
              <div className={`${styles.segurancaCard} segurancaCardAnim`}>
                <div className={styles.segurancaCardIconeWrapper}>
                  {/* substitua por ícone da sua lib */}
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

            {/* Status da conta */}
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
        </section>

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
        <div ref={rodapeRef} className={styles.rodape}>
          <button className={`btnPadrao ${styles.btnCancelar}`}>
            Cancelar alterações
          </button>
          <div className={styles.rodapeAcoes}>
            <span className={styles.rodapeTexto}>Alterações não salvas</span>
            <button className={styles.btnEditarPerfil}>
              <img
                width="22"
                height="22"
                src="https://img.icons8.com/sf-regular-filled/48/downloading-updates.png"
                alt="downloading-updates"
              />
              <p>SALVAR ALTERAÇÕES </p>
            </button>
          </div>
        </div>
      </main>
    </div>
    </>

    
  );
}
