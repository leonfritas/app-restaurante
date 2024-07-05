import { useContext } from "react";
import { Link } from "react-router-dom";
import "./css/homeNovoPedido.css";
import { LoginContext } from '../context/LoginContext';
import Axios from "axios";

export default function Navbar() {
    const { ativoAdm, setIdGrupoPedido } = useContext(LoginContext);

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
        <nav className="flex items-center justify-between bg-gray-800 p-6">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <span className="font-semibold text-xl tracking-tight">app-restaurante</span>
            </div>
            <div className="flex">
                <Link to='/novopedido'>
                    <button onClick={CriarNovoPedido} className="mr-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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
            </div>
        </nav>
    );
}
