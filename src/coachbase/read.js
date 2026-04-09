const { connectCouchbase } = require("./DBconnection")

const { cluster, unoptimzedCollection, optimizedCollection } = connectCouchbase

/**
 * Read all the data from collection.
 * @param {collection} collection 
 * @returns 
 */
async function readAll(collection) {
    const sql = `SELECT * FROM \`${collection}\``;
    const result = await cluster.query(sql)
    return;
}
/**
 * Vertical search one row
 * @param {collection} collection 
 * @returns 
 */
async function readOne(collection) {
    const sql = `SELECT * FROM \`${collection}\` USE KEY "5000"`;
    const result = await cluster.query(sql)
    return;
}

/**
 * Partical search of database ~ 5%
 * @param {collection} collection 
 * @param {severity} sev 
 * @param {us state} state 
 * @returns 
 */
async function readPart(collection, sev, state) {
    const sql = `SELECT * FROM \`${collection}\` WHERE severity = $severity AND us_state = $us_state`;
    const options = { parameters: { severity: sev, us_state: state } }
    const result = await cluster.query(sql, options)
    return;
    
}