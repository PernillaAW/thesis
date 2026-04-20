import { getCouchbase } from "./DBconnection.js";
import fs from 'fs';
import csv from 'csv-parser';

const { cluster, unoptimzedCollection, optimizedCollection } = await getCouchbase()


class couchbaseModel{

    /**
    * Read all the data from collection.
    * @param {collection} collection 
    * @returns 
    */
    async readAll(collection) {
        const { cluster } = await getCouchbase();
        const sql = `SELECT b.* FROM \`${collection}\` b`;
        await cluster.query(`
    SELECT 1 FROM system:indexes 
    WHERE keyspace_id = "${collection}" 
    AND state = "online"
`);
        const result = await cluster.query(sql, {timeout: 60000})
        console.log(result.rows[1])
        return;
    }
    /**
    * Vertical search one row
    * @param {collection} collection 
    * @returns 
    */
    async readOne(collection) {
        const { cluster } = await getCouchbase();
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
    async readPartial(collection, columnOne, columnTwo, valueOne, valueTwo) {
        const { cluster } = await getCouchbase();
        const sql = `SELECT * FROM \`${collection}\` WHERE \`${columnOne}\` = $columnOne AND \`${columnTwo}\` = $columnTwo`;
        const options = { parameters: { [columnOne]: valueOne , [columnTwo]: valueTwo } }
        const result = await cluster.query(sql, options)
        return;
    }
    /**
    * Drop the full collection.
    * @param {collection} collection 
    * @returns 
    */
    async drop(collection) {
        const { cluster } = await getCouchbase();
        const sql = `DROP COLLECTION \`${collection}\``;
        const result = await cluster.query(sql)
        return;
    }

    /**This function set up the documents with in the collections unoptimized.
    * It will read cvs file row by row and turn it into a JSON object.
    * The documents will load to database in map structre (key, value).
    * It will load in batches of 1000 or less. 
    * @param {string} filePath - The path to the CSV file to read.
    * @param {number} [batchSize=1000] - The number of documents to insert per batch.
    */
    async couchbaseUnoptimizedInsert(batchSize = 1000) {
        let batchUnoptimized = [];
        let count = 0;
        const { unoptimzedCollection } = await getCouchbase(); 
        fs.createReadStream("/data/dataTwentyFive.csv")
            .pipe(csv())
            .on('data', (row) => {
                const unoptimized = {
                    type: 'unoptimized',
                    id: `${count}`,
                    Severity: row.Severity,
                    State: row.State,
                    Precipitation: row.Precipitation,
                    Windy: row.Windy,
                    Start_Lng: row.Start_Lng,
                    Start_Lat: row.Start_Lat,
                    Start_time: row.Start_time,
                    End_time: row.End_time
                };
                batchUnoptimized.push({key:unoptimized.id, value: unoptimized })

                count++;

                if(batchUnoptimized.length >= batchSize) {
                    const batchCopyUnoptimized = [...batchUnoptimized];
                    batchUnoptimized = [];
                    fs.pause();
                    Promise.all([
                        Promise.all(batchCopyUnoptimized.map(doc => unoptimzedCollection.upsert(doc.key, doc.value))),
                    ]).then(() => {
                        fs.resume();
                    });   
                }
            })
            .on('end', async () => {
                if(batchUnoptimized.length > 0 ){
                    await Promise.all([
                        Promise.all(batchUnoptimized.map(doc => unoptimzedCollection.upsert(doc.key, doc.value)))
                    ]);
                }
            });
        }
    /**This function set up the documents with in the collections optimized.
     * It will read cvs file row by row and turn it into a JSON object.
     * The documents will load to database in map structre (key, value).
     * It will load in batches of 1000 or less. 
     * @param {string} filePath - The path to the CSV file to read.
     * @param {number} [batchSize=1000] - The number of documents to insert per batch.
     */



    async couchbaseOptimizedInsert(batchSize = 50000) {
        let batchOptimized = [];
        console.log("models");
        const { optimizedCollection } = await getCouchbase(); 
        let count = 0;

        return new Promise((resolve, reject) => {
            console.log("start of promise")
            const stream = fs.createReadStream("/data/dataTwentyFive.csv").pipe(csv());


            stream.on('data', async (row) => {
                
                const optimized = {
                    id: `${count}`,
                    Severity: row.Severity,
                    State: row.State,
                    Precipitation: row.Precipitation,
                    Windy: row.Windy,
                    Start_Lng: row.Start_Lng,
                    Start_Lat: row.Start_Lat,
                    Date: row.Date,
                    Time: row.Time
                };

                batchOptimized.push({ key: optimized.id, value: optimized });
                count++;

                if (batchOptimized.length >= batchSize) {
                    console.log("stream - batch")
                    const batchCopy = [...batchOptimized];
                    batchOptimized = [];

                    stream.pause();

                    try {
                        await Promise.all(
                            batchCopy.map(doc =>
                                optimizedCollection.upsert(doc.key, doc.value, {
                                    timeout: 30000
                                })
                            )
                        );

                        stream.resume();
                    } catch (e) {
                        stream.destroy();
                        reject(e);
                    }
                }
            });

            stream.on("end", async () => {
                try {
                    if (batchOptimized.length > 0) {
                        console.log("on end")
                        await Promise.all(
                            batchOptimized.map(doc =>
                                optimizedCollection.upsert(doc.key, doc.value)
                            )
                        );
                    }
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });

            stream.on("error", reject);
        });
    }
    async waitForCouchbase(cluster) {
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
          
}

             
    


export default couchbaseModel