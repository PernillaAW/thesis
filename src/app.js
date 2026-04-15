import express from 'express';
import { couchbaseSetup } from './coachbase/setUp.js';
import { preprocessing } from './postgis/preprocess.js';

import routes from '../routes/routes.js';

const app = express();

app.use(express.json());
app.use('/', routes);


app.listen(3000, () => console.log(`Server running on 3000`));


//couchbaseSetup()
//preprocessing("data.csv")
