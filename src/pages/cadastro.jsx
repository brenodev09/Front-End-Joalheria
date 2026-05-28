import style from "../styles/cadastro.module.css";
import background from "../img/bg-cadastro.png";
import { useState } from "react";

export default function Cadastro() {


  const [nome,setNome] = useState(null)
  const [sobrenome,setSobrenome] = useState(null)
  const [email,setEmail] = useState(null)
  const [telefone,setTelefone] = useState(null)
  const [erro, setErro] = useState(null)

  function ValidarForm(event) {

      event.preventDefault()

    if(!nome || !sobrenome || !email || !telefone) {
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
          {/* Nome */}
          <div className={style.formGroup}>
            <input 
              type="text" 
              id="nome" 
              className={style.input} 
              placeholder=" " /* Placeholder vazio para a lógica CSS */
               
            />
            <label htmlFor="nome" className={style.label}>NOME</label>
            <div className={style.line} />
          </div>

          {/* Sobrenome */}
          <div className={style.formGroup}>
            <input 
              type="text" 
              id="sobrenome" 
              className={style.input} 
              placeholder=" "
               
            />
            <label htmlFor="sobrenome" className={style.label}>SOBRENOME</label>
            <div className={style.line} />
          </div>
        </div>

        {/* E-mail */}
        <div className={style.formGroup}>
          <input 
            type="email" 
            id="email" 
            className={style.input} 
            placeholder=" "
             
          />
          <label htmlFor="email" className={style.label}>E-MAIL</label>
          <div className={style.line} />
        </div>

        {/* Telefone */}
        <div className={style.formGroup}>
          <input 
            type="tel" 
            id="telefone" 
            className={style.input} 
            placeholder=" "
             
          />
          <label htmlFor="telefone" className={style.label}>TELEFONE</label>
          <div className={style.line} />
        </div>

        {erro && <p className={style.erro}> {erro} </p> }


        <div className={style.rodapeForm}>
            <button type="submit" className={`btnPadrao ${style.btnCriar}`}>CRIAR CONTA</button>
            <div className={style.possuiConta}>
                <p>Já possui uma conta? </p>
                <a href="/">Entrar</a>
            </div>
            
        </div>
      </form>
      </main>
    </>
  );
}
