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

// Inserir pedido
export const pedidoinserir = async (req, res) => {
    const { idGrupoPedido, idProduto, quantidade, preco, database } = req.body;

    if (!idGrupoPedido || !idProduto || quantidade == null || preco == null || !database) {
        return res.status(400).send({ message: "Parâmetros inválidos." });
    }

    try {
        const sql = 'EXEC sp_pedido_inserir @idGrupoPedido, @idProduto, @quantidade, @preco';
        const result = await executeQuery(database, sql, { idGrupoPedido, idProduto, quantidade, preco });
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ message: "Erro ao inserir pedido." });
    }
};

// Excluir pedido
export const pedidoExcluir = async (req, res) => {
    const { idGrupoPedido, idProduto, database } = req.body;

    if (!idGrupoPedido || !idProduto || !database) {
        return res.status(400).send({ message: "Parâmetros inválidos." });
    }

    try {
        const sql = 'EXEC sp_pedido_excluir @idGrupoPedido, @idProduto';
        const result = await executeQuery(database, sql, { idGrupoPedido, idProduto });
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ message: "Erro ao excluir pedido." });
    }
};
