import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();


/**
 * Connection to the postgre database
 */
    const connectPostgre = postgres({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'root',
        database: process.env.POSTGRES_DB || 'db-name',
        port: 5432
    })

    console.log("postgre connected run")



export default connectPostgre;


