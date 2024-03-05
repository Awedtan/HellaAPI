import { getMultiResource, getSingleResource } from "../utils/getResource.mjs";

export async function getAllSandboxes(req, res) {
    const result = await getMultiResource("sandbox", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}

export async function getSandbox(req, res) {
    const result = await getSingleResource("sandbox", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}