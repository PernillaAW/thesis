import database from "./DBConnection";
import fs from "fs";
import csv from "csv-parser";


async function insertMongodb(collection) {
    const databaseCollection = database.collection(collection)
    const result = [];

    fs.createReadStream(filePath).pipe(csv()).on("data", (data) => result.push(data)).on("end", async () =>{
        await databaseCollection.inserMany(result);
        await databaseCollection.close()
    })

    }

export default insertMongodb();