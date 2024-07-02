
import { Link } from "react-router-dom"
import "./css/homeNovoPedido.css"
import Axios from "axios";
import { useContext, useState, useEffect } from "react";
import { LoginContext } from '../context/LoginContext'
import { mensagem, mensagemPergunta } from "../geral";
import './css/ApagarDepois.css'



export default function Home() {
  const { setIdGrupoPedido, ativoAdm } = useContext(LoginContext)
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

  function CriarNovoPedido(){
        
    Axios.get("http://localhost:3001/orderGroup/orderGroupInsert").then((response) => {          
      setIdGrupoPedido(response.data[0][0].idGrupoPedido);
      console.log(response.data[0][0].idGrupoPedido)
    })          
}

  function editarPedido() {    
    // Axios.get("http://localhost:3001/orderGroup/").then((response) => {
    //   setIdGrupoPedido(response.data[0][0].idGrupoPedido);      
    console.log('1')
    // })
  }

    // function editarPedido(idGrupoPedido, nomeGrupoPedido){
  //   if (idGrupoPedido > 0) {                        
  //       Axios.post("http://localhost:3001/realizarbaixa", {
  //         idGrupoPedido: idGrupoPedido
  //       })         
  //       atualizarLista()      
  //   } else {
  //     mensagem('Pedido não encontrado')
  //   }
  // }

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
        Axios.post("http://localhost:3001/realizarBaixa/realizarBaixa", {
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
      <nav className="flex items-center justify-between bg-gray-800 p-6">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <span className="font-semibold text-xl tracking-tight">app-restaurante</span>
        </div>
        <div className="flex">
          <Link to='/novopedido'>
            <button onClick={() => CriarNovoPedido()} className="mr-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Novo Pedido
            </button>
          </Link>
          <Link to='/lista'>
            {ativoAdm ? <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Lista de usuários
            </button> : ''}
          </Link>
        </div>
      </nav>
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