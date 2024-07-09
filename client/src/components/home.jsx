import { Link } from "react-router-dom";
import "./css/homeNovoPedido.css";
import Axios from "axios";
import { useState, useEffect } from "react";
import { mensagem, mensagemPergunta } from "../geral.jsx";
import './css/ApagarDepois.css';
import Navbar from "./Navbar.jsx";
import { useContext } from "react";
import { LoginContext } from '../context/LoginContext.jsx';

import Loading from "./Loading.jsx";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faUtensils, faShoppingCart, faCashRegister, faBarcode } from '@fortawesome/free-solid-svg-icons'; // Exemplos de ícones



export default function Home() {
  const [grupoPedido, setGrupoPedido] = useState([]);
  const [removeLoading, setRemoveLoading] = useState(false);
  const { setIdGrupoPedido } = useContext(LoginContext);

  const atualizarLista = async () => {
    try {
      // console.log('Iniciando');
      const response = await Axios.post('http://localhost:3001/orderGroup/orderGroupList', {
        dataEntrada: '2024-01-01'
      });
      // console.log('Reiniciando:', response.data);
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

  // console.log(atualizarLista)

  useEffect(() => {
    atualizarLista();

    const interval = setInterval(() => {
      atualizarLista();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  function editarPedido(idGrupoPedido) {
    setIdGrupoPedido(idGrupoPedido)

  }

  function finalizarPedido(idGrupoPedido, nomeGrupoPedido, ativoPedidoPronto) {
    let pedidoPronto = ativoPedidoPronto.data[0]
    if (idGrupoPedido > 0) {
      if(pedidoPronto){  
        Axios.post("http://localhost:3001/orderGroup/orderGroupFinalize", {
          idGrupoPedido: idGrupoPedido
        });
        mensagem('Pedido ' + nomeGrupoPedido + ' finalizado.');
        atualizarLista();
      }else{
        mensagem('Verifique status do pedido.')
      }
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
      <main className="flex justify-center">
  <div className="max-w-md w-full bg-white shadow-md rounded-lg overflow-hidden mx-4 my-8">
    {grupoPedido && grupoPedido.map((value, index) => (
      <div key={value.idGrupoPedido} className={`border-b border-gray-200 ${index !== 0 ? 'mb-8' : ''}`}>
        <div className="p-4">
          <div className="mb-4">
            <p className="text-gray-600 font-bold text-xl"><FontAwesomeIcon icon={faBarcode} /> Código: {value.idGrupoPedido}</p>
            <p className="text-gray-600 font-semibold text-xl">Nome: {value.nomeGrupoPedido}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600 font-bold text-xl">Lugar: {value.nomeMesa}</p>
            <p className="text-gray-600 font-semibold text-xl">
              <FontAwesomeIcon icon={faCashRegister} className="mr-2" />
              Status do Pagamento: {value.ativoBaixa}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600 font-semibold text-xl">Valor: R${value.valorPedido}</p>
            <p className="text-gray-600 font-semibold text-xl">Status: {value.statusPedido}</p>
          </div>
        </div>
        <div className="flex justify-between items-center p-4">
          {value.ativoBaixa === 'PAGO' && (
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Finalizar Pedido
            </button>
          )}

          {value.ativoBaixa === 'PENDENTE' && (
            <>
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => cancelarPedido(value.idGrupoPedido)}>
                Cancelar Pedido
              </button>
              <Link to='/editarpedido'>
                <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded" onClick={() => editarPedido(value.idGrupoPedido)}>
                  Editar Pedido
                </button>
              </Link>
            </>
          )}
          </div>
        </div>
    ))}
    {!removeLoading && <Loading />}  
  </div>
</main>

    </>
  );
}
