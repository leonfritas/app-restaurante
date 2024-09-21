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

export const realizarBaixa = (req, res) => {
    const { idGrupoPedido } = req.body;
    const database = req.body.database;
    let sql = 'call sp_FinanceiroMovimento_RealizarBaixa(?)';

    executeQuery(database, sql, [idGrupoPedido], res);
    
}   

export const movimentoRealizado = (req, res) => {
        const { movimentoRealizado } = req.body;
        const database = req.body.database;
        let sql = 'CALL sp_FinanceiroMovimento_Realizado(?)';
                
        executeQuery(database, sql, [movimentoRealizado], res);
}