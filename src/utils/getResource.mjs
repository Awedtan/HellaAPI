import db from "../db.mjs";
import createProjection from "./createProjection.mjs";

export async function getMultiResource(collectionName, req) {
    const collection = await db.collection(collectionName);
    const result = await collection.find().project(createProjection(req)).toArray();

    return result;
}

export async function getSingleResource(collectionName, req) {
    const collection = await db.collection(collectionName);
    const result = await collection.findOne({ keys: req.params.id }, { projection: createProjection(req) });

    return result;
}