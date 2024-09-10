import mysql from 'mysql'

export const db = mysql.createPool({
    host: '195.200.0.85',
    user: 'dev',
    password: 'spsx68EBsnND3iFL',
    database: 'dev'
});

