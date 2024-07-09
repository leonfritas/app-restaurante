import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { LoginContext } from '../context/LoginContext';
import Axios from "axios";

export default function Navbar() {
    const { ativoAdm, setIdGrupoPedido } = useContext(LoginContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para controlar a abertura do menu responsivo

    function CriarNovoPedido() {
        Axios.get("http://localhost:3001/orderGroup/orderGroupInsert")
            .then((response) => {
                setIdGrupoPedido(response.data[0][0].idGrupoPedido);
            })
            .catch((error) => {
                console.error("Erro ao criar novo pedido: ", error);
            });
    }

    return (
        <nav className="bg-gray-800 p-6">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    {/* Menu button for mobile */}
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button type="button" className="inline-flex items-center justify-center p-2  rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <span className="sr-only">Open main menu</span>
                            {/* Hamburger menu icon */}
                            <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                    {/* Logo or site name */}
                    <div className="flex-shrink-0">
                        <Link to='/home'>
                          <button className="text-white text-xl font-semibold ml-12">App Restaurador</button>
                        </Link>
                    </div>
                    {/* Menu items */}
                    <div className="hidden sm:block sm:ml-6">
                        <div className="flex space-x-4">
                            <Link to='/novopedido'>
                                <button onClick={CriarNovoPedido} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Novo Pedido
                                </button>
                            </Link>
                            {ativoAdm && (
                                <Link to='/lista'>
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                        Lista de usuários
                                    </button>
                                </Link>
                            )}
                            {ativoAdm && (
                                <Link to='/financeiro'>
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded">
                                        Financeiro
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu responsivo */}
            <div className={`sm:hidden ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} absolute top-0 left-0 h-screen w-1/2 bg-gray-800 transition-transform duration-300 ease-in-out`}>
                <div className="p-4">
                    <div className="flex justify-end">
                        {/* Botão de fechar */}
                        <button type="button" className="text-gray-400 hover:text-white focus:outline-none" onClick={() => setIsMenuOpen(false)}>
                            <span className="sr-only">Fechar menu</span>
                            {/* Ícone de fechar */}
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                            <h1 className="text-white font-bold text-center text-xl ">MenuNavbar</h1>
                    <div className="mt-6 space-y-4">
                        {/* Botão Novo Pedido */}
                        <Link to='/novopedido'>
                            <button onClick={CriarNovoPedido} className="block w-full px-4 py-2 text-center text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-700 mb-2">
                                Novo Pedido
                            </button>
                        </Link>
                        {/* Lista de usuários */}
                        {ativoAdm && (
                            <Link to='/lista'>
                                <button className="block w-full px-4 py-2 text-center text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-700 mb-2">
                                    Lista de usuários
                                </button>
                            </Link>
                        )}
                        {/* Financeiro */}
                        {ativoAdm && (
                            <Link to='/financeiro'>
                                <button className="block w-full px-4 py-2 text-center text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-700 mb-2">
                                    Financeiro
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
