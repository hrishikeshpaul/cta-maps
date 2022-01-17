'use strict';

const _ = require('lodash');
const chalk = require('chalk');
const fs = require('fs');

const mapStatusToColor = (status) => {
    switch (status) {
        case 200:
            return chalk.green(status);
        default:
            return chalk.red(status);
    }
};

const log = console.log;

const fileLog = (log) => {
    fs.appendFile('_logs.txt', log + '\n', (err) => {
        if (err) console.log(err);
    });
};

const getActualRequestDurationInMilliseconds = (start) => {
    const NS_PER_SEC = 1e9;
    const NS_TO_MS = 1e6;
    const diff = process.hrtime(start);
    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

const logger = async (req, res, next) => {
    const formattedDateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const { method, url } = req;
    const { statusCode } = res;
    const start = process.hrtime();
    const durationInMilliseconds = getActualRequestDurationInMilliseconds(start);
    const timeInMs = `${durationInMilliseconds.toLocaleString()} ms`;

    log(
        `[${chalk.blue(`${formattedDateTime}`)}] ${method} ${url} ${mapStatusToColor(statusCode)} ${chalk.yellow(
            timeInMs,
        )}`,
    );
    fileLog(`${formattedDateTime} ${method} ${url} ${statusCode} ${timeInMs}`);

    next();
};

module.exports = {
    logger,
};
