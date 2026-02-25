const { connectPostgre } = require('./DBConnection')


async function postgreeInsert() {
    const copySQl = `COPY unoptimized(severity, us_state, desciption) FROM 'path' DELIMITER ',' CSV HEADER)`;

    await connectPostgre.query(copySQl)
    
}

module.exports = { postgreeInsert }



