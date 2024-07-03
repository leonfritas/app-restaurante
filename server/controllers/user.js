import {response} from "express";
import { db } from '../db.js'

export const listar = (req, res) => {

    let sql = "select * from Funcionario"

    db.query(sql, (err, result) => {
        if(err) console.log(err)
        else res.send(result)
    })
}

export const cadastrar = (req, res) => {
    const { realName } = req.body
    const { user } = req.body;
    const { senha } = req.body;
    let sql = "call sp_Funcionario_Inserir (?, ?, ?)";
    
    db.query(sql, [realName, user, senha], (err, result) => {
        if (err) console.log(err)
        else res.send(result)        
    })    
    console.log(sql)
}

export const login =  (req, res) => {
    const { name } = req.body;
    const { senha } = req.body;
    let sql = "call sp_funcionario_verificar(?,?)";
    
    db.query(sql, [name, senha], (err, result) => {
        if (err) console.log(err)
        else res.send(result)        
    })    
}