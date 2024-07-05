import { useState, useEffect } from "react";
import Axios from "axios";
import Navbar from "../components/navbar.jsx";
import Loading from "../components/loading.jsx";

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
      console.log('Dados recebidos da API:', response.data);
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
        <h1 className="text-2xl font-bold mb-4">Lista de Movimentos Financeiros</h1>

        {financeiro.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg shadow overflow-hidden">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">ID do Grupo Pedido</th>
                  <th className="px-4 py-2">Data de Movimento</th>
                  <th className="px-4 py-2">Data de Pagamento</th>
                  <th className="px-4 py-2">Pagamento</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {financeiro.map((item, index) => (
                  <tr key={index} className="border-b">
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
