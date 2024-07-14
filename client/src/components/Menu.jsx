import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from '../context/LoginContext';
import Axios from "axios";

export default function Menu() {
    const { setIdGrupoPedido, idFuncionario } = useContext(LoginContext);
    
    function CriarNovoPedido() {
        Axios.post("http://localhost:3001/orderGroup/orderGroupInsert", {
            idFuncionario: idFuncionario
        })
            .then((response) => {                
                setIdGrupoPedido(response.data[0][0].idGrupoPedido);
            })
            .catch((error) => {
                console.error("Erro ao criar novo pedido: ", error);
            });
    }
    return (
        <div className="flex justify-center items-center mt-9">
            <Link to='/novopedido'>
                <button onClick={CriarNovoPedido}
                    type="button"
                    className="w-60 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center">
                        <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                    <span className="text-center">Novo Pedido</span>
                </button>
            </Link>
        </div>
    );
}
