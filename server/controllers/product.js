import { response } from 'express'

import { db } from '../db.js'

export const productRegister = (req, res) => {
    const { nomeProduto, quantidade, preco, idCategoria } = req.body;

    let insertSql = "INSERT INTO Produto (nomeProduto, idCategoria, quantidade, preco) VALUES (?, ?, ?, ?)";
    db.query(insertSql, [nomeProduto, idCategoria, quantidade, preco], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send({ message: "Erro ao registrar o produto." });
        }
        return res.status(201).send({ idProduto: result.insertId, produtoDuplicado: 0 });
    });
};

export const listaProduto = (req, res) => {
    let sql = `
        SELECT Produto.idProduto, Produto.nomeProduto, Produto.quantidade, Produto.preco, Categoria.nomeCategoria 
        FROM Produto 
        JOIN Categoria ON Produto.idCategoria = Categoria.idCategoria;
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ error: 'Erro ao consultar produtos.' });
        } else {
            res.send(result);
        }
    });
};


