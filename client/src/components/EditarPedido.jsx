import { useState, useEffect, useContext } from 'react';
import {LoginContext} from '../context/LoginContext.jsx'
import Axios from "axios"
// import ListaProdutos from './ListaProdutos.jsx';
import './css/novoPedido.css'
import { useNavigate } from "react-router-dom";
import './css/ApagarDepois.css'
import Loading from './Loading.jsx';
import { MsgModal } from '../geral.jsx'


export default function EditarPedido(){
    const [listProdutoEditar, setListProdutoEditar] = useState();      
    const { idGrupoPedido, nomeGrupoPedido, setNomeGrupoPedido, msgModal, setMsgModal} = useContext(LoginContext); 
    const navigate = useNavigate(); 
    const [quantidades, setQuantidades] = useState({});
    const [removeLoading, setRemoveLoading] = useState(false);    
    const [precoTotal, setPrecoTotal] = useState(0);
    const [textModal, setTextModal ] = useState(); 


    function atualizaEdicao(){
        Axios.post("http://localhost:3001/orderGroup/orderGroupEdit",{
            idGrupoPedido: idGrupoPedido
          }        
          ).then((response) => {
            const produtos = response.data[0];
            setListProdutoEditar(produtos);
            const quantidadesIniciais = {};
            produtos.forEach(produto => {
                quantidadesIniciais[produto.idProduto] = produto.quantidade;
            });
            setQuantidades(quantidadesIniciais);        
          })
          setRemoveLoading(true)
    }

    useEffect(() => {
        atualizaEdicao();
           
      }, []);

    function pedidoInserir(idProduto, preco, quantidade){                   
        if (idGrupoPedido > 0){
            const novaQuantidade = (quantidades[idProduto] || 0) + 1;
            Axios.post("http://localhost:3001/requested/requestInsert", {                
                idGrupoPedido: idGrupoPedido,
                idProduto: idProduto,   
                quantidade: quantidade,             
                preco: preco,            
            }).then(() => {                                               
                setQuantidades(prev => ({
                    ...prev,
                    [idProduto]: novaQuantidade
                }));                                     
            })  
            atualizaEdicao();          
        }else{
            openModal('Informe o código do pedido.');
        }        
    }

    function pedidoExcluir(idProduto){         
        if (idGrupoPedido > 0){
            const novaQuantidade = (quantidades[idProduto] || 0) - 1;            
            if (novaQuantidade >= 0) {
                Axios.post("http://localhost:3001/requested/requestDelete", {                
                    idGrupoPedido: idGrupoPedido,
                    idProduto: idProduto         
                }).then(() => {                                              
                    setQuantidades(prev => ({
                        ...prev,
                        [idProduto]: novaQuantidade
                    }));                                       
                })
            }    
            atualizaEdicao(); 
        }else{
            openModal('Informe o código do pedido.')
        }        
    }

    function salvarGrupoPedido(){                         
        if (idGrupoPedido > 0){
            Axios.post("http://localhost:3001/orderGroup/orderGroupSave", {                
                idGrupoPedido: idGrupoPedido,
                nomeGrupoPedido: nomeGrupoPedido          
            }).then(() => {                                                                                  
            })
            openModal('Pedido salvo com sucesso.');
            navigate('/home');
            setMsgModal(false);
        }else{
            openModal('Informe o código do pedido.');
        }  
    }

    function cancelarGrupoPedido(){                    
            navigate('/home')       
    }

    useEffect(() => {

        if (listProdutoEditar) {
            let total = 0;
        listProdutoEditar.forEach((produto) => {
            const quantidade = quantidades[produto.idProduto] || 0;
            total += produto.preco * quantidade;
        })
            setPrecoTotal(total);
        }
    }, [listProdutoEditar, quantidades]);

    function closeModal(action){
        if (action === 'msg') {
          setMsgModal(false);
        }
    }

    function openModal(msg){
        setTextModal(msg)
        setMsgModal(true)
    }

    return(
        <div className='NovoPedidoContainer'>
            <h2 className='text-lg font-bold mb-2'>EDITAR PEDIDO</h2>
            <h1></h1>
            <div className='flex justify-between mb-4'>               
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2' onClick={() => salvarGrupoPedido()}>Salvar Pedido</button>             
                <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded' onClick={() => cancelarGrupoPedido()}>Cancelar Pedido</button>                                              
            </div>      
            <input className='border border-gray-300 rounded px-3 py-2 mb-4 w-80' placeholder='Digite aqui o nome do pedido' type="text" value={nomeGrupoPedido} onChange={(e) => setNomeGrupoPedido(e.target.value)}/>               
            <div className="flex justify-end items-center mt-4">                
                <span className="text-xl font-bold">R${precoTotal.toFixed(2)}</span>
            </div>
            <h2 className='text-lg font-bold mb-2'>Selecione os items do pedido:</h2>
            <table className='w-full'>
    <thead className='bg-gray-200'>
        <tr className='border-b border-gray-300'>
            <th className='px-4 py-2 text-left'>Nome</th>
            <th className='px-4 py-2 text-left'>Preço</th>
            <th className='px-4 py-2 text-left'>Quantidade</th>
        </tr>
    </thead>
    <tbody>
        {listProdutoEditar?.map((value) => (
            <tr key={value.idProduto} className='border-b border-gray-200'>
                <td className='px-4 py-2'>{value.nomeProduto}</td>
                <td className='px-4 py-2'>R${value.preco.toFixed(2)}</td>
                <td className='px-4 py-2 flex items-center'>
                    <button className='bg-green-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded'
                            onClick={() => pedidoInserir(value.idProduto, value.preco, value.quantidade)}>+</button>
                    <span className='mx-2'>{quantidades[value.idProduto] || 0}</span>
                    <button className='bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded'
                            onClick={() => pedidoExcluir(value.idProduto)}>-</button>
                </td>
            </tr>
        ))}
    </tbody>
    {msgModal?
        <MsgModal
        // isOpen={functionModal}                    
        isClose={() => closeModal('msg')}                
        contentLabel="Modal de Edição de Produto"                            
        text={textModal}                    
        />
        : ''}
</table>
        {!removeLoading && <Loading />}
        </div>
    )
}
