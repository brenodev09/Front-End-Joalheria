import style from "./styles.module.css";

export default function HeaderAdmin() {

  function data () {
    const newData = new Date()

      const diasSemana = [
        "Domingo",
        "Segunda feira",
        "Terça feira",
        "Quarta feira",
        "Quinta feira",
        "Sexta feira",
        "Sábado"
    ]

    const meses = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ]


    return `${diasSemana[newData.getDay()]}, ${newData.getDate()} de ${meses[newData.getMonth()]} de ${newData.getFullYear()}`
  }

  return (
    <header className={style.header}>
      <p className={style.data}>{data()}</p>

      <div className={style.acoesHeader}>
        <div className={style.darkMode}>
          <input type="radio" />
          <img
            width="35"
            height="35"
            src="https://img.icons8.com/ffffff/external-tanah-basah-basic-outline-tanah-basah/24/external-sun-summer-tanah-basah-basic-outline-tanah-basah.png"
            alt="external-sun-summer-tanah-basah-basic-outline-tanah-basah"
          />{" "}
        </div>

        <a href="/" className="btnPadrao">VOLTAR A LOJA</a>
      </div>
    </header>
  );
}
