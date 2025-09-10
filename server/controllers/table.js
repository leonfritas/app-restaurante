import { conectDB } from '../db.js';

// Função genérica para executar queries no SQL Server
async function executeQuery(database, sql, params = {}) {
    try {
        const pool = await conectDB(database);
        const request = pool.request();

        // Adiciona os parâmetros dinamicamente
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

// Listar mesas disponíveis
export const getTable = async (req, res) => {
    const { database } = req.body;
    if (!database) return res.status(400).send({ message: "Database obrigatório" });

    try {
        const sql = 'EXEC sp_Mesa_Disponivel';
        const result = await executeQuery(database, sql);
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ message: "Erro ao listar mesas disponíveis." });
    }
};

// Inserir grupo de pedido na mesa
export const joinTable = async (req, res) => {
    const { idMesa, idGrupoPedido, database } = req.body;
    if (!database) return res.status(400).send({ message: "Database obrigatório" });

    try {
        const sql = 'EXEC sp_Mesa_Inserir @idMesa, @idGrupoPedido';
        const result = await executeQuery(database, sql, { idMesa, idGrupoPedido });
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ message: "Erro ao associar grupo de pedido à mesa." });
    }
};

// Consultar mesa ocupada
export const getOrderTable = async (req, res) => {
    const { idGrupoPedido, database } = req.body;
    if (!database) return res.status(400).send({ message: "Database obrigatório" });

    try {
        const sql = 'EXEC sp_Mesa_Ocupada @idGrupoPedido';
        const result = await executeQuery(database, sql, { idGrupoPedido });
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ message: "Erro ao consultar mesa ocupada." });
    }
};
