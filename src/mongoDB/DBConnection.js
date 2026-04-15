import { MongoClient } from 'mongodb';


export async function mongoDatabase() {
    try{
        const uri = 'mongodb://localhost:27017'
        const connection = new MongoClient(uri)
        connection.connect().then(()=>{console.log("mongodb connected")})
        const database = connection.db("test")
        return database
    }catch(e){
        console.error("error with mongodb", e)
    }
}
