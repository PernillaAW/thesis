import connectPostgre from "./DBConnection";

export async function fullRead(table) {
    const sql = `SELECT * FROM ${table}`
    const result = await connectPostgre.query(sql)
};

export async function fiveRead(table, columnOne, columnTwo, valueOne, valueTwo) {
    const sql = `SELECT * FROM ${table} WHERE ${columnOne} = $1 AND ${columnTwo} = $2`
    const arg = [valueOne, valueTwo]
    const result = await connectPostgre.query(sql, arg)
};

export async function singleRead(table) {
    const sql = `SELECT * FROM ${table} WHERE id = 5000`
    const result = await connectPostgre.query(sql)
};

export async function deleteTable(table) {
    const sql = `DROP TABLE ${table}`
    const result = await connectPostgre.query(sql)
}; 