import { conectDB } from '../db.js';

// Função genérica para executar queries no SQL Server
async function executeQuery(database, sql, params = {}) {
    try {
        const pool = await conectDB(database); // Conecta ao banco de dados
        const request = pool.request();

        // Adiciona os parâmetros dinamicamente
        for (const key in params) {
            request.input(key, params[key]);
        }

        const result = await request.query(sql);
        return result.recordset; // Retorna os registros
    } catch (err) {
        console.error("Erro ao executar a query:", err);
        throw err;
    }
}

// Controller adaptado: realizarBaixa
export const realizarBaixa = async (req, res) => {
    const { idGrupoPedido, database } = req.body;

    if (!idGrupoPedido || !database) {
        return res.status(400).send({ message: "idGrupoPedido e database são obrigatórios." });
    }

    try {
        const sql = 'EXEC sp_FinanceiroMovimento_RealizarBaixa @idGrupoPedido';
        const result = await executeQuery(database, sql, { idGrupoPedido });
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ message: "Erro ao realizar baixa." });
    }
};

// Controller adaptado: movimentoRealizado
export const movimentoRealizado = async (req, res) => {
    const { movimentoRealizado, database } = req.body;

    if (!movimentoRealizado || !database) {
        return res.status(400).send({ message: "movimentoRealizado e database são obrigatórios." });
    }

    try {
        const sql = 'EXEC sp_FinanceiroMovimento_Realizado @movimentoRealizado';
        const result = await executeQuery(database, sql, { movimentoRealizado });
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ message: "Erro ao marcar movimento como realizado." });
    }
};
