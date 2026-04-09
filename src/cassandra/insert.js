import client from "./DBConnection";

/**
 * Insert the cvs file to database
 * @param {path} path to file
 * @param {table} table 
 */
async function cassandraInsert(path, table) {
    const copySQl = `COPY ${table}(severity, us_state, precipitation, windy, longitude, latitude, start_time, end_time) 
    FROM $1 
    DELIMITER ',' 
    CSV HEADER)`;
    const arg = [path];

    await client.execute(copySQl, arg);
}