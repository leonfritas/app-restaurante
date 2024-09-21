import { conectDB } from '../db.js';


function executeQuery(database, sql, params, res) {
    const db = conectDB(database); 

    db.query(sql, params, (err, result) => {
        if (err) {
            console.log('chegou aqui');
            console.log(err);
            res.status(500).send('Erro ao executar a query');
        } else {
            res.send(result);
        }
    });
}

export const getCategory = (req, res) => {
    const database = req.body.database;
    let sql = 'select * from Categoria'        
    executeQuery(database, sql, [], res);
}

export const filterByCategory = (req, res) => {
    const { idCategory } = req.body;
    const { idGrupoPedido } = req.body;
    const database = req.body.database;
    let sql = 'call sp_ProdutoCategoria_Selecionar(?, ?)'    

    executeQuery(database, sql, [idCategory, idGrupoPedido], res);
}


