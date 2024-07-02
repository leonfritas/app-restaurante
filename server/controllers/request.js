import {response} from "express";
import { db } from '../db.js'



export const pedidoinserir = (req, res) => {
    const { idGrupoPedido } = req.body;
    const { idProduto } = req.body;
    const { quantidade } = req.body;
    const { preco } = req.body;    

    let sql = "call sp_pedido_inserir(?,?,?,?)";
    
    db.query(sql, [idGrupoPedido, idProduto, quantidade, preco ], (err, result) => {
        if (err) console.log(err)
        else res.send(result)        
    })    
}

export const pedidoExcluir = (req, res) => {
    const { idGrupoPedido } = req.body;
    const { idProduto } = req.body; 

    let sql = "call sp_pedido_excluir(?,?)";
    
    db.query(sql, [idGrupoPedido, idProduto], (err, result) => {
        if (err) console.log(err)
        else res.send(result)        
    })    
}

