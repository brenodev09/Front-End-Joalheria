import styles from "../../../styles/User/categoryTabs.module.css";


export default function CategoryTabs({

  categorias = [],

  active = "Todas",

  onChange

}) {


  return (

    <nav className={styles.wrapper}>


      <div className={styles.tabs}>


        {

          categorias.map((categoria)=>(


            <button

              key={categoria}

              type="button"

              className={`
                ${styles.tab}
                ${active === categoria ? styles.active : ""}
              `}


              onClick={() => onChange(categoria)}


            >

              {categoria}


              {
                active === categoria && (

                  <span className={styles.line}></span>

                )
              }


            </button>


          ))

        }


      </div>


    </nav>

  );

}