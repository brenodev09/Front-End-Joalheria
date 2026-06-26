import {Outlet, Navigate} from "react-router-dom"
import {useAuth} from "../context/authContext"
import { useState } from "react"

export default function RotasPublicas(){
    
    const {carregando, estaLogado} = useAuth()

    if(carregando){
      return  <p>Está carregando</p>
    }

    if(estaLogado){
        return <Navigate to="admin/dashboard"/>
    }

    return <Outlet/>
}