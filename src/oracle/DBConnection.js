import OracleDB from "oracledb";
import dotenv from 'dotenv';

dotenv.config();


    const dbConnectionOracle = await OracleDB.getConnection({
            user: process.env.ORACLE_DATABASE_USER, 
            password: process.env.ORACLE_DATABASE_PASSWORD, 
            connectionString: process.env.ORACLE_DATABASE_CONNECTION
        }); 
    
    if(dbConnectionOracle.isHealthy()){
        console.log("Oracle is connected")
    }
    
export default dbConnectionOracle
