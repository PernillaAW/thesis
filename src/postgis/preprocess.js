const fs = require('fs');
const csv = require('csv-parser');
const { writeFileSync } = require('fs');

const outputRows = [];

/**
 * Preprocessing of the cvs to create point.
 * @param {path} path to file
 */
function preprocessing(path){
    fs.createReadStream(path)
        .pipe(csv())
        .on('data', row => {
            const point = `(${row.longitude},${row.latitude})`;
            outputRows.push([
                row.severity,
                row.us_state,
                row.precipitation,
                row.windy,
                point,
                row.start_time,
                row.end_time
            ].join(','));
        })
        .on('end', () => {
        writeFileSync('postgis.csv', outputRows.join('\n'));
        });
}