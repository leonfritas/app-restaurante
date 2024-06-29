import { useState, useEffect, useContext } from 'react';
import {LoginContext} from '../context/LoginContext.jsx'
import Axios from "axios"
import Itens from './homeNovoPedidoItem.jsx';
import './css/homeNovoPedido.css'

export default function NovoPedido(){
    const [listProduto, setListProduto] = useState();      
    const { idGrupoPedido } = useContext(LoginContext);  

    useEffect(() => {
      Axios.get("http://localhost:3001/getProduto").then((response) => {
        setListProduto(response.data)        
      })
    }, [])


    function pedidoInserir(idProduto, preco, quantidade){        
        Axios.post("http://localhost:3001/pedidoinserir", {                
            idGrupoPedido: idGrupoPedido,
            idProduto: idProduto,   
            quantidade: quantidade,             
            preco: preco,            
        }).then((response) => {                              
            console.log(response)                                       
        })
    }

    function mostrarIdGrupoPedido(){
        alert(idGrupoPedido)
    }

    return(
        <div>   
            <button onClick={mostrarIdGrupoPedido}>MOSTRAR IDGRUPOPEDIDO</button>                              
            <h2>Selecione os items do pedido:</h2>
            <div>                    
                <ul>
                    <li>Item</li>
                    <li>Valor</li>
                    <li>categoria</li> 
                    <li>preco</li>
                </ul>
                {typeof listProduto !== "undefined" && 
                    listProduto.map((value) => {
                    return(
                    <>
                    <Itens key={value.idProduto}
                        listCard={listProduto}
                        setListCard={setListProduto}
                        id={value.idProduto}
                        name={value.nomeProduto}
                        cost={value.preco}
                        category={value.idCategoria}
                        quantidade={value.quantidade} /> 
                        <button onClick={pedidoInserir(value.idProduto, value.preco, value.quantidade)}>Adicionar Produto</button>                      
                    </> 
                    )
                })}                    
            </div>   
        </div>
    )
}