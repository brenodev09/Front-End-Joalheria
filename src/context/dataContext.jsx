import { useEffect, useState, useCallback } from "react"
import { api } from "../services/api"

export default function useDashboard() {

    const [metricas, setMetricas] = useState({})
    const [estoqueCategorias, setEstoqueCategorias] = useState([])
    const [alertasEstoque, setAlertasEstoque] = useState([])
    const [produtosRecentes, setProdutosRecentes] = useState([])
    const [vendas, setVendas] = useState({})
    const [metaMensal, setMetaMensal] = useState({})
    const [todasMetas, setTodasMetas] = useState([])
    const [carregando, setCarregando] = useState(true)

    const carregarDashboard = useCallback(async () => {

        try {

            const [
                metricas,
                estoqueCategorias,
                alertas,
                produtosRecentes,
                vendas,
            ] = await Promise.all([
                api.get("/dashboard/metricas"),
                api.get("/dashboard/estoque-categorias"),
                api.get("/dashboard/alertas-estoque"),
                api.get("/dashboard/produtos-recentes"),
                api.get("/dashboard/resumo-vendas"),
            ])

            try {
                const metaDoMes = await api.get("/dashboard/metas-mensais/atual")
                setMetaMensal(metaDoMes.data)
            } catch {
                setMetaMensal({})
            }

            try {
                const todas = await api.get("/dashboard/metas-mensais")
                setTodasMetas(todas.data)
            } catch (error) {
                console.error("Erro ao buscar todas as metas:", error.response?.data || error.message)
                setTodasMetas([])
            }

            setMetricas(metricas.data)
            setEstoqueCategorias(estoqueCategorias.data)
            setAlertasEstoque(alertas.data)
            setProdutosRecentes(produtosRecentes.data)
            setVendas(vendas.data)

        } catch (error) {

            console.error("Erro dashboard:", error.response?.data || error)

        } finally {

            setCarregando(false)

        }

    }, [])

    useEffect(() => {
        carregarDashboard()
    }, [carregarDashboard])

    return {
        metricas,
        estoqueCategorias,
        alertasEstoque,
        produtosRecentes,
        vendas,
        metaMensal,
        todasMetas,
        carregando,
        carregarDashboard
    }

}