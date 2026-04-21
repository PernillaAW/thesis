import { connectPostgre } from "./DBConnection.js";

class postgreModel{
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
    console.log("readPart", result.rowCount)
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
    console.log("readOne", result.rowCount)
    return true;
};

/**
 * Drop the full table
 * @param {table} table 
 */
async delete(table) {
    const client = await connectPostgre();
    const sql = `TRUNCATE TABLE ${table} RESTART IDENTITY`
    const result = await client.query(sql);
    console.log("delete", result.rowCount)
    return true;
}; 


/**
 * Insert the cvs file to database
 * @param {path} path to file
 * @param {table} table 
 */
async insert(table) {
    const client = await connectPostgre();
    const copySQl = `COPY ${table} (Severity,State,Precipitation,Windy,Start_Lat,Start_Lng,Date,Time) 
    FROM '/data/dataTwentyFive.csv'
    WITH (FORMAT csv, HEADER true, DELIMITER ',' );`;
    const result = await client.query(copySQl);
    console.log("insert", result.rowCount)
    return true
}
}
export default postgreModel