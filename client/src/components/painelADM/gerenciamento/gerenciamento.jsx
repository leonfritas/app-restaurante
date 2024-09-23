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
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProductTableVisible, setIsProductTableVisible] = useState(true);
  const [isCategoryTableVisible, setIsCategoryTableVisible] = useState(false);

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
      await axios.post("http://localhost:3001/products/productRegister", {
        nomeProduto: nameProduto,
        quantidade,
        preco,
        idCategoria: selectedCategory,
        database: sessionStorage.getItem("database"),
      });
      setMessage("Produto cadastrado com sucesso!");
      fetchProducts();
      setIsProductModalOpen(false);
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      setMessage("Erro ao tentar cadastrar. Tente novamente mais tarde.");
    }
  };

  const editProduct = async (product) => {
    setNameProduct(product.nomeProduto);
    setQuantidade(product.quantidade);
    setPreco(product.preco);
    setSelectedCategory(product.idCategoria);
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const updateProduct = async () => {
    if (!nameProduto || !quantidade || !preco || !selectedCategory) {
      setMessage("Preencha todos os campos para continuar.");
      return;
    }

    try {
      await axios.put("http://localhost:3001/products/productUpdate", {
        idProduto: editingProduct.idProduto,
        nomeProduto: nameProduto,
        quantidade,
        preco,
        idCategoria: selectedCategory,
        database: sessionStorage.getItem("database"),
      });
      setMessage("Produto atualizado com sucesso!");
      fetchProducts();
      setIsProductModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      setMessage("Erro ao tentar atualizar. Tente novamente mais tarde.");
    }
  };



  const deleteProduct = async (idProduto) => {
    if (window.confirm("Você tem certeza que deseja excluir este Produto?")) {
      try {
        await axios.delete(`http://localhost:3001/product/productDelete/${idProduto}`, {
          data: {database : sessionStorage.getItem("database")}
        });
        setMessage("Produto excluído com sucesso!");
        fetchProducts()
      } catch (error) {
          console.error("Erro ao excluir produto:", error);
          setMessage("Erro ao tentar excluir. Tente novamente mais tarde.")
      }
    }
  }

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
        setIsCategoryModalOpen(false);
      }
    } catch (error) {
      if (error.response) {
        setMessage(
          `Erro ao cadastrar categoria: ${error.response.data.message}`
        );
      } else {
        setMessage("Erro ao cadastrar categoria. Tente novamente.");
      }
    }
  };
  

  const deleteCategory = async (idCategoria) => {
    if (window.confirm("Você tem certeza que deseja excluir esta categoria?")) {
      try {
        await axios.delete(`http://localhost:3001/category/categoryDelete/${idCategoria}`, {
          data: { database: sessionStorage.getItem("database") }
        });
        setMessage("Categoria excluída com sucesso!");
        fetchCategories();
      } catch (error) {
        console.error("Erro ao excluir categoria:", error);
        setMessage("Erro ao tentar excluir. Tente novamente mais tarde.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 overflow-auto">
      {message && (
        <div className="mb-4 text-red-500 bg-red-100 p-3 rounded">
          {message}
        </div>
      )}

      <h2 className="text-3xl font-bold mb-6 text-white">
        Gerenciamento de Produtos e Categorias
      </h2>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => {
            setIsProductTableVisible(false);
            setIsProductModalOpen(true);
          }}
          className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition-shadow"
        >
          Adicionar Produto
        </button>
        <button
          onClick={() => {
            setIsCategoryTableVisible(false);
            setIsCategoryModalOpen(true);
          }}
          className="bg-green-600 text-white p-3 rounded hover:bg-green-700 transition-shadow"
        >
          Adicionar Categoria
        </button>
      </div>

      {/* Alternar entre Tabelas */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setIsProductTableVisible(true)}
          className={`p-2 rounded ${isProductTableVisible ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}
        >
          Produtos
        </button>
        <button
          onClick={() => setIsProductTableVisible(false)}
          className={`p-2 rounded ${!isProductTableVisible ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"}`}
        >
          Categorias
        </button>
      </div>

      {/* Modal para Adicionar Produto */}
      {isProductModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              {editingProduct ? "Editar Produto" : "Adicionar Novo Produto"}
            </h2>
            <input
              type="text"
              placeholder="Nome do Produto"
              value={nameProduto}
              onChange={(e) => setNameProduct(e.target.value)}
              className="w-full p-3 mb-4 rounded bg-gray-700 text-white placeholder-gray-400"
            />
            <input
              type="number"
              placeholder="Quantidade"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              className="w-full p-3 mb-4 rounded bg-gray-700 text-white placeholder-gray-400"
            />
            <input
              type="number"
              placeholder="Preço"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              className="w-full p-3 mb-4 rounded bg-gray-700 text-white placeholder-gray-400"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
            >
              <option value="">Selecione uma categoria</option>
              {listCategory.map((category) => (
                <option key={category.idCategoria} value={category.idCategoria}>
                  {category.nomeCategoria}
                </option>
              ))}
            </select>
            <button
              onClick={editingProduct ? updateProduct : registerProduct}
              className="bg-blue-600 text-white p-3 rounded w-full hover:bg-blue-700 transition-shadow"
            >
              {editingProduct ? "Atualizar Produto" : "Adicionar Produto"}
            </button>
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="bg-red-600 text-white p-3 rounded w-full mt-2 hover:bg-red-700 transition-shadow"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal para Adicionar Categoria */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              {editingCategory ? "Editar Categoria" : "Adicionar Nova Categoria"}
            </h2>
            <input
              type="text"
              placeholder="Nome da Categoria"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full p-3 mb-4 rounded bg-gray-700 text-white placeholder-gray-400"
            />
            <button
              onClick={editingCategory ? updateCategory : registerCategory}
              className="bg-green-600 text-white p-3 rounded w-full hover:bg-green-700 transition-shadow"
            >
              {editingCategory ? "Atualizar Categoria" : "Adicionar Categoria"}
            </button>
            <button
              onClick={() => setIsCategoryModalOpen(false)}
              className="bg-red-600 text-white p-3 rounded w-full mt-2 hover:bg-red-700 transition-shadow"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Renderizar Tabela de Produtos ou Categorias */}
      <div className="w-full py-6 overflow-x-auto mt-6">
        {isProductTableVisible ? (
          <table className="min-w-full text-left table-auto border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-4 py-2 border">Nome do Produto</th>
                <th className="px-4 py-2 border">Quantidade</th>
                <th className="px-4 py-2 border">Preço</th>
                <th className="px-4 py-2 border">Categoria</th>
                <th className="px-4 py-2 border">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white text-gray-800">
              {listProduct.map((product) => (
                <tr key={product.idProduto} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border">{product.nomeProduto}</td>
                  <td className="px-4 py-2 border">{product.quantidade}</td>
                  <td className="px-4 py-2 border">R${product.preco}</td>
                  <td className="px-4 py-2 border">
                    {product.nomeCategoria || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => editProduct(product)}
                      className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600 mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteProduct(product.idProduto)}
                      className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="min-w-full text-left table-auto border-collapse">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="px-4 py-2 border">Nome da Categoria</th>
                <th className="px-4 py-2 border">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white text-gray-800">
              {listCategory.map((category) => (
                <tr key={category.idCategoria} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border">{category.nomeCategoria}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => editCategory(category)}
                      className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600 mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteCategory(category.idCategoria)}
                      className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
