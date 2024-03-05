import { getMultiResource, getSingleResource } from "../utils/getResource.mjs";

export async function getAllParadoxes(req, res) {
    const result = await getMultiResource("paradox", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}

export async function getParadox(req, res) {
    const result = await getSingleResource("paradox", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}