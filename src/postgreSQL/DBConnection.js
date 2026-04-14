import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();


/**
 * Connection to the postgre database
 */
    const connectPostgre = postgres({
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'password',
        database: process.env.POSTGRES_DB || 'dev_db',
        port: 5432
    })

    console.log("postgre connected run")



export default connectPostgre;


