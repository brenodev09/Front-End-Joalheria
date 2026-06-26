import {Outlet, Navigate} from "react-router-dom"
import {useAuth} from "../context/authContext"
import { Donut } from "lucide-react"

export default function RotasPrivadas(){
    
    const {carregando, estaLogado} = useAuth()

    if(carregando){
        return <p>Está carregando!</p>
    }

    if(!estaLogado) {
        return <Navigate to = "/login"/>
    }

    return <Outlet/>
}