import getDb from "./db";

export async function getCollections() {
    const collections = await (await getDb()).collections();
    return collections.map(collection => collection.collectionName);
}

// Gets all documents from a collection
// operator
export async function getMulti(collectionName: string, req) {
    const collection = (await getDb()).collection(collectionName);
    const result = await collection.find({}, createOptions(req)).toArray();

    return result;
}

// Gets a single document that has a key equal to the request id
// operator/char_188_helage
export async function getSingle(collectionName: string, req) {
    const collection = (await getDb()).collection(collectionName);
    const result = await collection.findOne({ keys: req.params.id }, createOptions(req));

    return result;
}

// Gets all documents whose keys contain the request id as a substring
// operator/match/helage
export async function getMatch(collectionName: string, req) {
    const collection = (await getDb()).collection(collectionName);

    // Find matching keys through a regex match with case insensitivity
    const result = await collection.find({ keys: { $regex: req.params.id, $options: 'i' } }, createOptions(req)).toArray();

    return result;
}

// Gets all documents where the document fields are equal to the request params
// operator/search?data.subProfessionId=musha
export async function getSearch(collectionName: string, req) {
    const collection = (await getDb()).collection(collectionName);
    const filter = {};

    for (const key in req.query) {
        if (['include', 'exclude', 'limit'].includes(key)) continue;
        filter[`value.${key}`] = req.query[key];
    }

    const result = await collection.find(filter, createOptions(req)).toArray();

    return result;
}

function createOptions(req) {
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
            excludeParams.forEach(exclude => projection[`value.${exclude}`] = 0);
        }
        else {
            projection[`value.${excludeParams}`] = 0;
        }
    }

    const options = { projection: projection, limit: parseInt(req.query.limit) ?? 0 };
    return options;
}