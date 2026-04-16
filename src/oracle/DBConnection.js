import OracleDB from "oracledb";
import dotenv from 'dotenv';

dotenv.config();

export async function dbConnectionOracle() {
    
    try{
        const dbConnectionOracle = await OracleDB.getConnection({
            user: process.env.APP_USER, 
            password: process.env.APP_USER_PASSWORD, 
            connectionString: process.env.ORACLE_CONNECTION
        }); 
    
    return dbConnectionOracle;
}catch(e){
    console.error("error with oracle connection", e)
}
}    

