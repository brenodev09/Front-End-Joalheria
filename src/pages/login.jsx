import style from "../styles/login.module.css"
import { useEffect, useState } from "react"
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
  const [bloqueadoAte, setBloqueadoAte] = useState(() => Number(localStorage.getItem("login_bloqueado_ate")) || 0)
  const [segundosRestantes, setSegundosRestantes] = useState(() => Math.max(0, Math.ceil(((Number(localStorage.getItem("login_bloqueado_ate")) || 0) - Date.now()) / 1000)))
  const navegar = useNavigate()

  const { login } = useAuth()

  useEffect(() => {
    if (!bloqueadoAte) return undefined
    const atualizar = () => {
      const restantes = Math.max(0, Math.ceil((bloqueadoAte - Date.now()) / 1000))
      setSegundosRestantes(restantes)
      if (!restantes) {
        setBloqueadoAte(0)
        localStorage.removeItem("login_bloqueado_ate")
      }
    }
    atualizar()
    const intervalo = window.setInterval(atualizar, 1000)
    return () => window.clearInterval(intervalo)
  }, [bloqueadoAte])

  function ValidarForm() {


    if (!email || !senha) {
      setErro("Preencha todos os campos")

      setTimeout(() => {
        setErro("")
      }, 4500)
      return false
    }

    return true
  }


  async function fazerLogin(event) {
    event.preventDefault()
    setErro("")

    if (segundosRestantes > 0) {
      setErro(`Aguarde ${formatarTempo(segundosRestantes)} para tentar novamente.`)
      return
    }

    if (!ValidarForm()) return;

    setEntrando(true)

    const resultado = await login(email, senha)

    if (resultado.sucesso) {
      navegar("/")
    } else {
      if (resultado.bloqueado && resultado.bloqueadoAte) {
        const dataBloqueio = new Date(resultado.bloqueadoAte).getTime()
        setBloqueadoAte(dataBloqueio)
        localStorage.setItem("login_bloqueado_ate", String(dataBloqueio))
        setSegundosRestantes(Math.max(0, Math.ceil((dataBloqueio - Date.now()) / 1000)))
      }
      setErro(resultado.bloqueado ? `Muitas tentativas. Aguarde ${formatarTempo(resultado.retryAfter)}.` : resultado.mensagem)
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
            <button disabled = {entrando || segundosRestantes > 0} type="submit" className={`btnPadrao ${style.btnCriar} ${entrando ? style.btnEntrando : ""}`}> 
            {entrando ? "ENTRANDO..." : segundosRestantes > 0 ? `AGUARDE ${formatarTempo(segundosRestantes)}` : "ENTRAR"}</button>

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

function formatarTempo(segundos) {
  const minutos = Math.floor(segundos / 60)
  const segundosFormatados = String(segundos % 60).padStart(2, "0")
  return `${minutos}:${segundosFormatados}`
}