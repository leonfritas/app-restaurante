import { Link } from "react-router-dom"
import "./css/homeNovoPedido.css"


export default function Home(){

    return(
        <>        
            <Link to='/novopedido'><button className="homeNovoPedido container " >Novo Pedido</button></Link>
        </>
    )
}