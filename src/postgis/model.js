import { postgisconnect } from "./DBConnection.js";



class postgisModel{
    /**
    * Read full table from database
    * @param {table} table 
    */
    async readAll(table) {
        const { client, postgis } = await postgisconnect();
        let lastId = 0;
        let rows;

        do {
            rows = await client.query(
                `SELECT FROM ${table} WHERE id > $1 ORDER BY id LIMIT 5000`,
                [lastId]
            );
            if (rows.rows.length > 0) {
                lastId = rows.rows[rows.rows.length - 1].id;
            }

        } while (rows.rows.length > 0);

        console.log("ALL", lastId)
        return true;
    }


    async readPartial(table, columnOne, columnTwo, valueOne, valueTwo) {
    
        const { client, postgis } = await postgisconnect();
        const sql = `SELECT * FROM ${table} WHERE ${columnOne} = $1 AND ${columnTwo}= $2`
        const arg = [valueOne, valueTwo]
        const result = await client.query(sql, arg)
        console.log("PART", result.rowCount)
        return true;
    };


    async readPartialOP(table, min_lon, min_lat, max_lon, max_lat) {

        const { client, postgis } = await postgisconnect();
        const sql = `SELECT * FROM ${table} WHERE geom && ST_MakeEnvelope($1, $2, $3, $4, 4326)`;
        const arg = [min_lon, min_lat, max_lon, max_lat,]
        const result = await client.query(sql, arg)
        console.log("PART", result.rowCount)
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
        console.log("ONE", result.rowCount)
        return true;
    };

    /**
    * Drop the full table
    * @param {table} table 
    */
    async delete(table) {
        console.log(table);
        const { client, postgis } = await postgisconnect();
        const sql = `TRUNCATE TABLE ${table} RESTART IDENTITY`
        const result = await client.query(sql)
        console.log("DELETE", result)
        return true;
    };

    /**
    * Insert the cvs file to database
    * @param {path} path to file
    * @param {table} table 
    */
    async insert(table) {
        const { client, postgis } = await postgisconnect();
        const copySQl = `COPY ${table}(Severity, State, Precipitation, Windy, Geo_text, Start_time, End_time) 
        FROM '/data/postgis.csv'
        DELIMITER ',' 
        CSV HEADER`;
        await client.query(copySQl)
        //await client.query(`UPDATE ${table} SET Geo = ST_GeomFromText(Geo_text, 4326)`);
        //await client.query(`ALTER TABLE ${table} DROP COLUMN Geo_text`)
    } 
}

export default postgisModel