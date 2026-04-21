import { dbConnectionOracle } from "./DBConnection.js"
import fs from "fs";
import csv from "csv-parser";


class oracleModel{
    /**
    * Read full table from database
    * @param {table} table 
    */
    async readAll(table) {
        const dbconn = await dbConnectionOracle();
        const sql = `SELECT * FROM ${table}`;
        const result = await dbconn.execute(sql);
        return true;
    };
    /**
    * Searches table for partial results ~5%
    * @param {table} table 
    * @param {columnOne} columnOne for searching
    * @param {columnTwo} columnTwo for searching
    * @param {valueOne} valueOne specified for search
    * @param {valueTwo} valueTwo specified for search
    */
    async readPartial(table, columnOne, columnTwo, valueOne, valueTwo) {
        const dbconn = await dbConnectionOracle();
        const sql = `SELECT * FROM ${table} WHERE ${columnOne} = $1 AND ${columnTwo} = $2`;
        const arg = [valueOne, valueTwo];
        const result = await dbconn.execute(sql, arg);
        return true;
    };

    /**
    * Select single row based on id
    * @param {table} table 
    */
    async readOne(table) {
        const dbconn = await dbConnectionOracle();
        const sql = `SELECT * FROM ${table} WHERE id = 5000`
        const result = await dbconn.execute(sql)
        return true;
    }
    /**
    * Delete the table and release memory space.
    * @param {table} table 
    */
    async delete(table) {
        const dbconn = await dbConnectionOracle();
        const sql = `TRUNCATE TABLE ${table}`
        const result = await dbconn.execute(sql)
        return true;
    
    }
    async insert(path, table) {
        const dbconn = await dbConnectionOracle();
        const sql = `INSERT INTO ${table} (Severity, State, Precipitation, Windy, Start_Lng, Start_Lat, Start_time, End_time) VALUES (:Severity, :State, :Precipitation, :Windy, :Start_Lng, :Start_Lat, :Start_time, :End_time);`
        let bulk = [];
        const size = 1000000;
        
        return new Promise((resolve, reject)=>{
            fs.createReadStream("/data/dataTwentyFive.csv")
            .pipe(csv())
            .on("data", async (row)=>{
                bulk.push({
                    Severity:row.Severity,
                    State:row.State,
                    Precipitation:row.Precipitation,
                    Windy:row.Windy,
                    Start_Lng:row.Start_Lng,
                    Start_Lat:row.Start_Lat,
                    Start_time:row.Start_time,
                    End_time:row.End_time
                });
                if (bulk>= size){
                    const copyBulk = [...bulk];
                    bulk=[];
                    try{
                        await dbconn.executeMany(sql, copyBulk, {autoCommit:true})
                    }catch(e){
                        reject(e)
                    }
                }
            })
            .on("end", async()=>{
                try{
                    if (bulk.length > 0){
                        await dbconn.executeMany(sql, copyBulk, {autoCommit:true})
                    }
                    resolve(true);
                }catch(e){
                    reject(e);
                }
            })
            .on("error", reject);
        });
    }

}
export default oracleModel