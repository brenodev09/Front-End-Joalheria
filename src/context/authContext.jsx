import { useState, useEffect, useContext, createContext } from "react";
import { api } from "../services/api";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const usuarioSalvo = localStorage.getItem("usuario");
        const tokenSalvo = localStorage.getItem("token");

        if (usuarioSalvo && tokenSalvo) {
            setUsuario(JSON.parse(usuarioSalvo));

            api.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${tokenSalvo}`;
        }

        setCarregando(false);
    }, []);

    async function login(email, senha) {
        try {
            const resposta = await api.post("/usuarios/login", {
                email,
                senha,
            });

            const { usuario, token } = resposta.data;

            localStorage.setItem(
                "usuario",
                JSON.stringify(usuario)
            );

            localStorage.setItem(
                "token",
                token
            );

            api.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${token}`;

            setUsuario(usuario);

            return {
                sucesso: true,
            };
        } catch (error) {
            return {
                sucesso: false,
                mensagem:
                    error.response?.data?.erro ||
                    "Erro ao fazer login",
            };
        }
    }

    async function logout() {
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");

        delete api.defaults.headers.common[
            "Authorization"
        ];

        setUsuario(null);
    }

    async function cadastrar(nome, email, senha) {
        try {
            await api.post("/usuarios", {
                nome,
                email,
                senha,
            });

            return {
                sucesso: true,
            };
        } catch (error) {
            return {
                sucesso: false,
                mensagem:
                    error.response?.data?.erro ||
                    "Erro ao cadastrar usuário",
            };
        }
    }

    const estaLogado = usuario !== null;

    return (
        <AuthContext.Provider
            value={{
                usuario,
                login,
                logout,
                cadastrar,
                estaLogado,
                carregando,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}