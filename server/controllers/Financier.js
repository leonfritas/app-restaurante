import { response } from 'express';

import { db } from "../db.js";

export const realizarBaixa = (req, res) => {
    const { idGrupoPedido } = req.body;

    let sql = 'call sp_FinanceiroMovimento_RealizarBaixa(?)';

    db.query(sql, [idGrupoPedido], (err, result) => {
        if(err) console.log(err)
            else res.send(result)
    })
    
}   

export const movimentoRealizado = (req, res) => {
        const { movimentoRealizado } = req.body;

        let sql = 'CALL sp_FinanceiroMovimento_Realizado(?)';
                
        db.query(sql, [movimentoRealizado], (err, result) => {
            if(err) console.log(err)
                else res.send(result)
        })
}