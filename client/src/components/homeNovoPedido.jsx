import { useState, useEffect } from 'react';
import Axios from "axios"
import Itens from './homeNovoPedidoItem.jsx';
import './css/homeNovoPedido.css'

export default function NovoPedido(){
    const [listGames, setListGames] = useState();
    // console.log(values)

    useEffect(() => {
      Axios.get("http://localhost:3001/getCards").then((response) => {
        setListGames(response.data)
        console.log(response.data)
      })
    }, [])

    return(
        <div>
                <h2>Selecione os items do pedido:</h2>
                <table>
                    <tr>
                        <td>Item</td>
                        <td>Valor</td>
                        <td>categoria</td> 
                        <td>preco</td>
                    </tr>
                    {typeof listGames !== "undefined" && 
                        listGames.map((value) => {
                        return(
                        <>
                        <Itens key={value.idProduto}
                            listCard={listGames}
                            setListCard={setListGames}
                            id={value.idProduto}
                            name={value.nomeProduto}
                            cost={value.preco}
                            category={value.idCategoria}
                            quantidade={value.quantidade} />                      
                        </> 
                        )
                    })}
                </table>   
        </div>
    )
}