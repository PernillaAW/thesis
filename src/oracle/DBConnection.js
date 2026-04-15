import OracleDB from "oracledb";
import dotenv from 'dotenv';

dotenv.config();

export async function dbConnectionOracle() {
    
    try{
        const dbConnectionOracle = await OracleDB.getConnection({
            user: process.env.ORACLE_DATABASE_USER, 
            password: process.env.ORACLE_DATABASE_PASSWORD, 
            connectionString: process.env.ORACLE_DATABASE_CONNECTION
        }); 
    
    if(dbConnectionOracle.isHealthy()){
        console.log("Oracle is connected")
    }
}catch(e){
    console.error("error with oracle connection", e)
}
}    

