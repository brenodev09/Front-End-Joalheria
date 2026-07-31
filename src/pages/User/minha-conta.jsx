import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "../../styles/User/minha-conta.module.css";
import {
    usuario,
    resumo,
    pedidosRecentes,
    favoritosRecentes,
    timelineAtividades,
} from "./mockData";

gsap.registerPlugin(ScrollTrigger);

/* --------------------------------- Ícones ---------------------------------
   Ícones inline em SVG (sem dependências externas), traço fino,
   coerente com a estética de joalheria.
---------------------------------------------------------------------------- */

const Icon = {
    edit: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
    ),
    camera: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" />
            <circle cx="12" cy="13" r="4" />
        </svg>
    ),
    bag: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
    ),
    heart: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
        </svg>
    ),
    cart: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
        </svg>
    ),
    gem: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M6 3h12l4 6-10 12L2 9Z" />
            <path d="M2 9h20" />
            <path d="M12 3 8 9l4 12 4-12Z" />
        </svg>
    ),
    user: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M20 21a8 8 0 1 0-16 0" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    ),
    mail: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m2 7 10 6 10-6" />
        </svg>
    ),
    lock: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="4" y="11" width="16" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
    ),
    phone: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z" />
        </svg>
    ),
    cake: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
            <path d="M4 16s.5-1 2-1 2 1 3.5 1 2-1 3.5-1 2 1 3.5 1 2-1 2-1" />
            <path d="M12 3v4M9 3v2M15 3v2" />
        </svg>
    ),
    eye: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    ),
    eyeOff: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M17.9 17.9A10.4 10.4 0 0 1 12 20c-7 0-11-8-11-8a19.4 19.4 0 0 1 5-5.9M9.9 4.2A9.4 9.4 0 0 1 12 4c7 0 11 8 11 8a19.4 19.4 0 0 1-3.3 4.4M14.1 14.1a3 3 0 1 1-4.2-4.2" />
            <path d="M1 1l22 22" />
        </svg>
    ),
    check: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M4 12.6 9.5 18 20 6" />
        </svg>
    ),
    truck: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="1" y="6" width="14" height="11" rx="1" />
            <path d="M15 10h4l3 3v4h-7z" />
            <circle cx="6" cy="19" r="1.6" />
            <circle cx="17.5" cy="19" r="1.6" />
        </svg>
    ),
    box: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 8 12 3 3 8v8l9 5 9-5Z" />
            <path d="M3 8l9 5 9-5M12 13v8" />
        </svg>
    ),
};

const statusStyle = {
    Entregue: styles.statusEntregue,
    Enviado: styles.statusEnviado,
    Processando: styles.statusProcessando,
    Cancelado: styles.statusCancelado,
};

function formatarData(iso) {
    const [ano, mes, dia] = iso.split("-");
    return `${dia}/${mes}/${ano}`;
}

