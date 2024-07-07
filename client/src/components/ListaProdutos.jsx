import "./css/homeNovoPedidoItem.css"

export default function ListaProdutos(props){    
    return(
    <>                   
        <ul className="listaDeProdutos">
            <li><p className="card-title item">{props.name}</p></li>
            <li><p className="card-cost item">{props.cost}</p></li>
            <li><p className="card-category item">{props.category}</p></li>
            <li><p className="card-quantidade item">{props.quantidade}</p></li>
        </ul>                
    </>
    )
}


