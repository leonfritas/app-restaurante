import { response } from 'express';
import { conectDB } from '../db.js';


function executeQuery(database, sql, params, res) {
    const db = conectDB(database); 

    db.query(sql, params, (err, result) => {
        if (err) {

            console.log(err);
            res.status(500).send('Erro ao executar a query');
        } else {
            res.send(result);
        }
    });
}

export const getTable = (req, res) => {
    const database = req.body.database;

    let sql = 'call sp_Mesa_Disponivel';

    executeQuery(database, sql, [], res);
}

export const joinTable = (req, res) => {
    const {idMesa } = req.body;
    const {idGrupoPedido} = req.body;
    const database = req.body.database;
    
    let sql = 'call sp_Mesa_Inserir(?,?)'; 

    executeQuery(database, sql, [idMesa, idGrupoPedido], res);
}

export const getOrderTable = (req, res) => {
    const {idGrupoPedido} = req.body;
    const database = req.body.database;
    
    let sql = 'call sp_Mesa_Ocupada(?)';  

    executeQuery(database, sql, [idGrupoPedido], res);
}
