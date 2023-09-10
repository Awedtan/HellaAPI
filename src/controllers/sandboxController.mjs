import { getMultiResource, getSingleResource } from "../utils/getResource.mjs";

export async function getAllSandboxes(req, res) {
    const result = await getMultiResource("sandboxes", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}

export async function getSandbox(req, res) {
    const result = await getSingleResource("sandboxes", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}