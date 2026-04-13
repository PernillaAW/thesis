import MongoClient from 'mongodb';


const uri = 'mongodb://localhost:27017'
const connection = new MongoClient(uri)
const database = connection.db("test")


export default database