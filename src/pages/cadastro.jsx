import style from "../styles/cadastro.module.css";
import background from "../img/bg-cadastro.png";
import { useState } from "react";

export default function Cadastro() {


  const [nome,setNome] = useState(null)
  const [email,setEmail] = useState(null)
  const [senha,setSenha] = useState(null)
  const [confirmarSenha,setConfirmarSenha] = useState(null)
  const [erro, setErro] = useState(null)

  function ValidarForm(event) {

      event.preventDefault()

    if(!nome || !email || !senha || !confirmarSenha) {
      setErro("Preencha todos os campos")
      
      setTimeout(() =>{
        setErro("")
      }, 4500)
      return
    }

    setErro("")
  }
  


  return (
    <>
      <img className={style.bg} src={background} alt="bg pagina" />

      <main className={style.formulario}>
        <div className={style.topoForm}>
          <h1>Crie sua conta</h1>
          <p>Informe seus dados pessoais para criar uma conta exclusiva</p>
        </div>

       <form onSubmit={ValidarForm} className={style.form}>
        
        <div className={style.row}>
          {/* Nome de usuario */}
          <div className={style.formGroup}>
            <input 
              type="text" 
              id="nome" 
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
            id="email" 
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
            id="senha" 
            className={style.input} 
            placeholder=" "
             
          />
          <label htmlFor="senha" className={style.label}>CONFIRMAR SENHA</label>
          <div className={style.line} />
        </div>

        {erro && <p className={style.erro}> {erro} </p> }


        <div className={style.rodapeForm}>
            <button type="submit" className={`btnPadrao ${style.btnCriar}`}>CRIAR CONTA</button>
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
