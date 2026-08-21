import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react"

import { api } from "../services/api"

const PedidosContext = createContext()

export function PedidosProvider({ children }) {

    const [pedidos, setPedidos] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState(null)

    async function carregarPedidos() {

        try {

            setCarregando(true)
            setErro(null)

            const resposta = await api.get("/pedidos/meus-pedidos")

            setPedidos(resposta.data)

        } catch (error) {

            console.error(
                "Erro ao carregar pedidos:",
                error
            )

            setErro(
                error.response?.data?.erro ||
                "Não foi possível carregar seus pedidos."
            )

        } finally {

            setCarregando(false)

        }
    }

    useEffect(() => {

        carregarPedidos()

    }, [])

    const resumo = useMemo(() => {

        return {

            total: pedidos.length,

            pendentes: pedidos.filter(
                pedido =>
                    pedido.status_pedido === "pendente"
            ).length,

            pagos: pedidos.filter(
                pedido =>
                    pedido.status_pedido === "pago"
            ).length,

            separacao: pedidos.filter(
                pedido =>
                    pedido.status_pedido === "separacao"
            ).length,

            enviados: pedidos.filter(
                pedido =>
                    pedido.status_pedido === "enviado"
            ).length,

            entregues: pedidos.filter(
                pedido =>
                    pedido.status_pedido === "entregue"
            ).length,

            cancelados: pedidos.filter(
                pedido =>
                    pedido.status_pedido === "cancelado"
            ).length,

            totalGasto: pedidos.reduce(
                (acumulado, pedido) =>
                    acumulado + Number(pedido.total || 0),
                0
            )

        }

    }, [pedidos])

    return (

        <PedidosContext.Provider
            value={{
                pedidos,
                setPedidos,
                resumo,
                carregando,
                erro,
                carregarPedidos
            }}
        >

            {children}

        </PedidosContext.Provider>

    )
}

export function usePedidos() {

    const context = useContext(PedidosContext)

    if (!context) {

        throw new Error(
            "usePedidos deve ser utilizado dentro de um PedidosProvider"
        )

    }

    return context
}