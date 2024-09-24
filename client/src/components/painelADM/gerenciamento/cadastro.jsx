import { useState, useEffect } from "react";
import axios from "axios";

export default function Cadastro() {
  const [message, setMessage] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [listCategory, setListCategory] = useState([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProductTableVisible, setIsProductTableVisible] = useState(true);
  const [isCategoryTableVisible, setIsCategoryTableVisible] = useState(false);
  const [nameProduto, setNameProduct] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [preco, setPreco] = useState("");
  const [listProduct, setListProduct] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

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

    

  return (
    <>
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
    </>
  );
}
