import { connectCouchbase } from "./DBconnection.js"


/**
 * This function setup the indexing for the different collections.
 * Unoptimised has primary index.
 * Optimised has primary index and seconder index on severity and us_state.
 */
export async function couchbaseSetup() {
    const { cluster } = await connectCouchbase();

    await cluster.query(`CREATE PRIMARY INDEX IF NOT EXIST ON \`unoptimizedBucket\``);

    
    await cluster.query(`CREATE PRIMARY INDEX IF NOT EXISTS ON \`optimizedBucket\``);

    await cluster.query(`CREATE INDEX idx_Severity_State ON \`optimizedBucket\`(\`Severity\`, \`State\`) WHERE \`type\` = "optimized"`);
}

