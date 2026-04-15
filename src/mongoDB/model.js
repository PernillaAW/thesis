import { mongoDatabase } from "./DBConnection.js";
import fs from "fs";
import csv from "csv-parser";

class mongodbModel{

    /**
    * Read full table from database
    * @param {table} table 
    */
    async readAll(collection) {
        const databaseCollection = mongoDatabase.collection(collection)
        const result = await databaseCollection.find({});    
    }

    /**
    * Searches table for partial results ~5%
    * @param {table} table 
    * @param {columnOne} columnOne for searching
    * @param {columnTwo} columnTwo for searching
    * @param {valueOne} valueOne specified for search
    * @param {valueTwo} valueTwo specified for search
    */
    async readPartial(collection, columnA, columnB, valueA, valueB) {
        const databaseCollection = mongoDatabase.collection(collection) 
        const query = { [columnA]: {valueA}, [columnB]: {valueB} }
        const result = databaseCollection.find(query)
    }

    /**
    * Select single row based on id
    * @param {table} table 
    */
    async readOne(collection) {
        const databaseCollection = mongoDatabase.collection(collection) 
        const result = await databaseCollection.findOne({id: 5000})
    }

    /**
    * Drop the full table
    * @param {table} table 
    */
    async drop(collection) {
        const databaseCollection = mongoDatabase.collection(collection) 
        await databaseCollection.drop()
    
    }

    /**
    * Insert the cvs file to database
    * @param {path} path to file
    * @param {table} table 
    */
    async insert(filePath, collection) {
        const databaseCollection = mongoDatabase.collection(collection)
        const result = [];

        fs.createReadStream(filePath).pipe(csv()).on("data", (data) => result.push(data)).on("end", async () =>{
            await databaseCollection.inserMany(result);
            await databaseCollection.close()
        })
    }
}

export default mongodbModel