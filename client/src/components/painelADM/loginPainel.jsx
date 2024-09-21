import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PainelLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3001/users/userList");
            const users = await response.json();

            const user = users.find(
                (user) => user.nomeUsuario === username && user.nomeSenha === password
            );

            if (user && user.ativoAdministrador === 1) {
                if (rememberMe) {
                    localStorage.setItem("userToken", "loggedIn"); 
                } else {
                    sessionStorage.setItem("userToken", "loggedIn"); 
                }
                navigate("/painelAdministrador");
            } else {
                setError("Nome de usuário ou senha incorretos ou sem permissão de administrador");
            }
        } catch (err) {
            console.error("Erro ao buscar usuários:", err);
            setError("Erro ao tentar fazer login. Tente novamente mais tarde.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <form className="bg-gray-800 p-6 rounded-lg shadow-lg w-80" onSubmit={handleLogin}>
                <h2 className="text-white text-2xl text-center mb-4">Login</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <div className="mb-4">
                    <label className="text-gray-400 block mb-2">Nome de Usuário</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                        placeholder="admin"
                    />
                </div>
                <div className="mb-4">
                    <label className="text-gray-400 block mb-2">Senha</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                        placeholder="1234"
                    />
                </div>
                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="mr-2"
                    />
                    <label className="text-gray-400">Lembrar-me</label>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
                >
                    Entrar
                </button>
            </form>
        </div>
    );
}
