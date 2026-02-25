const { connectCouchbase } = require("./DBconnection")

async function couchbaseSetup() {
    const { cluster } = await connectCouchbase();

    await cluster.query(`CREATE PRIMARY INDEX IF NOT EXIST ON \`unoptimizedBucket\``);

    await cluster.query(`CREATE INDEX IF NOT EXIST idx_severity_us_state ON \`unoptimizedBucket\`(severity, us_state) WHERE type = 'unoptimized'`);

}

module.exports = { couchbaseSetup };