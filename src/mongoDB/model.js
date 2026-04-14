import database from "./DBConnection";
import fs from "fs";
import csv from "csv-parser";

class mongodbModel{
async readAll(collection) {
    const databaseCollection = database.Collection(collection)
    const result = await databaseCollection.find({});    
}

async readPartial(collection, columnA, columnB, valueA, valueB) {
    const databaseCollection = database.Collection(collection) 
     const query = { [columnA]: {valueA}, [columnB]: {valueB} }
     const result = databaseCollection.find(query)
}

async readOne(collection) {
    const databaseCollection = database.Collection(collection) 
    const result = await databaseCollection.findOne({id: 5000})
}

async drop(collection) {
    const databaseCollection = database.Collection(collection) 
    await databaseCollection.drop()
    
}
async insert(collection) {
    const databaseCollection = database.collection(collection)
    const result = [];

    fs.createReadStream(filePath).pipe(csv()).on("data", (data) => result.push(data)).on("end", async () =>{
        await databaseCollection.inserMany(result);
        await databaseCollection.close()
    })

    }
}

export default mongodbModel