import { getMultiResource, getSingleResource } from "../utils/getResource.mjs";

export async function getAllModules(req, res) {
    const result = await getMultiResource("module", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}

export async function getModule(req, res) {
    const result = await getSingleResource("module", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}