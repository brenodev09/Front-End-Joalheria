import { createContext,useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api"
import { create } from "axios";

const PedidosContext = createContext()

export function PedidosProvider({children}) {
    const [pedidos, setPedidos] = useState([])

    useEffect(() => {

        async function carregarPedidos() {
            try {
                const resposta = await api.get("/pedidos/meus-pedidos")
                setPedidos(resposta.data)
            } catch (error) {
                console.error(error)
            }


        }

        carregarPedidos()


    }, [])


    const resumo = useMemo(() => ({
        total: pedidos.length,
        entregues: pedidos.filter((p) => p.status === "entregue").length,
        transporte: pedidos.filter((p) => p.status === "em_transporte").length,
        cancelados: pedidos.filter((p) => p.status === "cancelado").length,
        totalGasto: pedidos.reduce((acumulado, pedido) => acumulado + Number(pedido.total), 0)
        
    }), [pedidos])


    return (
        <PedidosContext.Provider value={{pedidos, resumo}}> 
            {children}
        </PedidosContext.Provider>
    )
}


export const usePedidos = () => useContext(PedidosContext)