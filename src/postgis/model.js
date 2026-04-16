import { postgisconnect } from "./DBConnection.js";



class postgisModel{
    /**
    * Read full table from database
    * @param {table} table 
    */
    async readAll(table) {
        const { client, postgis } = await postgisconnect();
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
    async readPartialOP(table, valueOne) {
    
        const { client, postgis } = await postgisconnect();
        const sql = `SELECT * FROM ${table} WHERE point = $1`
        const arg = [valueOne]
        const result = await client.query(sql, arg)
        return true;
    };

    async readPartial(table, columnOne, columnTwo, valueOne, valueTwo) {
    
        const { client, postgis } = await postgisconnect();
        const sql = `SELECT * FROM ${table} WHERE ${columnOne} = $1 AND ${columnTwo}= $2`
        const arg = [valueOne, valueTwo]
        const result = await client.query(sql, arg)
        return true;
    };

    /**
    * Select single row based on id
    * @param {table} table 
    */
    async readOne(table) {
        const { client, postgis } = await postgisconnect();
        const sql = `SELECT * FROM ${table} WHERE id = 5000`
        const result = await client.query(sql)
        return true;
    };

    /**
    * Drop the full table
    * @param {table} table 
    */
    async delete(table) {
        const { client, postgis } = await postgisconnect();
        const sql = `TRANCATE TABLE ${table} RESTART IDENTITY`
        const result = await client.query(sql)
        return true;
    };

    /**
    * Insert the cvs file to database
    * @param {path} path to file
    * @param {table} table 
    */
    async insert(path, table) {
        const { client, postgis } = await postgisconnect();
        const copySQl = `COPY ${table}(Severity, State, Precipitation, Windy, Geo_text, Start_time, End_time) 
        FROM '/postgis/postgis.cvs 
        DELIMITER ',' 
        CSV HEADER`;
        await client.query(copySQl)
        await client.query(`UPDATE ${table} SET Geo = ST_GeomFromText(Geo_text, 4326)`);
        await client.query(`ALTER TABLE ${table} DEROP COLUMN Geo_text`)
    } 
}

export default postgisModel