import { useState, useEffect } from 'react';
import { Link } from "react-router-dom"
import Axios from "axios";
import './css/homeNovoPedido.css';

export default function ListUser() {
    const [listUser, setListUser] = useState([]);

    useEffect(() => {
        Axios.get("http://localhost:3001/users/userList")
            .then((response) => {                
                setListUser(response.data);
            })
            .catch((error) => {
                console.error("Erro ao buscar dados: ", error);
            });
    }, []);



    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Lista de Usuários</h1>
            <Link to='/cadastro'><button className="text-white w-60 py-3 my-2 leading-none bg-indigo-600 hover:bg-indigo-700 font-semibold rounded shadow" >Cadastrar novos usuários!</button></Link>


            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {listUser.length > 0 ? (
                    listUser.map((user, index) => (
                        <li key={index} className="bg-slate-700 p-4 rounded-lg shadow-md">
                            <p className="text-white font-semibold">ID: {user.idFuncionario}</p>
                            <p className="text-white">Nome: {user.nomeFuncionario}</p>
                            <p className="text-white">Senha: {user.nomeSenha}</p>
                            <p className="text-white">Administrador {user.ativoAdministrador?.data[0]}</p>
                            <button type="submit" className="text-white w-full py-3 leading-none bg-indigo-600 hover:bg-indigo-700 font-semibold rounded shadow">
                                ATUALIZAR
                            </button>
                        </li>
                    ))
                ) : (
                    <li className="text-gray-500">Nenhum usuário encontrado</li>
                )}
            </ul>
        </div>
    );
}
