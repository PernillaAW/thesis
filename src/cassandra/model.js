import { cassandraConnect } from "./DBConnection.js"
import fs from "fs";
import csv from "csv-parser";
import pLimit from "p-limit"
import cassandra from 'cassandra-driver'


class cassandraModel{
    /**
    * Read full table from database
    * @param {table} table 
    */
    async readAll(table) {
        const conn = await cassandraConnect();
        const sql = `SELECT * FROM ${table}`;
        let pageState = null;
        let totalRow = 0;
        do{
            const result = await conn.execute(sql, [], {fetchSize:5000, pageState: pageState});
            totalRows += this.result.rows.length;
            pageState = this.result.pageState;
        } while (pageState);
        return true;
       };

    /**
    * Searches table for partial results ~5%
    * @param {table} table 
    * @param {columnOne} columnOne for searching
    * @param {columnTwo} columnTwo for searching
    * @param {valueOne} valueOne specified for search
    * @param {valueTwo} valueTwo specified for search
    */
    async readPartial(table, columnOne, columnTwo, valueOne, valueTwo) {
        const conn = await cassandraConnect();
        const sql = `SELECT * FROM ${table} WHERE ${columnOne} = ? AND ${columnTwo} = ?;`;
        const arg = [Number(valueOne), valueTwo];
        const result = await conn.execute(sql, arg, {prepare:true});
        return true;
    };

    /**
    * Searches table for partial results ~5%
    * @param {table} table 
    * @param {columnOne} columnOne for searching
    * @param {columnTwo} columnTwo for searching
    * @param {valueOne} valueOne specified for search
    * @param {valueTwo} valueTwo specified for search
    */
    async readPartialOptimized(table, columnOne, valueOne, valueTwo, valueThree) {
        const conn = await cassandraConnect();
        const sql = `SELECT * FROM ${table} WHERE ${columnOne} = ? AND time >= ? AND time <= ?;`;
        const arg = [valueOne, new Date(valueTwo), new Date(valueThree)];
        const result = await conn.execute(sql, arg, {prepare:true});
        return true;
    };

    /**
    * Select single row based on id
    * @param {table} table 
    */
    async readOne(table) {
        const conn = await cassandraConnect();
        const sql = `SELECT * FROM ${table} WHERE id = 5000`
        const result = await conn.execute(sql);
        return true;
    }
    /**
    * Delete the table and release memory space.
    * @param {table} table 
    */
    async delete(table) {
        const conn = await cassandraConnect();
        const sql = `TRUNCATE TABLE ${table}`
        const result = await conn.execute(sql);
    }
    /**
    * Insert the cvs file to database
    * @param {path} path to file
    * @param {table} table 
    */
    async insert(path, table) {
        const { types } = cassandra;
        const limit = pLimit(50);
        const conn = await cassandraConnect();
        const sql = `INSERT INTO ${table}(id, severity, state, precipitation, windy, start_lng, start_lat, date, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?);`;
        let count = 0;
        let tasks = [];
        const size = 1000;
        const stream = fs.createReadStream('/data/data.csv').pipe(csv());
        for await (const row of stream){
            const id = count++;
            tasks.push(
                limit(()=>
                conn.execute(sql,[
                    id,
                    Number(row.Severity),
                    row.State,
                    parseFloat(row.Precipitation),
                    Number(row.Windy),
                    parseFloat(row.Start_Lng),
                    parseFloat(row.Start_Lat),
                    types.LocalDate.fromString(row.Date),
                    new Date(row.Time.replace(' ', 'T')+ 'Z')
                    ],
                    {prepare:true}))
            );
            if(tasks.length>= size){
                await Promise.all(tasks);
                tasks = [];
            }}
        await Promise.all(tasks);
    }
}

export default cassandraModel