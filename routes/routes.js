import express from 'express';
import couchbaseModel from '../src/coachbase/model';
import cassandraModel from '../src/cassandra/model';
import mongodbModel from '../src/mongoDB/model';
import oracleModel from '../src/oracle/model';
import postgisModel from '../src/postgis/model';
import postgreModel from '../src/postgreSQL/model';

const routes = express.Router();

const pg = new postgreModel();
const postgis = new postgisModel();
const oracle = new oracleModel();
const mongoDB = new mongodbModel();
const cassandra = new cassandraModel();
const couchDB = new couchbaseModel();

routes.post("/insert", async (req, res)=>{
    const result = await pg.insert();
})

routes.post("/read_all", async (req, res) => {
    const result = await pg.readAll();
    res.json(result);
})

routes.post("/read_partial", async (req, res) => {
    const result = await pg.readPartial ({ids: req.params.ids});
    res.json(result);
})

routes.post("/read_one", async (req, res) => {
    const result = await pg.readOne({id: req.params.id});
    res.json(result);
})

routes.post("/drop", async (req, res) => {
    const result = await pg.drop(req.body);
    res.json(result);
})


export default routes;

