import { Link } from "react-router-dom"
import "./css/homeNovoPedido.css"
import Axios from "axios";
import { useContext } from "react";
import { LoginContext } from '../context/LoginContext'


export default function Home(){
    const {setIdGrupoPedido } = useContext(LoginContext)

    function CriarNovoPedido(){
        
            Axios.get("http://localhost:3001/grupopedidoinserir").then((response) => {          
              setIdGrupoPedido(response.data[0][0].idGrupoPedido);
              console.log(response.data[0][0].idGrupoPedido)
            })          
    }
    return (
        <nav className="flex items-center justify-between bg-gray-800 p-6">
          <div className="flex items-center flex-shrink-0 text-white mr-6">
            <span className="font-semibold text-xl tracking-tight">app-restaurante</span>
          </div>
          <div className="flex">
            <Link to='/novopedido'>
              <button className="mr-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Novo Pedido
              </button>
            </Link>
            <Link to='/lista'>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Lista de usuários
              </button>
            </Link>
          </div>
        </nav>
      );
      
}