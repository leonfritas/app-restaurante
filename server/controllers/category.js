import { db } from "../db.js";

export const getCategory = (req, res) => {
    
    let sql = 'select * from Categoria'    
    console.log(sql)
    db.query(sql, (err, result) => {
        if(err) console.log(err)
            else res.send(result)
    })
}


