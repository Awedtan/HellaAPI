import { getMultiResource, getSingleResource } from "../utils/getResource.mjs";

export async function getAllRogues(req, res) {
    const result = await getMultiResource("roguethemes", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}

export async function getRogue(req, res) {
    const result = await getSingleResource("roguethemes", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}