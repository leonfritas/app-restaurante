import { useState, useEffect, useContext } from 'react';
import { LoginContext } from '../context/LoginContext.jsx';
import Axios from "axios";
import ListaProdutos from './homeNovoPedidoItem.jsx';
import './css/homeNovoPedido.css';
import { mensagem } from '../geral.jsx';
import { useNavigate } from "react-router-dom";
import './css/ApagarDepois.css';

import Loading from './loading.jsx';

export default function NovoPedido() {
    const [listProduto, setListProduto] = useState([]); 
     
    const { idGrupoPedido, nomeGrupoPedido, setNomeGrupoPedido } = useContext(LoginContext); 
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

    function pedidoInserir(idProduto, preco, quantidade) {         
        if (idGrupoPedido > 0) {
            Axios.post("http://localhost:3001/requested/requestInsert", {                
                idGrupoPedido: idGrupoPedido,
                idProduto: idProduto,   
                quantidade: quantidade,             
                preco: preco,            
            }).then(() => {                                              
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
            }).then(() => {                                              
                setQuantidades(prev => ({
                    ...prev,
                    [idProduto]: (prev[idProduto] || 1) - 1
                }));                                       
            });
        } else {
            mensagem('Informe o código do pedido.');
        }        
    }

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
                Axios.post("http://localhost:3001/orderGroup/orderGroupSave", {                
                    idGrupoPedido: idGrupoPedido,
                    nomeGrupoPedido: nomeGrupoPedido,
                    idMesa: idMesa,
                    textoObservacao: 'teste'     
                }).then(() => {                                                                                      
                });
                mensagem('Pedido salvo com sucesso.');
                navigate('/home');
            }  
        } else {
            mensagem('Informe o código do pedido.');
        }  
    }

    function cancelarGrupoPedido() {
        if (idGrupoPedido > 0) {
            Axios.post("http://localhost:3001/orderGroup/orderGroupCancel", {                
                idGrupoPedido: idGrupoPedido                         
            }).then(() => {                                                                                   
            });
            navigate('/home');
        } else {
            navigate('/home');
        }  
    }

    return(               
        <div className='NovoPedidoContainer'>
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
                                    <ListaProdutos
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
        </div>
    );
}
