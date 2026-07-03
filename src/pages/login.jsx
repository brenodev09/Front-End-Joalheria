import style from "../styles/login.module.css"
import { useState } from "react"
import background from "../img/bg-login.png"
import { useAuth } from "../context/authContext"
import { useNavigate } from "react-router-dom"


export default function Login() {
  // const [nome, setNome] = useState()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  // const [confirmarSenha, setConfirmarSenha] = useState()
  const [erro, setErro] = useState("")
  const [entrando, setEntrando] = useState(false)
  const navegar = useNavigate()

  const { login } = useAuth()

  function ValidarForm() {


    if (!email || !senha) {
      setErro("Preencha todos os campos")

      setTimeout(() => {
        setErro("")
      }, 4500)
      return false
    }

    return true

    setErro("")
  }


  async function fazerLogin(event) {
    event.preventDefault()
    setErro("")

    if (!ValidarForm()) return;

    setEntrando(true)

    const resultado = await login(email, senha)

    if (resultado.sucesso) {
      navegar("/")
    } else {
      setErro(resultado.mensagem)
      setEntrando(false)
    }
  }




  return (
    <>
      <img className={style.bg} src={background} alt="bg pagina" />

      <main className={style.formulario}>
        <div className={style.topoForm}>
          <h1>Entre na sua conta</h1>
          <p>Informe seus dados para entrar em sua conta exclusiva</p>
        </div>

        <form onSubmit={fazerLogin} className={style.form}>



          {/* Email */}
          <div className={style.formGroup}>
            <input
              type="text"
              id="sobrenome"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={style.input}
              placeholder=" "

            />
            <label htmlFor="sobrenome" className={style.label}>EMAIL</label>
            <div className={style.line} />
          </div>

          {/* Senha */}
          <div className={style.formGroup}>
            <input
              type="password"
              id="email"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              className={style.input}
              placeholder=" "

            />
            <label htmlFor="email" className={style.label}>SENHA</label>
            <div className={style.line} />
          </div>



          {erro && <p className={style.erro}> {erro} </p>}


          <div className={style.rodapeForm}>
            <button disabled = {entrando} type="submit" className={`btnPadrao ${style.btnCriar} ${entrando ? style.btnEntrando : ""}`}> 
            {entrando ? "ENTRANDO..." : "ENTRAR"}</button>

            <div className={style.possuiConta}>
              <p>Não possui uma conta? </p>
              <a href="/Cadastrar">Criar agora</a>
            </div>

          </div>
        </form>
      </main>
    </>
  );
}