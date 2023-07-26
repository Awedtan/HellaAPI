export default function getProjection(req) {
    const includeParams = req.query.include;
    const excludeParams = req.query.exclude;
    const projection = {};

    if (includeParams) {
        if (Array.isArray(includeParams)) {
            for (const include of includeParams) {
                projection[`value.${include}`] = 1;
            }
        }
        else {
            projection[`value.${includeParams}`] = 1;
        }
    }
    else if (excludeParams) {
        if (Array.isArray(excludeParams)) {
            for (const exclude of excludeParams) {
                projection[`value.${exclude}`] = 0;
            }
        }
        else {
            projection[`value.${excludeParams}`] = 0;
        }
    }

    return projection;
}