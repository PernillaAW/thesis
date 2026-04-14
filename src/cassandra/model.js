import connect from "./DBConnection.js"


class cassandraModel{
/**
 * Read full table from database
 * @param {table} table 
 */
async readAll(table) {
    const sql = `SELECT * FROM ${table}`;
    const result = await connect.execute(sql);
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
    const sql = `SELECT * FROM ${table} WHERE ${columnOne} = ? AND ${columnTwo} = ?`;
    const arg = [valueOne, valueTwo];
    const result = await connect.execute(sql, arg);
};

/**
 * Select single row based on id
 * @param {table} table 
 */
async readOne(table) {
    const sql = `SELECT * FROM ${table} WHERE id = 5000`
    const result = await connect.execute(sql)
    
}
/**
 * Delete the table and release memory space.
 * @param {table} table 
 */
async dropTable(table) {
    const sql = `DROP TABLE ${table}`
    const result = await connect.execute(sql);
}
/**
 * Insert the cvs file to database
 * @param {path} path to file
 * @param {table} table 
 */
async insert(path, table) {
    const copySQl = `COPY ${table}(severity, us_state, precipitation, windy, longitude, latitude, start_time, end_time) 
    FROM $1 
    DELIMITER ',' 
    CSV HEADER)`;
    const arg = [path];

    await client.execute(copySQl, arg);
}

}

export default cassandraModel