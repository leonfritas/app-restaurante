import { conectDB } from '../db.js';

// Função genérica para executar queries no SQL Server
async function executeQuery(database, sql, params = {}) {
    try {
        const pool = await conectDB(database); // Conecta ao banco
        const request = pool.request();

        // Adiciona parâmetros dinamicamente
        for (const key in params) {
            request.input(key, params[key]);
        }

        const result = await request.query(sql);
        return result.recordset; // Retorna registros
    } catch (err) {
        console.error("Erro ao executar a query:", err);
        throw err;
    }
}

// Registrar produto
export const productRegister = async (req, res) => {
    const { nomeProduto, preco, idCategoria, quantidade, database } = req.body;

    if (!nomeProduto || preco == null || !idCategoria || quantidade == null || !database) {
        return res.status(400).send({ message: 'Parâmetros inválidos' });
    }

    try {
        const sql = `
            INSERT INTO Produto(nomeProduto, idCategoria, quantidade, preco)
            VALUES (@nomeProduto, @idCategoria, @quantidade, @preco)
        `;
        await executeQuery(database, sql, { nomeProduto, idCategoria, quantidade, preco });
        res.status(201).send({ message: "Produto cadastrado com sucesso!" });
    } catch (err) {
        res.status(500).send({ message: "Erro ao cadastrar produto." });
    }
};

// Listar produto(s)
export const listaProduto = async (req, res) => {
    const { database, idProduto } = req.body;

    if (!database) {
        return res.status(400).send({ message: "Banco de dados não especificado" });
    }

    try {
        const sql = 'EXEC sp_Produto_Selecionar @idProduto';
        const result = await executeQuery(database, sql, { idProduto });
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ message: "Erro ao buscar produtos." });
    }
};

// Deletar produto
export const productDelete = async (req, res) => {
    const { idProduto } = req.params;
    const { database } = req.body;

    if (!idProduto || !database) {
        return res.status(400).send({ message: "ID do produto e database são obrigatórios." });
    }

    try {
        const sql = 'DELETE FROM Produto WHERE idProduto = @idProduto';
        const result = await executeQuery(database, sql, { idProduto });

        if (result.length === 0) { // SQL Server não retorna affectedRows da mesma forma
            return res.status(404).send({ message: "Produto não encontrado." });
        }

        res.status(200).send({ message: "Produto excluído com sucesso!" });
    } catch (err) {
        res.status(500).send({ message: "Erro ao tentar excluir o produto." });
    }
};
