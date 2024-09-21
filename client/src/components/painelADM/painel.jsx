import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../loading";

export default function Painel() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const userToken = localStorage.getItem("userToken") || sessionStorage.getItem("userToken"); 

        if (userToken === "loggedIn") {
            setIsAuthenticated(true);
        } else {
            navigate("/loginPainel");
        }

        setLoading(false);
    }, [navigate]);

    const functionsAdmin = [
        { title: "Lista de Usuários", description: "Adicionar e remover usuários", url: "/usuarios" },
        { title: "Painel Financeiro", description: "Visualizar movimentação financeira", url: "/financeiro" },
        { title: "Gerenciamento de Estoque", description: "Atualizar e Gerenciar cardápios", url: "#" },
    ];

    if (loading) {
        return <Loading />;
    }

    return (
        isAuthenticated ? (
            <>
                <div className="flex items-center justify-center">
                    <h1 className="text-white font-mono text-3xl py-5">Painel Administrador</h1>
                </div>
                <div className="flex flex-wrap justify-center gap-6">
                    {functionsAdmin.map((functions, index) => (
                        <a
                            key={index}
                            href={functions.url}
                            className="bg-black m-4 p-6 rounded-lg shadow-lg w-64 text-center hover:bg-gray-800 transition duration-300"
                        >
                            <div>
                                <h2 className="text-white text-xl mb-2">{functions.title}</h2>
                                <p className="text-gray-400">{functions.description}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </>
        ) : (
            <p className="text-white">Redirecionando para login...</p>
        )
    );
}
