import { useContext, useState, useEffect } from 'react'
import {LoginContext} from '../../context/LoginContext'
import { useNavigate } from "react-router-dom";
import "./login.css"
import Axios from 'axios';

export default function Login() {
    const { setIsLogged } = useContext(LoginContext);
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    function logar() {
        if (usuario !== '' && senha !== '') {
            Axios.post("http://localhost:3001/login", {
                name: usuario,
                senha: senha
            }).then((response) => {
                let ativoFuncionario = response.data[0][0].ativoFuncionario;

                if (ativoFuncionario == 1) {
                    setIsLogged(true);
                    navigate('/home');
                } else if (ativoFuncionario == 0) {
                    alert('Acesso Negado');
                }
            });
        } else {
            alert('Preencha seu usuário e senha para continuar.');
        }
    }
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Enter") {
                logar();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        
    
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [usuario, senha]);


  return (
    <>
    <div className="min-h-screen flex flex-col justify-center bg-indigo-600">
        <div className="bg-white mx-auto max-w-md py-8 px-10 shadow rounded-lg">
            <div className="mb-4">                       
        </div>            
                <div className="mb-4">
                    <input type="text" name='name' placeholder="Usuário" onChange={(e) =>{setUsuario(e.target.value)}} className="appearance-none block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-50 focus:bg-white border border-gray-200 focus:border-gray-500 rounded focus:outline-none"></input>
                </div>
                <div className="mb-4">
                    <input type="password" name='senha' placeholder="Senha" onChange={(e) =>{setSenha(e.target.value)}} className="appearance-none block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-50 focus:bg-white border border-gray-200 focus:border-gray-500 rounded focus:outline-none"></input>
                </div>
                <div className="mb-4">
                    <button onClick={logar} className="inline-block w-full px-8 py-4 leading-none text-white bg-indigo-600 hover:bg-indigo-700 font-semibold rounded shadow"  >Entrar</button>
                </div>
                <div className="nb-4">
                    <p><a href="#" className="text-indigo-600">Esqueceu sua senha?</a></p>
                    <p>Não tem uma conta? <a href="/cadastro" className="text-indigo-600">Registre-se</a></p>
                </div>            
        </div>
    </div>
    </>
  );
}


