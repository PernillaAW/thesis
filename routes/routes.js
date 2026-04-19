import express from 'express';
import couchbaseModel from '../src/coachbase/model.js';
import cassandraModel from '../src/cassandra/model.js';
import mongodbModel from '../src/mongoDB/model.js';
import oracleModel from '../src/oracle/model.js';
import postgisModel from '../src/postgis/model.js';
import postgreModel from '../src/postgreSQL/model.js';

const routes = express.Router();

const pg = new postgreModel();
const postgis = new postgisModel();
const oracle = new oracleModel();
const mongoDB = new mongodbModel();
const cassandra = new cassandraModel();
const couchDB = new couchbaseModel();

routes.post("/insert", async (req, res)=>{
    //const result = await mongoDB.insert(req.body.collection);
    const result = await couchDB.couchbaseOptimizedInsert(req.body.file);
    //const result = await couchDB.couchbaseUnoptimizedInsert(req.body.file);
    res.status(200).json(result);
})

routes.post("/read_all", async (req, res) => {
    const result = await couchDB.readAll(req.body.collection);
    res.status(200).json(result);
})

routes.post("/read_partial", async (req, res) => {
    const result = await couchDB.readPartial (req.body.collection, req.body.columnOne, req.body.columnTwo, req.body.valueOne, req.body.valueTwo);
    //const result = await postgis.readPartial(req.body.collection, req.body.valueOne)
    res.status(200).json(result);
})

routes.post("/read_one", async (req, res) => {
    const result = await mongoDB.readOne(req.body.collection);
    res.status(200).json(result);
})

routes.post("/delete", async (req, res) => {
    const result = await mongoDB.delete(req.body.collection);
    res.status(200).json(result);
})


export default routes;

