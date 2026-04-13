import database from "./DBConnection";

async function readAll(collection) {
    const databaseCollection = database.Collection(collection)
    const result = await databaseCollection.find({});    
}

async function readPartial(collection, columnA, columnB, valueA, valueB) {
    const databaseCollection = database.Collection(collection) 
     const query = { [columnA]: {valueA}, [columnB]: {valueB} }
     const result = databaseCollection.find(query)
}

async function readOne(collection) {
    const databaseCollection = database.Collection(collection) 
    const result = await databaseCollection.findOne({id: 5000})
}

async function dropCollection(collection) {
    const databaseCollection = database.Collection(collection) 
    await databaseCollection.drop()
    
}