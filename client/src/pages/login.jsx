import { useContext, useState, useEffect } from "react";
import { LoginContext } from "../context/LoginContext.jsx";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Loading from "../components/Loading.jsx";

export default function Login() {
    const { setIsLogged, setAtivoAdm } = useContext(LoginContext);
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const navigate = useNavigate();
    const [removeLoading, setRemoveLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const logar = () => {
        if (usuario !== '' && senha !== '') {
            setRemoveLoading(false);
            Axios.post("http://localhost:3001/users/login", {
                name: usuario,
                senha: senha
            }).then((response) => {
                console.log(response.data);
                let ativoFuncionario = response.data[0][0].ativoFuncionario;
                if (ativoFuncionario === 1) {
                    let ativoAdm = response.data[0][0].ativoAdm;
                    setAtivoAdm(ativoAdm);
                    setIsLogged(true);
                    navigate('/home');
                } else {
                    setModalMessage('Acesso negado');
                    setModalOpen(true);
                }
            }).catch((error) => {
                console.error('Erro ao fazer login:', error);
                setModalMessage('Erro ao fazer login. Verifique suas credenciais.');
                setModalOpen(true);
            }).finally(() => {
                setRemoveLoading(true);
            });
        } else {
            setModalMessage('Preencha seu usuário e senha para continuar.');
            setModalOpen(true);
        }
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Enter") {
                logar();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [usuario, senha]);

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-800">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">APP-RESTAURANTE</h2>
                    <div className="mb-4">
                    { removeLoading ?
                        <input
                            type="text"
                            name="name"
                            placeholder="Usuário"
                            onChange={(e) => {
                                setUsuario(e.target.value);
                            }}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 leading-tight focus:bg-white"
                        /> : '' }
                    </div>
                    <div className="mb-4">
                      { removeLoading ?
                        <input
                            type="password"
                            name="senha"
                            placeholder="Senha"
                            onChange={(e) => {
                                setSenha(e.target.value);
                            }}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 leading-tight focus:bg-white"
                        /> : '' }
                    </div>
                    <div className="mb-6">
                        <button
                            onClick={() => logar()}
                            className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                        >
                            {removeLoading ? "Entrar" : "Carregando..."}
                        </button>
                    </div>
                    {!removeLoading && <Loading />} {/* Exibir o componente de loading se removeLoading for false */}
                </div>
            </div>

            {/* Modal com animação */}
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={closeModal}></div>
                    <div className="bg-white p-8 rounded-lg shadow-md max-w-md transform transition-all">
                        <p className="text-lg text-gray-800">{modalMessage}</p>
                        <div className="mt-4 flex justify-center">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
