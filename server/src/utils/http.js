'use strict';

const axios = require('axios');
const chalk = require('chalk');
const dotenv = require('dotenv');
const { mapStatusToColor } = require('./logger');

dotenv.config();

class Http {
    constructor(baseURL, key) {
        this.http = axios.create({
            baseURL,
            params: {
                key,
                format: 'json',
            },
        });

        this.http.interceptors.request.use((config) => {
            config.metadata = { startTime: new Date().getTime() };

            return config;
        });
    }

    get_bus_http() {
        this.http.interceptors.response.use((response) => {
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
                `${chalk.blue(formattedDateTime)} GET ${responseUrl} ${mapStatusToColor(status)} ${chalk.yellow(
                    `${responseTime}ms`,
                )}`,
            );

            return { data: busResponse };
        });

        return this.http;
    }
}

module.exports = {
    Http,
};
