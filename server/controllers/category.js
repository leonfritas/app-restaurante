import { db } from "../db.js";

export const getCategory = (req, res) => {
    
    let sql = 'select * from Categoria'        
    db.query(sql, (err, result) => {
        if(err) console.log(err)
            else res.send(result)
    })
}

export const categoryRegister = (req, res) => {
    const { nomeCategoria } = req.body;

        let insertSql = "INSERT INTO dev.Categoria(nomeCategoria) VALUES (?)";
        db.query(insertSql, [nomeCategoria], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ message: "Erro ao registrar Categoria." });
            }
        });
    };

export const filterByCategory = (req, res) => {
    const { idCategory } = req.body;
    const { idGrupoPedido } = req.body;

    let sql = 'call sp_ProdutoCategoria_Selecionar(?, ?)'    

    db.query(sql, [idCategory, idGrupoPedido],(err, result) => {
        if(err) console.log(err)
            else res.send(result)
    })
}


