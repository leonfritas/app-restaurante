import { useState, useEffect } from "react";
import axios from "axios";

export default function Tabela() {

      const [listProduct, setListProduct] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [ setNameProduct] = useState("");
  const [ setQuantidade] = useState("");
  const [ setPreco] = useState("");
  const [ setSelectedCategory] = useState("");
  const [ setMessage] = useState("");
  const [setEditingProduct] = useState(null);
  const [isProductTableVisible, setIsProductTableVisible] = useState(true);

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

      const editProduct = async (product) => {
            setNameProduct(product.nomeProduto);
            setQuantidade(product.quantidade);
            setPreco(product.preco);
            setSelectedCategory(product.idCategoria);
            setEditingProduct(product);
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
      return(
            <>
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
                      onClick={() => (category)}  //editCategory(category)
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
            </>
      )
}