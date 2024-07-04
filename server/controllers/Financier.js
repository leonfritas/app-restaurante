import { response } from 'express';

import { db } from "../db.js";

export const realizarBaixa = (req, res) => {
    const { idGrupoPedido } = req.body;
    let sql = 'call sp_FinanceiroMovimento_RealizarBaixa(?)'
    console.log(sql)
    db.query(sql, [idGrupoPedido], (err, result) => {
        if(err) console.log(err)
            else res.send(result)
    })
}
