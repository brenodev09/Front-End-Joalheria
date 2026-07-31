import { Route, Routes } from "react-router-dom";

import SideBarCarrinho from "../components/SideBarCarrinho";
import { useCarrinho } from "../context/carrinhoContext";
import RotasPublicas from "./rotasPublicas.jsx";
import RotasPrivadas from "./rotasPrivadas.jsx";

// Páginas do Admin
import AdminLayout from "../Layouts/AdminLayout.jsx";
import Dashboard from "../pages/Admin/dashboard.jsx";
import Categorias from "../pages/Admin/Categorias.jsx";
import Produtos from "../pages/Admin/ProdutosAdmin.jsx";
import Materiais from "../pages/Admin/Materiais.jsx";
import InfoConta from "../pages/Admin/infoConta.jsx";

// Cadastro e Login
import Cadastro from "../pages/cadastro.jsx";
import Login from "../pages/login.jsx";

// Páginas comuns
import Inicial from "../pages/inicial.jsx";
import PagProduto from "../pages/ProdutoJoalheria.jsx";
import Carrinho from "../pages/User/carrinho.jsx";
import Catalogo from "../pages/User/Catalogo";

export default function Rotas() {
    const { sidebarAberta } = useCarrinho();

    return (
        <>
            <Routes>
                <Route path="/" element={<Inicial />} />
                <Route path="/produto/:id" element={<PagProduto />} />
                <Route path="/carrinho" element={<Carrinho />} />
                <Route 
                        path="/catalogo" 
                        element={<Catalogo />} 
                    />

                <Route element={<RotasPrivadas />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="categorias" element={<Categorias />} />
                        <Route path="produtos" element={<Produtos />} />
                        <Route path="materiais" element={<Materiais />} />
                        <Route path="conta" element={<InfoConta />} />
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