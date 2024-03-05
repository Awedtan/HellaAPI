import { getMultiResource, getSingleResource } from "../utils/getResource.mjs";

export async function getAllArchetypes(req, res) {
    const result = await getMultiResource("archetype", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}

export async function getArchetype(req, res) {
    const result = await getSingleResource("archetype", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}