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

// Controller adaptado
export const getCompany = async (req, res) => {
    const { idEmpresa, database } = req.body;

    if (!idEmpresa || !database) {
        return res.status(400).send({ message: "ID da empresa e database são obrigatórios." });
    }

    try {
        const sql = 'EXEC sp_Empresa_Selecionar @idEmpresa';
        const result = await executeQuery(database, sql, { idEmpresa });
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ message: "Erro ao buscar a empresa." });
    }
};
