
import { useContext, useState, useEffect} from "react";
import { Link } from "react-router-dom"

import "./css/homeNovoPedido.css"
import './css/ApagarDepois.css'
import { LoginContext } from '../context/LoginContext'



export default function Navbar() {
    const { setIdGrupoPedido, ativoAdm } = useContext(LoginContext)
    const [grupoPedido, setGrupoPedido] = useState();

    function CriarNovoPedido(){
        
        Axios.get("http://localhost:3001/orderGroup/orderGroupInsert").then((response) => {          
          setIdGrupoPedido(response.data[0][0].idGrupoPedido);      
        })          
    }

  return (
      <nav className="flex items-center justify-between bg-gray-800 p-6">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <span className="font-semibold text-xl tracking-tight">app-restaurante</span>
        </div>
        <div className="flex">
          <Link to='/novopedido'>
            <button onClick={() => CriarNovoPedido()} className="mr-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Novo Pedido
            </button>
          </Link>
          <Link to='/lista'>
            {ativoAdm ? <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Lista de usuários
            </button> : ''}
          </Link>
        </div>
      </nav>   
  );

}