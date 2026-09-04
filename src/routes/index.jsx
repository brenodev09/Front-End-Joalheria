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
import Colecoes from "../pages/Admin/Colecoes.jsx";
import Produtos from "../pages/Admin/ProdutosAdmin.jsx";
import Materiais from "../pages/Admin/Materiais.jsx";
import InfoConta from "../pages/Admin/infoConta.jsx";
import Pedidos from "../pages/Admin/GestaoPedidos.jsx"
import Funcionarios from "../pages/Admin/FuncionariosPage.jsx"
import Cupons from "../pages/Admin/Cupons.jsx"
import Notificacoes from "../pages/Admin/Notificacoes.jsx"
import Configuracoes from "../pages/Admin/Configuracoes.jsx"
import Manutencao from "../pages/Manutencao.jsx"
import Relatorios from "../pages/Admin/relatorios.jsx"

// paginas do usuario
import UserLayout from "../Layouts/UserLayout.jsx";
import Carrinho from "../pages/User/carrinho.jsx";
import MinhaConta from "../pages/User/minha-conta.jsx"
import MeusPedidos from "../pages/User/meus-pedidos.jsx"
import Favoritos from "../pages/User/MeusFavoritos.jsx"


// Cadastro e Login
import Cadastro from "../pages/cadastro.jsx";
import Login from "../pages/login.jsx";

// Páginas comuns
import Inicial from "../pages/inicial.jsx";
import PagProduto from "../pages/ProdutoJoalheria.jsx";
import Catalogo from "../pages/User/Catalogo";
import ColecoesPublicas from "../pages/User/Colecoes.jsx";
import ColecaoDetalhe from "../pages/User/ColecaoDetalhe.jsx";
import Atelier from "../pages/Atelier.jsx";
import PersonalizacaoProduto from "../pages/Admin/PersonalizacaoProduto.jsx";
import StatusLojaGuard from "./StatusLojaGuard.jsx";



export default function Rotas() {
    const { sidebarAberta } = useCarrinho();

    return (
        <>
        <script src="https://sdk.mercadopago.com/js/v2"></script>
            <Routes>
                <Route element={<StatusLojaGuard />}>
                    <Route path="/" element={<Inicial />} />
                    <Route path="/produto/:id" element={<PagProduto />} />
                    <Route path="/produto/:id/personalizacao" element={<PagProduto />} />
                    <Route path="/produto/:id/personalização" element={<PagProduto />} />
                    <Route path="/atelier/:produtoId" element={<Atelier />} />
                    <Route path="/catalogo" element={<Catalogo />} />
                    <Route path="/colecoes" element={<ColecoesPublicas />} />
                    <Route path="/colecoes/:id" element={<ColecaoDetalhe />} />
                </Route>
                <Route path="/manutencao" element={<Manutencao />} />

                <Route element={<RotasAdmin />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="notificacoes" element={<Notificacoes />} />
                        <Route path="categorias" element={<Categorias />} />
                        <Route path="produtos" element={<Produtos />} />
                        <Route path="produtos/personalizacao" element={<PersonalizacaoProduto />} />
                        <Route path="materiais" element={<Materiais />} />
                        <Route path="conta" element={<InfoConta />} />
                        <Route path="pedidos" element={<Pedidos />} />
                        <Route path="colecoes" element={<Colecoes />} />
                        <Route path="funcionarios" element={<Funcionarios />} />
                        <Route path="cupons" element={<Cupons />} />
                        <Route path="configuracoes" element={<Configuracoes />} />
                        <Route path="relatorios" element={<Relatorios />} />
                    </Route>
                </Route>

                <Route element={<RotasPrivadas />}>
                    <Route path="/carrinho" element={<Carrinho />} />
                    <Route path="/minha-conta" element={<UserLayout />}>
                        <Route path="conta" element={<MinhaConta />} />
                        <Route path="pedidos" element={<MeusPedidos />} />
                        <Route path="favoritos" element={<Favoritos />} />
                    </Route>
                </Route>


                <Route element={<RotasPublicas />}>
                    <Route path="/cadastro" element={<Cadastro />} />
                    <Route path="/login" element={<Login />} />
                </Route>
            </Routes>

            {sidebarAberta && <SideBarCarrinho />}
        </>
    );
}