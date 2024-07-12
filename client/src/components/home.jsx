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
  const { setIdGrupoPedido, setNomeGrupoPedido } = useContext(LoginContext);
  const [ verPedido, setVerPedido] = useState(false);
  const [listaProduto, setListaProduto] = useState();  

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

  return (
    <>
      <Navbar />
      {/* <div>
        <h2>Carrossel</h2>
      </div> */}
      <main className="flex justify-center">
        <div className="">
          {grupoPedido && grupoPedido.map((value, index) => (            
            <div key={value.idGrupoPedido} className={`cardContainer  ${index !== 0 ? 'mb-8' : ''}`}>
              {/* <div className=""> */}
                <div className="cardPrincipal">
                  <div className="cardPrincipalNome">
                    <p>Pedido: {value.idGrupoPedido}</p>
                    <p className="cardNomeGrupoPedido">Nome: {value.nomeGrupoPedido}</p>
                  </div>                  
                  <p className="">{value.statusPedido}</p>
                  <FontAwesomeIcon className="iconMenu" icon={faEllipsisVertical}  />                                
                </div>
                <div className="cardInfo">
                  <p className="">{value.nomeMesa}</p>
                  <p className="">{value.ativoBaixa}</p>
                  <p className="">R${value.valorPedido}</p>
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
                    {/* {verPedido == true? */}
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
              </div>
          ))}
          {!removeLoading && <Loading />}  
        </div>
      </main>
    </>
  );
}


