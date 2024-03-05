import { getMultiResource, getSingleResource } from "../utils/getResource.mjs";

export async function getAllEvents(req, res) {
    const result = await getMultiResource("event", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}

export async function getEvent(req, res) {
    const result = await getSingleResource("event", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}