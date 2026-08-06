import { Route, Routes } from "react-router-dom";

import SideBarCarrinho from "../components/SideBarCarrinho";
import { useCarrinho } from "../context/carrinhoContext";
import RotasPublicas from "./rotasPublicas.jsx";
import RotasPrivadas from "./rotasPrivadas.jsx";
import RotasAdmin from "./rotasAdmin.jsx"

// Páginas do Admin
import AdminLayout from "../Layouts/AdminLayout.jsx";
import Dashboard from "../pages/Admin/dashboard.jsx";
import Categorias from "../pages/Admin/Categorias.jsx";
import Produtos from "../pages/Admin/ProdutosAdmin.jsx";
import Materiais from "../pages/Admin/Materiais.jsx";
import InfoConta from "../pages/Admin/infoConta.jsx";
import Pedidos from "../pages/Admin/GestaoPedidos.jsx"

// paginas do usuario
import UserLayout from "../Layouts/UserLayout.jsx";
import Carrinho from "../pages/User/carrinho.jsx";
import MinhaConta from "../pages/User/minha-conta.jsx"
import MeusPedidos from "../pages/User/meus-pedidos.jsx"


// Cadastro e Login
import Cadastro from "../pages/cadastro.jsx";
import Login from "../pages/login.jsx";

// Páginas comuns
import Inicial from "../pages/inicial.jsx";
import PagProduto from "../pages/ProdutoJoalheria.jsx";
import Catalogo from "../pages/User/Catalogo";



export default function Rotas() {
    const { sidebarAberta } = useCarrinho();

    return (
        <>
            <Routes>
                <Route path="/" element={<Inicial />} />
                <Route path="/produto/:id" element={<PagProduto />} />
                <Route path="/carrinho" element={<Carrinho />} />
                <Route path="/catalogo" element={<Catalogo />} />

                <Route element={<RotasAdmin />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="categorias" element={<Categorias />} />
                        <Route path="produtos" element={<Produtos />} />
                        <Route path="materiais" element={<Materiais />} />
                        <Route path="conta" element={<InfoConta />} />
                        <Route path="pedidos" element={<Pedidos />} />
                    </Route>
                </Route>

                <Route element={<RotasPrivadas />}>
                    <Route path="/minha-conta" element={<UserLayout />}>
                        <Route path="conta" element={<MinhaConta />} />
                        <Route path="pedidos" element={<MeusPedidos />} />
                    </Route>
                </Route>


                <Route element={<RotasPublicas />}>
                    <Route path="/Cadastrar" element={<Cadastro />} />
                    <Route path="/Login" element={<Login />} />
                </Route>
            </Routes>

            {sidebarAberta && <SideBarCarrinho />}
        </>
    );
}