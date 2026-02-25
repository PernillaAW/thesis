const couchbase = require("couchbase");
require('dotenv').config()

async function connectCouchbase() {
    const cluster = await couchbase.connect("couchbase://127.0.0.1", {
        username: process.env.COUCHBASE_ADMINISTRATOR_USERNAME,
        password: process.env.COUCHBASE_ADMINISTRATOR_PASSWORD

    });
    const unoptimizedBucket = cluster.bucket("unoptimized");
    const unoptimizedCollection = unoptimizedBucket.scope("_default").collection("unoptimizedCollection");

    const optimizedBucket = cluster.bucket("optimized");
    const optimizedCollection = optimizedBucket.scope("_default").collection("optimizedCollection");

    return { cluster, unoptimizedCollection, optimizedCollection }
}

module.exports = { connectCouchbase }