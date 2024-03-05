import { getMultiResource, getSingleResource } from "../utils/getResource.mjs";

export async function getAllSkins(req, res) {
    const result = await getMultiResource("skin", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}

export async function getSkins(req, res) {
    const result = await getSingleResource("skin", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}