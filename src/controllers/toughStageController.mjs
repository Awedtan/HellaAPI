import { getMultiResource, getSingleResource } from "../utils/getResource.mjs";

export async function getAllToughStages(req, res) {
    const result = await getMultiResource("toughstage", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}

export async function getToughStage(req, res) {
    const result = await getSingleResource("toughstage", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}