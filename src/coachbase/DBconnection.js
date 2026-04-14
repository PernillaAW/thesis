import couchbase from "couchbase";
import dotenv from 'dotenv';

dotenv.config();

/**
 * This function connects to the database and creates the intial buckets.
 * @returns {cluster, unoptimizedCollection, optimizedCollection}
 */
export async function connectCouchbase() {
    const cluster = await couchbase.connect("couchbase://127.0.0.1", {
        username: process.env.COUCHBASE_ADMINISTRATOR_USERNAME,
        password: process.env.COUCHBASE_ADMINISTRATOR_PASSWORD

    }).then(()=>{console.log("couchbase connected")});
    
    const unoptimizedBucket = cluster.bucket("unoptimized");
    const unoptimizedCollection = unoptimizedBucket.scope("_default").collection("unoptimizedCollection");

    const optimizedBucket = cluster.bucket("optimized");
    const optimizedCollection = optimizedBucket.scope("_default").collection("optimizedCollection");

    return { cluster, unoptimizedCollection, optimizedCollection }
}

