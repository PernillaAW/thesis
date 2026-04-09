import connectPostgre from "../postgreeSQL/DBConnection.js"

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

async function postgreeInsert() {
    const copySQl = `COPY unoptimized(severity, us_state, precipitation, windy, longitude, latitude, start_time, end_time) FROM 'path' DELIMITER ',' CSV HEADER)`;

    await connectPostgre.query(copySQl)
    
}

export default postgreeInsert();



