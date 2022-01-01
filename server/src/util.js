'use strict';

import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';

import { Cache, cacheKeys } from './cache.js';
import { Http } from './http.js';

dotenv.config();

const cache = new Cache();
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export const getRoutes = async () => {
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

export const getVehicles = async (routes) => {
    const { data, error } = await Http.get('/getvehicles', {
        params: { rt: routes },
    });

    if (error) {
        throw error;
    }

    return data['vehicle'];
};

export const getPatterns = async (route) => {
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

export const getPredictions = async (stop) => {
    const { data, error } = await Http.get('/getpredictions', {
        params: { stpid: stop },
    });

    if (error) {
        throw error;
    }

    return data['prd'];
};

export const getGitHubWorkflow = async () => {
    const [{ data: web }, { data: server }] = await Promise.all([
        axios.get(process.env.GITHUB_WORKFLOW_WEB_URL, { headers: { Authorization: `token ${GITHUB_TOKEN}` } }),
        axios.get(process.env.GITHUB_WORKFLOW_SERVER_URL, { headers: { Authorization: `token ${GITHUB_TOKEN}` } }),
    ]);

    return { web, server };
};

export const getLocaleJson = async (lng) => {
    const key = cacheKeys.locale(lng);
    const value = cache.get(key);

    if (lng === 'en' && process.env.NODE_ENV === 'development') {
        return fs.readFileSync('./res/en.json');
    }

    if (value) {
        cache.log_hit(key);
        return Promise.resolve(value);
    }

    const { data, status } = await axios.get(`${process.env.LOCALE_URL}/${lng}.json`);

    cache.log_miss(key);
    cache.set(key, { data, status });

    return { data, status };
};

export const checkHeading = (heading) => {
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
