import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/novoPedido.css";

export default function Gerenciamento() {
  const [listProduct, setListProduct] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [nameProduto, setNameProduct] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [preco, setPreco] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [message, setMessage] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/products/listProduct",
        {
          database: sessionStorage.getItem("database"),
        }
      );
      setListProduct(response.data[0]);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/category/getCategory",
        {
          database: sessionStorage.getItem("database"),
        }
      );
      setListCategory(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const registerProduct = async () => {
    if (!nameProduto || !quantidade || !preco || !selectedCategory) {
      setMessage("Preencha todos os campos para continuar.");
      return;
    }

    if (quantidade <= 0 || preco <= 0) {
      setMessage("Quantidade e preço devem ser positivos.");
      return;
    }

    const normalizedProductName = nameProduto.trim().toLowerCase();
    const produtoExistente = listProduct.some(
      (product) =>
        product.nomeProduto.trim().toLowerCase() === normalizedProductName
    );

    if (produtoExistente) {
      setMessage("Nome do produto já existe.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3001/products/productRegister",
      {
        nomeProduto: nameProduto,
        quantidade,
        preco,
        idCategoria: selectedCategory,
        database: sessionStorage.getItem("database"),
      });
      setMessage("Produto cadastrado com sucesso!");
      fetchProducts();
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      setMessage("Erro ao tentar cadastrar. Tente novamente mais tarde.");
    }
  };

  const registerCategory = async () => {
    if (!newCategoryName) {
        setMessage("Preencha o nome da categoria.");
        return;
    }

    try {
        const response = await axios.post(
            "http://localhost:3001/category/addCategory",
            {
                nomeCategoria: newCategoryName,
                database: sessionStorage.getItem("database"),
            }
        );

        if (response.status === 201) {
            setMessage("Categoria cadastrada com sucesso!");
            fetchCategories();
            setNewCategoryName("");
        }
    } catch (error) {
        if (error.response) {
            setMessage(`Erro ao cadastrar categoria: ${error.response.data.message}`);
        } else {
            setMessage("Erro ao cadastrar categoria. Tente novamente.");
        }
    }
};

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 overflow-auto">
      {message && <div className="mb-4 text-red-500 bg-red-100 p-3 rounded">{message}</div>}

      <h2 className="text-3xl font-bold mb-6 text-white">Gerenciamento de Produtos</h2>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6 w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4 text-white">Adicionar Nova Categoria</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Nome da Categoria"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
          />
          <button
            onClick={registerCategory}
            className="bg-green-600 text-white p-3 rounded hover:bg-green-700 transition-shadow"
          >
            Adicionar
          </button>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4 text-white">Adicionar Novo Produto</h2>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <input
            type="text"
            placeholder="Nome do Produto"
            value={nameProduto}
            onChange={(e) => setNameProduct(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Quantidade"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Preço"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
          >
            <option value="">Selecione uma categoria</option>
            {listCategory.map((category) => (
              <option key={category.idCategoria} value={category.idCategoria}>
                {category.nomeCategoria}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={registerProduct}
          className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition-shadow w-full"
        >
          Registrar Produto
        </button>
      </div>

      <div className="w-full py-6 overflow-x-auto mt-6">
        <table className="min-w-full text-left table-auto border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="px-4 py-2 border">Nome do Produto</th>
              <th className="px-4 py-2 border">Quantidade</th>
              <th className="px-4 py-2 border">Preço</th>
              <th className="px-4 py-2 border">Categoria</th>
            </tr>
          </thead>
          <tbody className="bg-white text-gray-800">
            {listProduct.map((product) => (
              <tr key={product.idProduto} className="hover:bg-gray-100">
                <td className="px-4 py-2 border">{product.nomeProduto}</td>
                <td className="px-4 py-2 border">{product.quantidade}</td>
                <td className="px-4 py-2 border">R${product.preco}</td>
                <td className="px-4 py-2 border">{product.nomeCategoria || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
