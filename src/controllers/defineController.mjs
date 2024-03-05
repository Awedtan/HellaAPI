import { getMultiResource, getSingleResource } from "../utils/getResource.mjs";

export async function getAllDefinitions(req, res) {
    const result = await getMultiResource("define", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}

export async function getDefinition(req, res) {
    const result = await getSingleResource("define", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}