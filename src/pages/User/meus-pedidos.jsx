import { useState, useEffect } from "react";
import styles from "../../styles/User/meus-pedidos.module.css";
import { api } from "../../services/api"


const pedidosMock = [
    {
        id: "AZ-5482",
        data: "31 Jul 2026",
        status: "Em Transporte",
        total: "R$ 1.890,00",
        itens: [
            "Colar Aurora Premium",
            "Anel Imperial Gold"
        ]
    },
    {
        id: "AZ-5410",
        data: "24 Jul 2026",
        status: "Entregue",
        total: "R$ 690,00",
        itens: [
            "Pulseira Elegance"
        ]
    },
    {
        id: "AZ-5321",
        data: "18 Jul 2026",
        status: "Processando",
        total: "R$ 2.450,00",
        itens: [
            "Anel Diamond",
            "Colar Royal",
            "Brinco Essence"
        ]
    }
];

export default function MeusPedidos() {
    const [pedidoAberto, setPedidoAberto] = useState(null);
    const [pedidos, setPedidos] = useState([])
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        async function carregarPedidos() {
            try {

                setCarregando(true)
                const resposta = await api.get("/pedidos/meus-pedidos")

                console.log(resposta.data)


                setPedidos(resposta.data)

            } catch (error) {
                console.error(error)
            } finally{
                setCarregando(false)
            }
        }

        carregarPedidos()
    }, [])

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Meus Pedidos</h1>
                <p>Acompanhe suas compras e entregas.</p>
            </header>

            <section className={styles.stats}>
                <div className={styles.statCard}>
                    <span>12</span>
                    <p>Pedidos</p>
                </div>

                <div className={styles.statCard}>
                    <span>9</span>
                    <p>Entregues</p>
                </div>

                <div className={styles.statCard}>
                    <span>2</span>
                    <p>Em Transporte</p>
                </div>

                <div className={styles.statCard}>
                    <span>1</span>
                    <p>Processando</p>
                </div>
            </section>

            <section className={styles.listaPedidos}>
                {pedidos.map((pedido) => (
                    <div key={pedido.id} className={styles.cardPedido}>
                        <div className={styles.topoPedido}>
                            <div>
                                <h3>Pedido #{pedido.id}</h3>
                                <span>{pedido.data}</span>
                            </div>

                            <div className={styles.infoDireita}>
                                {/* <span
                                    className={`${styles.status} ${styles[pedido.status.replace(/\s/g, "")]
                                        }`}
                                >
                                    {pedido.status}
                                </span> */}

                                <strong>{pedido.total}</strong>
                            </div>
                        </div>

                        <div className={styles.produtos}>
                            {pedido.itens?.map((item, index) => (
                                <div key={index} className={styles.produto}>
                                    {item}
                                </div>
                            ))}
                        </div>

                        <div className={styles.footerPedido}>
                            <button
                                onClick={() =>
                                    setPedidoAberto(
                                        pedidoAberto === pedido.id ? null : pedido.id
                                    )
                                }
                            >
                                {pedidoAberto === pedido.id
                                    ? "Ocultar Detalhes"
                                    : "Ver Detalhes"}
                            </button>
                        </div>

                        {pedidoAberto === pedido.id && (
                            <div className={styles.detalhes}>
                                <div>
                                    <h4>Endereço</h4>
                                    <p>Rua Exemplo, 123 - São Paulo</p>
                                </div>

                                <div>
                                    <h4>Pagamento</h4>
                                    <p>Cartão de Crédito</p>
                                </div>

                                <div>
                                    <h4>Rastreamento</h4>
                                    <p>BR123456789</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </section>
        </div>
    );
}