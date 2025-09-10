import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

// Cache de pools de conexão para diferentes bancos de dados
const pools = {};

// Função para obter ou criar uma pool de conexão para um banco de dados específico
export async function conectDB(database) {
    if (!pools[database]) {
        const config = {
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            server: process.env.DB_HOST,
            port: Number(process.env.DB_PORT) || 1433, // 👈 agora dá pra configurar porta
            database: database,
            options: {
                encrypt: true,
                trustServerCertificate: true
            },
            pool: {
                max: 500,
                min: 0,
                idleTimeoutMillis: 30000
            }
        };

        pools[database] = new sql.ConnectionPool(config)
            .connect()
            .then(pool => {
                console.log(`Conectado ao banco: ${database}`);
                return pool;
            })
            .catch(err => {
                console.error('Erro ao conectar:', err);
            });
    }

    return pools[database];
}
