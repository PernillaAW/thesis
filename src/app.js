import express from 'express';
//import { couchbaseSetup } from './coachbase/setUp.js';
import { preprocessing } from './postgis/preprocess.js';

import routes from '../routes/routes.js';

const app = express();

app.use(express.json());

app.use('/', routes);

app.listen(3000, () => console.log(`Server running on 3000`));

/* async function start() {
    await couchbaseSetup();
    console.log("Väntar 5 sekunder på att hinkarna ska stabiliseras...");
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log("CB SETUP DONE!");

    
}
 */


//start();


preprocessing("dataTwentyFive.csv")
