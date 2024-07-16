import { response } from 'express';

import { db } from "../db.js";

export const getTable = (req, res) => {
    
    let sql = 'call sp_Mesa_Disponivel'    
    db.query(sql, (err, result) => {
        if(err) console.log(err)
            else res.send(result)
    })
}

export const joinTable = (req, res) => {
    const {idMesa } = req.body;
    const {idGrupoPedido} = req.body;
    
    let sql = 'call sp_Mesa_Inserir(?,?)'  

    db.query(sql, [idMesa, idGrupoPedido], (err, result) => {
        if(err) console.log(err)
            else res.send(result)
    })
}

export const getOrderTable = (req, res) => {
    const {idGrupoPedido} = req.body;
    
    let sql = 'call sp_Mesa_Ocupada(?)'  

    db.query(sql, [idGrupoPedido], (err, result) => {
        if(err) console.log(err)
            else res.send(result)
    })
}
