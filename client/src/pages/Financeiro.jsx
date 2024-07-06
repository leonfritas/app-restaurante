import { useState, useEffect } from "react";
import Axios from "axios";
import Navbar from "../components/navbar.jsx";
import Loading from "../components/loading.jsx";

import financeiroPDF from "../components/pdf.jsx";

export default function Home() {


  const [financeiro, setFinanceiro] = useState([]);

  useEffect(() => {
    listaFinanceiro();
  }, []);

  const listaFinanceiro = async () => {
    try {
      const response = await Axios.post('http://localhost:3001/financier/movimentoRealizado', {
        dataEntrada: '2024-01-01'
        
      });
      console.log('Dados recebidos da API:', response.data[0]);
      const financeiroFormatado = response.data[0].map(item => ({
        ...item,
        dataPagamento: formatarData(item.dataPagamento)
      }));
      setFinanceiro(financeiroFormatado);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  const formatarData = (data) => {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4 ">Lista de Movimentos Financeiros</h1>
        <button 
          type="button"
          onClick={(e) =>financeiroPDF(financeiro)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded ml-3 mb-5">
          Salvar em PDF
        </button>
  
        {financeiro.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow overflow-hidden">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">N°Pedido</th>
                  <th className="px-4 py-2 text-left">Data de Pagamento</th>
                  <th className="px-4 py-2 text-left">Total do Pedido</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {financeiro.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2">{item.idFinanceiroGrupoPedido}</td>
                    <td className="px-4 py-2">{item.idGrupoPedido}</td>
                    <td className="px-4 py-2">{item.dataPagamento}</td>
                    <td className="px-4 py-2">R${item.valorMovimento}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Loading />
        )}
      </main>
    </>
  );
}