'use strict';

const axios = require('axios');
const chalk = require('chalk');
const dotenv = require('dotenv');
const { mapStatusToColor } = require('./logger');

dotenv.config();

const Http = axios.create({
    baseURL: process.env.CTA_BASE_URL,
    params: {
        key: process.env.CTA_KEY,
        format: 'json',
    },
});

Http.interceptors.request.use((config) => {
    config.metadata = { startTime: new Date().getTime() };
    
    return config;
});

Http.interceptors.response.use((response) => {
    const {
        status,
        request: {
            res: { responseUrl },
        },
        data,
        config: {
            metadata: { startTime },
        },
    } = response;
    const responseTime = new Date().getTime() - startTime;
    const formattedDateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const busResponse = data['bustime-response'];
    const error = busResponse['error'];

    if (error) {
        console.log(chalk.red(error[0].msg));

        return { error: error[0].msg };
    }

    console.log(
        `[${chalk.blue(formattedDateTime)}] GET ${responseUrl} ${mapStatusToColor(status)} ${chalk.yellow(
            `${responseTime}ms`,
        )}`,
    );

    return { data: busResponse };
});

module.exports = {
    Http,
};
