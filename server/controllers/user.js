import { response } from "express";
import { conectDB } from '../db.js';


function executeQuery(database, sql, params, res) {
    const db = conectDB(database);    
    
    db.query(sql, params, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Erro ao executar a query');
        } else {
            res.send(result);
        }
    });
}

export const login = (req, res) => {
    const { name } = req.body;
    const { senha } = req.body; 
    const database = req.body.database;

    let sql = "CALL sp_funcionario_verificar(?, ?)";

    executeQuery(database, sql, [name, senha], res);
}

export const listar = (req, res) => {
    const database = req.body.database; 

    let sql = "SELECT * FROM Funcionario";

    executeQuery(database, sql, [], res);
}

export const cadastrar = (req, res) => {
    const { realName, userName, senha, cpf, checkAdmin, userCheck } = req.body; // Inclua 'database' se for dinâmico
    const ativoAdminValue = checkAdmin ? 1 : 0;
    const ativoFuncionarioValue = userCheck ? 1 : 0;
    const database = req.body.database;

    let sql = "CALL sp_Funcionario_Inserir (?, ?, ?, ?, ?, ?)";

    executeQuery(database, sql, [realName, userName, senha, cpf, ativoAdminValue, ativoFuncionarioValue], res);
}

export const deleteUser = (req, res) => {
    const { id } = req.params;
    const database = req.body.database;

    let sql = 'CALL sp_Funcionario_Cancelar(?);';
    executeQuery(database, sql, [id], res);
}
