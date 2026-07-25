import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";
import AuthProvider from "./context/authContext.jsx";
import { CarrinhoProvider } from "./context/carrinhoContext.jsx";
import { BrowserRouter } from "react-router-dom";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>

      <BrowserRouter>

        <AuthProvider>

          <CarrinhoProvider>

            <App />

          </CarrinhoProvider>

        </AuthProvider>

      </BrowserRouter>

    </ErrorBoundary>
  </React.StrictMode>
);