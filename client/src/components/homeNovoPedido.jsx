import { useState, useEffect, useContext } from 'react';
import { LoginContext } from '../context/LoginContext.jsx';
import Axios from "axios";
import Itens from './homeNovoPedidoItem.jsx';
import './css/homeNovoPedido.css';
import { mensagem } from '../geral.jsx';
import { useNavigate } from "react-router-dom";
import './css/ApagarDepois.css';

import Loading from './loading.jsx';

export default function NovoPedido() {
    const [listProduto, setListProduto] = useState([]); 
    const [nomeGrupoPedido, setNomeGrupoPedido] = useState('');      
    const { idGrupoPedido } = useContext(LoginContext); 
    const navigate = useNavigate(); 
    const [quantidades, setQuantidades] = useState({});
    const [mostrarListaMesa, setMostrarListaMesa] = useState(true);
    const [table, setTable] = useState([]);
    const [idMesa, setIdMesa] = useState();

    const [removeLoading, setRemoveLoading] = useState(false)



    useEffect(() => {
        Axios.get("http://localhost:3001/products/listProduct").then((response) => {
            setListProduto(response.data);
            setRemoveLoading(true)
        });
    }, []);

<<<<<<< HEAD
    function pedidoInserir(idProduto, preco, quantidade) {         
        if (idGrupoPedido > 0) {
=======
    function pedidoInserir(idProduto, preco, quantidade){         
        if (idGrupoPedido > 0){
>>>>>>> b68723b4ced5cf215f2d7294132ca9384bb51e82
            Axios.post("http://localhost:3001/requested/requestInsert", {                
                idGrupoPedido: idGrupoPedido,
                idProduto: idProduto,   
                quantidade: quantidade,             
                preco: preco,            
            }).then((response) => {                              
                console.log(response);  
                setQuantidades(prev => ({
                    ...prev,
                    [idProduto]: (prev[idProduto] || 0) + 1
                }));                                     
            });            
        } else {
            mensagem('Informe o código do pedido.');
        }        
    }

    function pedidoExcluir(idProduto) {         
        if (idGrupoPedido > 0) {
            Axios.post("http://localhost:3001/requested/requestDelete", {                
                idGrupoPedido: idGrupoPedido,
                idProduto: idProduto         
            }).then((response) => {                              
                console.log(response);
                setQuantidades(prev => ({
                    ...prev,
                    [idProduto]: (prev[idProduto] || 1) - 1
                }));                                       
            });
        } else {
            mensagem('Informe o código do pedido.');
        }        
    }

<<<<<<< HEAD
    function getTable() {
        Axios.get("http://localhost:3001/table/getTable").then((response) => {
            setTable(response.data[0]);
        });    
    }

    useEffect(() => {
        getTable();
    }, []);

    function selecionarMesa(idMesa) {
        setIdMesa(idMesa);
        setMostrarListaMesa(false);
    }

    function salvarGrupoPedido() {        
        if (nomeGrupoPedido === '') return mensagem('Digite o nome do pedido.');
        
        if (idGrupoPedido > 0) { 
            if (idMesa === undefined) setIdMesa(0);
            if (idMesa !== undefined) {
                setMostrarListaMesa(false);
=======
    function getTable(){
        Axios.get("http://localhost:3001/table/getTable").then((response) => {
          setTable(response.data[0])            
        })    
    }

    useEffect(() => {
        getTable()
      }, [])

     function selecionarMesa(idMesa){
        setIdMesa(idMesa)
        setMostrarListaMesa(false)  
    }

    function salvarGrupoPedido(){        
        if (nomeGrupoPedido == '' || nomeGrupoPedido == undefined) return mensagem('Digite o nome do pedido.');
        
        if (idGrupoPedido > 0){                                     
                setMostrarListaMesa(false)
>>>>>>> b68723b4ced5cf215f2d7294132ca9384bb51e82
                Axios.post("http://localhost:3001/orderGroup/orderGroupSave", {                
                    idGrupoPedido: idGrupoPedido,
                    nomeGrupoPedido: nomeGrupoPedido,
                    idMesa: idMesa     
                }).then((response) => {                              
<<<<<<< HEAD
                    console.log(response);                                       
                });
                mensagem('Pedido salvo com sucesso.');
                navigate('/home');
            }  
        } else {
            mensagem('Informe o código do pedido.');
=======
                    console.log(response)                                       
                })
                mensagem('Pedido salvo com sucesso.')
                navigate('/home')            
        }else{
            mensagem('Informe o código do pedido.')
>>>>>>> b68723b4ced5cf215f2d7294132ca9384bb51e82
        }  
    }

    function cancelarGrupoPedido() {
        if (idGrupoPedido > 0) {
            Axios.post("http://localhost:3001/orderGroup/orderGroupCancel", {                
                idGrupoPedido: idGrupoPedido                         
            }).then((response) => {                              
                console.log(response);                                       
            });
            navigate('/home');
        } else {
            navigate('/home');
        }  
    }

    return(               
        <div className='NovoPedidoContainer'>
<<<<<<< HEAD
            {mostrarListaMesa === false &&
                <>
                    <div className='botoesPedido'>
                        <button className='apagarDepois' onClick={() => salvarGrupoPedido()}>Salvar Pedido</button>             
                        <button className='apagarDepois' onClick={() => cancelarGrupoPedido()}>Cancelar Pedido</button>                                              
                    </div>
                    <input className='inputNomeGrupoPedido' placeholder='Digite aqui o nome do pedido' type="text" onChange={(e) => setNomeGrupoPedido(e.target.value)}/>
                    <h2>Selecione os items do pedido:</h2>
                    <div>
                        <ul className='NovoPedidoContainerLista'>
                            <li>Item</li>
                            <li>Valor</li>
                            <li>Categoria</li> 
                            <li>Preço</li>
                        </ul>
                        <div>
                            {listProduto.map((value) => (
                                <div key={value.idProduto} className='listaProdutos'>
                                    <Itens
                                        listCard={listProduto}
                                        setListCard={setListProduto}
                                        id={value.idProduto}
                                        name={value.nomeProduto}
                                        cost={value.preco}
                                        category={value.idCategoria}
                                        quantidade={value.quantidade} 
                                    /> 
                                    <div className='adicionaERemoveProduto'>
                                        <button className='buttonApagarDepois' onClick={() => pedidoInserir(value.idProduto, value.preco, value.quantidade)}>+</button>   
                                        <p>{quantidades[value.idProduto] || 0}</p> 
                                        <button className='buttonApagarDepois' onClick={() => pedidoExcluir(value.idProduto)}>-</button>
                                    </div>   
                                </div>
                            ))}
                            {!removeLoading && <Loading />}     
                        </div>
                    </div>
                </>
            }
            {mostrarListaMesa === true &&
                <div id="divSalvarPedido">              
                    {table.map((value) => (
                        <div key={value.idMesa} className='listaMesa'>                                                                                      
                            <button className='mesa' onClick={()  => selecionarMesa(value.idMesa)}>{value.nomeMesa}</button>                                                                                                                                                              
                        </div>
                    ))}
                        {!removeLoading && <Loading />}     

                </div>
            }  
=======
            {mostrarListaMesa == false ?
            <div className='botoesPedido'>
                <button className='apagarDepois' onClick={() => salvarGrupoPedido()}>Salvar Pedido</button>             
                <button className='apagarDepois' onClick={() => cancelarGrupoPedido()}>Cancelar Pedido</button>                                              
            </div> 
            : ''}
            {mostrarListaMesa == false ? <input  className='inputNomeGrupoPedido' placeholder='Digite aqui o nome do pedido' type="text"  onChange={(e) => setNomeGrupoPedido(e.target.value)}/> : ''}
            {mostrarListaMesa == false ? <h2>Selecione os items do pedido:</h2> : ''}
            
            {mostrarListaMesa == false ?
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
            : ''}
            {mostrarListaMesa === true ?
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
                <div>
                    <button className='mesa' onClick={()  => selecionarMesa(null)}>Não especificar mesa</button>
                </div>
            </div> : ''}  
>>>>>>> b68723b4ced5cf215f2d7294132ca9384bb51e82
        </div>
    );
}
