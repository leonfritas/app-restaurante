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
    const { realName, userName, senha, cpf, checkAdmin, userCheck } = req.body;
    const ativoAdminValue = checkAdmin ? 1 : 0;
    const ativoFuncionarioValue = userCheck ? 1 : 0

    let sql = "CALL sp_Funcionario_Inserir (?, ?, ?, ?, ?, ?)";

    db.query(sql, [realName, userName, senha, cpf, ativoAdminValue, ativoFuncionarioValue], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Erro ao tentar cadastrar funcionário.');
        } else {
            res.status(200).json(result);
        }
    });

    console.log(sql);
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