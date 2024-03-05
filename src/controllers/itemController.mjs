import { getMultiResource, getSingleResource } from "../utils/getResource.mjs";

export async function getAllItems(req, res) {
    const result = await getMultiResource("item", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}

export async function getItem(req, res) {
    const result = await getSingleResource("item", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}