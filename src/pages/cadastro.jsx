import style from "../styles/cadastro.module.css";
import background from "../img/bg-cadastro.png";

export default function Cadastro() {
  return (
    <>
      <img className={style.bg} src={background} alt="bg pagina" />

      <main className={style.formulario}>
        <div className={style.topoForm}>
          <h1>Crie sua conta</h1>
          <p>Informe seus dados pessoais para criar uma conta exclusiva</p>
        </div>

       <form className={style.form}>
        <div className={style.row}>
          {/* Nome */}
          <div className={style.formGroup}>
            <input 
              type="text" 
              id="nome" 
              className={style.input} 
              placeholder=" " /* Placeholder vazio para a lógica CSS */
              required 
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
              required 
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
            required 
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
            required 
          />
          <label htmlFor="telefone" className={style.label}>TELEFONE</label>
          <div className={style.line} />
        </div>


        <div className={style.rodapeForm}>
            <button className={`btnPadrao ${style.btnCriar}`}>CRIAR CONTA</button>
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
