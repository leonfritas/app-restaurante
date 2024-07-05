import { Link } from "react-router-dom";
import "./css/homeNovoPedido.css";
import Axios from "axios";
import { useState, useEffect } from "react";
import { mensagem, mensagemPergunta } from "../geral";
import './css/ApagarDepois.css';
import Navbar from "./navbar.jsx";

import Loading from "./loading.jsx";

export default function Home() {
  const [grupoPedido, setGrupoPedido] = useState([]);
  const [removeLoading, setRemoveLoading] = useState(false)

  const atualizarLista = async () => {
    try {
      console.log('Iniciando');
      const response = await Axios.post('http://localhost:3001/orderGroup/orderGroupList', {
        dataEntrada: '2024-01-01'
      });
      console.log('Reiniciando:', response.data);
      setGrupoPedido(response.data[0]);
      setRemoveLoading(true);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      if (error.response) {
        console.error('Erro na resposta:', error.response);
      } else {
        console.error('Erro desconhecido:', error.message);
      }
    }
  };

  console.log(atualizarLista)

  useEffect(() => {
    atualizarLista();

    const interval = setInterval(() => {
      atualizarLista();
    }, 50000);

    return () => clearInterval(interval);
  }, []);

  function editarPedido() {
    console.log('1');
  }

  function finalizarPedido(idGrupoPedido, nomeGrupoPedido) {
    if (idGrupoPedido > 0) {
      Axios.post("http://localhost:3001/orderGroup/orderGroupFinalize", {
        idGrupoPedido: idGrupoPedido
      });
      mensagem('Pedido ' + nomeGrupoPedido + ' finalizado.');
      atualizarLista();
    } else {
      mensagem('Pedido não encontrado');
    }
  }

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
  

  function realizarBaixa(idGrupoPedido, nomeGrupoPedido) {
    if (idGrupoPedido > 0) {
      if (mensagemPergunta('Deseja realizar a baixa do pedido ' + nomeGrupoPedido)) {
        Axios.post("http://localhost:3001/financier/realizarBaixa", {
          idGrupoPedido: idGrupoPedido
        });
        atualizarLista();
      }
    } else {
      mensagem('Pedido não encontrado');
    }
  }

  return (
    <>
      <Navbar />
      <main className="listaGrupoPedido">
        <div className="listaPedido">
          {grupoPedido && grupoPedido.map((value) => (
            <div key={value.idGrupoPedido} className='listaPedidos'>
              <ul className="cardPedido">
                <li>Código: {value.idFinanceiroPedido}</li>
                <li>Nome: {value.nomeGrupoPedido}</li>
                <li>Lugar: {value.nomeMesa}</li>
                <li>Pagamento: {value.ativoBaixa}</li>
                <li>Valor: {value.valorPedido}</li>
                <li>Status: {value.ativoPedidoPronto}</li>
              </ul>
              <div className="homeBotoesPedido">
                {value.ativoBaixa === 'PAGO' ? (
                  <button className="buttonFinalizarPedido" onClick={() => finalizarPedido(value.idGrupoPedido, value.nomeGrupoPedido)}>Finalizar Pedido</button>
                ) : (
                  <button className="buttonRealizarBaixa" onClick={() => realizarBaixa(value.idGrupoPedido, value.nomeGrupoPedido)}>Pagar</button>
                )}
                
                {value.ativoBaixa === 'PENDENTE' && (
                  <>
                    <button className="buttonCancelarPedido" onClick={() => cancelarPedido(value.idGrupoPedido)}>Cancelar Pedido</button>
                    <Link to='/editarpedido'>
                      <button className="buttonEditarPedido" onClick={() => editarPedido(value.idGrupoPedido, value.nomeGrupoPedido)}>Editar Pedido</button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          ))}
          {!removeLoading && <Loading/>}  
        </div>
      </main>
    </>
  );
}
