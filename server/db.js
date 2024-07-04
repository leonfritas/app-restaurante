import mysql from 'mysql'

export const db = mysql.createPool({
    host: 'apprestaurante.cno0wseamf91.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: '2Cerva1camarao.',
    database: 'AppDeskRestaurante'
});

