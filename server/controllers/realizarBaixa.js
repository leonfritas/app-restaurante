import { response } from 'express';

import { db } from "../db.js";

export const realizarBaixa = (req, res) => {
    const { idGrupoPedido } = req.body;
    let sql = 'call sp_FinanceiroMovimento_RealizarBaixa(?)'

    db.query(sql, [idGrupoPedido], (err, result) => {
        if(err) return console.log(err);
        if (result) return console.log(result)
    })
}
