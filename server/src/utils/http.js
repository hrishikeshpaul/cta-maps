'use strict';

const axios = require('axios');
const chalk = require('chalk');
const dotenv = require('dotenv');

const { mapStatusToColor } = require('./logger');

dotenv.config();

const busResponseKey = 'bustime-response';
const trainResponseKey = 'ctatt';

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

    assign_response_interceptor(key) {
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
            const busResponse = data[key];
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
    }

    get_bus_http() {
        this.assign_response_interceptor(busResponseKey);
        return this.http;
    }

    get_train_http() {
        this.assign_response_interceptor(trainResponseKey);
        return this.http;
    }
}

const BusHttp = new Http(process.env.CTA_BASE_URL, process.env.CTA_KEY).get_bus_http();
const TrainHttp = new Http(process.env.CTA_TRAIN_BASE_URL, process.env.CTA_TRAIN_KEY).get_train_http();

module.exports = {
    BusHttp,
    TrainHttp
};
