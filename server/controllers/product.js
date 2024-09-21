import { response } from 'express'

import { conectDB } from '../db.js';


function executeQuery(database, sql, params, res) {
    const db = conectDB(database); 

    db.query(sql, params, (err, result) => {
        if (err) {
            console.log('chegou aqui');
            console.log(err);
            res.status(500).send('Erro ao executar a query');
        } else {
            res.send(result);
        }
    });
}


export const productRegister = (req, res) => {
    const { name } = req.body;
    const { cost } = req.body;
    const { category } = req.body;
    const { quantidade } = req.body;
    const database = req.body.database;

    let sql = "insert into produto(nomeProduto, idCategoria, quantidade, preco)values(?,?,?,?)";

    executeQuery(database, sql, [name, cost, category, quantidade], res);
}

export const listaProduto = (req, res) => {
    const database = req.body.database;
    let sql = "select * from Produto"

    executeQuery(database, sql, [], res);
    
}
