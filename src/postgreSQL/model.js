import connectPostgre from "./DBConnection";


/**
 * Read full table from database
 * @param {table} table 
 */
export async function fullRead(table) {
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
export async function fiveRead(table, columnOne, columnTwo, valueOne, valueTwo) {
    const sql = `SELECT * FROM ${table} WHERE ${columnOne} = $1 AND ${columnTwo} = $2`
    const arg = [valueOne, valueTwo]
    const result = await connectPostgre.query(sql, arg)
};

/**
 * Select single row based on id
 * @param {table} table 
 */
export async function singleRead(table) {
    const sql = `SELECT * FROM ${table} WHERE id = 5000`
    const result = await connectPostgre.query(sql)
};

/**
 * Drop the full table
 * @param {table} table 
 */
export async function deleteTable(table) {
    const sql = `DROP TABLE ${table}`
    const result = await connectPostgre.query(sql)
}; 