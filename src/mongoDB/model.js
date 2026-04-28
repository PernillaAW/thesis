import { mongoDatabase } from "./DBConnection.js";
import fs from "fs";
import csv from "csv-parser";
import { resolve } from "dns";

class mongodbModel{

    /**
    * Read full table from database
    * @param {table} table 
    */
    async readAll(collection) {
        const db = await mongoDatabase();
        const databaseCollection = db.collection(collection);
        const result = await databaseCollection.find({}).toArray();   
        console.log("READ ALL", result.length) 
        return result;
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
        console.log(columnA, columnB, valueA, valueB)
        const db = await mongoDatabase();
        const databaseCollection = db.collection(collection) 
        const query = { [columnA]: valueA, [columnB]: valueB }
        const result = await databaseCollection.find(query).toArray();
        console.log("READ PART", result.length)
        return result;
    }

    /**
    * Select single row based on id
    * @param {table} table 
    */
    async readOne(collection) {
        const db = await mongoDatabase();
        const databaseCollection = db.collection(collection) 
        const result = await databaseCollection.findOne({id: 5000});
        console.log("READ ONE", result)
        return result;
    }

    /**
    * Drop the full table
    * @param {table} table 
    */
    async delete(collection) {
        const db = await mongoDatabase();
        const databaseCollection = db.collection(collection) 
        const result = await databaseCollection.drop()
        console.log("DELETE", result.length)
        return result;
    
    }

    /**
    * Insert the cvs file to database
    * @param {path} path to file
    * @param {table} table 
    */
    async insert(collection, path) {
        const filePath = `/data/${path}.csv`;
        const db = await mongoDatabase();
        const databaseCollection = db.collection(collection)
        let count = 0;
        const result = [];

        return new Promise((resolve, rejuct) => {
            fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => {
                data.id = count++
                result.push(data)

            })
            .on("end", async () =>{
                try {
                    const res = await databaseCollection.insertMany(result);
                    resolve(res);
                }catch(e){
                    console.error("Error when inserting many in MongodbDB", e)
                }
        })

        })
    }
}

export default mongodbModel