const { connectCouchbase } = require("./DBconnection")


/**
 * This function setup the indexing for the different collections.
 * Unoptimised has primary index.
 * Optimised has primary index and seconder index on severity and us_state.
 */
async function couchbaseSetup() {
    const { cluster } = await connectCouchbase();

    await cluster.query(`CREATE PRIMARY INDEX IF NOT EXIST ON \`unoptimizedBucket\``);

    
    await cluster.query(`CREATE PRIMARY INDEX IF NOT EXIST ON \`optimizedBucket\``);
    await cluster.query(`CREATE INDEX IF NOT EXIST idx_severity_us_state ON \`optimizedBucket\`(severity, us_state) WHERE type = 'optimized'`);

}

module.exports = { couchbaseSetup };