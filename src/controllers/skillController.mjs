import { getMultiResource, getSingleResource } from "../utils/getResource.mjs";

export async function getAllSkills(req, res) {
    const result = await getMultiResource("skill", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}

export async function getSkill(req, res) {
    const result = await getSingleResource("skill", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}