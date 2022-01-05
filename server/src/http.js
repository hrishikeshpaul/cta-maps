'use strict';

const axios = require('axios');
const chalk = require('chalk');
const dotenv = require('dotenv');

dotenv.config();

const Http = axios.create({
    baseURL: process.env.CTA_BASE_URL,
    params: {
        key: process.env.CTA_KEY,
        format: 'json',
    },
});

Http.interceptors.request.use((config) => {
    const { baseURL, params, url } = config;
    const paramsStr = Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');

    console.log(chalk.blue(`[GET] ${baseURL}${url}?${paramsStr}`));

    return config;
});

Http.interceptors.response.use((response) => {
    const { data } = response;
    const busResponse = data['bustime-response'];
    const error = busResponse['error'];

    if (error) {
        console.log(chalk.red(error[0].msg));

        return { error: error[0].msg };
    }

    return { data: busResponse };
});

module.exports = {
    Http,
};
