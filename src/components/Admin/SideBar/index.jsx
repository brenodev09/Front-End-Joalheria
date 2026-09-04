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
          <img
            width="24"
            height="24"
            src="https://img.icons8.com/parakeet-line/24/ffffff/dashboard-layout.png"
            alt="dashboard-layout"
          />
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
          <img
            width="24"
            height="24"
            src="https://img.icons8.com/ios/24/ffffff/box--v1.png"
            alt="box"
          />
          <span className={styles.textoNav}>Produtos</span>
        </NavLink>
        <NavLink to="/admin/produtos/personalizacao" className={({ isActive }) => `${styles.itemNav} ${isActive ? styles.pagAtiva : ""}`}>
          <Gem size={24} strokeWidth={1.7} />
          <span className={styles.textoNav}>Personalização</span>
        </NavLink>

        <NavLink to="/admin/pedidos" end className={({ isActive }) => `${styles.itemNav} ${isActive ? styles.pagAtiva : ""}`}>
          <img
            width="28"
            height="28"
            src="https://img.icons8.com/external-sbts2018-outline-sbts2018/58/ffffff/external-order-history-ecommerce-basic-1-sbts2018-outline-sbts2018.png" alt="external-order-history-ecommerce-basic-1-sbts2018-outline-sbts2018" />
          <span className={styles.textoNav}>Pedidos</span>
        </NavLink>

        <NavLink to="/admin/notificacoes" end className={({ isActive }) => `${styles.itemNav} ${isActive ? styles.pagAtiva : ""}`}>
          <Bell className={styles.iconeNotificacao} size={24} strokeWidth={1.7} />
          <span className={styles.textoNav}>Notificações</span>
        </NavLink>

        <NavLink to="/admin/categorias" end className={({ isActive }) => `${styles.itemNav} ${isActive ? styles.pagAtiva : ""}`}>
          <img width="30" height="30" src="https://img.icons8.com/ios/50/ffffff/categorize.png" alt="categorize" />
          <span className={styles.textoNav}>Categorias</span>
        </NavLink>


        <NavLink to="/admin/materiais" end className={({ isActive }) => `${styles.itemNav} ${isActive ? styles.pagAtiva : ""}`}>
          <img
            width="24"
            height="24"
            src="https://img.icons8.com/ios/24/ffffff/diamond--v1.png"
            alt="diamond"
          />
          <span className={styles.textoNav}>Materiais</span>
        </NavLink>


        <NavLink
          to="/admin/colecoes"
          end
          className={({ isActive }) =>
            `${styles.itemNav} ${isActive ? styles.pagAtiva : ""}`
          }
        >
          <img
            width="24"
            height="24"
            src="https://img.icons8.com/ios/50/ffffff/stack-of-photos.png"
            alt="coleções"
          />
          <span className={styles.textoNav}>Coleções</span>
        </NavLink>

        <NavLink
          to="/admin/funcionarios"
          end
          className={({ isActive }) =>
            `${styles.itemNav} ${isActive ? styles.pagAtiva : ""}`
          }
        >
          <img width="24" height="24" src="https://img.icons8.com/ios/50/ffffff/staff.png" alt="staff" />
          <span className={styles.textoNav}>Funcionários</span>
        </NavLink>


        <NavLink
          to="/admin/cupons"
          end
          className={({ isActive }) =>
            `${styles.itemNav} ${isActive ? styles.pagAtiva : ""}`
          }
        >
          <img width="24" height="24" src="https://img.icons8.com/windows/32/ffffff/discount-ticket.png" alt="discount-ticket" />
          <span className={styles.textoNav}>Cupons</span>
        </NavLink>


        <NavLink to="/admin/conta" end className={({ isActive }) => `${styles.itemNav} ${isActive ? styles.pagAtiva : ""}`}>
          <img
            width="24"
            height="24"
            src="https://img.icons8.com/fluency-systems-regular/24/ffffff/user--v1.png"
            alt="user"
          />
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