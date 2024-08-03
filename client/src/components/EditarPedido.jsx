import { useState, useEffect, useContext, useRef } from 'react';
import {LoginContext} from '../context/LoginContext.jsx'
import Axios from "axios"
import './css/novoPedido.css'
import { useNavigate } from "react-router-dom";
import './css/ApagarDepois.css'
import Loading from './Loading.jsx';
import { MsgModal } from '../geral.jsx';
import './css/editarPedido.css';


export default function EditarPedido(){
    const [listProdutoEditar, setListProdutoEditar] = useState();      
    const [listProduto, setListProduto] = useState(); 
    const { idGrupoPedido, nomeGrupoPedido, setNomeGrupoPedido, msgModal, setMsgModal} = useContext(LoginContext); 
    const navigate = useNavigate(); 
    const [quantidades, setQuantidades] = useState({});
    const [removeLoading, setRemoveLoading] = useState(false);    
    const [precoTotal, setPrecoTotal] = useState(0);
    const [textModal, setTextModal ] = useState(); 
    const [listCategory, setListCategory] = useState(); 
    const carousel = useRef(null);           
    const [isProcessing, setIsProcessing] = useState(false);  


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
        Axios.get("http://localhost:3001/category/getCategory")
          .then((response) => {
            // Mapeia os dados para incluir URLs das imagens
            const categoriesWithImages = response.data.map((item) => {
              if (item.imgCategoria && item.imgCategoria.data) {
                // Cria um Blob a partir dos dados binários
                const imageBlob = new Blob([new Uint8Array(item.imgCategoria.data)], { type: 'image/jpeg' });
                // Cria uma URL de objeto para a imagem
                const imageUrl = URL.createObjectURL(imageBlob);
                return {
                  ...item,
                  imageUrl, // Adiciona a URL da imagem ao objeto do item
                };
              }
              return item; // Retorna o item sem alterações se não houver imagem
            });
    
            setListCategory(categoriesWithImages);
            setRemoveLoading(true);
          })
          .catch((error) => {
            console.error("Error fetching categories:", error);
          });
    }, []);

    useEffect(() => {
        atualizaEdicao();
           
      }, []);

    function pedidoInserir(idProduto, preco, quantidade){     
        setIsProcessing(true);              
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
        setIsProcessing(false);  
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

    function filterByCategory(idCategory){                  
        if(idGrupoPedido > 0){            
            Axios.post("http://localhost:3001/category/filterByCategory", {
                idCategory: idCategory, 
                idGrupoPedido: idGrupoPedido                
            }).then((response) => {                
                setListProduto(response.data[0]);                                                      
            })
        }else{            
            openModal('msg', 'Número de pedido não encontrado',);
        }
    }    
    return(
        <div className='NovoPedidoContainer'>
            <h2 className='text-lg font-bold mb-2  text-white'>EDITAR PEDIDO</h2>
            <h1></h1>
            <div className='flex justify-between mb-4'>               
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2' onClick={() => salvarGrupoPedido()}>Salvar Pedido</button>             
                <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded' onClick={() => cancelarGrupoPedido()}>Cancelar Pedido</button>                                              
            </div>      
            <input className='border border-gray-300 rounded px-3 py-2 mb-4 w-80' placeholder='Digite aqui o nome do pedido' type="text" value={nomeGrupoPedido} onChange={(e) => setNomeGrupoPedido(e.target.value)}/>               
            <div className='carousel' ref={carousel}> 
                        
                {listCategory?.map((value) => (
                        <div key={value.idCategoria} className='divCarouselButton'>
                            <button className='carouselButton' onClick={() => filterByCategory(value.idCategoria, value.imagemCategoria)} role="button">
                                                                       
                                {value.imageUrl ? (
                                <img src={value.imageUrl}  />
                                ) : (
                                <p>No image available</p>
                                )}
                            </button>
                            <p className='nomeCategoriaButton'>{value.nomeCategoria}</p>                                                                                                   
                        </div>
                ))}
            </div>
            <div className="selecionarProduto">
                {/* <h2 className='selecionarTexto'>Selecione os itens do pedido:</h2> */}
                {/* <img className='imgSuco' src={imgPrincipal} alt="" /> */}
                <div className="selecionarValorTotal">                        
                    <span className="text-xl font-bold">R$ {precoTotal.toFixed(2)}</span>
                </div>                        
            </div>
                                                        
            <div className='tableProdutos'>                        
                <div className='tableTitle'>
                    <p className='nomeProduto'>Produto</p>
                    <p className='precoProduto'>Preço</p>
                    <p className=''>Quantidade</p>
                </div>                        
                <div className='tableContent'>
                    <h2 className='pedidoAtual'>Pedido atual</h2>
                    {listProdutoEditar?.map((value) => (
                    <ul key={value.idProduto} className=' itemProduto'>
                        <li className=' nomeProduto'>{value.nomeProduto}</li>
                        <li className=''>R${value.preco.toFixed(2)}</li>
                        <li className='botoesProduto'>
                        {isProcessing? <Loading /> :
                        <>
                            <button className='inserirProduto'
                                onClick={() => pedidoInserir(value.idProduto, value.preco, value.quantidade)}>+</button>
                            <span className='mx-2'>{quantidades[value.idProduto] || 0}</span>
                            <button className='excluirProduto'
                                onClick={() => pedidoExcluir(value.idProduto)}>-</button>
                        </>
                        }
                        </li>
                    </ul>
                    ))}
                    {listProdutoEditar?.length == 0? <p className='instrucaoUsuario'>Vazio</p> :''}
                    <h2 className='adicionarPedido'>Adicionar ao pedido</h2>
                    
                    {listProduto?.map((value) => (
                    <ul key={value.idProduto} className=' itemProduto'>
                        <li className=' nomeProduto'>{value.nomeProduto}</li>
                        <li className=''>R${value.preco.toFixed(2)}</li>
                        <li className='botoesProduto'>
                        {isProcessing? <Loading /> :
                        <>
                            <button className='inserirProduto'
                                onClick={() => pedidoInserir(value.idProduto, value.preco, value.quantidade)}>+</button>
                            <span className='mx-2'>{quantidades[value.idProduto] || 0}</span>
                            <button className='excluirProduto'
                                onClick={() => pedidoExcluir(value.idProduto)}>-</button>
                        </>
                        }
                        </li>
                        
                    </ul>
                    ))}
                    {!listProduto? <p className='instrucaoUsuario'>Selecione uma categoria</p> :''}
                </div>
            </div>
    {msgModal?
        <MsgModal
        // isOpen={functionModal}                    
        isClose={() => closeModal('msg')}                
        contentLabel="Modal de Edição de Produto"                            
        text={textModal}                    
        />
        : ''}
{/* </table> */}
        {!removeLoading && <Loading />}
        </div>
    )
}
