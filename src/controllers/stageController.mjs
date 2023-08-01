import { getMultiResource, getSingleResource } from "../utils/getResource.mjs";

export async function getAllStages(req, res) {
    const result = await getMultiResource("stages", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}

export async function getStage(req, res) {
    const result = await getSingleResource("stages", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}