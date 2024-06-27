import { Link } from "react-router-dom"

export default function Home(){




    return(
        <>        
            <Link to='/novopedido'><button className="homeNovoPedido" >Novo Pedido</button></Link>
        </>
    )
}