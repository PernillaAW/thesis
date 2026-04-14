import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();


/**
 * Connection to the postgre database
 */
    const connectPostgre = postgres({
        host: string = process.env.DB_GRE_HOST || 'localhost',
        user: string = process.env.DB_GRE_USER || 'postgres',
        password: string = process.env.DB_GRE_PASSWORD || 'root',
        database: string = process.env.DB_GRE_NAME || 'db-name',
        port: 5432
    })

    console.log("postgre connected run")



export default connectPostgre;


