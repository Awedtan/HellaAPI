import getDb from "./db";

export async function getCollections() {
    const collections = await (await getDb()).collections();
    return collections.map(collection => collection.collectionName);
}

export async function getMulti(collectionName: string, req) {
    const collection = (await getDb()).collection(collectionName);
    const result = await collection.find().project(createProjection(req)).limit(createLimit(req)).toArray();

    return result;
}

export async function getSingle(collectionName: string, req) {
    const collection = (await getDb()).collection(collectionName);
    const result = await collection.findOne({ keys: req.params.id }, { projection: createProjection(req) });

    return result;
}

export async function getMatch(collectionName: string, req) {
    const collection = (await getDb()).collection(collectionName);
    const result = await collection.find({ keys: { $regex: req.params.id, $options: 'i' } }).project(createProjection(req)).limit(createLimit(req)).toArray();

    return result;
}

export async function getSearch(collectionName: string, req) {
    const collection = (await getDb()).collection(collectionName);
    const filter = {};

    for (const key in req.query) {
        if (['include', 'exclude', 'limit'].includes(key)) continue;
        filter[`value.${key}`] = req.query[key];
    }

    const result = await collection.find(filter).project(createProjection(req)).limit(createLimit(req)).toArray();

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