export default function MinhaConta() {
    const containerRef = useRef(null);
    const [senhaVisivel, setSenhaVisivel] = useState(false);

    useGSAP(
        () => {
            // Entrada geral da página: fade + slide up
            gsap.set(".gsap-fade-up", { opacity: 0, y: 24 });
            gsap.set(".gsap-hero", { opacity: 0, y: 18, scale: 0.98 });
            gsap.set(".gsap-stat", { opacity: 0, y: 20 });
            gsap.set(".gsap-input", { opacity: 0, y: 10 });

            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            tl.to(".gsap-hero", { opacity: 1, y: 0, scale: 1, duration: 0.75 })
                .to(
                    ".gsap-stat",
                    { opacity: 1, y: 0, duration: 0.55, stagger: 0.09 },
                    "-=0.4"
                )
                .to(
                    ".gsap-fade-up",
                    { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
                    "-=0.25"
                )
                .to(
                    ".gsap-input",
                    { opacity: 1, y: 0, duration: 0.4, stagger: 0.06 },
                    "-=0.3"
                );

            // Corrente da timeline: desenha-se de cima para baixo ao entrar em vista
            gsap.fromTo(
                ".gsap-thread",
                { scaleY: 0 },
                {
                    scaleY: 1,
                    duration: 1.1,
                    ease: "power2.inOut",
                    scrollTrigger: {
                        trigger: ".gsap-timeline-section",
                        start: "top 75%",
                    },
                }
            );

            // Elos (nós) da timeline aparecendo progressivamente
            gsap.fromTo(
                ".gsap-timeline-node",
                { opacity: 0, scale: 0.4 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    stagger: 0.22,
                    ease: "back.out(2)",
                    scrollTrigger: {
                        trigger: ".gsap-timeline-section",
                        start: "top 75%",
                    },
                }
            );

            // Favoritos: stagger leve ao entrar em vista
            gsap.fromTo(
                ".gsap-fav-card",
                { opacity: 0, y: 18 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".gsap-fav-section",
                        start: "top 80%",
                    },
                }
            );

            // Pedidos: stagger leve ao entrar em vista
            gsap.fromTo(
                ".gsap-order-row",
                { opacity: 0, x: -14 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.5,
                    stagger: 0.07,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".gsap-orders-section",
                        start: "top 80%",
                    },
                }
            );
        },
        { scope: containerRef }
    );

    return (
        <div className={styles.page} ref={containerRef}>
            {/* ---------------------------------- Hero ---------------------------------- */}
            <section className={`${styles.hero} gsap-hero`}>
                <div className={styles.avatarWrap}>
                    <div className={styles.avatar}>{usuario.iniciais}</div>
                    <span className={styles.avatarStatus} />
                </div>

                <div className={styles.heroInfo}>
                    <div className={styles.heroNameRow}>
                        <h1 className={styles.heroName}>{usuario.nome}</h1>
                        <div className={styles.perfilBadgeCargo}>
                            {/* substitua por ícone da sua lib */}
                            <span className={styles.perfilBadgeCargoIconePlaceholder} />
                            <span className={styles.perfilBadgeCargoTexto}>
                                Usuário
                            </span>
                        </div>
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
                            <span>Conta criada em { }</span>
                        </div>
                        <span className={styles.perfilMetaSeparador} />

                        {/* <div className={styles.perfilMetaItem}>
                  <span className={styles.perfilMetaIconePlaceholder} />
                  <span>São Paulo, BR</span>
                </div> */}
                    </div>
                </div>

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
                    <button className={`btnPadrao ${styles.btnTrocarFoto}`} >
                        {/* substitua por ícone da sua lib */}
                        Alterar foto
                    </button>

                    <input
                        type="file"
                        accept="image/*"
                        //   ref={inputFotoRef}
                        style={{ display: "none" }}
                    //   onChange={enviarFoto}
                    />
                </div>
            </section>

            {/* -------------------------------- Resumo ----------------------------------- */}
            <div className={styles.statsGrid}>
                {resumo.map((item) => (
                    <div className={`${styles.statCard} gsap-stat`} key={item.id}>
                        <div className={styles.statIcon}>{Icon[item.icone]}</div>
                        <p className={styles.statValue}>{item.valor}</p>
                        <p className={styles.statLabel}>{item.label}</p>
                    </div>
                ))}
            </div>

            {/* ---------------------------- Informações da Conta -------------------------- */}
            <section className={`${styles.section} gsap-fade-up`}>
                <div className={styles.sectionHead}>
                    <div className={styles.secaoTituloLinha} />
                        <p className={styles.secaoTituloTexto}>Informações da Conta</p>
                    <div className={styles.secaoTituloOrnamento} />
                    <div className={styles.acoesForm}>

                        <div className={styles.btnsAcoes}>
                            <button className={`btnPadrao ${styles.btnCancelar}`}>
                                Cancelar alterações
                            </button>
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

                        {/* {erro && <p className={styles.erro}>{erro}</p>} */}
                    </div>

                </div>

                <div className={styles.formGrid}>
                    <div className={`${styles.field} gsap-input`}>
                        <label className={styles.fieldLabel}>Nome completo</label>
                        <div className={styles.inputWrap}>
                            <span className={styles.inputIcon}>{Icon.user}</span>
                            <input
                                className={styles.input}
                                type="text"
                                defaultValue={usuario.nome}
                            />
                        </div>
                    </div>

                    <div className={`${styles.field} gsap-input`}>
                        <label className={styles.fieldLabel}>E-mail</label>
                        <div className={styles.inputWrap}>
                            <span className={styles.inputIcon}>{Icon.mail}</span>
                            <input
                                className={styles.input}
                                type="email"
                                defaultValue={usuario.email}
                            />
                        </div>
                    </div>

                    <div className={`${styles.field} gsap-input`}>
                        <label className={styles.fieldLabel}>Telefone</label>
                        <div className={styles.inputWrap}>
                            <span className={styles.inputIcon}>{Icon.phone}</span>
                            <input
                                className={styles.input}
                                type="tel"
                                defaultValue={usuario.telefone}
                            />
                        </div>
                    </div>

                    <div className={`${styles.field} gsap-input`}>
                        <label className={styles.fieldLabel}>Data de nascimento</label>
                        <div className={styles.inputWrap}>
                            <span className={styles.inputIcon}>{Icon.cake}</span>
                            <input
                                className={styles.input}
                                type="text"
                                defaultValue={formatarData(usuario.nascimento)}
                            />
                        </div>
                    </div>

                    <div className={`${styles.field} ${styles.fieldFull} gsap-input`}>
                        <label className={styles.fieldLabel}>Senha</label>
                        <div className={styles.inputWrap}>
                            <span className={styles.inputIcon}>{Icon.lock}</span>
                            <input
                                className={styles.input}
                                type={senhaVisivel ? "text" : "password"}
                                defaultValue="azory-senha-segura"
                            />
                            <button
                                type="button"
                                className={styles.inputToggle}
                                onClick={() => setSenhaVisivel((v) => !v)}
                                aria-label={senhaVisivel ? "Ocultar senha" : "Mostrar senha"}
                            >
                                {senhaVisivel ? Icon.eyeOff : Icon.eye}
                            </button>
                        </div>
                        <span className={styles.fieldHint}>
                            Última alteração há 3 meses · Use ao menos 8 caracteres com letras, números e símbolos
                        </span>
                    </div>
                </div>
            </section>

            {/* ------------------------------ Pedidos Recentes ---------------------------- */}
            {/* <section className={`${styles.section} gsap-fade-up gsap-orders-section`}>
                <div className={styles.sectionHead}>
                    <div className={styles.sectionTitleWrap}>
                        <span className={styles.sectionBar} />
                        <h2 className={styles.sectionTitle}>Pedidos Recentes</h2>
                    </div>
                    <button className={`${styles.btn} ${styles.btnText}`} type="button">
                        Ver todos os pedidos
                    </button>
                </div>

                <div className={styles.ordersList}>
                    {pedidosRecentes.map((pedido) => (
                        <div className={`${styles.orderRow} gsap-order-row`} key={pedido.id}>
                            <span className={styles.orderId}>{pedido.id}</span>
                            <span className={styles.orderItems}>{pedido.itens}</span>
                            <span className={styles.orderDate}>{pedido.data}</span>
                            <span className={styles.orderTotal}>{pedido.total}</span>
                            <span className={`${styles.statusBadge} ${statusStyle[pedido.status]}`}>
                                <span className={styles.statusDot} />
                                {pedido.status}
                            </span>
                        </div>
                    ))}
                </div>
            </section> */}

            {/* ------------------------------ Favoritos Recentes --------------------------- */}
            {/* <section className={`${styles.section} gsap-fade-up gsap-fav-section`}>
                <div className={styles.sectionHead}>
                    <div className={styles.sectionTitleWrap}>
                        <span className={styles.sectionBar} />
                        <h2 className={styles.sectionTitle}>Favoritos Recentes</h2>
                    </div>
                    <button className={`${styles.btn} ${styles.btnText}`} type="button">
                        Ver todos os favoritos
                    </button>
                </div>

                <div className={styles.favGrid}>
                    {favoritosRecentes.map((produto) => (
                        <div className={`${styles.favCard} gsap-fav-card`} key={produto.id}>
                            <div className={styles.favThumb}>{Icon.gem}</div>
                            <p className={styles.favCategory}>{produto.categoria}</p>
                            <h3 className={styles.favName}>{produto.nome}</h3>
                            <span className={styles.favPrice}>{produto.preco}</span>
                        </div>
                    ))}
                </div>
            </section> */}

            {/* ----------------------------- Timeline de Atividades ------------------------- */}
            {/* <section className={`${styles.section} gsap-fade-up gsap-timeline-section`}>
                <div className={styles.sectionHead}>
                    <div className={styles.sectionTitleWrap}>
                        <span className={styles.sectionBar} />
                        <h2 className={styles.sectionTitle}>Timeline de Atividades</h2>
                    </div>
                </div>

                <div className={styles.timeline}>
                    <span className={`${styles.timelineThread} gsap-thread`} />
                    {timelineAtividades.map((atividade, index) => {
                        const icones = [Icon.bag, Icon.check, Icon.truck, Icon.box];
                        return (
                            <div className={styles.timelineItem} key={atividade.id}>
                                <span className={`${styles.timelineNode} gsap-timeline-node`}>
                                    {icones[index]}
                                </span>
                                <div className={styles.timelineBody}>
                                    <h3 className={styles.timelineTitle}>{atividade.titulo}</h3>
                                    <p className={styles.timelineDesc}>{atividade.descricao}</p>
                                    <span className={styles.timelineDate}>{atividade.data}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section> */}
        </div>
    );
}