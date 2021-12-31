'use strict';

import axios from 'axios';
import dotenv from 'dotenv';

import { Cache } from './cache.js';
import { Http } from './http.js';

dotenv.config();

const ttl = 60 * 60 * 24;
const cache = new Cache(ttl);
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const cacheKeys = {
    locale: 'locale-cache',
    routes: 'routes-cache',
};

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
    const { data, error } = await Http.get('/getpatterns', {
        params: { rt: route },
    });

    if (error) {
        throw error;
    }

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
    const key = cacheKeys.locale;
    const value = cache.get(key);

    if (value) {
        cache.log_hit(key);
        return Promise.resolve(value);
    }

    const { data, status } = await axios.get(`${process.env.LOCALE_URL}/${lng}.json`);

    cache.set(key, { data, status });
    console.info(`[${key}] cache miss`);

    return { data, status };
};
