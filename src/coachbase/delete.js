const { connectCouchbase } = require("./DBconnection")

const { cluster, unoptimzedCollection, optimizedCollection } = connectCouchbase

/**
 * Drop the full collection.
 * @param {collection} collection 
 * @returns 
 */
async function dropall(collection) {
    const sql = `DROP COLLECTION \`${collection}\``;
    const result = await cluster.query(sql)
    return;
}
