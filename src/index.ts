import express from 'express';
import { getCollections, getMatch, getMulti, getSearch, getSingle } from './persistence';
const { port } = require('../config.json')

function createRouter(route: string) {
    const router = express.Router();

    router.get('/', async (req, res) => {
        const result = await getMulti(route, req);

        if (!result) res.status(404).send("Not found");
        else res.status(200).send(result);
    });
    router.get('/search', async (req, res) => {
        const result = await getSearch(route, req);

        if (!result) res.status(404).send("Not found");
        else res.status(200).send(result);
    });
    router.get('/match/:id', async (req, res) => {
        const result = await getMatch(route, req);

        if (!result) res.status(404).send("Not found");
        else res.status(200).send(result);
    });
    router.get('/:id', async (req, res) => {
        const result = await getSingle(route, req);

        if (!result) res.status(404).send("Not found");
        else res.status(200).send(result);
    });

    return router;
}

async function main() {
    const app = express();
    for (const collection of await getCollections()) {
        app.use('/' + collection, createRouter(collection));
    }
    app.use((err, _req, res, next) => {
        res.status(500).send("Uh oh! An unexpected error occured.");
        console.log(err);
    })
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
    });
}

main();

/* 

api.app/operator
api.app/operator/hellagur
api.app/operator/hellagur?include=description&include=name
api.app/operator/hellagur?exclude=paradox
api.app/operator/search
api.app/operator/search?archetype=Pioneer&include=id
api.app/operator/search?archetype=Pioneer&include=data.name&limit=6
api.app/operator/match/chen

*/