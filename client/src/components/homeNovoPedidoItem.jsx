import "./css/homeNovoPedidoItem.css"

export default function Itens(props){
    console.log(props.name)
    return(
    <div className="card-container">
                   
            <tr>
                <td><p className="card-title item">{props.name}</p></td>
                <td><p className="card-cost item">{props.cost}</p></td>
                <td><p className="card-category item">{props.category}</p></td>
                <td><p className="card-quantidade item">{props.quantidade}</p></td>
            </tr>

        <button onClick={() => {alert(props.id)}}>Adicionar Produto</button>   
        
    </div>
    )
}


