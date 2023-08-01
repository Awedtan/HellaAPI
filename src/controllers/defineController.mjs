import { getMultiResource, getSingleResource } from "../utils/getResource.mjs";

export async function getAllDefinitions(req, res) {
    const result = await getMultiResource("definitions", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}

export async function getDefinition(req, res) {
    const result = await getSingleResource("definitions", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}