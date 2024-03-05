import { getMultiResource, getSingleResource } from "../utils/getResource.mjs";

export async function getAllCc(req, res) {
    const result = await getMultiResource("cc", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}

export async function getCc(req, res) {
    const result = await getSingleResource("cc", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}