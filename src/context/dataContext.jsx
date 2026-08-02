import { useEffect, useState } from "react"
import { api } from "../services/api"

export default function useDashboard() {

    const [metricas, setMetricas] = useState({})
    const [estoqueCategorias, setEstoqueCategorias] = useState([])
    const [alertasEstoque, setAlertasEstoque] = useState([])
    const [produtosRecentes, setProdutosRecentes] = useState([])
    const [vendas, setVendas] = useState({})
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {

        async function carregarDashboard() {

            try {

                const [
                    metricas,
                    estoqueCategorias,
                    alertas,
                    produtosRecentes,
                    vendas
                ] = await Promise.all([
                    api.get("/dashboard/metricas"),
                    api.get("/dashboard/estoque-categorias"),
                    api.get("/dashboard/alertas-estoque"),
                    api.get("/dashboard/produtos-recentes"),
                    api.get("/dashboard/resumo-vendas")
                ])

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

        }

        carregarDashboard()

    }, [])

    return {
        metricas,
        estoqueCategorias,
        alertasEstoque,
        produtosRecentes,
        vendas,
        carregando
    }

}