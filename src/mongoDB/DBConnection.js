import { MongoClient } from 'mongodb';


export async function mongoDatabase() {
    try{

        const uri = 'mongodb://mongodb:27017'
        const connection = new MongoClient(uri)
        await connection.connect()
        console.log("mongodb connected")
        const database = connection.db("test")
        return database
    }catch(e){
        console.error("error with mongodb", e)
    }
}
