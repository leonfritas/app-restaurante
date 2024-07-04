
import { Link } from "react-router-dom"
import "./css/homeNovoPedido.css"
import Axios from "axios";
import {  useState, useEffect } from "react";
import { mensagem, mensagemPergunta } from "../geral";
import './css/ApagarDepois.css'
import Navbar from "./navbar.jsx";



export default function Home() {
  const [grupoPedido, setGrupoPedido] = useState();
  

  function atualizarLista(){
    Axios.post("http://localhost:3001/orderGroup/orderGroupList",
      {
        dataEntrada: '2024-01-01'
      }
    ).then((response) => {
      setGrupoPedido(response.data[0])        
    })    
  }

  useEffect(() => {
    atualizarLista()
  }, [])


  atualizarLista()



  function editarPedido() {    
    // Axios.get("http://localhost:3001/orderGroup/").then((response) => {
    //   setIdGrupoPedido(response.data[0][0].idGrupoPedido);      
    console.log('1')
    // })
  }
   

  function finalizarPedido(idGrupoPedido, nomeGrupoPedido) {
    if (idGrupoPedido > 0) {
      Axios.post("http://localhost:3001/orderGroup/orderGroupFinalize", {
        idGrupoPedido: idGrupoPedido
      })
      mensagem('Pedido ' + nomeGrupoPedido + ' finalizado.');
      atualizarLista()
    } else {
      mensagem('Pedido não encontrado')
    }
  }

  function cancelarPedido(idGrupoPedido) {    
    if (idGrupoPedido > 0) {                  
      if (mensagemPergunta('Deseja cancelar pedido ' + idGrupoPedido)){        
        Axios.post("http://localhost:3001/orderGroup/orderGroupCancel", {
          idGrupoPedido: idGrupoPedido
        })         
        atualizarLista()
      }
    } else {
      mensagem('Pedido não encontrado')
    }
  }

  function realizarBaixa(idGrupoPedido, nomeGrupoPedido){
    if (idGrupoPedido > 0) {            
      if (mensagemPergunta('Deseja realizar a baixa do pedido ' + nomeGrupoPedido)){        
        Axios.post("http://localhost:3001/financier/realizarBaixa", {
          idGrupoPedido: idGrupoPedido
        })                 
        atualizarLista()
      }
    } else {
      mensagem('Pedido não encontrado')
    }
  }



  return (
    <>
      <Navbar/>
      <main className="listaGrupoPedido">
        <div className="listaPedido">
        {typeof grupoPedido !== "undefined" &&
          grupoPedido.map((value) => {
            return (
              <>              
                <div  className='listaPedidos'>                      
                    <ul className="cardPedido">
                      <li>Código: {value.idGrupoPedido}</li>
                      <li>Nome: {value.nomeGrupoPedido}</li>                      
                      <li>Lugar: {value.nomeMesa}</li>
                      <li>Pagamento: {value.ativoBaixa}</li>
                      <li>Valor: {value.valorPedido}</li>
                    </ul> 
                    <div className="homeBotoesPedido">   
                      {/* Se o pedido estiver pago irá mostar o botão para finalizar o pedido e ao clicar ele sumirá da tela, 
                      se o pedido não estiver pago irá mostar apenas o botão para pagar o pedido e depois de pago 
                      aparecerá o botão de finalizar no lugar */}                           
                      {value.ativoBaixa == 'PAGO' ? <button className="buttonFinalizarPedido" onClick={() => finalizarPedido(value.idGrupoPedido, value.nomeGrupoPedido)}>Finalizar Pedido</button> : 
                      <button className="buttonRealizarBaixa" onClick={() => realizarBaixa(value.idGrupoPedido, value.nomeGrupoPedido)}>Pagar</button>}
                      {/* Só será possível cancelar ou editar o pedido enquanto ele não estiver pago, após ser pago os botões irão sumir*/}
                      {value.ativoBaixa == 'PENDENTE' ? <button className="buttonCancelarPedido" onClick={() => cancelarPedido(value.idGrupoPedido)}>Cancelar Pedido</button> : ''} 
                      {value.ativoBaixa == 'PENDENTE' ? <Link to='/editarpedido'><button className="buttonEditarPedido" onClick={() => editarPedido(value.idGrupoPedido, value.nomeGrupoPedido)}>Editar Pedido</button></Link> : ''}                   
                    </div>                                   
                </div>
              </>
            )
          })}
        </div>
      </main>
    </>
  );

}