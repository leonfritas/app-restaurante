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


export const productDelete = (req, res) => {
    const { idProduto } = req.params;
    const { database } = req.body;

    if (!idProduto) {
        return res.status(400).send({ message: "ID do produto é obrigatório." });
    }

    const sql = "DELETE FROM Produto WHERE idProduto = ?";

    executeQuery(database, sql, [idProduto], (err, result) => {
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



