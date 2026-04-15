import { connectPostgre } from "./DBConnection.js";

class postgreModel{
    /**
    * Read full table from database
    * @param {table} table 
    */
    async readAll(table) {
        const client = await connectPostgre();
        const sql = `SELECT * FROM ${table}`
        const result = await client.query(sql)
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
        const client = await connectPostgre();
        const sql = `SELECT * FROM ${table} WHERE ${columnOne} = $1 AND ${columnTwo} = $2`
        const arg = [valueOne, valueTwo]
        const result = await client.query(sql, arg)
        return true;
    };

    /**
    * Select single row based on id
    * @param {table} table 
    */
    async readOne(table) {
        
        const client = await connectPostgre();
        const sql = `SELECT * FROM ${table} WHERE id = 5000`
        const result = await client.query(sql)
        return true;
    };

    /**
    * Drop the full table
    * @param {table} table 
    */
    async delete(table) {
        
        const client = await connectPostgre();
        const sql = `TRUNCATE TABLE ${table}` 
        const result = await client.query(sql)
        return true;
    }; 

    /**
    * Insert the cvs file to database
    * @param {path} path to file
    * @param {table} table 
    */
    async insert(path, table) {
        const client = await connectPostgre();
        const copySQl = `COPY ${table} (severity, state, precipitation, windy, Start_Lng, Start_Lat, start_time, end_time) 
          FROM '/data/dataTwentyFive.csv' 
          WITH (FORMAT csv, HEADER true)`;
        await client.query(copySQl, arg)
        return true;
    }
}

export default postgreModel