import styles from "./styles.module.css"
import Logo from "../../../img/logo.svg"
import { NavLink } from "react-router-dom"

export default function Sidebar() {
  return (
    <aside className={styles.sideBarr}>
      <div className={styles.cabecalho}>
        <a href="/"> <img src={Logo} alt="Logo" className={styles.logo} /></a>
      </div>

      <main className={styles.navegacao}>
        <NavLink to="/minha-conta/conta" end className={({ isActive }) => `${styles.itemNav} ${isActive ? styles.pagAtiva : ""}`}>
          <img
            width="25"
            height="25"
            src="https://img.icons8.com/fluency-systems-regular/25/ffffff/user--v1.png"
            alt="user"
          />
          <span className={styles.textoNav}>Conta</span>
        </NavLink>


        <NavLink to="/minha-conta/pedidos" end className={({ isActive }) => `${styles.itemNav} ${isActive ? styles.pagAtiva : ""}`}>
          <img
            width="25"
            height="25"
            src="https://img.icons8.com/ios/25/ffffff/box--v1.png"
            alt="box"
          />
          <span className={styles.textoNav}>Pedidos</span>
        </NavLink>

        <NavLink to="/minha-conta/favoritos" end className={({ isActive }) => `${styles.itemNav} ${isActive ? styles.pagAtiva : ""}`}>
          <img width="25" height="25" src="https://img.icons8.com/windows/32/ffffff/like--v1.png" alt="like--v1" />
          <span className={styles.textoNav}>Favoritos</span>
        </NavLink>

        {/* <NavLink to="/admin/dashboard" end className={({isActive}) => `${styles.itemNav} ${isActive ? styles.pagAtiva : ""}`}>
          <img
            width="27"
            height="27"
            src="https://img.icons8.com/parakeet-line/27/ffffff/dashboard-layout.png"
            alt="dashboard-layout"
          />
          <span className={styles.textoNav}>Dashboard</span>
        </NavLink>


        <NavLink to="/admin/categorias" end className={({isActive}) => `${styles.itemNav} ${isActive ? styles.pagAtiva : ""}`}>
         <img width="30" height="30" src="https://img.icons8.com/ios/50/ffffff/categorize.png" alt="categorize"/>
          <span className={styles.textoNav}>Categorias</span>
        </NavLink>


        <NavLink to="/admin/materiais" end className={({isActive}) => `${styles.itemNav} ${isActive ? styles.pagAtiva : ""}`}>
          <img
            width="27"
            height="27"
            src="https://img.icons8.com/ios/27/ffffff/diamond--v1.png"
            alt="diamond"
          />
          <span className={styles.textoNav}>Materiais</span>
        </NavLink> */}


      </main>
    </aside>
  );
}