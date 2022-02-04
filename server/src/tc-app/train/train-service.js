'use strict';

const fs = require('fs');

const Trip = require('../../utils/db/schemas/trips-schema');
const Stop = require('../../utils/db/schemas/stops-schema');

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

const getPatterns = async (route) => {
    const key = cacheKeys.pattern(route);
    const pattern = cache.get(key);

    if (pattern) {
        cache.log_hit(key);
        return pattern;
    }

    const routeId = route.charAt(0).toUpperCase() + route.slice(1);

    const response = await Trip.aggregate([
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
    ]);

    cache.log_miss(key);
    cache.set(key, response);

    return response;
};

const getStops = async (route) => {
    const key = cacheKeys.trainStops(route);
    const pattern = cache.get(key);

    if (pattern) {
        cache.log_hit(key);
        return pattern;
    }

    const response = await Stop.aggregate([
        {
            $match: { red: true, type: 'T' },
        },
        {
            $set: {
                lat: {
                    $arrayElemAt: ['$location.coordinates', 0],
                },
                lng: {
                    $arrayElemAt: ['$location.coordinates', 1],
                },
                latitude: {
                    $arrayElemAt: ['$location.coordinates', 0],
                },
                longitude: {
                    $arrayElemAt: ['$location.coordinates', 1],
                },
                route: route,
            },
        },
        {
            $project: {
                lat: 1,
                lng: 1,
                name: 1,
                description: 1,
                id: 1,
                wheelchairBoarding: 1,
                latitude: 1,
                longitude: 1,
                route: 1,
                _id: 0,
            },
        },
    ]);

    cache.log_miss(key);
    cache.set(key, response);

    return response;
};

module.exports = {
    getRoutes,
    getPatterns,
    getStops,
};
