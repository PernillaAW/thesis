const fs = require('fs')
const csv = require('csv-parser');
const  { connectCouchbase } = require('./DBconnection');

async function couchbaseInsert(filePatch, batchSize = 1000) {
    const { unoptimizedCollection, optimizedCollection } = await connectCouchbase();
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
                description: row.description
            };
            batchUnoptimized.push({key:unoptimized.id, value: unoptimized })

            const optimized = {
                type: 'optimized',
                id: `${count}`,
                severity: row.severity,
                us_state: row.us_state,
                description: row.description,
                embedding: Array.from({ length: 512}, () => Math.random())
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