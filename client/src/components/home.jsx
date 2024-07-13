import { Link } from "react-router-dom";
import "./css/novoPedido.css";
import Axios from "axios";
import { useState, useEffect } from "react";
import { mensagem, mensagemPergunta } from "../geral.jsx";
import './css/ApagarDepois.css';
import Navbar from "./Navbar.jsx";
import { useContext } from "react";
import { LoginContext } from '../context/LoginContext.jsx';
import './css/home.css'
import Loading from "./Loading.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'; // Exemplos de ícones
import Menu from "./Menu.jsx";
import Modal from 'react-modal'



export default function Home() {
  const [grupoPedido, setGrupoPedido] = useState([]);
  const [removeLoading, setRemoveLoading] = useState(false);
  const { idGrupoPedido, setIdGrupoPedido, setNomeGrupoPedido } = useContext(LoginContext);
  const [ verPedido, setVerPedido] = useState(false);
  const [listaProduto, setListaProduto] = useState(); 
  const [cardUnirMesa, setCardUnirMesa] = useState(false) 
  const [table, setTable] = useState();
  const [modalEdit, setModalEdit] = useState(false)
  const [modalCancel, setModalCancel] = useState(false)


  function openModalEdit() {
    setModalEdit(true)
  }

  function closeModalEdit() {
    setModalEdit(false)
  }

  function openModalCancel() {
    setModalCancel(true)
  }

  function closeModalCancel() {
    setModalCancel(false)
  }

  const atualizarLista = async () => {
    try {      
      const response = await Axios.post('http://localhost:3001/orderGroup/orderGroupList', {
        dataEntrada: '2024-01-01'
      });  
      setGrupoPedido(response.data[0]);
      setRemoveLoading(true);
    } catch (error) {
      // console.error('Erro ao buscar dados:', error);
      if (error.response) {
        console.error('Erro na resposta:', error.response);
      } else {
        console.error('Erro desconhecido:', error.message);
      }
    }
  };

  useEffect(() => {
    atualizarLista();

    const interval = setInterval(() => {
      atualizarLista();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  function editarPedido(idGrupoPedido, nomeGrupoPedido) {
    setIdGrupoPedido(idGrupoPedido)    
    setNomeGrupoPedido(nomeGrupoPedido)
  }

  // function finalizarPedido(idGrupoPedido, nomeGrupoPedido, ativoPedidoPronto) {
  //   let pedidoPronto = ativoPedidoPronto.data[0]
  //   if (idGrupoPedido > 0) {
  //     if(pedidoPronto){  
  //       Axios.post("http://localhost:3001/orderGroup/orderGroupFinalize", {
  //         idGrupoPedido: idGrupoPedido
  //       });
  //       mensagem('Pedido ' + nomeGrupoPedido + ' finalizado.');
  //       atualizarLista();
  //     }else{
  //       mensagem('Verifique status do pedido.')
  //     }
  //   } else {
  //     mensagem('Pedido não encontrado');
  //   }
  // }

  function cancelarPedido(idGrupoPedido) {
    if (idGrupoPedido > 0) {
      if (mensagemPergunta('Deseja cancelar pedido ' + idGrupoPedido)) {
        Axios.post("http://localhost:3001/orderGroup/orderGroupCancel", {
          idGrupoPedido: idGrupoPedido
        });
        atualizarLista();
      }
    } else {
      mensagem('Pedido não encontrado');
    }
  }

  async function listarProdutos(idGrupoPedido){
    if (idGrupoPedido > 0) { 
      setRemoveLoading(false);   
        await Axios.post("http://localhost:3001/orderGroup/orderGroupListProduct", {
          idGrupoPedido: idGrupoPedido
        }).then((response) => {
          setListaProduto(response.data[0])                          
        })      
        atualizarLista();
        
      }
  }

  useEffect(() => {
    listarProdutos();
  }, [])
  

  function mostrarPedido(index, idGrupoPedido){
    const divCardVerPedido    = document.getElementsByClassName('divCardVerPedido');
    const divCardListProduct  =  document.getElementsByClassName('divCardListProduct');
    const buttonVerPedido     = document.getElementsByClassName('buttonVerPedido');

    for(let i = 0; i < divCardVerPedido.length; i = i + 1 ) {
      divCardVerPedido[i].classList.remove('mostrarPedido');
      divCardListProduct[i].classList.remove('divCardListProductMostrar');            
      buttonVerPedido[i].innerHTML = 'Ver Pedido';        
      setListaProduto('');
    }
    if (verPedido == false && buttonVerPedido[index].innerHTML == 'Ver Pedido'){      
      divCardVerPedido[index].classList.add('mostrarPedido');
      divCardListProduct[index].classList.add('divCardListProductMostrar');          
      listarProdutos(idGrupoPedido); 
      buttonVerPedido[index].innerHTML = 'Fechar Pedido';  
      setVerPedido(true)         
    }else{      
      buttonVerPedido[index].innerHTML = 'Ver Pedido';
      setVerPedido(false)
    }  
    setRemoveLoading(true);        
  }

  function abrirMenu(idGrupoPedido){
    setIdGrupoPedido(idGrupoPedido)
    setCardUnirMesa(true)
  }


  function getTable(){
    // 
    Axios.get("http://localhost:3001/table/getTable")
    .then((response) => {
        setTable(response.data[0]);
    })
    .catch((error) => {
        console.error("Error fetching tables:", error);
    });
  }

  useEffect(() => {
    getTable()
  }, []);

  function unirMesa(idMesa){

    if (idGrupoPedido > 0) {
      
        Axios.post("http://localhost:3001/table/joinTable", {
          idGrupoPedido: idGrupoPedido,
          idMesa: idMesa
        });
        atualizarLista();
        setCardUnirMesa(false)
      
    } else {
      mensagem('Pedido não encontrado');
    }
    getTable()
  }

  return (
    <>
      <Navbar />
      <Menu />    
      <main className="flex justify-center">        
        <div className="">
          { cardUnirMesa == false ?
          <div>
            {grupoPedido && grupoPedido.map((value, index) => (                         
              <div key={value.idGrupoPedido} className={`cardContainer   ${index !== 0 ? 'mb-8' : ''}`}>                              
                <>
                  <div className="cardPrincipal">
                    <div className="cardPrincipalTop">    
                      <p className="statusPedido">{value.idGrupoPedido} - {value.statusPedido}</p>                                                    
                      <button onClick={() => abrirMenu(value.idGrupoPedido)}>
                        <FontAwesomeIcon className="iconMenu" icon={faEllipsisVertical}  />
                      </button>
                    </div>                    
                    <p className="cardNomeGrupoPedido">{value.nomeGrupoPedido}</p>                               
                  </div>
                  <div className="cardInfo">                  
                    <p className=""> {value.horaPedido}</p>                    
                    {value.mesaAdicional !== value.nomeMesa ? 
                      <div className="mesaAdicional">
                        <p>{value.nomeMesa}</p>                        
                        <p>{value.mesaAdicional}</p>
                      </div>                  
                      : 
                      <p className="">{value.nomeMesa}</p>
                    }
                    <p className="">R$ {value.valorPedido.toFixed(2)}</p>
                  </div>                                           
                  <div className="cardButton">
                    {value.ativoBaixa === 'PAGO' && (
                      <button className="">
                        Finalizar Pedido
                      </button>
                    )}

                    {value.ativoBaixa === 'PENDENTE' && (
                      <>
                        <button className="buttonCancelar" onClick={openModalCancel}>
                          Cancelar
                        </button>
                        
                          <button className="buttonEditar" onClick={openModalEdit} >
                            Editar
                          </button>
                        
                      </>
                    )}
                  </div>              
                  {!removeLoading ? 
                    <Loading />                 
                    : 
                    <div onClick={() => mostrarPedido(index, value.idGrupoPedido)} className='divCardVerPedido' >
                      <button className='buttonVerPedido' >Ver Pedido</button>                     
                      <div className= {`divCardListProduct`}  >
                        {listaProduto && listaProduto.map((value, index) => (                        
                          <div key={value.idProduto} className={`${index !== 0 ? 'cardListProduct' : 'cardListProduct'}`}>                                              
                                <p>{value.nomeProduto}</p>                                                                                                                                                                                               
                                <p>{value.quantidade}</p> 
                                <p>R$ {value.preco.toFixed(2)}</p>                               
                          </div>             
                        ))}               
                      </div>                      
                    </div>}
                    <Modal
                      isOpen={modalEdit}
                      onRequestClose={closeModalEdit}
                      contentLabel="Modal de Edição de Produto"
                      className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex"
                    >
                      <div className="relative p-5 bg-white w-50  m-auto flex-col flex rounded-lg shadow-lg">
                        <h1 className="text-xl font-bold mb-4">Deseja Editar o Pedido?</h1>
                        <div className="flex justify-center">
                          <Link to="/editarpedido" className="mx-4">
                            <button 
                            className="bg-green-500 hover:bg-green-700 text-white font-bold mx-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                            onClick={() => editarPedido(value.idGrupoPedido, value.nomeGrupoPedido)}
                            >
                              Sim
                            </button>
                          </Link>
                          <button
                            onClick={closeModalEdit}
                            className="bg-red-500 hover:bg-red-800 text-white font-bold mx-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </Modal>

                    <Modal
                      isOpen={modalCancel}
                      onRequestClose={closeModalCancel}
                      contentLabel="Modal de Cancelar o PEDIDO!"
                      className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex" 
                      >
                        <div className="relative p-5 bg-white w-50  m-auto flex-col flex rounded-lg shadow-lg">
                        <h1 className="text-xl font-bold mb-4">Deseja Cancelar o Pedido?</h1>

                        <div  className="flex justify-center">
                          <button
                            className="bg-green-500 hover:bg-blue-700 text-white font-bold mx-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                            onClick={() => {
                              cancelarPedido(value.idGrupoPedido)
                              closeModalCancel()
                            }}
                              >
                            Sim
                          </button>
                          <button
                            onClick={() => {
                              closeModalCancel()
                            }}
                            className="bg-red-500 hover:bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-2 w-full"
                          >
                            Cancelar
                          </button>
                        </div>
                          
                        </div>
                      
                    </Modal>

 
                </>     
                            
              </div>
                
            ))}
          </div>  
          : 
          <div className="divContainerMesa">                            
            {table.map((value) => (
                <div key={value.idMesa} >
                    <button onClick={() => unirMesa(value.idMesa)} className="butonMesa" >{value.nomeMesa}</button>
                </div>                
            ))}               
            <button  onClick={() => setCardUnirMesa(false)}className="butonMesa bg-red-500 hover:bg-red-700 text-white font-bold " >Voltar</button>                           
          </div>}                                   
          {!removeLoading && <Loading />}  
        </div>        
      </main>
    </>
  );
}


