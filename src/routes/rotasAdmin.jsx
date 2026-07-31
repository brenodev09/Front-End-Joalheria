import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function RotasAdmin() {

    const { carregando, estaLogado, usuario } = useAuth();

    if (carregando) {
        return <p>Está carregando!</p>;
    }

    if (!estaLogado) {
        return <Navigate to="/login" />;
    }

    if (usuario.tipo !== "admin") {
        return <Navigate to="/" />;
    }

    return <Outlet />;
}