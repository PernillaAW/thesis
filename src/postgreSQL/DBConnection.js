import { Client } from 'pg';
import dotenv from 'dotenv';


dotenv.config();


/**
 * Connection to the postgre database
 */
export async function connectPostgre() {
    try{
        const client = new Client({
            host: process.env.DB_HOST || 'postgres',
            user: process.env.DB_USER || 'postgres',
            password: process.env.POSTGRES_PASSWORD || 'password',
            database: process.env.POSTGRES_DB || 'dev_db',
            port: 5432
        })
        await client.connect();
        console.log("connect to post..")
        return client;
    }catch(e){
        console.error("error with postgre connection", e)
    }  
}



