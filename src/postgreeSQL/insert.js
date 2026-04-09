import connectPostgre from "../postgreeSQL/DBConnection.js"



/**
 * Insert the cvs file to database
 * @param {path} path to file
 * @param {table} table 
 */
async function postgreInsert(path, table) {
    const copySQl = `COPY ${table}(severity, us_state, precipitation, windy, longitude, latitude, start_time, end_time) 
    FROM $1 
    DELIMITER ',' 
    CSV HEADER)`;
    const arg = [path]
    await connectPostgre.query(copySQl, arg)
    
}


export default postgreInsert();



