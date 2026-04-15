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
            const Geo_text = `POINT(${row.Start_Lng} ${row.Start_Lat})`;
            outputRows.push([
                row.Severity,
                row.State,
                row.Precipitation,
                row.Windy,
                `"${Geo_text}"`,
                row.Start_time,
                row.End_time
            ].join(','));
        })
        .on('end', () => {
            const headers = ["Severity", "State", "Precipitation", "Windy", "Geo_text", "Start_time", "End_time"]
            outputRows.unshift(headers.join(','));
            writeFileSync('postgis.csv', outputRows.join('\n'));
            console.log("file done")
        });
}