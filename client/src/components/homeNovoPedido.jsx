import { useState, useEffect, useContext } from 'react';
import {LoginContext} from '../context/LoginContext.jsx'
import Axios from "axios"
import Itens from './homeNovoPedidoItem.jsx';
import './css/homeNovoPedido.css'
import { mensagem, mensagemPergunta } from '../geral.jsx';
import { useNavigate } from "react-router-dom";
import './css/ApagarDepois.css'

export default function NovoPedido(){
    const [listProduto, setListProduto] = useState(); 
    const [nomeGrupoPedido, setNomeGrupoPedido] = useState();      
    const { idGrupoPedido } = useContext(LoginContext); 
    const navigate = useNavigate(); 
    const [quantidades, setQuantidades] = useState({});
    const [salvarPedido, setSalvarPedido] = useState(false);
    const [table, setTable] = useState();

    useEffect(() => {
      Axios.get("http://localhost:3001/products/listProduct").then((response) => {
        setListProduto(response.data)        
      })
    }, [])


    function pedidoInserir(idProduto, preco, quantidade){         
        if (idGrupoPedido > 0){
            Axios.post("http://localhost:3001/requested/requestInsert", {                
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
            mensagem('Informe o código do pedido.')
        }        
    }

    function pedidoExcluir(idProduto){         
        if (idGrupoPedido > 0){
            Axios.post("http://localhost:3001/requested/requestDelete", {                
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
            mensagem('Informe o código do pedido.')
        }        
    }

     function getTable(){
         Axios.get("http://localhost:3001/table/getTable").then((response) => {
          setTable(response.data[0])    
        //   console.log(table)    
        })    
      }

    useEffect(() => {
        getTable()
      }, [])

     function selecionarMesa(idMesa){
        setSalvarPedido(false)  
        salvarGrupoPedido(idMesa)
        

    }

     function salvarGrupoPedido(idMesaSelecionada){        
        if (nomeGrupoPedido == '' || nomeGrupoPedido == undefined) return mensagem('Digite o nome do pedido.');
        
        if (idGrupoPedido > 0){     
            alert(idMesaSelecionada)       
            idMesaSelecionada !== 0 ? setSalvarPedido(true) : '';
            idMesaSelecionada !== 0 ? getTable() : '';
                         
            if (idMesaSelecionada > 0){
                setSalvarPedido(false)
                Axios.post("http://localhost:3001/orderGroup/orderGroupSave", {                
                    idGrupoPedido: idGrupoPedido,
                    nomeGrupoPedido: nomeGrupoPedido,
                    idMesa: idMesaSelecionada     
                }).then((response) => {                              
                    console.log(response)                                       
                })
                mensagem('Pedido salvo com sucesso.')
                navigate('/home')
            }//else mensagem('Selecione uma mesa.')    
        }else{
            mensagem('Informe o código do pedido.')
        }  
    }

    function cancelarGrupoPedido(){
        if (idGrupoPedido > 0){
            Axios.post("http://localhost:3001/orderGroup/orderGroupCancel", {                
                idGrupoPedido: idGrupoPedido                         
            }).then((response) => {                              
                console.log(response)                                       
            })
            navigate('/home')
        }else{
            navigate('/home')
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
            {salvarPedido === true ?
            <div id="divSalvarPedido">              
               {typeof table !== "undefined" &&
                    table.map((value) => {
                    return (
                        <>              
                            <div  className='listaMesa'>                                                                                      
                                <button className='mesa' onClick={()  => selecionarMesa(value.idMesa)}>{value.nomeMesa}</button>                                                                                                                                                              
                            </div>
                        </>
                    )
                    })}
            </div> : ''}  
        </div>
    )
}