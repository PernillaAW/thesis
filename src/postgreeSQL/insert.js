import connectPostgre from "../postgreeSQL/DBConnection.js"


async function postgreeInsert(path) {
    const copySQl = `COPY unoptimized(severity, us_state, precipitation, windy, longitude, latitude, start_time, end_time) 
    FROM $1 
    DELIMITER ',' 
    CSV HEADER)`;
    const arg = [path]
    await connectPostgre.query(copySQl, arg)
    
}

export default postgreeInsert();



