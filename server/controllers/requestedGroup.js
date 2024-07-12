import {response} from "express";
import { db } from '../db.js'

export const grupoPedidoSalvar = (req, res) => {
    const { idGrupoPedido } = req.body;
    const { nomeGrupoPedido } = req.body;
    const { idMesa } = req.body;
    const { textoObservacao } = req.body;
    let sql = "call sp_grupoPedido_salvar(?,?,?,?)";
    
    db.query(sql, [idGrupoPedido, nomeGrupoPedido, idMesa, textoObservacao], (err, result) => {
        if (err) console.log(err)
        else res.send(result)        
    })        
}

export const grupoPedidoCancelar =  (req, res) => {
    const { idGrupoPedido } = req.body;

    let sql = "call sp_GrupoPedido_Cancelar(?)";
    
    db.query(sql, [idGrupoPedido], (err, result) => {
        if (err) console.log(err)
        else res.send(result)        
    })        
}

export const grupoPedidoInserir = (req, res) => {
    let sql = "call sp_GrupoPedido_Inserir";
    db.query(sql, (err, result) => {
        if(err) console.log(err)
        else res.send(result)
    })
}

export const grupoPedidoListar = (req, res) => {
    const {dataEntrada, ativoPedidoPronto} = req.body;
    let sql = "call sp_GrupoPedido_Listar(?)";

    db.query(sql, [dataEntrada, ativoPedidoPronto], (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })
}

export const grupoPedidoFinalizar = (req, res) => {
    const { idGrupoPedido } = req.body;

    let sql = "call sp_GrupoPedido_Finalizar(?)";
    
    db.query(sql, [idGrupoPedido], (err, result) => {
        if (err) console.log(err)
        else res.send(result)        
    })        
}

export const grupoPedidoEditar = (req, res) => {
    const { idGrupoPedido } = req.body;

    let sql = "call sp_GrupoPedido_Editar(?)";
    
    db.query(sql, [idGrupoPedido], (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    console.log(result)        
    })            
}

export const grupoPedidoListarProduto = (req, res) => {
    const { idGrupoPedido } = req.body;

    let sql = "call sp_GrupoPedido_ListarProduto(?)";
    
    db.query(sql, [idGrupoPedido], (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    console.log(result)        
    })    
    
    
}