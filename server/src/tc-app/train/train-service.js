'use strict';

const fs = require('fs');

const Trip = require('../../utils/db/schemas/trips-schema');
const Shape = require('../../utils/db/schemas/shapes-schema');
const { cache, cacheKeys } = require('../../utils/cache');

const getRoutes = async () => {
    const key = cacheKeys.trainRoutes;
    const routes = cache.get(key);
    let data;

    if (routes) {
        cache.log_hit(key);
        return routes;
    }

    try {
        data = JSON.parse(await fs.readFileSync('./assets/trains.json'));
    } catch (err) {
        throw err;
    }

    cache.log_miss(key);
    cache.set(key, data);

    return data;
};

const getPatterns = (route) => {
    const key = cacheKeys.pattern(route);
    const pattern = cache.get(key);

    if (pattern) {
        cache.log_hit(key);
        return pattern;
    }

    const routeId = route.charAt(0).toUpperCase() + route.slice(1);

    Trip.aggregate([
        {
            $lookup: {
                from: 'shapes',
                localField: 'shapeId',
                foreignField: 'id',
                as: 'shape',
            },
        },
        {
            $match: { routeId },
        },
        {
            $project: {
                shape: 1,
                routeId: 1,
                direction: 1,
                id: 1,
            },
        },
    ]).exec((err, res) => {
        if (err) {
            console.log(err);
            throw err;
        } else {
            cache.log_miss(key);
            cache.set(key, res);
            return res;
        }
    });
};

module.exports = {
    getRoutes,
    getPatterns,
};
