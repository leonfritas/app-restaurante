import { conectDB } from '../db.js'; // Sua função já adaptada para SQL Server

// Função genérica para executar queries
export async function executeQuery(database, query, params = {}) {
    try {
        const pool = await conectDB(database); // Conecta ao banco
        const request = pool.request();

        // Adiciona os parâmetros dinamicamente
        for (const key in params) {
            request.input(key, params[key]);
        }

        const result = await request.query(query);
        return result.recordset; // Retorna os registros
    } catch (err) {
        console.error("Erro na query:", err);
        throw err;
    }
}

export const categoryDelete = async (req, res) => {
    const { idCategoria, database } = req.body;

    if (!idCategoria) {
        return res.status(400).send({ message: "ID da categoria é obrigatório." });
    }

    try {
        const sql = "DELETE FROM Categoria WHERE idCategoria = @idCategoria";
        const result = await executeQuery(database, sql, { idCategoria });

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send({ message: "Categoria não encontrada." });
        }

        res.status(200).send({ message: "Categoria excluída com sucesso!" });
    } catch (err) {
        res.status(500).send({ message: "Erro ao tentar excluir a categoria." });
    }
};


export const getCategory = async (req, res) => {
    const { database } = req.body;

    try {
        const sql = 'SELECT * FROM Categoria';
        const result = await executeQuery(database, sql);
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ message: "Erro ao buscar categorias." });
    }
};


export const categoryRegister = async (req, res) => {
    const { nomeCategoria, database } = req.body;

    if (!nomeCategoria) {
        return res.status(400).send({ message: "Nome da categoria é obrigatório." });
    }

    try {
        const sql = "INSERT INTO Categoria(nomeCategoria) VALUES (@nomeCategoria)";
        await executeQuery(database, sql, { nomeCategoria });
        res.status(201).send({ success: true, message: "Categoria cadastrada com sucesso!" });
    } catch (err) {
        res.status(500).send({ message: 'Erro ao executar a query' });
    }
};


export const filterByCategory = async (req, res) => {
    const { idCategory, idGrupoPedido, database } = req.body;

    try {
        const sql = 'EXEC sp_ProdutoCategoria_Selecionar @idCategory, @idGrupoPedido';
        const result = await executeQuery(database, sql, { idCategory, idGrupoPedido });
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ message: "Erro ao filtrar categorias." });
    }
};

