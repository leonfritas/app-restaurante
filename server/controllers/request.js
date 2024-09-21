import {response} from "express";
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


export const pedidoinserir = (req, res) => {
    const { idGrupoPedido } = req.body;
    const { idProduto } = req.body;
    const { quantidade } = req.body;
    const { preco } = req.body;    
    const database = req.body.database;
    let sql = "call sp_pedido_inserir(?,?,?,?)";
    
    executeQuery(database, sql, [idGrupoPedido, idProduto, quantidade, preco], res);   
}

export const pedidoExcluir = (req, res) => {
    const { idGrupoPedido } = req.body;
    const { idProduto } = req.body; 
    const database = req.body.database;
    let sql = "call sp_pedido_excluir(?,?)";
    
    executeQuery(database, sql, [idGrupoPedido, idProduto], res);    
}

