import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Axios from "axios";
import './css/homeNovoPedido.css';

export default function ListUser() {
    const [listUser, setListUser] = useState([]);

    useEffect(() => {
        buscarUsers();
    }, []);

    const buscarUsers = () => {
        Axios.get("http://localhost:3001/users/userList")
            .then((response) => {
                console.log(response.data); // Verifique os dados recebidos
                setListUser(response.data);
            })
            .catch((error) => {
                console.error("Erro ao buscar dados: ", error);
            });
    };

    const deleteUser = (idFuncionario) => {
        if (idFuncionario > 0) {
            if (window.confirm(`Deseja excluir essa conta ${idFuncionario}` )) {
                Axios.delete(`http://localhost:3001/users/deleteUser/${idFuncionario}`)
                    .then((response) => {
                        console.log(response.data);
                        buscarUsers(); 
                    })
                    .catch((error) => {
                        console.error("Erro ao deletar usuário: ", error);
                    });
            }
        } else {
            alert('Usuário não encontrado');
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen ">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Lista de Usuários</h1>
            <Link to='/cadastro'>
                <button className="text-white w-60 py-3 my-2 leading-none bg-indigo-600 hover:bg-indigo-700 font-semibold rounded shadow">
                    Cadastrar novos usuários!
                </button>
            </Link>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {listUser && listUser.length > 0 ? (
                    listUser.map((user, index) => (
                        <li key={index} className="bg-slate-700 p-4 rounded-lg shadow-md">
                            <p className="text-white font-semibold">ID: {user.idFuncionario}</p>
                            <p className="text-white font-mono">Nome: {user.nomeFuncionario}</p>
                            <p className="text-white font-mono">CPF: {user.numeroCPF}</p>
                            <p className="text-white font-mono">Senha: {user.nomeSenha}</p>
                            <p className="text-white font-mono">Funcionário: {user.ativoFuncionario}</p>
                            <p className="text-white font-mono">Administrador: {user.ativoAdministrador}</p>
                            <button className="buttonDeleteUser text-white w-60 py-3 my-2 leading-none bg-indigo-600 hover:bg-indigo-700 font-semibold rounded shadow " onClick={() => deleteUser(user.idFuncionario)}>EXCLUIR CONTA</button>
                        </li>
                    ))
                ) : (
                    <li className="text-gray-500">Nenhum usuário encontrado</li>
                )}
            </ul>
        </div>
    );
}
