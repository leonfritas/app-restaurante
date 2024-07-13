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



export default function Home() {
  const [grupoPedido, setGrupoPedido] = useState([]);
  const [removeLoading, setRemoveLoading] = useState(false);
  const { idGrupoPedido, setIdGrupoPedido, setNomeGrupoPedido } = useContext(LoginContext);
  const [ verPedido, setVerPedido] = useState(false);
  const [listaProduto, setListaProduto] = useState(); 
  const [cardUnirMesa, setCardUnirMesa] = useState(false) 
  const [table, setTable] = useState();

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
    console.log(idMesa)
    console.log(idGrupoPedido)

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
                    <p className="">R$ {value.valorPedido}</p>
                  </div>                                           
                  <div className="cardButton">
                    {value.ativoBaixa === 'PAGO' && (
                      <button className="">
                        Finalizar Pedido
                      </button>
                    )}

                    {value.ativoBaixa === 'PENDENTE' && (
                      <>
                        <button className="buttonCancelar" onClick={() => cancelarPedido(value.idGrupoPedido)}>
                          Cancelar
                        </button>
                        <Link to='/editarpedido'>
                          <button className="buttonEditar" onClick={() => editarPedido(value.idGrupoPedido, value.nomeGrupoPedido)}>
                            Editar
                          </button>
                        </Link>
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
                                <p>{value.nomeCategoria}</p>                                                                               
                                <p>{value.quantidade}</p>                               
                          </div>             
                        ))}               
                      </div>                      
                    </div>}
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
          </div>}  
          
          {!removeLoading && <Loading />}  
        </div>
        
      </main>
    </>
  );
}


