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
    return(
        <>        
            <Link to='/novopedido'><button onClick={CriarNovoPedido} className="homeNovoPedido container" >Novo Pedido</button></Link>
            <Link to='/lista'><button onClick={CriarNovoPedido} className="homeNovoPedido container" >Lista de usuários</button></Link>

        </>
    )
}