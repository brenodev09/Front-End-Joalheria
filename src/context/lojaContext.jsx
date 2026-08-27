/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const LojaContext = createContext(null);

export function LojaProvider({ children }) {
  const [status, setStatus] = useState(null);
  const [dados, setDados] = useState(null);

  async function consultarStatus() {
    try {
      const resposta = await api.get("/status-loja");
      setDados(resposta.data || {});
      setStatus(resposta.data?.status || "online");
    } catch {
      setStatus("online");
    }
  }

  useEffect(() => {
    const consultaInicial = window.setTimeout(consultarStatus, 0);
    const intervalo = window.setInterval(consultarStatus, 15000);
    return () => { window.clearTimeout(consultaInicial); window.clearInterval(intervalo); };
  }, []);

  return <LojaContext.Provider value={{ status, dados, atualizarStatus: consultarStatus }}>{children}</LojaContext.Provider>;
}

export function useLoja() {
  return useContext(LojaContext);
}
