import mysql from 'mysql2';
import dotenv from 'dotenv';



dotenv.config();

// Função para criar a conexão
export function conectDB(database){
    return mysql.createPool({
            connectionLimit: 500,
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: database // Ou process.env.DB_DATABASE para uso padrão
    });
}
