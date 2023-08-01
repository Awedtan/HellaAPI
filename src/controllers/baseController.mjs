import { getMultiResource, getSingleResource } from "../utils/getResource.mjs";

export async function getAllBases(req, res) {
    const result = await getMultiResource("baseskills", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}

export async function getBase(req, res) {
    const result = await getSingleResource("baseskills", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}