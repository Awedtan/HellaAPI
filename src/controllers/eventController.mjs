import { getMultiResource, getSingleResource } from "../utils/getResource.mjs";

export async function getAllEvents(req, res) {
    const result = await getMultiResource("events", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}

export async function getEvent(req, res) {
    const result = await getSingleResource("events", req);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
}