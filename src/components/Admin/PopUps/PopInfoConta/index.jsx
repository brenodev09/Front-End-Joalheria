import style from "./styles.module.css"

export default function NotificacaoCategoria({visivel}) {
    return(
       <div className={`${style.notificacao} ${visivel ? style.mostrar : style.esconder}`}
    >
            <p>Suas informações de usuário foram editadas!</p>
        </div>
    )
}