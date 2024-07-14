import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import './css/novoPedido.css';
import Loading from './Loading.jsx';

import Modal from 'react-modal'
import Register from './Register.jsx';

Modal.setAppElement('#root')

export default function ListUser() {
    const [listUser, setListUser] = useState([]);
    const [removeLoading, setRemoveLoading] = useState(false);
    const [modalDelete, setModalDelete] = useState(false)
    const [modalRegister, setModalRegister] = useState(false)

    function openModalRegister() {
        setModalRegister(true)
    }

    function closeModalRegister() {
        setModalRegister(false)
    }


    function openModalDelete() {
        setModalDelete(true)
    }

    function closeModalDelete() {
        setModalDelete(false)
    }


    const buscarUsers = () => {
        Axios.get('http://localhost:3001/users/userList')
            .then((response) => {
                setListUser(response.data);
                setRemoveLoading(true);
            })
            .catch((error) => {
                console.error('Erro ao buscar dados: ', error);
            });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            buscarUsers();
          }, 2000);
      
          return () => clearInterval(interval);
        }, []);
    

    const deleteUser = (idFuncionario) => {
        if (idFuncionario > 0) {
                Axios.delete(`http://localhost:3001/users/deleteUser/${idFuncionario}`)
                    .then(() => {                        
                        buscarUsers(); 
                    })
                    .catch((error) => {
                        console.error("Erro ao deletar usuário: ", error);
                    });
            
        } else {
            alert('Usuário não encontrado');
        }
    };

    

    return (
        <div className="p-6 bg-[#40A578] min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center text-white">Lista de Usuários</h1>
                <button 
                className="text-white w-60 py-3 my-2 ml-12 mb-4  leading-none bg-[#9DDE8B] hover:bg-[#E6FF94] font-semibold rounded shadow transition duration-300 ease-in-out transform hover:scale-105"
                onClick={openModalRegister}>
                    Cadastrar novos usuários!
                </button>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listUser && listUser.length > 0 ? (
                listUser.map((user, index) => (
                    <li key={index} className="bg-slate-700 p-4 rounded-lg shadow-md">
                            <p className="text-white font-bold">ID: {user.idFuncionario}</p>
                            <p className="text-white font-mono">Nome: {user.nomeFuncionario}</p>
                            <p className="text-white font-mono">CPF: {user.numeroCPF}</p>
                            <p className="text-white font-mono">Senha: {user.nomeSenha}</p>
                            <p className="text-white font-mono">
                                Funcionário: {user.ativoFuncionario === 1 ? 'Ativado' : 'Desativado'}
                            </p>
                            <p className="text-white font-mono">
                                Administrador: {user.ativoAdministrador === 1 ? 'Ativado' : 'Desativado'}
                            </p>
                            <button
                                className="buttonDeleteUser text-white w-20 py-3 my-2 leading-none bg-indigo-600 hover:bg-indigo-700 font-semibold rounded shadow "
                                onClick={openModalDelete}
                            >
                                EXCLUIR CONTA
                            </button>
                            
                            <Modal
                            isOpen={modalDelete}
                            onRequestClose={closeModalDelete}
                            contentLabel="Modal de Confirmação de Exclusão"
                            overlayClassName='fixed inset-0 flex items-center justify-center backdrop-filter backdrop-blur-sm transition-opacity duration-300'
                            className='fixed inset-0 flex items-center justify-center backdrop-filter backdrop-blur-sm transition-opacity duration-300'
                        >
                            <div className='bg-white rounded-lg p-8 max-w-sm w-full opacity-100 transition-transform duration-300 transform'>
                                <h2 className='text-xl font-bold mb-6'>Deseja Excluir Esse Funcionário?</h2>
                                <div className='flex justify-end'>
                                    <button
                                        className='bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2'
                                        onClick={closeModalDelete}
                                    >
                                        Não
                                    </button>
                                    <button
                                        className='bg-red-500 text-white px-4 py-2 rounded'
                                        onClick={() => {
                                            deleteUser(user.idFuncionario);
                                            closeModalDelete();
                                        }}
                                    >
                                        SIM
                                    </button>
                                </div>
                            </div>
                        </Modal>

                        <Modal
                            isOpen={modalRegister}
                            onRequestClose={closeModalRegister}
                            contentLabel='Modal de Registro'
                            overlayClassName='fixed inset-0 flex items-center justify-center backdrop-filter backdrop-blur-sm transition-opacity duration-300'
                            className='flex items-center justify-center'
                                    >
                                <div className='rounded-lg p-8 max-w-md w-full opacity-100 transition-transform duration-300 transform'>
                                    <div className='flex justify-center mb-1'>
                                        <button
                                            className='bg-indigo-600 font-semibold px-4 py-2 rounded text-white'
                                            onClick={closeModalRegister}
                                        >
                                            Fechar
                                        </button>
                                    </div>
                                    <div>
                                        <Register />
                                    </div>
                                </div>
                        </Modal>
                    </li>
                        
                    ))
                ) : (
                <li className="text-gray-500">Nenhum usuário encontrado</li>
            )}
        </ul>
            {!removeLoading && <Loading />}
            {/* Modal de confirmação */}
        </div>
    );
}
