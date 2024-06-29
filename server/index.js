const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const jwt = require('jsonwebtoken');


const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "01042018",
    database: "sistema"
});

app.use(cors());
app.use(express.json());

app.post("/register", (req, res) => {
    const { name } = req.body;
    const { cost } = req.body;
    const { category } = req.body;
    const { quantidade } = req.body;

    let sql = "insert into produto(nomeProduto, idCategoria, quantidade, preco)values(?,?,?,?)";

    db.query(sql, [name, cost, category, quantidade], (err, result) => {
        console.log(err)
    })
})

app.get("/getProduto", (req, res) => {
    let sql = "select * from produto";

    db.query(sql, (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })
})

app.get("/listar", (req, res) => {

    let sql = "select * from funcionario"

    db.query(sql, (err, result) => {
        if(err) console.log(err)
        else res.send(result)
    })
})

app.post("/cadastrar", (req, res) => {
    const { id, nome, usuario, senha, ativoAdministrador } = req.body;

    if (!nome || !usuario || !senha) {
        return res.status(400).send("Todos os campos são obrigatórios.");
    }

    let sql = "INSERT INTO funcionario(`idFuncionario`, `nomeFuncionario`, `nomeUsuario`, `nomeSenha`, `ativoAdministrador`) VALUES (?, ?, ?, ?, ?)";

    db.query(sql, [id, nome, usuario, senha, ativoAdministrador], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("Erro ao inserir dados no banco de dados.");
        } else {
            res.status(200).send("Dados inseridos com sucesso.");
        }
    });
});

app.get("/login", (req, res) => {
        const { name } = req.body;
        const { senha } = req.body;
    
    
        let sql = "call sp_funcionario_verificar(?,?)";
    
        db.query(sql, [name, senha], (err, result) => {
            if (err) console.log(err)
            else res.send(result)
        })
    })







app.listen(3001, ()=>{
    console.log('RODANDO SERVIDOR')
})
