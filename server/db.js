import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// Cache de pools de conexões para diferentes bancos de dados
const pools = {};

// Função para obter ou criar uma pool de conexão para um banco de dados específico
export function conectDB(database) {
    if (!pools[database]) {
        pools[database] = mysql.createPool({
            connectionLimit: 500,
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: database // Define dinamicamente o banco de dados
        });
    }
    return pools[database]; // Retorna a pool do banco de dados solicitado
}
