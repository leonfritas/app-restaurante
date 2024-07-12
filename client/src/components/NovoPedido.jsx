import { useState, useEffect, useContext,useRef } from 'react';
import { LoginContext } from '../context/LoginContext.jsx';
import Axios from "axios";
// import ListaProdutos from './ListaProdutos.jsx';
import { mensagem } from '../geral.jsx';
import { useNavigate } from "react-router-dom";
import Loading from './Loading.jsx';
import './css/novoPedido.css'
import seta from '../assets/setaCarousel.png'

export default function NovoPedido() {
    const { idGrupoPedido, nomeGrupoPedido, setNomeGrupoPedido } = useContext(LoginContext);
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
                setListCategory(response.data);
                setRemoveLoading(true);                
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
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
        })
        setPrecoTotal(total);
    }, [listProduto, quantidades]);
    
    function pedidoInserir(idProduto, preco, quantidade) {
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
            mensagem('Informe o código do pedido.');
        }
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
            mensagem('Informe o código do pedido.');
        }
    }

    function selecionarMesa(idMesa, nomeMesa) {
        setIdMesa(idMesa);
        setMostrarListaMesa(false);
        setNomeGrupoPedido('Pedido: ' + nomeMesa)
    }
    
    function salvarGrupoPedido() {
        if (nomeGrupoPedido === '') {
            return mensagem('Digite o nome do pedido.');
        }

        if (idGrupoPedido > 0) {
            if (idMesa === undefined) setIdMesa(0);
            if (idMesa !== undefined) {
                setMostrarListaMesa(false);
                Axios.post("http://localhost:3001/orderGroup/orderGroupSave", {
                    idGrupoPedido: idGrupoPedido,
                    nomeGrupoPedido: nomeGrupoPedido,
                    idMesa: idMesa,                
                    textoObservacao: 'teste'
                    
                })
                .then(() => {
                    mensagem('Pedido salvo com sucesso.');
                    navigate('/home');
                })
                .catch((error) => {
                    console.error("Error saving order group:", error);
                });
            }
        } else {
            mensagem('Informe o código do pedido.');
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

    function filterByCategory(idCategory){        
        if(idGrupoPedido > 0){            
            Axios.post("http://localhost:3001/category/filterByCategory", {
                idCategory: idCategory                
            }).then((response) => {                
                setListProduto(response.data[0]);
            })
        }else{
            mensagem('Número de pedido não encontrado');
        }
    }
        

    return (
        
        <div className='NovoPedidoContainer'>
            
            
            {mostrarListaMesa === false &&
                <>
                    <div className='flex mb-4'>
                    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 mt-5' onClick={() => salvarGrupoPedido()}>Salvar Pedido</button>
                    <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded  mt-5' onClick={() => cancelarGrupoPedido()}>Cancelar Pedido</button>
                    </div>
                    <input className='border border-blue-700 rounded px-4 py-2 mb-4 w-80 focus:outline-none' placeholder='Digite aqui o nome do pedido' type="text" onChange={(e) => setNomeGrupoPedido(e.target.value)} />
                    <div className="flex justify-end items-center mt-4">                        
                        <span className="text-xl font-bold">R$ {precoTotal.toFixed(2)}</span>
                    </div>
                    <h2 className='text-lg font-bold mb-2'>Selecione os itens do pedido:</h2>
                    <div className='carousel' ref={carousel}> 
                        {listCategory.map((value) => (
                                <div key={value.idCategoria} className='divCarouselButton'>
                                    <button className='carouselButton' onClick={() => filterByCategory(value.idCategoria)} role="button">{value.nomeCategoria}</button>                                                                
                                </div>
                        ))}
                    </div>
                    <button className='buttonPrev' onClick={handleLeftClick} ><img src={seta} alt="Scroll Left" /></button>
                    <button className='buttonNext' onClick={handleRightClick}><img src={seta} alt="Scroll Right" /></button>
                    <table className='table-auto border-collapse w-full'>
                        <thead>
                            <tr className='bg-gray-200'>
                                <th className='w-1/4 py-2 px-4 text-left'>Produto</th>
                                <th className='w-1/4 py-2 px-4 text-left'>Preço</th>
                                <th className='w-1/4 py-2 px-4 text-left'>Quantidade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listProduto.map((value) => (
                            <tr key={value.idProduto} className='border-b border-gray-200'>
                                <td className='py-2 px-4'>{value.nomeProduto}</td>
                                <td className='py-2 px-4'>R${value.preco.toFixed(2)}</td>
                                <td className='py-2 px-4'>
                                    <button className='bg-green-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded'
                                        onClick={() => pedidoInserir(value.idProduto, value.preco, value.quantidade)}>+</button>
                                    <span className='mx-2'>{quantidades[value.idProduto] || 0}</span>
                                    <button className='bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded'
                                        onClick={() => pedidoExcluir(value.idProduto)}>-</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
                        {!removeLoading && <Loading />}
                    </div>
                </div>
            }
        </div>
    );
}