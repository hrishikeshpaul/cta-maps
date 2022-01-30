'use strict';

const fs = require('fs');

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

module.exports = {
    getRoutes,
};
