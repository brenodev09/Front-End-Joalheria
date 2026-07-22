import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";

import RotasPublicas from "./rotasPublicas.jsx";
import RotasPrivadas from "./rotasPrivadas.jsx";

// PAGINAS DO ADMIN
import AdminLayout from "../Layouts/AdminLayout.jsx";
import Inicial from "../pages/inicial.jsx"
import Dashboard from "../pages/Admin/dashboard.jsx"
import Categorias from "../pages/Admin/Categorias.jsx"
import Produtos from "../pages/Admin/ProdutosAdmin.jsx"
import Materiais from "../pages/Admin/Materiais.jsx"
import InfoConta from "../pages/Admin/infoConta.jsx"


// cadastro e login
import Cadastro from "../pages/cadastro.jsx"
import Login from "../pages/login.jsx"


// paginas comum
import PagProduto from "../pages/ProdutoJoalheria.jsx"


export default function Rotas() {
    return (
        <>
            <BrowserRouter>
                <Routes>

                    <Route path="/" element={<Inicial />} />
                    <Route path="/produto" element = {<PagProduto/>}/>

                    <Route element={<RotasPrivadas />}>
                        <Route path="/admin" element={<AdminLayout />} >
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="categorias" element={<Categorias />} />
                            <Route path="produtos" element={<Produtos />} />
                            <Route path="materiais" element={<Materiais />} />
                            <Route path="conta" element={<InfoConta />} />
                        </Route>
                    </Route>

                    <Route element={<RotasPublicas />}>
                        <Route path="/Cadastrar" element={<Cadastro />}></Route>
                        <Route path="/Login" element={<Login />}></Route>
                    </Route>

                </Routes>
            </BrowserRouter>

        </>
    )
}