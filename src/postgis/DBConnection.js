import postgres from 'postgres';
import dotenv from 'dotenv';
import Postgis from 'postgis';

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
    
    console.log("postGIS connected run")
/**
 * Updates to GIS extention
 */
    const postgis = new Postgis(connectPostgre)



export default postgis;