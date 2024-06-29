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

app.post("/login", (req, res) => {
    const { name } = req.body;
    const { senha } = req.body;
    let sql = "call sp_funcionario_verificar(?,?)";
    
    db.query(sql, [name, senha], (err, result) => {
        if (err) console.log(err)
        else res.send(result)        
    })    
})

app.post("/pedidoinserir", (req, res) => {
    const { idGrupoPedido } = req.body;
    const { idProduto } = req.body;
    const { quantidade } = req.body;
    const { preco } = req.body;    

    let sql = "call sp_pedido_inserir(?,?,?,?)";
    
    db.query(sql, [idGrupoPedido, idProduto, quantidade, preco ], (err, result) => {
        if (err) console.log(err)
        else res.send(result)        
    })    
})


app.get("/grupopedidoinserir", (req, res) => {
    let sql = "call sp_GrupoPedido_Inserir";
    db.query(sql, (err, result) => {
        if(err) console.log(err)
        else res.send(result)
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
    const { realName } = req.body
    const { user } = req.body;
    const { senha } = req.body;
    let sql = "INSERT INTO funcionario(`nomeFuncionario`, `nomeUsuario`, `nomeSenha`) VALUES (?, ?, ?)";
    
    db.query(sql, [realName, user, senha], (err, result) => {
        if (err) console.log(err)
        else res.send(result)        
    })    
})





/*----------------------------------------------------*/ 

app.listen(3001, () => console.log('RODANDO SERVIDOR'))

/*----------------------------------------------------*/ 