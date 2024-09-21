import {response} from "express";
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

export const grupoPedidoSalvar = (req, res) => {
    const { idGrupoPedido } = req.body;
    const { nomeGrupoPedido } = req.body;
    const { idMesa } = req.body;
    const { textoObservacao } = req.body;
    const database = req.body.database;
    let sql = "call sp_grupoPedido_salvar(?,?,?,?)";
    
    executeQuery(database, sql, [idGrupoPedido, nomeGrupoPedido, idMesa, textoObservacao], res);        
}

export const grupoPedidoCancelar =  (req, res) => {
    const { idGrupoPedido } = req.body;
    const database = req.body.database;

    let sql = "call sp_GrupoPedido_Cancelar(?)";
    
    executeQuery(database, sql, [idGrupoPedido], res);           
}

export const grupoPedidoInserir = (req, res) => {
    const { idFuncionario } = req.body;
    const database = req.body.database;

    let sql = "call sp_GrupoPedido_Inserir(?)";

    executeQuery(database, sql, [idFuncionario], res); 
}

export const grupoPedidoListar = (req, res) => {
    const {dataEntrada, ativoPedidoPronto} = req.body;
    const database = req.body.database;

    let sql = "call sp_GrupoPedido_Listar(?)";

    executeQuery(database, sql, [dataEntrada, ativoPedidoPronto], res); 
}

export const grupoPedidoFinalizar = (req, res) => {
    const { idGrupoPedido } = req.body;
    const database = req.body.database;    

    let sql = "call sp_GrupoPedido_Finalizar(?)";
    
    executeQuery(database, sql, [idGrupoPedido], res);        
}

export const grupoPedidoEditar = (req, res) => {
    const { idGrupoPedido } = req.body;
    const database = req.body.database;

    let sql = "call sp_GrupoPedido_Editar(?)";
    
    executeQuery(database, sql, [idGrupoPedido], res);            
}

export const grupoPedidoListarProduto = (req, res) => {
    const { idGrupoPedido } = req.body;
    const database = req.body.database;

    let sql = "call sp_GrupoPedido_ListarProduto(?)";
    
    executeQuery(database, sql, [idGrupoPedido], res);           
}

export const grupoPedidoSaveObs = (req, res) => {
    const { idGrupoPedido } = req.body;
    const { observacao } = req.body;
    const database = req.body.database;

    let sql = "call sp_GrupoPedido_salvarObservacao(?,?)";
    
    executeQuery(database, sql, [idGrupoPedido, observacao], res);            
}