import { postgisconnect } from "./DBConnection.js";



class postgisModel{
    /**
    * Read full table from database
    * @param {table} table 
    */
    async readAll(table) {
    const client = await connectPostgre();
    const sql = `SELECT * FROM ${table}`
    await client.query(sql);
    console.log("READ ALL")
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
        const sql = `SELECT * FROM ${table} WHERE geo && ST_MakeEnvelope($1, $2, $3, $4, 4326)`;
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
    async insert(table, path) {
        const client = await connectPostgre();
        const copySQl = `COPY ${table} (Severity,State,Precipitation,Windy,Start_Lat,Start_Lng,Date,Time) 
        FROM '/data/${path}.csv'
        WITH (FORMAT csv, HEADER true, DELIMITER ',' )`;
        const result = await client.query(copySQl);
        console.log("insert", result.rowCount)
        return true
    }

        /**
    * Insert the cvs file to database
    * @param {path} path to file
    * @param {table} table 
    */
    async insertOptimised(table, path) {
        const { client, postgis } = await postgisconnect();
        const copySQl = `COPY optimized_scarp(Severity, State, Precipitation, Windy, Geo_text, Start_time, End_time) 
        FROM '/data/postgis.csv'
        DELIMITER ',' 
        CSV HEADER`;
        const res = await client.query(copySQl)

        const copyScrap = `INSERT INTO optimized (Severity, State, Precipitation, Windy, Geo, Start_time, End_time)
        SELECT Severity::integer, State, Precipitation::float, Windy::boolean, ST_GeomFromText(Geo_text, 4326), Start_time::timestamp, End_time::timestamp
        FROM optimized_scarp;`

        const result = await client.query(copyScrap)
        console.log("insert", result.rowCount)
        return true
    } 

    async dropScrap(){
        const { client, postgis } = await postgisconnect();
        const sql = `TRUNCATE TABLE optimized_scarp`
        const res = client.query(sql)
        return true
    }
}

export default postgisModel