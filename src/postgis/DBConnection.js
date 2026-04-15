import dotenv from 'dotenv';
import Postgis from 'postgis';
import { Client } from "pg";

dotenv.config();
/**
 * Connection to the postgre database
 */
export async function postgisconnect() {
    try{
        const client = new Client({
            host: 'postgis', 
            user: process.env.DB_USER  || 'postgres',
            password: process.env.DB_PASS || 'password',
            database: process.env.DB_DATABASE || 'db-dev_db',
            port: 5432
    });
        await client.connect();
        console.log("postGIS connected run")
    /**
    * Updates to GIS extention
    */
        const postgis = new Postgis(client);
        return { client, postgis }
    }catch(e){
        console.error("postGIS connection failed", e)
    }
    
}
