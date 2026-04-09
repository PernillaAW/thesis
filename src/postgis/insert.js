import postgis from "./DBConnection.js"


/**
 * Insert the cvs file to database
 * @param {path} path to file
 * @param {table} table 
 */
async function postgisInsert(path, table) {
    const copySQl = `COPY ${table}(severity, us_state, precipitation, windy, geo, start_time, end_time) 
    FROM $1 
    DELIMITER ',' 
    CSV HEADER)`;
    const arg = [path]
    await postgis.query(copySQl, arg)
    
}

export default postgisInsert();