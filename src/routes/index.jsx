import { Route, Routes,BrowserRouter } from "react-router-dom";

// PAGINAS DO ADMIN
import Inicial from "../pages/Admin/inicial.jsx"
import Dashboard from "../pages/Admin/dashboard.jsx"


export default function Rotas() {
    return(
        <>
            <BrowserRouter>
            
                <Routes>
                    <Route path="/" element={<Inicial/>}/>
                    <Route path="/admin/Dashboard" element={<Dashboard/>}/>
                </Routes>
            
            </BrowserRouter>
        
        </>
    ) 
}