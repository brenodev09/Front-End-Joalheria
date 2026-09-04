import styles from "./styles.module.css";
import Logo from "../../../img/logo.svg";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FolderKanban,
  ShoppingBag,
  Tags,
  Gem,
  User,
  Bell
  , Settings
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className={styles.sideBarr}>
      <div className={styles.cabecalho}>
        <a href="/"> <img src={Logo} alt="Logo" className={styles.logo} /></a>
      </div>

      <main className={styles.navegacao}>
        <NavLink to="/admin/dashboard" end className={({ isActive }) => `${styles.itemNav} ${isActive ? styles.pagAtiva : ""}`}>
          <LayoutDashboard size={24} strokeWidth={1.7} aria-hidden="true" />
          <span className={styles.textoNav}>Dashboard</span>
        </NavLink>


        <NavLink
          to="/admin/relatorios"
          end
          className={({ isActive }) =>
            `${styles.itemNav} ${isActive ? styles.pagAtiva : ""}`
          }
        >
          <img width="24" height="24" src="https://img.icons8.com/ios/50/ffffff/graph-report.png" alt="graph-report" />
          <span className={styles.textoNav}>Relatórios</span>
        </NavLink>

        <NavLink to="/admin/produtos" end className={({ isActive }) => `${styles.itemNav} ${isActive ? styles.pagAtiva : ""}`}>
          <Package size={24} strokeWidth={1.7} aria-hidden="true" />
          <span className={styles.textoNav}>Produtos</span>
        </NavLink>

        <NavLink to="/admin/produtos/personalizacao" className={({ isActive }) => `${styles.itemNav} ${isActive ? styles.pagAtiva : ""}`}>
          <Gem size={24} strokeWidth={1.7} />
          <span className={styles.textoNav}>Personalização</span>
        </NavLink>

        <NavLink to="/admin/pedidos" end className={({ isActive }) => `${styles.itemNav} ${isActive ? styles.pagAtiva : ""}`}>
          <ShoppingBag size={24} strokeWidth={1.7} aria-hidden="true" />
          <span className={styles.textoNav}>Pedidos</span>
        </NavLink>

        <NavLink to="/admin/notificacoes" end className={({ isActive }) => `${styles.itemNav} ${isActive ? styles.pagAtiva : ""}`}>
          <Bell className={styles.iconeNotificacao} size={24} strokeWidth={1.7} />
          <span className={styles.textoNav}>Notificações</span>
        </NavLink>

        <NavLink to="/admin/categorias" end className={({ isActive }) => `${styles.itemNav} ${isActive ? styles.pagAtiva : ""}`}>
          <img width="24" height="24" src="https://img.icons8.com/ios/50/ffffff/categorize.png" alt="categorize" />          <span className={styles.textoNav}>Categorias</span>
        </NavLink>


        <NavLink to="/admin/materiais" end className={({ isActive }) => `${styles.itemNav} ${isActive ? styles.pagAtiva : ""}`}>
          <Gem size={24} strokeWidth={1.7} aria-hidden="true" />
          <span className={styles.textoNav}>Materiais</span>
        </NavLink>


        <NavLink
          to="/admin/colecoes"
          end
          className={({ isActive }) =>
            `${styles.itemNav} ${isActive ? styles.pagAtiva : ""}`
          }
        >
          <img width="24" height="24" src="https://img.icons8.com/external-smashingstocks-detailed-outline-smashing-stocks/66/ffffff/external-Photo-family-and-relations-smashingstocks-detailed-outline-smashing-stocks.png" alt="external-Photo-family-and-relations-smashingstocks-detailed-outline-smashing-stocks" />
          <span className={styles.textoNav}>Coleções</span>
        </NavLink>

        <NavLink
          to="/admin/funcionarios"
          end
          className={({ isActive }) =>
            `${styles.itemNav} ${isActive ? styles.pagAtiva : ""}`
          }
        >
          <img width="50" height="50" src="https://img.icons8.com/ios/50/ffffff/staff.png" alt="staff" />
          <span className={styles.textoNav}>Funcionários</span>
        </NavLink>


        <NavLink
          to="/admin/cupons"  
          end
          className={({ isActive }) =>
            `${styles.itemNav} ${isActive ? styles.pagAtiva : ""}`
          }
        >
          <Tags size={24} strokeWidth={1.7} aria-hidden="true" />
          <span className={styles.textoNav}>Cupons</span>
        </NavLink>


        <NavLink to="/admin/conta" end className={({ isActive }) => `${styles.itemNav} ${isActive ? styles.pagAtiva : ""}`}>
          <User size={24} strokeWidth={1.7} aria-hidden="true" />
          <span className={styles.textoNav}>Conta</span>
        </NavLink>

        <NavLink to="/admin/configuracoes" end className={({ isActive }) => `${styles.itemNav} ${isActive ? styles.pagAtiva : ""}`}>
          <Settings size={24} strokeWidth={1.7} />
          <span className={styles.textoNav}>Configurações</span>
        </NavLink>



      </main>
    </aside>
  );
}