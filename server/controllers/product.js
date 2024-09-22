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
    })
}

export const productRegister = (req, res) => {
    const { nomeProduto } = req.body;
    const { preco } = req.body;
    const { idCategoria } = req.body;
    const { quantidade } = req.body;
    const database = req.body.database;

    let sql = "insert into Produto(nomeProduto, idCategoria, quantidade, preco)values(?,?,?,?)";

    executeQuery(database, sql, [nomeProduto, idCategoria, preco, quantidade], res);
}

export const listaProduto = (req, res) => {
    const database = req.body.database;
    let sql = "select * from Produto"

    executeQuery(database, sql, [], res);
    
}
