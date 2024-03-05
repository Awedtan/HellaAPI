import { getMultiResource, getSingleResource } from "../utils/getResource.mjs";

export async function getAllRanges(req, res) {
    const result = await getMultiResource("range", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}

export async function getRange(req, res) {
    const result = await getSingleResource("range", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}