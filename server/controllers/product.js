import { conectDB } from '../db.js';

function executeQuery(database, sql, params, res) {
    const db = conectDB(database);
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Erro ao obter conexão:', err);
            res.status(500).send('Erro ao obter a conexão: ' + err.message);
            return;
        }

        connection.query(sql, params, (err, result) => {
            connection.release();
            if (err) {
                console.error('Erro na consulta:', err);
                res.status(500).send('Erro ao executar a query: ' + err.message);
            } else {
                res.send(result);
            }
        });
    });
}

export const productRegister = (req, res) => {
    const { nomeProduto, preco, idCategoria, quantidade, database } = req.body;

    if (!nomeProduto || !preco || !idCategoria || !quantidade || !database) {
        return res.status(400).send('Parâmetros inválidos');
    }

    const sql = "INSERT INTO Produto(nomeProduto, idCategoria, quantidade, preco) VALUES (?, ?, ?, ?)";
    executeQuery(database, sql, [nomeProduto, idCategoria, quantidade, preco], res);
}

export const listaProduto = (req, res) => {
    const { database, idProduto } = req.body;

    if (!database) {
        return res.status(400).send("Banco de dados não especificado");
    }

    const sql = "CALL sp_Produto_Selecionar(?);";

    
    executeQuery(database, sql, [idProduto], res);
};



