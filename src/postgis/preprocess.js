import fs from 'fs';
import csv from 'csv-parser';
import { writeFileSync } from 'fs';

const outputRows = [];

/**
 * Preprocessing of the cvs to create point.
 * @param {path} path to file
 */
export function preprocessing(path){
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