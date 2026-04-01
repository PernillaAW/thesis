import express from 'express';
import routes from '../routes/routes.js';

const app = express();

app.use(express.json());
app.use('/', routes);


app.listen(3000);


/* 
const { connectCouchbase } = require('./coachbase/DBconnection');
const { couchbaseSetup } = require('./coachbase/setUp');
const { couchbaseInsert } = require('./coachbase/insert');

const { connectPostgre } = require('./postgreeSQL/DBConnection');
const { postgreeInsert } = require('./postgreeSQL/insert');

require('dotenv').config()

//Couchbase database connections

connectCouchbase();
couchbaseSetup();
couchbaseInsert();

//Postgre database connections

connectPostgre();
postgreeInsert(); */
