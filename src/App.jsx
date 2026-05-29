  import Inicio from "./components/Inicial"
import Categorias from "./components/Categorias/Categorias.jsx"
import Destaques from "./components/Destaques/ProdutosDestaque.jsx"
import Dashboard from "./components/Dashboard/index.jsx"
import Produtos from "./components/Produtos/ProductsAdmin.jsx"
import Conta from "./components/Conta/AzoryAccount.jsx"
import CategoriasAdmin from "./components/CategoriasAdmin/index.jsx"
import Cadastrar from "./components/Cadastrar/index.jsx"
import Cadastro from "./components/Cadastro/Register.jsx"
import ProdutosAdmin from "./pages/Admin/ProdutosAdmin";
import Rotas from "./routes/index.jsx"



import "./styles/cssGlobal.css"

function App() {
  return (
    <>
     


      <Rotas/>  
      {/* <Cadastro/> */}
     {/* <Produtos/> */}
     {/* <ProdutosAdmin/> */}

    
      {/* <Conta/> */}
      {/* <CategoriasAdmin/> */}
      {/* <Cadastrar/> */}
      {/* <Dashboard/> */}
       {/* <Inicio/> */}
      {/* <Categorias/>
      <Destaques/>  */}

    </>
  );
}

export default App;
