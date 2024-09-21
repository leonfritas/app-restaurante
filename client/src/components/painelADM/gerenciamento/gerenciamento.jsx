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
        const produtoExistente = listProduct.some(product => 
            product.nomeProduto.trim().toLowerCase() === normalizedProductName
        );

        if (produtoExistente) {
            setMessage("Nome do produto já existe.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:3001/products/productRegister", {
                nomeProduto: nameProduto,
                quantidade,
                preco,
                idCategoria: selectedCategory 
            });

            if (response.data.produtoDuplicado === 0) {
                setMessage("Produto cadastrado com sucesso!");
                setListProduct(prev => [...prev, {
                    idProduto: response.data.idProduto,
                    nomeProduto: nameProduto,
                    quantidade,
                    preco
                }]);
                setNameProduct("");
                setQuantidade("");
                setPreco("");
                setSelectedCategory("");
            } else {
                setMessage("Nome do produto já existe.");
            }
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
            const response = await axios.post("http://localhost:3001/category/addCategory", {
                nomeCategoria: newCategoryName,
            });
            setMessage("Categoria cadastrada com sucesso!");
            setListCategory(prev => [...prev, response.data]);
            setNewCategoryName("");
            setSelectedCategory(response.data.idCategoria); 
        } catch (error) {
            console.error("Erro ao cadastrar categoria:", error);
            setMessage("Erro ao cadastrar categoria. Tente novamente.");
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:3001/products/listProduct");
                setListProduct(response.data);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
                setMessage("Erro ao buscar produtos: " + error.message);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:3001/category/getCategory");
                setListCategory(response.data);
            } catch (error) {
                console.error("Erro ao buscar categorias:", error);
                setMessage("Erro ao buscar categorias: " + error.message);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-6">
            {message && <div className="mb-4 text-red-400">{message}</div>}

            <h2 className="text-3xl font-bold mb-6">Cadastro de Produtos</h2>

            <h2 className="text-2xl font-bold mb-4">Adicionar Nova Categoria</h2>
            <div className="grid grid-cols-1 gap-4 mb-4 w-full max-w-md">
                <input
                    type="text"
                    placeholder="Nome da Nova Categoria"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="border p-3 rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                />
                <button onClick={registerCategory} className="bg-green-600 text-white p-3 rounded hover:bg-green-700 transition-shadow shadow-md hover:shadow-lg">
                    Adicionar Categoria
                </button>
            </div>

            <h2 className="text-2xl font-bold mb-4 text-white">Adicionar Novo Produto</h2>
            <div className="grid grid-cols-1 gap-4 mb-4 w-full max-w-md">
                <input
                    type="text"
                    placeholder="Nome do Produto"
                    value={nameProduto}
                    onChange={(e) => setNameProduct(e.target.value)}
                    className="border p-3 rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                />
                <input
                    type="number"
                    placeholder="Quantidade"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                    className="border p-3 rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                />
                <input
                    type="number"
                    placeholder="Preço"
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    className="border p-3 rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                />
                <label htmlFor="category" className="mb-2 text-white">Categoria</label>
                <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border p-3 rounded shadow-sm focus:outline-none text-black focus:ring focus:ring-blue-500"
                >
                    <option value="">Selecione uma categoria</option>
                    {listCategory.map((category) => (
                        <option key={category.idCategoria} value={category.idCategoria}>
                            {category.nomeCategoria}
                        </option>
                    ))}
                </select>
            </div>

            <button onClick={registerProduct} className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition-shadow shadow-md hover:shadow-lg">
                Registrar Produto
            </button>

            <div className="w-full py-5">
                <table className="border-collapse w-full text-black bg-white rounded-lg shadow-lg">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="border px-4 py-2">Nome do Produto</th>
                            <th className="border px-4 py-2">Quantidade</th>
                            <th className="border px-4 py-2">Preço</th>
                            <th className="border px-4 py-2">Categoria</th> 
                        </tr>
                    </thead>
                    <tbody>
                        {listProduct.map((product) => (
                            <tr key={product.idProduto} className="hover:bg-gray-200">
                                <td className="border px-4 py-2">{product.nomeProduto}</td>
                                <td className="border px-4 py-2">{product.quantidade}</td>
                                <td className="border px-4 py-2">{product.preco}</td>
                                <td className="border px-4 py-2">{product.nomeCategoria || 'N/A'}</td> 
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
