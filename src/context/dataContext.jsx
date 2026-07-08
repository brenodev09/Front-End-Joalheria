import { useEffect, useState } from "react"
import { api } from "../services/api"

export default function useDashboard() {

    const [metricas, setMetricas] = useState({})
    const [estoqueCategorias, setEstoqueCategorias] = useState([])
    const [alertasEstoque, setAlertasEstoque] = useState([])
    const [produtosRecentes, setProdutosRecentes] = useState([])
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {

        async function carregarDashboard() {

            try {

                const [
                    metricas,
                    estoqueCategorias,
                    alertas,
                    produtosRecentes
                ] = await Promise.all([
                    api.get("/dashboard/metricas"),
                    api.get("/dashboard/estoque-categorias"),
                    api.get("/dashboard/alertas-estoque"),
                    api.get("/dashboard/produtos-recentes")
                ])

                setMetricas(metricas.data)
                setEstoqueCategorias(estoqueCategorias.data)
                setAlertasEstoque(alertas.data)
                setProdutosRecentes(produtosRecentes.data)

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
        carregando
    }

}