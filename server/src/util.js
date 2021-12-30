'use strict';

import axios from 'axios';
import dotenv from 'dotenv';

import { Http } from './http.js';

dotenv.config();

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
        axios.get(process.env.GITHUB_WORKFLOW_WEB_URL),
        axios.get(process.env.GITHUB_WORKFLOW_SERVER_URL),
    ]);

    return { web, server };
};
