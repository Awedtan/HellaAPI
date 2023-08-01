import { getMultiResource, getSingleResource } from "../utils/getResource.mjs";

export async function getAllModules(req, res) {
    const result = await getMultiResource("modules", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}

export async function getModule(req, res) {
    const result = await getSingleResource("modules", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}