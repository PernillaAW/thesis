import dbConnectionOracle from "./DBConnection.js"

async function insertOracle(path, table) {
    const sql = `LOAD DATA INFILE ${path} INTO TABLE ${table} FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' (severity, us_state, precipitation, windy, longitude, latitude, start_time, end_time)`;
    const result = await dbConnectionOracle.execute(sql);
    return;
}

export default insertOracle();