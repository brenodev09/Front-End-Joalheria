import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useLoja } from "../context/lojaContext";

export default function StatusLojaGuard() {
  const { usuario, carregando: carregandoAuth } = useAuth();
  const { status } = useLoja();

  if (carregandoAuth || !status) return <p>Carregando...</p>;
  if (usuario?.tipo === "admin") return <Outlet />;
  if (status === "maintenance" || status === "closed") return <Navigate to="/manutencao" replace />;
  return <Outlet />;
}
