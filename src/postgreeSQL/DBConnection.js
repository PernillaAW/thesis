

const postgres = require(postgres);
require('dotenv').config()

async function connectPostgre() {
    const sql = postgres('postgres://username:password@host:port/database', {
        host: string = process.env.DB_GRE_HOST || 'localhost',
        user: string = process.env.DB_GRE_USER || 'postgres',
        password: string = process.env.DB_GRE_PASSWORD || 'root',
        database: string = process.env.DB_GRE_NAME || 'db-name',
        port: 5432
    })

    await sql.connect();
}

module.exports = { connectPostgre }


