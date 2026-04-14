import postgis from "./DBConnection";


class postgisModel{
/**
 * Read full table from database
 * @param {table} table 
 */
async readAll(table) {
    const sql = `SELECT * FROM ${table}`
    const result = await postgis.query(sql)
};

/**
 * Searches table for partial results ~5%
 * @param {table} table 
 * @param {columnOne} columnOne for searching
 * @param {columnTwo} columnTwo for searching
 * @param {valueOne} valueOne specified for search
 * @param {valueTwo} valueTwo specified for search
 */
async readPartial(table, valueOne) {
    const sql = `SELECT * FROM ${table} WHERE point = $1`
    const arg = [valueOne]
    const result = await postgis.query(sql, arg)
};

/**
 * Select single row based on id
 * @param {table} table 
 */
async readOne(table) {
    const sql = `SELECT * FROM ${table} WHERE id = 5000`
    const result = await postgis.query(sql)
};

/**
 * Drop the full table
 * @param {table} table 
 */
async drop(table) {
    const sql = `DROP TABLE ${table}`
    const result = await postgis.query(sql)
};
/**
 * Insert the cvs file to database
 * @param {path} path to file
 * @param {table} table 
 */
async insert(path, table) {
    const copySQl = `COPY ${table}(severity, us_state, precipitation, windy, geo, start_time, end_time) 
    FROM $1 
    DELIMITER ',' 
    CSV HEADER)`;
    const arg = [path]
    await postgis.query(copySQl, arg)
    
} 
}

export default postgisModel