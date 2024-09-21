import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

export const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});


db.getConnection((err) => {
    if (err) {
        console.log("Erro ao conectar ao banco de dados", err);
        return;
    }
    console.log("Sucesso, conectado ao banco!");
});
