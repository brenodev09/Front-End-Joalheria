import style from "./styles.module.css"
import {useAuth} from "../../../context/authContext"
import { useNavigate } from "react-router-dom"
import { useState } from "react"


export default function SideBar({isOpen, fecharSideBar}){

    const {logout} = useAuth()
    const navegar = useNavigate()
    const [erro, setErro] = useState("")

    async function SairConta(event){
        event.preventDefault()
        setErro("")

        await logout()

       
            navegar("/")
      
            setErro(resultado.mensagem)
    }


    if (!isOpen) return null

    return(
        <aside>
            <button onClick={fecharSideBar} className={style.btnFechar} >X</button>
            <button className={style.btnSair} onClick={SairConta}>Sair</button>
        </aside>
    )
}