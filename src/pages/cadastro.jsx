import style from "../styles/cadastro.module.css";
import background from "../img/bg-cadastro.png";
import { api } from "../services/api"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext"

export default function Cadastro() {


  const [nome, setNome] = useState(null)
  const [email, setEmail] = useState(null)
  const [senha, setSenha] = useState(null)
  const [confirmarSenha, setConfirmarSenha] = useState(null)
  const [erro, setErro] = useState(null)
  const [criando, setCriando] = useState(false)
  const navegar = useNavigate()

  const { cadastrar } = useAuth()

  function ValidarForm() {

    if (!nome || !email || !senha || !confirmarSenha) {
      setErro("Preencha todos os campos")

      setTimeout(() => {
        setErro("")
      }, 4500)
      return false
    } 

    if (senha !== confirmarSenha) {
      setErro("As senhas estão diferentes")

      setTimeout(() => {
        setErro("")
      }, 4500)
      return false
    }

    return true

    setErro("")
  }

  async function cadastrarUsuario(event) {
    event.preventDefault()
    setErro("")

    if (!ValidarForm()) return;

    setCriando(true)
    const resultado = await cadastrar(nome, email, senha)

    if (resultado.sucesso) {
      navegar("/admin/dashboard")
    } else {
      setErro(resultado.mensagem)
      setCriando(false)
    }
  }



  return (
    <>
      <img className={style.bg} src={background} alt="bg pagina" />

      <main className={style.formulario}>
        <div className={style.topoForm}>
          <h1>Crie sua conta</h1>
          <p>Informe seus dados pessoais para criar uma conta exclusiva</p>
        </div>

        <form onSubmit={cadastrarUsuario} className={style.form}>

          <div className={style.row}>
            {/* Nome de usuario */}
            <div className={style.formGroup}>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                className={style.input}
                placeholder=" " /* Placeholder vazio para a lógica CSS */

              />
              <label htmlFor="nome" className={style.label}>NOME DE USUÁRIO</label>
              <div className={style.line} />
            </div>

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
          </div>

          {/* Senha */}
          <div className={style.formGroup}>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              className={style.input}
              placeholder=" "

            />
            <label htmlFor="email" className={style.label}>SENHA</label>
            <div className={style.line} />
          </div>

          {/* Confirmar senha */}
          <div className={style.formGroup}>
            <input
              type="password"
              id="confirmarSenha"
              value={confirmarSenha}
              onChange={(event) =>
                setConfirmarSenha(event.target.value)
              }
              className={style.input}
              placeholder=" "

            />
            <label htmlFor="senha" className={style.label}>CONFIRMAR SENHA</label>
            <div className={style.line} />
          </div>

          {erro && <p className={style.erro}> {erro} </p>}


          <div className={style.rodapeForm}>
            <button disabled={criando} type="submit" className={`btnPadrao ${style.btnCriar}`}>
             {criando ? "CRIANDO CONTA" : "CRIAR CONTA "} </button>
            <div className={style.possuiConta}>
              <p>Já possui uma conta? </p>
              <a href="/Login">Entrar</a>
            </div>

          </div>
        </form>
      </main>
    </>
  );
}
