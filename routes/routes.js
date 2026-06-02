import express from 'express';
//import getCouchbase from '../src/coachbase/model.js';
//import cassandraModel from '../src/cassandra/model.js';
//import mongodbModel from '../src/mongoDB/model.js';
//import oracleModel from '../src/oracle/model.js';
import postgisModel from '../src/postgis/model.js';
//import postgreModel from '../src/postgreSQL/model.js';


const routes = express.Router();

//const pg = new postgreModel();
const postgis = new postgisModel();
//const oracle = new oracleModel();
//const mongoDB = new mongodbModel();
//const cassandra = new cassandraModel();
//const couchDB = new getCouchbase();

routes.post("/insert", async (req, res)=>{
    try {

        const result = await postgis.insertOptimised(req.body.collection, req.body.path);
        //const result = await postgis.insert(req.body.collection, req.body.path);
        console.log("insert route", result)
        //const result = await cassandra.insertOptimized(req.body.collectionTime, req.body.collectionId, req.body.path);
        res.status(200).json({ success: true, result });
    } catch (err) {
        console.error("INSERT ERROR:", err);
        res.status(500).json({ success: false, error: err.message });
        }
})

routes.post("/read_all", async (req, res) => {
    console.log("read_all route", req.body.collection)
    const result = await postgis.readAll(req.body.collection);
    console.log("read_all route", result)
    res.status(200).json(result);
})

routes.post("/read_partial", async (req, res) => {
    console.log("ROUTES REQ'S",req.body.collection, req.body.columnOne, req.body.columnTwo, req.body.valueOne, req.body.valueTwo)
    //const result = await oracle.readPartial(req.body.collection, req.body.columnOne, req.body.columnTwo, req.body.valueOne, req.body.valueTwo);
    const result = await postgis.readPartialOP(req.body.collection, req.body.valueOne, req.body.valueTwo, req.body.valueThree, req.body.valueFour)
    //const result = await cassandra.readPartialOptimized(req.body.collection, req.body.valueOne, req.body.valueTwo)
    res.status(200).json(result);
})

routes.post("/read_one", async (req, res) => {
    const result = await postgis.readOne(req.body.collection);
    
    res.status(200).json(result);
})

routes.post("/delete", async (req, res) => {
    //const result = await cassandra.delete(req.body.collectionTime, req.body.collectionId);
    const result = await postgis.delete(req.body.collection);
    res.status(200).json(result);
})
routes.post("/postgisdrop", async (req, res) => {
    const result = await postgis.dropScrap();
    res.status(200).json(result);
})




export default routes;

