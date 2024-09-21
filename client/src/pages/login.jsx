import { useContext, useState, useEffect } from "react";
import { LoginContext } from "../context/LoginContext.jsx";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Loading from "../components/loading.jsx";
import './css/login.css'
import  logoHest  from '../assets/logoHest.png'

export default function Login() {
    const { setIsLogged, setAtivoAdm, setIdFuncionario } = useContext(LoginContext);
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
                console.log('Resposta do servidor:', response); // Log da resposta
    
                if (response.data && response.data[0] && response.data[0][0]) {
                    let user = response.data[0][0];
                    let ativoFuncionario = user.ativoFuncionario;
    
                    if (ativoFuncionario) {
                        let ativoAdm = user.ativoAdm;                    
                        let idFuncionario = user.idFuncionario;
                        setIdFuncionario(idFuncionario);                    
                        setAtivoAdm(ativoAdm);
                        setIsLogged(true);
                        navigate('/home');
                    } else {
                        setModalMessage('Acesso negado');
                        setModalOpen(true);
                    }
                } else {
                    setModalMessage('Usuário ou senha incorretos.');
                    setModalOpen(true);
                }
            }).catch((error) => {
                console.error('Erro ao fazer login:', error);
                setModalMessage(error.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
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
            <div className="mainLogin">            
                <div className=" loginContainer ">
                    <img className="logoHest" src={logoHest} alt="" />
                    <div className="divInput">
                    { removeLoading ?
                        <input
                            type="text"
                            name="name"
                            placeholder="Usuário"
                            onChange={(e) => {
                                setUsuario(e.target.value);
                            }}
                            className="input"
                        /> : '' }
                    </div>                    
                    <div className="divInput">
                      { removeLoading ?
                        <input
                            type="password"
                            name="senha"
                            placeholder="Senha"
                            onChange={(e) => {
                                setSenha(e.target.value);
                            }}
                            className="input"
                        /> : '' }
                    </div>
                    { removeLoading ?
                        <div className="divButtonEntrar">
                        <button
                            onClick={() => logar()}
                            className="buttonEntrar"
                        >
                            {removeLoading ? "Entrar" : "Carregando..."}
                        </button>
                    </div> 
                        : ''} 
                    {!removeLoading && <Loading />}
                    <p className="version">v1.0.0</p>
                    <p className="lasoft">L.A.</p>
                </div>
                
            </div>
            
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
