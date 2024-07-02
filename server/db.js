import mysql from 'mysql'

export const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "01042018",
    database: "sistema"
});