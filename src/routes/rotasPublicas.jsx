import {Outlet, Navigate} from "react-router-dom"
import {useAuth} from "../context/authContext"
import { useLoja } from "../context/lojaContext";

export default function RotasPublicas(){
    
    const {carregando, estaLogado} = useAuth()
    const { status } = useLoja()

    if(carregando){
      return  <p>Está carregando</p>
    }

    if(estaLogado){
        return <Navigate to="/admin/dashboard"/>
    }

    if (status === "maintenance" || status === "closed") {
      return <Navigate to="/manutencao" replace />;
    }

    return <Outlet/>
}