import { useState, useEffect, useContext, useRef } from 'react';
import { LoginContext } from '../context/LoginContext.jsx';
import Axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Loading from './Loading.jsx';
import './css/novoPedido.css';
import seta from '../assets/setaCarousel.png';
import { MsgModal } from '../geral.jsx'

export default function NovoPedido() {
    const { idGrupoPedido, nomeGrupoPedido, setNomeGrupoPedido, msgModal, setMsgModal } = useContext(LoginContext);
    const navigate = useNavigate();
    const [listProduto, setListProduto] = useState([]);
    const [quantidades, setQuantidades] = useState({});
    const [precoTotal, setPrecoTotal] = useState(0);
    const [listCategory, setListCategory] = useState();    
    const [table, setTable] = useState([]);
    const [idMesa, setIdMesa] = useState();
    const [mostrarListaMesa, setMostrarListaMesa] = useState(true);
    const [removeLoading, setRemoveLoading] = useState(false);
    const carousel = useRef(null);    
    const [isProcessing, setIsProcessing] = useState(false);
    const [textModal, setTextModal ] = useState(); 
    const [link, setLink] = useState();
    const [imgPrincipal, setImgPrincipal] = useState();    


    useEffect(() => {
        Axios.get("http://localhost:3001/products/listProduct")
            .then((response) => {
                setListProduto(response.data);
                setRemoveLoading(true);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    }, []);    

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
        Axios.get("http://localhost:3001/table/getTable")
            .then((response) => {
                setTable(response.data[0]);
            })
            .catch((error) => {
                console.error("Error fetching tables:", error);
            });
    }, []);

    useEffect(() => {
        let total = 0;
        listProduto.forEach((produto) => {
            const quantidade = quantidades[produto.idProduto] || 0;
            total += produto.preco * quantidade;
            console.log(quantidade)
            console.log(produto.preco)
        })
        
        setPrecoTotal(total);
    }, [listProduto, quantidades]);
    
    function pedidoInserir(idProduto, preco, quantidade) {
        setIsProcessing(true);
        if (idGrupoPedido > 0) {
            Axios.post("http://localhost:3001/requested/requestInsert", {
                idGrupoPedido: idGrupoPedido,
                idProduto: idProduto,
                quantidade: quantidade,
                preco: preco,
            })
            .then(() => {
                setQuantidades((prev) => ({
                    ...prev,
                    [idProduto]: (prev[idProduto] || 0) + 1
                    
                }));
            })
            .catch((error) => {
                console.error("Error adding item to order:", error);
            });
        } else {
            openModal('Informe o código do pedido.');
        }
        setIsProcessing(false);        
    }

    
    function pedidoExcluir(idProduto) {
        if (idGrupoPedido > 0) {
            Axios.post("http://localhost:3001/requested/requestDelete", {
                idGrupoPedido: idGrupoPedido,
                idProduto: idProduto
            })
            .then(() => {
                setQuantidades((prev) => ({
                    ...prev,
                    [idProduto]: (prev[idProduto] || 1) - 1
                }));
            })
            .catch((error) => {
                console.error("Error removing item from order:", error);
            });
        } else {
            openModal('Informe o código do pedido.');
        }
    }

    function selecionarMesa(idMesa, nomeMesa) {
        setIdMesa(idMesa);
        setMostrarListaMesa(false);
        setNomeGrupoPedido('Pedido: ' + nomeMesa)
    }
    
    function salvarGrupoPedido() {
        if (nomeGrupoPedido === '') {
            return openModal('Digite o nome do pedido.');
        }

        if (idGrupoPedido > 0) {
            if (idMesa === undefined) setIdMesa(0);
            if (idMesa !== undefined) {
                setMostrarListaMesa(false);
                Axios.post("http://localhost:3001/orderGroup/orderGroupSave", {
                    idGrupoPedido: idGrupoPedido,
                    nomeGrupoPedido: nomeGrupoPedido,
                    idMesa: idMesa,                
                    textoObservacao: null
                    
                })
                .then(() => {    
                    openModal('msg', 'Pedido salvo com sucesso.', '/home');                                     
                    // navigate('/home');
                                       
                })
                .catch((error) => {
                    console.error("Error saving order group:", error);
                });
            }
        } else {
            openModal('Informe o código do pedido.');
        }        
    }

    
    function cancelarGrupoPedido() {
        if (idGrupoPedido > 0) {
            Axios.post("http://localhost:3001/orderGroup/orderGroupCancel", {
                idGrupoPedido: idGrupoPedido
            })
            .then(() => {
                navigate('/home');
            })
            .catch((error) => {
                console.error("Error canceling order group:", error);
            });
        } else {
            navigate('/home');
        }
    }

    const handleLeftClick = (e) => {
        e.preventDefault();
        carousel.current.scrollLeft -= carousel.current.offsetWidth;
    }
  
    const handleRightClick = (e) => {
        e.preventDefault();
        carousel.current.scrollLeft += carousel.current.offsetWidth;
    }

    function filterByCategory(idCategory, imgCategoria){              
        if(idGrupoPedido > 0){            
            Axios.post("http://localhost:3001/category/filterByCategory", {
                idCategory: idCategory                
            }).then((response) => {                
                setListProduto(response.data[0]);
                setImgPrincipal(imgCategoria)                
            })
        }else{            
            openModal('msg', 'Número de pedido não encontrado',);
        }
    }

    function closeModal(action){        
        if (action === 'msg') {            
          setMsgModal(false);
        }
    }

    function openModal(action, msg, link){

        if (action === 'msg') {  
            setLink(link)
            setTextModal(msg)            
            setMsgModal(true)                        
        }        
    }

  console.log(listCategory)
    return (
        
        <div className='NovoPedidoContainer'>
                        
            {mostrarListaMesa === false &&
                <>
                    <div className='flex mb-4'>
                    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 mt-5' onClick={() => salvarGrupoPedido()}>Salvar Pedido</button>
                    <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded  mt-5' onClick={() => cancelarGrupoPedido()}>Cancelar Pedido</button>
                    </div>
                    <input className='border rounded px-4 py-2 mb-4 w-80 focus:outline-none' placeholder='Digite aqui o nome do pedido' type="text" onChange={(e) => setNomeGrupoPedido(e.target.value)} />
                    <div className='carousel' ref={carousel}> 
                        
                        {listCategory?.map((value) => (
                                <div key={value.idCategoria} className='divCarouselButton'>
                                    <button className='carouselButton' onClick={() => filterByCategory(value.idCategoria, value.imagemCategoria)} role="button">
                                        {/* <img src={value.imagemCategoria} alt="" />                                           */}
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
                        <h2 className='selecionarTexto'>Selecione os itens do pedido:</h2>
                        <img className='imgSuco' src={imgPrincipal} alt="" />
                        <div className="selecionarValorTotal">                        
                            <span className="text-xl font-bold">R$ {precoTotal.toFixed(2)}</span>
                        </div>                        
                    </div>
                    
                    
                    <button className='buttonPrev' onClick={handleLeftClick} ><img src={seta} alt="Scroll Left" /></button>
                    <button className='buttonNext' onClick={handleRightClick}><img src={seta} alt="Scroll Right" /></button>
                    <div className='tableProdutos'>                        
                        <div className='tableTitle'>
                            <th className='nomeProduto'>Produto</th>
                            <th className='precoProduto'>Preço</th>
                            <th className=''>Quantidade</th>
                        </div>                        
                        <div className='tableContent'>
                            {listProduto.map((value) => (
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
                        </div>
                    </div>
                        {!removeLoading && <Loading />}
                </>
            }
            {mostrarListaMesa === true &&
                <div id="" className="flex justify-center items-center h-screen">
                    <div className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <h2 className="text-2xl mb-4 text-center">Selecione uma mesa:</h2>
                        {table.map((value) => (
                            <div key={value.idMesa} className="mb-4">
                                <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => selecionarMesa(value.idMesa, value.nomeMesa)}>{value.nomeMesa}</button>
                            </div>
                        ))}                        
                        <Link to='/home'>
                            <button className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Voltar</button>
                        </Link>
                        
                        {!removeLoading && <Loading />}
                    </div>
                </div>
            }
            {msgModal?
                <MsgModal
                // isOpen={functionModal}                    
                isClose={() => closeModal('msg')}                
                contentLabel="Modal de Edição de Produto"                            
                text={textModal}    
                link={link}                
                />
            : ''}
        </div>
        
    );
}