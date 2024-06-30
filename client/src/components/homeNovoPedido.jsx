import { useState, useEffect, useContext } from 'react';
import {LoginContext} from '../context/LoginContext.jsx'
import Axios from "axios"
import Itens from './homeNovoPedidoItem.jsx';
import './css/homeNovoPedido.css'
import { mensagemErro } from '../geral.jsx';
import { useNavigate } from "react-router-dom";
import './css/ApagarDepois.css'

export default function NovoPedido(){
    const [listProduto, setListProduto] = useState(); 
    const [nomeGrupoPedido, setNomeGrupoPedido] = useState();      
    const { idGrupoPedido } = useContext(LoginContext); 
    const navigate = useNavigate(); 
    const [quantidades, setQuantidades] = useState({});


    useEffect(() => {
      Axios.get("http://localhost:3001/getProduto").then((response) => {
        setListProduto(response.data)        
      })
    }, [])


    function pedidoInserir(idProduto, preco, quantidade){         
        if (idGrupoPedido > 0){
            Axios.post("http://localhost:3001/pedidoinserir", {                
                idGrupoPedido: idGrupoPedido,
                idProduto: idProduto,   
                quantidade: quantidade,             
                preco: preco,            
            }).then((response) => {                              
                console.log(response)  
                setQuantidades(prev => ({
                    ...prev,
                    [idProduto]: (prev[idProduto] || 0) + 1
                }));                                     
            })            
        }else{
            mensagemErro('Informe o código do pedido.')
        }        
    }

    function pedidoExcluir(idProduto){         
        if (idGrupoPedido > 0){
            Axios.post("http://localhost:3001/pedidoexcluir", {                
                idGrupoPedido: idGrupoPedido,
                idProduto: idProduto         
            }).then((response) => {                              
                console.log(response)
                setQuantidades(prev => ({
                    ...prev,
                    [idProduto]: (prev[idProduto] || 1) - 1
                }));                                       
            })
        }else{
            mensagemErro('Informe o código do pedido.')
        }        
    }

    function salvarGrupoPedido(){        
        if (nomeGrupoPedido == '' || nomeGrupoPedido == undefined) return mensagemErro('Digite o nome do pedido.');

        if (idGrupoPedido > 0){
            Axios.post("http://localhost:3001/grupopedidosalvar", {                
                idGrupoPedido: idGrupoPedido,
                nomeGrupoPedido: nomeGrupoPedido          
            }).then((response) => {                              
                console.log(response)                                       
            })
        }else{
            mensagemErro('Informe o código do pedido.')
        }  
    }

    function cancelarGrupoPedido(){
        if (idGrupoPedido > 0){
            Axios.post("http://localhost:3001/grupopedidocancelar", {                
                idGrupoPedido: idGrupoPedido                         
            }).then((response) => {                              
                console.log(response)                                       
            })
            navigate('/home')
        }else{
            mensagemErro('Informe o código do pedido.')
        }  
    }


    return(
        <div className='NovoPedidoContainer'>
            <div className='botoesPedido'>
                <button className='apagarDepois' onClick={() => salvarGrupoPedido()}>Salvar Pedido</button>             
                <button className='apagarDepois' onClick={() => cancelarGrupoPedido()}>Cancelar Pedido</button>                                              
            </div> 
            <input  className='inputNomeGrupoPedido' placeholder='Digite aqui o nome do pedido' type="text"  onChange={(e) => setNomeGrupoPedido(e.target.value)}/> 
            <h2>Selecione os items do pedido:</h2>
            <div >                    
                <ul className='NovoPedidoContainerLista'>
                    <li>Item</li>
                    <li>Valor</li>
                    <li>categoria</li> 
                    <li>preco</li>
                </ul>
                <div >
                {typeof listProduto !== "undefined" && 
                    listProduto.map((value) => {
                    return(
                    < >
                        <div className='listaProdutos'>
                            <Itens  key={value.idProduto}
                                listCard={listProduto}
                                setListCard={setListProduto}
                                id={value.idProduto}
                                name={value.nomeProduto}
                                cost={value.preco}
                                category={value.idCategoria}
                                quantidade={value.quantidade} /> 
                                <div className='adicionaERemoveProduto'>
                                    <button className='buttonApagarDepois' onClick={() => pedidoInserir(value.idProduto, value.preco, value.quantidade)}>+</button>   
                                    <p>{quantidades[value.idProduto] || 0}</p> 
                                    <button className='buttonApagarDepois' onClick={() => pedidoExcluir(value.idProduto)}>-</button>
                                </div>   
                        </div>                    
                    </>
                    )
                })}     
                </div>               
            </div>

        </div>
    )
}