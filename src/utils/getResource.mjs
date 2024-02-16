import db from "../db.mjs";

export async function getMultiResource(collectionName, req) {
    const collection = await db.collection(collectionName);
    const result = await collection.find().project(createProjection(req)).limit(createLimit(req)).toArray();

    return result;
}

export async function getSingleResource(collectionName, req) {
    const collection = await db.collection(collectionName);
    const result = await collection.findOne({ keys: req.params.id }, { projection: createProjection(req) });

    return result;
}

function createLimit(req) {
    const limit = req.query.limit;
    return limit ? parseInt(limit) : 0;
}

function createProjection(req) {
    const includeParams = req.query.include;
    const excludeParams = req.query.exclude;
    const projection = {};

    if (includeParams) {
        projection[`keys`] = 1;
        if (Array.isArray(includeParams)) {
            includeParams.forEach(include => projection[`value.${include}`] = 1);
        }
        else {
            projection[`value.${includeParams}`] = 1;
        }
    }
    else if (excludeParams) {
        if (Array.isArray(excludeParams)) {
            includeParams.forEach(include => projection[`value.${include}`] = 0);
        }
        else {
            projection[`value.${excludeParams}`] = 0;
        }
    }

    return projection;
}