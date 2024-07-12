import { response } from 'express';

import { db } from "../db.js";

export const getTable = (req, res) => {
    
    let sql = 'call sp_Mesa_Disponivel'    
    db.query(sql, (err, result) => {
        if(err) console.log(err)
            else res.send(result)
    })
}
