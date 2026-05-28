import styles from "./styles.module.css";
import Logo from "../../../img/logo.svg";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.cabecalho}>
        <img src={Logo} alt="Logo" className={styles.logo} />
      </div>

      <nav className={styles.navegacao}>
        <NavLink to="/admin" className={styles.itemNav}>
          <img
            width="27"
            height="27"
            src="https://img.icons8.com/parakeet-line/27/ffffff/dashboard-layout.png"
            alt="dashboard-layout"
          />
          <span className={styles.textoNav}>Dashboard</span>
        </NavLink>

        <button className={styles.itemNav}>
          <img
            width="27"
            height="27"
            src="https://img.icons8.com/ios/27/ffffff/box--v1.png"
            alt="box"
          />
          <span className={styles.textoNav}>Produtos</span>
        </button>
        
        <NavLink to="/admin/categorias" className={styles.itemNav}>
         <img width="30" height="30" src="https://img.icons8.com/ios/50/ffffff/categorize.png" alt="categorize"/>
          <span className={styles.textoNav}>Categorias</span>
        </NavLink>


        <button className={styles.itemNav}>
          <img
            width="27"
            height="27"
            src="https://img.icons8.com/ios/27/ffffff/diamond--v1.png"
            alt="diamond"
          />
          <span className={styles.textoNav}>Materiais</span>
        </button>

        <button className={styles.itemNav}>
          <img
            width="27"
            height="27"
            src="https://img.icons8.com/fluency-systems-regular/27/ffffff/user--v1.png"
            alt="user"
          />
          <span className={styles.textoNav}>Conta</span>
        </button>
      </nav>
    </aside>
  );
}