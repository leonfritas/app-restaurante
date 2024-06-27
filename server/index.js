const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors")

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

app.listen(3001, ()=>{
    console.log('RODANDO SERVIDOR')
})
