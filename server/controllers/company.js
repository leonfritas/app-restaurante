import { conectDB } from '../db.js';


function executeQuery(database, sql, params, res) {
    const db = conectDB(database);    
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Erro ao obter conexão:', err);
            res.status(500).send('Erro ao obter a conexão');
            return;
        } 
                
        connection.query(sql, params, (err, result) => {
            
            connection.release();
            if (err) {
                console.log(err);
                res.status(500).send('Erro ao executar a query');
            } else {
                res.send(result);
            }            
        });
    })
}

export const getCompany = (req, res) => {
    const { idEmpresa } = req.body;
    const database = req.body.database;
    let sql = 'call sp_Empresa_Selecionar(?)'        
    executeQuery(database, sql, [idEmpresa], res);
}