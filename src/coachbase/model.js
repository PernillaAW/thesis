import { connectCouchbase } from "./DBconnection";
import fs from 'fs';
import csv from 'csv-parser';

const { cluster, unoptimzedCollection, optimizedCollection } = connectCouchbase


class couchbaseModel{

/**
 * Read all the data from collection.
 * @param {collection} collection 
 * @returns 
 */
async readAll(collection) {
    const sql = `SELECT * FROM \`${collection}\``;
    const result = await cluster.query(sql)
    return;
}
/**
 * Vertical search one row
 * @param {collection} collection 
 * @returns 
 */
async readOne(collection) {
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
async readPartial(collection, sev, state) {
    const sql = `SELECT * FROM \`${collection}\` WHERE severity = $severity AND us_state = $us_state`;
    const options = { parameters: { severity: sev, us_state: state } }
    const result = await cluster.query(sql, options)
    return;
    
}
/**
 * Drop the full collection.
 * @param {collection} collection 
 * @returns 
 */
async drop(collection) {
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
async couchbaseUnoptimizedInsert(filePatch, batchSize = 1000) {
    const { unoptimizedCollection } = await connectCouchbase();
    let batchUnoptimized = [];
    let count = 0;

    fs.createReadStream(filePatch)
        .pipe(csv())
        .on('data', (row) => {
            const unoptimized = {
                type: 'unoptimized',
                id: `${count}`,
                severity: row.severity,
                us_state: row.us_state,
                precipitation: row.precipitation,
                windy: row.windy,
                longitude: row.longitude,
                latitude: row.latitude,
                start_time: row.start_time,
                end_time: row.end_time

            };
            batchUnoptimized.push({key:unoptimized.id, value: unoptimized })

            count++;

            if(batchUnoptimized.length >= batchSize) {
                const batchCopyUnoptimized = [...batchUnoptimized];
                batchUnoptimized = [];
                fs.pause();
                Promise.all([
                    Promise.all(batchCopyUnoptimized.map(doc => unoptimizedCollection.upsert(doc.key, doc.value))),
                ]).then(() => {
                    fs.resume();
                });
                
            }
        })
        .on('end', async () => {
            if(batchUnoptimized.length > 0 ){
                await Promise.all([
                    Promise.all(batchUnoptimized.map(doc => unoptimizedCollection.upsert(doc.key, doc.value)))
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
async couchbaseOptimizedInsert(filePatch, batchSize = 1000) {
    const { optimizedCollection } = await connectCouchbase();
    let batchOptimized = [];
    let count = 0;

    fs.createReadStream(filePatch)
        .pipe(csv())
        .on('data', (row) => {
        
            const optimized = {
                type: 'optimized',
                id: `${count}`,
                severity: row.severity,
                us_state: row.us_state,
                precipitation: row.precipitation,
                windy: row.windy,
                longitude: row.longitude,
                latitude: row.latitude,
                start_time: row.start_time,
                end_time: row.end_time
            };

            batchOptimized.push({key:optimized.id, value: optimized })
            
            count++;

            if(batchOptimized.length >= batchSize) {
                const batchCopyOptimized = [...batchOptimized];
                batchOptimized = [];
                fs.pause();
                Promise.all([
                    Promise.all(batchCopyOptimized.map(doc => optimizedCollection.upsert(doc.key, doc.value)))    
                ]).then(() => {
                    fs.resume();
                });
                
            }
        })
        .on('end', async () => {
            if(batchOptimized.length > 0 ){
                await Promise.all([
                    Promise.all(batchOptimized.map(doc => optimizedCollection.upsert(doc.key, doc.value)))
                    
                ]);
            }
        });
}

}

export default couchbaseModel