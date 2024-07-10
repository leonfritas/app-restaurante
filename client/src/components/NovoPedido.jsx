import { useState, useEffect, useContext } from 'react';
import { LoginContext } from '../context/LoginContext.jsx';
import Axios from "axios";
import ListaProdutos from './ListaProdutos.jsx';
import { mensagem } from '../geral.jsx';
import { useNavigate } from "react-router-dom";
import Loading from './Loading.jsx';

export default function NovoPedido() {
    const { idGrupoPedido, nomeGrupoPedido, setNomeGrupoPedido } = useContext(LoginContext);
    const navigate = useNavigate();

    // State for managing products and quantities
    const [listProduto, setListProduto] = useState([]);
    const [quantidades, setQuantidades] = useState({});

    // State for managing table selection
    const [table, setTable] = useState([]);
    const [idMesa, setIdMesa] = useState();
    const [mostrarListaMesa, setMostrarListaMesa] = useState(true);

    // State for loading indicator
    const [removeLoading, setRemoveLoading] = useState(false);

    // Fetch products from API on component mount
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

    // Fetch available tables from API on component mount
    useEffect(() => {
        Axios.get("http://localhost:3001/table/getTable")
            .then((response) => {
                setTable(response.data[0]);
            })
            .catch((error) => {
                console.error("Error fetching tables:", error);
            });
    }, []);

    // Add item to order
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

    // Remove item from order
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

    // Select a table
    function selecionarMesa(idMesa) {
        setIdMesa(idMesa);
        setMostrarListaMesa(false);
    }

    // Save order group
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

    // Cancel order group
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

    return (
        <div className='NovoPedidoContainer'>
            {mostrarListaMesa === false &&
                <>
                    <div className='flex justify-between mb-4'>
                    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2' onClick={() => salvarGrupoPedido()}>Salvar Pedido</button>
                    <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded' onClick={() => cancelarGrupoPedido()}>Cancelar Pedido</button>
                    </div>
                    <input className='border border-gray-300 rounded px-3 py-2 mb-4 w-full' placeholder='Digite aqui o nome do pedido' type="text" onChange={(e) => setNomeGrupoPedido(e.target.value)} />
                    <h2 className='text-lg font-bold mb-2'>Selecione os itens do pedido:</h2>
                    <div className=''>
                        <ul className='flex mb-4 border-b border-gray-300'>
                            <li className='w-1/4 py-2'>Item</li>
                            <li className='w-1/4 py-2'>Valor</li>
                            <li className='w-1/4 py-2'>Categoria</li>
                            <li className='w-1/4 py-2'>Preço</li>
                        </ul>
                        <div className=''>
                            {listProduto.map((value) => (
                        <div key={value.idProduto} className='listaProdutos flex items-center justify-between border-b border-gray-300 py-2'>
                                    <ListaProdutos
                                        listCard={listProduto}
                                        setListCard={setListProduto}
                                        id={value.idProduto}
                                        name={value.nomeProduto}
                                        cost={value.preco}
                                        category={value.idCategoria}
                                        quantidade={value.quantidade}
                                    />
                                    <div className='adicionaERemoveProduto flex items-center'>
                                    <button className='buttonApagarDepois bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded' onClick={() => pedidoInserir(value.idProduto, value.preco, value.quantidade)}>+</button>
                                    <p className='mx-2'>{quantidades[value.idProduto] || 0}</p>
                                    <button className='buttonApagarDepois bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded' onClick={() => pedidoExcluir(value.idProduto)}>-</button>
                                    </div>
                                </div>
                            ))}
                            {!removeLoading && <Loading />}
                        </div>
                    </div>
                </>
            }
            {mostrarListaMesa === true &&
                <div id="" className="flex justify-center items-center h-screen">
                    <div className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <h2 className="text-2xl mb-4 text-center">Selecione uma mesa:</h2>
                        {table.map((value) => (
                            <div key={value.idMesa} className="mb-4">
                                <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => selecionarMesa(value.idMesa)}>{value.nomeMesa}</button>
                            </div>
                        ))}
                        {!removeLoading && <Loading />}
                    </div>
                </div>
            }
        </div>
    );
}