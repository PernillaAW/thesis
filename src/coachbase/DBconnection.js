import { connect } from "couchbase";
import dotenv from 'dotenv';

dotenv.config();

/**
 * This function connects to the database and creates the intial buckets.
 * @returns {cluster, unoptimizedCollection, optimizedCollection}
 */
let cached = null;


export async function getCouchbase() {

    const cluster = await connect("couchbase://couchbase", {
        username: process.env.COUCHBASE_ADMINISTRATOR_USERNAME,
        password: process.env.COUCHBASE_ADMINISTRATOR_PASSWORD,
        timeouts: {
            kvTimeout: 60000,
            queryTimeout: 60000,
            connectTimeout: 60000
        }
    });

    await waitForCouchbase(cluster);

    const optimizedCollection = cluster
        .bucket("optimized")
        .defaultCollection();

    cached = { cluster, optimizedCollection };

    return cached;
}

async function waitForCouchbase(cluster) {
    let tries = 20;

    while (tries > 0) {
        try {
            await cluster.query("SELECT 1;");
            console.log("Couchbase Query service is ready");
            return;
        } catch (e) {
            console.log("Waiting for Couchbase Query service...");
            tries--;
            await new Promise(res => setTimeout(res, 2000));
        }
    }
}
