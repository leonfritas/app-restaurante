import { conectDB } from '../db.js';

function executeQuery(database, sql, params, callback) {
    const db = conectDB(database);
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Erro ao obter conexão:', err);
            return callback(err, null);
        }

        connection.query(sql, params, (err, result) => {
            connection.release();
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            callback(null, result);
        });
    });
}

export const categoryDelete = (req, res) => {
    const { idCategoria } = req.params;
    const { database } = req.body;

    if (!idCategoria) {
        return res.status(400).send({ message: "ID da categoria é obrigatório." });
    }

    const sql = "DELETE FROM Categoria WHERE idCategoria = ?";

    executeQuery(database, sql, [idCategoria], (err, result) => {
        if (err) {
            return res.status(500).send({ message: "Erro ao tentar excluir a categoria." });
        }

        // Verifica se alguma linha foi afetada
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: "Categoria não encontrada." });
        }

        res.status(200).send({ message: "Categoria excluída com sucesso!" });
    });
};

// Outros métodos

export const getCategory = (req, res) => {
    const database = req.body.database;
    let sql = 'SELECT * FROM Categoria';
    executeQuery(database, sql, [], (err, result) => {
        if (err) {
            return res.status(500).send({ message: "Erro ao buscar categorias." });
        }
        res.status(200).send(result);
    });
}

export const categoryRegister = (req, res) => {
    const { nomeCategoria, database } = req.body;

    if (!nomeCategoria) {
        return res.status(400).send({ message: "Nome da categoria é obrigatório." });
    }

    const insertSql = "INSERT INTO Categoria(nomeCategoria) VALUES (?)"; 
    
    executeQuery(database, insertSql, [nomeCategoria], (err, result) => {
        if (err) {
            return res.status(500).send({ message: 'Erro ao executar a query' });
        }
        res.status(201).send({ success: true, message: "Categoria cadastrada com sucesso!" });
    });
};

export const filterByCategory = (req, res) => {
    const { idCategory, idGrupoPedido, database } = req.body;
    let sql = 'CALL sp_ProdutoCategoria_Selecionar(?, ?)';

    executeQuery(database, sql, [idCategory, idGrupoPedido], (err, result) => {
        if (err) {
            return res.status(500).send({ message: "Erro ao filtrar categorias." });
        }
        res.status(200).send(result);
    });
};
