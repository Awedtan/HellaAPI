import { getMultiResource, getSingleResource } from "../utils/getResource.mjs";

export async function getAllEnemies(req, res) {
    const result = await getMultiResource("enemies", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}

export async function getEnemy(req, res) {
    const result = await getSingleResource("enemies", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}