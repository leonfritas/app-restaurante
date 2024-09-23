import { useContext, useState, useEffect } from "react";
import { LoginContext } from "../../context/LoginContext.jsx";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Loading from "../loading.jsx";
import logoHest from '../../assets/logoHest.png';

export default function loginPainel() {
    const { setIsLogged, setAtivoAdm, setIdFuncionario, database, setDataBase } = useContext(LoginContext);
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const navigate = useNavigate();
    const [removeLoading, setRemoveLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    function getCompany(idEmpresa) {
        Axios.post("http://localhost:3001/company/getCompany", {
            idEmpresa: idEmpresa,
            database: database
        }).then((response) => {
            console.log(response.data[0][0].nomeEmpresa);
        }).catch((error) => {
            console.error('Erro ao buscar dados da empresa:', error);
            setModalMessage(error.response?.data?.message || 'Erro ao buscar dados da empresa.');
            setModalOpen(true);
        }).finally(() => {
            setRemoveLoading(true);
        });
    }

    const logar = () => {
        if (usuario !== '' && senha !== '') {
            setRemoveLoading(false);
            Axios.post("http://localhost:3001/users/login", {
                name: usuario,
                senha: senha,
                database: database
            }).then((response) => {
                if (response.data && response.data[0] && response.data[0][0]) {
                    getCompany(1);

                    let user = response.data[0][0];
                    let ativoFuncionario = user.ativoFuncionario;

                    if (ativoFuncionario) {
                        let ativoAdm = user.ativoAdm;
                        let idFuncionario = user.idFuncionario;

                        sessionStorage.setItem('isLogged', true);
                        sessionStorage.setItem('idFuncionario', idFuncionario);
                        sessionStorage.setItem('database', database);

                        setIdFuncionario(idFuncionario);
                        setAtivoAdm(ativoAdm);
                        setIsLogged(true);

                        navigate('/painelAdmin');
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
        const isLogged = sessionStorage.getItem('isLogged');
        const ativoAdm = sessionStorage.getItem('ativoAdm');
        const idFuncionario = sessionStorage.getItem('idFuncionario');

        if (isLogged) {
            setIsLogged(true);
            setAtivoAdm(ativoAdm === 'true');  
            setIdFuncionario(idFuncionario);
            navigate('/painelAdmin');
        }
    }, [navigate, setIsLogged, setAtivoAdm, setIdFuncionario]);

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
                <div className="loginContainer">
                    <img className="logoHest" src={logoHest} alt="" />
                    <div className="divInput">
                        {removeLoading ? (
                            <input
                                type="text"
                                placeholder="Empresa"
                                onChange={(e) => setDataBase(e.target.value)}
                                className="input"
                            />
                        ) : null}
                    </div>
                    <div className="divInput">
                        {removeLoading ? (
                            <input
                                type="text"
                                placeholder="Usuário"
                                onChange={(e) => setUsuario(e.target.value)}
                                className="input"
                            />
                        ) : null}
                    </div>
                    <div className="divInput">
                        {removeLoading ? (
                            <input
                                type="password"
                                placeholder="Senha"
                                onChange={(e) => setSenha(e.target.value)}
                                className="input"
                            />
                        ) : null}
                    </div>
                    {removeLoading ? (
                        <div className="divButtonEntrar">
                            <button onClick={logar} className="buttonEntrar">
                                {removeLoading ? "Entrar" : "Carregando..."}
                            </button>
                        </div>
                    ) : null}
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
                            </button>b
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
