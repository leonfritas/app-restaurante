import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { RegisterContext } from '../../context/RegisterContext.jsx';

export default function Register() {
    const { setIsCreated } = useContext(RegisterContext);
    const [realName, setName] = useState('');
    const [user, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    const register = () => {
        if (realName !== '' && user !== '' && senha !== '') {
            Axios.post("http://localhost:3001/cadastrar", {
                realName: realName,
                user: user,
                senha: senha
            }).then((response) => {
                // Verifica se a resposta está vazia
                if (!response.data) {
                    console.error('Resposta vazia ao cadastrar:', response);
                    alert('Erro ao tentar cadastrar. Resposta vazia do servidor.');
                    return;
                }

                // Verifica se há dados na resposta
                if (response.data[0] && response.data[0][0]) {
                    let ativoFuncionario = response.data[0][0].ativoFuncionario;

                    if (ativoFuncionario === 1) {
                        setIsCreated(true);
                        navigate('/');
                    } else if (ativoFuncionario === 0) {
                        alert('Acesso Negado');
                    }
                } else {
                    console.error('Resposta de cadastro inválida:', response);
                    alert('Erro ao tentar cadastrar. Resposta inválida do servidor.');
                }
            }).catch((error) => {
                console.error('Erro ao cadastrar:', error);
                alert('Erro ao tentar cadastrar. Por favor, tente novamente mais tarde.');
            });
        } else {
            alert('Preencha seu nome, usuário e senha para continuar.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center bg-indigo-600">
            <div className="bg-white mx-auto max-w-md py-8 px-10 shadow rounded-lg">
                <div className="mb-4">
                    {/* Se você deseja adicionar algum título ou cabeçalho, pode ser colocado aqui */}
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Nome completo..."
                        value={realName}
                        onChange={(e) => setName(e.target.value)}
                        className="appearance-none block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-50 focus:bg-white border border-gray-200 focus:border-gray-500 rounded focus:outline-none"
                    />
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        name="user"
                        placeholder="Nome de Usuário..."
                        value={user}
                        onChange={(e) => setUsuario(e.target.value)}
                        className="appearance-none block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-50 focus:bg-white border border-gray-200 focus:border-gray-500 rounded focus:outline-none"
                    />
                </div>

                <div className="mb-4">
                    <input
                        type="password"
                        name="senha"
                        placeholder="Senha..."
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className="appearance-none block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-50 focus:bg-white border border-gray-200 focus:border-gray-500 rounded focus:outline-none"
                    />
                </div>

                <div className="mb-4">
                    <button
                        onClick={register}
                        className="inline-block w-full px-8 py-4 leading-none text-white bg-indigo-600 hover:bg-indigo-700 font-semibold rounded shadow focus:outline-none"
                    >
                        Criar Conta
                    </button>
                </div>

                <div className="mb-4">
                    <p>
                        Já tem uma conta? <a href="/" className="text-indigo-600">Faça Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
}