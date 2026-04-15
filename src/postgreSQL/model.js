import { connectPostgre } from "./DBConnection.js";

class postgreModel{
    /**
    * Read full table from database
    * @param {table} table 
    */
    async readAll(table) {
        const sql = `SELECT * FROM ${table}`
        const result = await connectPostgre.query(sql)
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
        const sql = `SELECT * FROM ${table} WHERE ${columnOne} = $1 AND ${columnTwo} = $2`
        const arg = [valueOne, valueTwo]
        const result = await connectPostgre.query(sql, arg)
    };

    /**
    * Select single row based on id
    * @param {table} table 
    */
    async readOne(table) {
        const sql = `SELECT * FROM ${table} WHERE id = 5000`
        const result = await connectPostgre.query(sql)
    };

    /**
    * Drop the full table
    * @param {table} table 
    */
    async drop(table) {
        const sql = `DROP TABLE ${table}`
        const result = await connectPostgre.query(sql)
    }; 


    /**
    * Insert the cvs file to database
    * @param {path} path to file
    * @param {table} table 
    */
    async insert(path, table) {
        const copySQl = `COPY ${table}(Severity, State, Precipitation, Windy, Start_Lng, Start_Lat, Start_time, End_time)
        FROM $1 
        DELIMITER ',' 
        CSV HEADER)`;
        const arg = [path]
        await connectPostgre.query(copySQl, arg)
    }
}

export default postgreModel