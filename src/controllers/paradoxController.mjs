import { getMultiResource, getSingleResource } from "../utils/getResource.mjs";

export async function getAllParadoxes(req, res) {
    const result = await getMultiResource("paradoxes", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}

export async function getParadox(req, res) {
    const result = await getSingleResource("paradoxes", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}