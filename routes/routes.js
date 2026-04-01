import express from 'express';
import dbService from '../services/dbService.js';

const routes = express.Router();

routes.post("/full_read", async (req, res) => {
    const result = await dbService.full_read();
    res.json(result);
})

routes.post("/five_read", async (req, res) => {
    const result = await dbService.five_read({ids: req.params.ids});
    res.json(result);
})

routes.post("/single_read", async (req, res) => {
    const result = await dbService.single_read({id: req.params.id});
    res.json(result);
})

routes.post("/delete", async (req, res) => {
    const result = await dbService.delete(req.body);
    res.json(result);
})


export default routes;

