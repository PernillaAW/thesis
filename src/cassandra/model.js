import { cassandraConnect } from "./DBConnection.js"
import fs from "fs";
import csv from "csv-parser";
import pLimit from "p-limit"
import cassandra from 'cassandra-driver';

const { types } = cassandra;

class cassandraModel{
    constructor(){
        this.cachedDates = null;
        this.client = null; 
    }
    /**
    * Read full table from database
    * @param {table} table 
    */
    async readAll(table) {
        const conn = await cassandraConnect();
        const sql = `SELECT * FROM ${table}`;
        let pageState = null;
        let totalRows = 0;
        do{
            const result = await conn.execute(sql, [], {fetchSize:5000, pageState: pageState});
            totalRows += result.rows.length;
            pageState = result.pageState;
        } while (pageState);
        console.log(totalRows);
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
        console.log(result.rows.length);
        return true;
    };



    /**
    * Searches table for partial results ~5%
    * @param {table} table 
    * @param {startTime} startTime specified for search
    * @param {endTime} endTime specified for search
    */
    async readPartialOptimized(table, startTime, endTime) {
        await this.init();
        const limit = pLimit(4);

        const start = startTime;
        const end = endTime ;

        const queries = this.cachedDates.map(date =>
            limit(() =>
                this.client.execute(
                    `SELECT * FROM thesis.${table}
                    WHERE date = ? AND time >= ? AND time <= ?`,
                    [date, start, end],
                    { prepare: true }
                )
            )
        );
        const results = await Promise.all(queries);
        const rows = results.flatMap(r => r.rows);
        console.log(rows.length);
        return true;
    }    

    async init() {
    if (!this.client) {
        this.client = await cassandraConnect();
    }

    if (!this.cachedDates) {
        const result = await this.client.execute(
            `SELECT DISTINCT date FROM thesis.optimizedbytime`
        );

        this.cachedDates = result.rows.map(r => r.date);
    }
}
    /**
    * Select single row based on id
    * @param {table} table 
    */
    async readOne(table) {
        const conn = await cassandraConnect();
        const sql = `SELECT * FROM ${table} WHERE id = 5000`
        const result = await conn.execute(sql);
        console.log(result.rows.length);
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
        console.log("DELETED");
        return true;
    }
    /**
    * Insert the cvs file to database
    * @param {path} path to file
    * @param {table} table 
    */
    async insert(table) {
        const limit = pLimit(50);
        const conn = await cassandraConnect();
        const sql = `INSERT INTO ${table}(id, severity, state, precipitation, windy, start_lng, start_lat, date, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?);`;
        let count = 0;
        let tasks = [];
        const size = 1000;
        const stream = fs.createReadStream('/data/dataTwentyFive.csv').pipe(csv());
        for await (const row of stream){
            const timePart = row.Time.split(' ')[1];

            const cassandraTime = timePart;
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
                    cassandraTime
                    ],
                    {prepare:true}))
            );
            if(tasks.length>= size){
                await Promise.all(tasks);
                tasks = [];
            }}
        const result = await Promise.all(tasks);
        console.log(count);
        return true;

    }
}

export default cassandraModel