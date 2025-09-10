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

// Login de funcionário
export const login = async (req, res) => {
    const { name, senha, database } = req.body;
    if (!database) return res.status(400).send({ message: "Database obrigatório" });

    try {
        const sql = 'EXEC sp_funcionario_verificar @name, @senha';
        const result = await executeQuery(database, sql, { name, senha });
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ message: "Erro ao verificar login." });
    }
};

// Listar funcionários
export const listar = async (req, res) => {
    const { database } = req.body;
    if (!database) return res.status(400).send({ message: "Database obrigatório" });

    try {
        const sql = 'SELECT * FROM Funcionario';
        const result = await executeQuery(database, sql);
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ message: "Erro ao listar funcionários." });
    }
};

// Cadastrar funcionário
export const cadastrar = async (req, res) => {
    const { realName, userName, senha, cpf, checkAdmin, userCheck, database } = req.body;
    if (!database) return res.status(400).send({ message: "Database obrigatório" });

    const ativoAdminValue = checkAdmin ? 1 : 0;
    const ativoFuncionarioValue = userCheck ? 1 : 0;

    try {
        const sql = `
            EXEC sp_Funcionario_Inserir 
                @realName, @userName, @senha, @cpf, @ativoAdmin, @ativoFuncionario
        `;
        const result = await executeQuery(database, sql, {
            realName,
            userName,
            senha,
            cpf,
            ativoAdmin: ativoAdminValue,
            ativoFuncionario: ativoFuncionarioValue
        });
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ message: "Erro ao cadastrar funcionário." });
    }
};

// Deletar funcionário
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    const { database } = req.body;
    if (!database) return res.status(400).send({ message: "Database obrigatório" });

    try {
        const sql = 'EXEC sp_Funcionario_Cancelar @id';
        const result = await executeQuery(database, sql, { id });
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ message: "Erro ao deletar funcionário." });
    }
};
