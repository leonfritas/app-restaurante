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

app.post("/grupopedidosalvar", (req, res) => {
    const { idGrupoPedido } = req.body;
    const { nomeGrupoPedido } = req.body;
    let sql = "call sp_grupoPedido_salvar(?,?)";
    
    db.query(sql, [idGrupoPedido, nomeGrupoPedido], (err, result) => {
        if (err) console.log(err)
        else res.send(result)        
    })    
    console.log(sql)
});

app.post("/grupopedidocancelar", (req, res) => {
    const { idGrupoPedido } = req.body;

    let sql = "call sp_grupoPedido_cancelar(?)";
    
    db.query(sql, [idGrupoPedido], (err, result) => {
        if (err) console.log(err)
        else res.send(result)        
    })    
    console.log(sql)
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

app.post("/pedidoexcluir", (req, res) => {
    const { idGrupoPedido } = req.body;
    const { idProduto } = req.body; 

    let sql = "call sp_pedido_excluir(?,?)";
    
    db.query(sql, [idGrupoPedido, idProduto], (err, result) => {
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
    let sql = "call sp_Funcionario_Inserir (?, ?, ?)";
    
    db.query(sql, [realName, user, senha], (err, result) => {
        if (err) console.log(err)
        else res.send(result)        
    })    
    console.log(sql)
})

app.post("/grupopedidolistar", (req, res) => {
    const {dataEntrada} = req.body;
    let sql = "call sp_GrupoPedido_Listar(?)";

    db.query(sql,[dataEntrada], (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })
})

app.post("/grupopedidofinalizar", (req, res) => {
    const { idGrupoPedido } = req.body;

    let sql = "call sp_grupoPedido_finalizar(?)";
    
    db.query(sql, [idGrupoPedido], (err, result) => {
        if (err) console.log(err)
        else res.send(result)        
    })    
    console.log(sql)
})

app.post("/realizarbaixa", (req, res) => {
    const { idGrupoPedido } = req.body;

    let sql = "call sp_FinanceiroMovimento_RealizarBaixa(?)";
    
    db.query(sql, [idGrupoPedido], (err, result) => {
        if (err) console.log(err)
        else res.send(result)        
    })    
    console.log(sql)
})

app.post("/realizarbaixa", (req, res) => {
    const { idGrupoPedido } = req.body;

    let sql = "call sp_FinanceiroMovimento_RealizarBaixa(?)";
    
    db.query(sql, [idGrupoPedido], (err, result) => {
        if (err) console.log(err)
        else res.send(result)        
    })    
    console.log(sql)
})




/*----------------------------------------------------*/ 

app.listen(3001, () => console.log('RODANDO SERVIDOR'))

/*----------------------------------------------------*/ 