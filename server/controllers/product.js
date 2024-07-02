import { response } from 'express'

import { db } from '../db.js'

export const productRegister = (req, res) => {
    const { name } = req.body;
    const { cost } = req.body;
    const { category } = req.body;
    const { quantidade } = req.body;

    let sql = "insert into produto(nomeProduto, idCategoria, quantidade, preco)values(?,?,?,?)";

    db.query(sql, [name, cost, category, quantidade], (err, result) => {
        console.log(err)
    })
}

export const listaProduto = (req, res) => {

    let sql = "select * from produto"

    db.query(sql, (err, result) => {
        if(err) console.log(err)
        else res.send(result)
    })
    
}