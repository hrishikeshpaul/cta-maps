'use strict';

const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');

const { Cache, cacheKeys } = require('./cache');
const { Http } = require('./http');

dotenv.config();

const cache = new Cache();
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const getRoutes = async () => {
    const key = cacheKeys.routes;
    const routes = cache.get(key);

    if (routes) {
        cache.log_hit(key);
        return routes;
    }

    const { data, error } = await Http.get(`/getroutes`);

    if (error) {
        throw error;
    }

    cache.log_miss(key);
    cache.set(key, data['routes']);

    return data['routes'];
};

const getVehicles = async (routes) => {
    const { data, error } = await Http.get('/getvehicles', {
        params: { rt: routes },
    });

    if (error) {
        throw error;
    }

    return data['vehicle'];
};

const getPatterns = async (route) => {
    const key = cacheKeys.pattern(route);
    const pattern = cache.get(key);

    if (pattern) {
        cache.log_hit(key);
        return pattern;
    }

    const { data, error } = await Http.get('/getpatterns', {
        params: { rt: route },
    });

    if (error) {
        throw error;
    }

    cache.log_miss(key);
    cache.set(key, data['ptr']);

    return data['ptr'];
};

const getPredictions = async (stop) => {
    const { data, error } = await Http.get('/getpredictions', {
        params: { stpid: stop },
    });

    if (error) {
        throw error;
    }

    return data['prd'];
};

const getRouteDirections = async (route) => {
    const key = cacheKeys.direction(route);
    const directions = cache.get(key);

    if (directions) {
        cache.log_hit(key);
        return directions;
    }

    const { data, error } = await Http.get('/getdirections', {
        params: { rt: route },
    });

    if (error) {
        throw error;
    }

    const response = data['directions'].map((dir) => dir.dir);

    cache.log_miss(key);
    cache.set(key, response);

    return response;
};

const getStops = async (route, direction) => {
    const key = cacheKeys.stops(route, direction);
    const stops = cache.get(key);

    if (stops) {
        cache.log_hit(key);
        return stops;
    }

    const { data, error } = await Http.get('/getstops', {
        params: { rt: route, dir: direction },
    });

    if (error) {
        throw error;
    }

    const response = { direction, route, stops: data['stops'] };
    cache.log_miss(key);
    cache.set(key, response);

    return response;
};

const getGitHubWorkflow = async () => {
    const [{ data: web }, { data: server }] = await Promise.all([
        axios.get(process.env.GITHUB_WORKFLOW_WEB_URL, { headers: { Authorization: `token ${GITHUB_TOKEN}` } }),
        axios.get(process.env.GITHUB_WORKFLOW_SERVER_URL, { headers: { Authorization: `token ${GITHUB_TOKEN}` } }),
    ]);

    return { web, server };
};

const getLatestVersion = async () => {
    const { data } = await axios.get(process.env.GITHUB_VERSION_URL, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` },
    });

    return data.tag_name;
};

const getLocaleJson = async (ns, lng) => {
    if (process.env.NODE_ENV === 'development' && ns === 'common' && lng === 'en') {
        return { data: fs.readFileSync('./src/locales/common_en.json'), status: 200 };
    }

    if (process.env.NODE_ENV === 'development' && ns === 'faq' && lng === 'en') {
        return { data: fs.readFileSync('./src/locales/faq_en.json'), status: 200 };
    }

    const key = cacheKeys.locale(ns, lng);
    const value = cache.get(key);

    if (value) {
        cache.log_hit(key);
        return Promise.resolve(value);
    }

    const { data, status } = await axios.get(`${process.env.LOCALE_URL}/${ns}/${lng}.json`);

    cache.log_miss(key);
    cache.set(key, { data, status });

    return { data, status };
};

const checkHeading = (heading) => {
    if (heading >= 0 && heading <= 45) {
        return 'N';
    } else if (heading > 45 && heading <= 90) {
        return 'NE';
    } else if (heading > 90 && heading <= 135) {
        return 'E';
    } else if (heading > 135 && heading <= 180) {
        return 'SE';
    } else if (heading > 180 && heading <= 225) {
        return 'S';
    } else if (heading > 225 && heading <= 270) {
        return 'SW';
    } else if (heading > 270 && heading <= 315) {
        return 'W';
    } else if (heading > 315 && heading <= 360) {
        return 'NW';
    } else {
        return 'F';
    }
};

module.exports = {
    getGitHubWorkflow,
    getLatestVersion,
    getLocaleJson,
    getPatterns,
    getPredictions,
    getRoutes,
    getVehicles,
    getRouteDirections,
    getStops,
    checkHeading,
};
