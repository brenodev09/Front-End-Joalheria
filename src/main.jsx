import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";
import AuthProvider from "./context/authContext.jsx";
import { CarrinhoProvider } from "./context/carrinhoContext.jsx";
import { PedidosProvider } from "./context/pedidosContext.jsx";
import { BrowserRouter } from "react-router-dom";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>

      <BrowserRouter>

        <AuthProvider>

          <PedidosProvider>
            
            <CarrinhoProvider>
              <App />
            </CarrinhoProvider>

          </PedidosProvider>


        </AuthProvider>

      </BrowserRouter>

    </ErrorBoundary>
  </React.StrictMode>
);