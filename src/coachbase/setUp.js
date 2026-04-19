import { getCouchbase } from "./DBconnection.js"


/**
 * This function setup the indexing for the different collections.
 * Unoptimised has primary index.
 * Optimised has primary index and seconder index on severity and us_state.
 */
export async function couchbaseSetup() {
    const { cluster } = await getCouchbase();

    await waitForCouchbase(cluster);

    await cluster.query("CREATE PRIMARY INDEX  IF NOT EXISTS ON unoptimized");

    
    await cluster.query(`CREATE PRIMARY INDEX IF NOT EXISTS ON \`optimized\``);
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

    throw new Error("Couchbase never became ready");
}
