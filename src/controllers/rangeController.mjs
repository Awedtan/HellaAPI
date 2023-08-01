import { getMultiResource, getSingleResource } from "../utils/getResource.mjs";

export async function getAllRanges(req, res) {
    const result = await getMultiResource("ranges", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}

export async function getRange(req, res) {
    const result = await getSingleResource("ranges", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}