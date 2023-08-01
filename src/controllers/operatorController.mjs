import { getMultiResource, getSingleResource } from "../utils/getResource.mjs";

export async function getAllOperators(req, res) {
    const result = await getMultiResource("operators", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}

export async function getOperator(req, res) {
    const result = await getSingleResource("operators", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}