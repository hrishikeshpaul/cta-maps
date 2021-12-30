'use strict';

import axios from 'axios';
import dotenv from 'dotenv';

import { Http } from './http.js';

dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export const getRoutes = async () => {
    const { data, error } = await Http.get(`/getroutes`);

    if (error) {
        throw error;
    }

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
    
}