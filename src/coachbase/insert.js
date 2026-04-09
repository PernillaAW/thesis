const fs = require('fs')
const csv = require('csv-parser');
const  { connectCouchbase } = require('./DBconnection');

/**This function set up the documents with in the collections unoptimized and optimized.
 * It will read cvs file row by row and turn it into a JSON object.
 * The documents will load to database in map structre (key, value).
 * It will load in batches of 1000 or less. 
 * @param {string} filePath - The path to the CSV file to read.
 * @param {number} [batchSize=1000] - The number of documents to insert per batch.
 */
async function couchbaseInsert(filePatch, batchSize = 1000) {
    const { cluster, unoptimizedCollection, optimizedCollection } = await connectCouchbase();
    let batchUnoptimized = [];
    let batchOptimized = [];
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

            if(batchUnoptimized.length >= batchSize) {
                const batchCopyUnoptimized = [...batchUnoptimized];
                const batchCopyOptimized = [...batchOptimized];
                batchUnoptimized = [];
                batchOptimized = [];
                fs.pause();
                Promise.all([
                    Promise.all(batchCopyUnoptimized.map(doc => unoptimizedCollection.upsert(doc.key, doc.value))),
                    Promise.all(batchCopyOptimized.map(doc => optimizedCollection.upsert(doc.key, doc.value)))    
                ]).then(() => {
                    fs.resume();
                });
                
            }
        })
        .on('end', async () => {
            if(batchUnoptimized.length > 0 ){
                await Promise.all([
                    Promise.all(batchUnoptimized.map(doc => unoptimizedCollection.upsert(doc.key, doc.value))),
                    Promise.all(batchOptimized.map(doc => optimizedCollection.upsert(doc.key, doc.value)))
                    
                ]);
            }
        });
}

module.exports = { couchbaseInsert };

insertFromCSV("");