import mysql from 'mysql'

export const db = mysql.createPool({
    host: '195.200.0.85',
    user: 'lasoftsolutions',
    password: 'la2024la!',
    database: 'dev'
});

    db.getConnection((err) => {
        if(err) {
            console.log("Erro ao conectar ao banco de dados", err);
            return;
        }
        console.log("Sucesso, conectado ao banco!")
    })

