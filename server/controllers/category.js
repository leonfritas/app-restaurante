import { conectDB } from '../db.js';

function executeQuery(database, sql, params, res) {
    const db = conectDB(database);
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Erro ao obter conexão:', err);
            res.status(500).send('Erro ao obter a conexão');
            return;
        }

        connection.query(sql, params, (err, result) => {
            connection.release();
            if (err) {
                console.log(err);
                res.status(500).send('Erro ao executar a query');
            } else {
                res.send(result);
            }
        });
    });
}

export const getCategory = (req, res) => {
    const database = req.body.database;
    let sql = 'SELECT * FROM Categoria';
    executeQuery(database, sql, [], res);
}

export const categoryRegister = (req, res) => {
    const { nomeCategoria, database } = req.body;

    if (!nomeCategoria) {
        return res.status(400).send({ message: "Nome da categoria é obrigatório." });
    }

    const insertSql = "INSERT INTO Categoria(nomeCategoria) VALUES (?)"; 
    executeQuery(database, insertSql, [nomeCategoria], res);
}

export const filterByCategory = (req, res) => {
    const { idCategory, idGrupoPedido, database } = req.body;
    let sql = 'CALL sp_ProdutoCategoria_Selecionar(?, ?)';

    executeQuery(database, sql, [idCategory, idGrupoPedido], res);
}
