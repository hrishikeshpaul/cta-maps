'use strict';

require('dotenv').config();
const csvtojsonV2 = require('csvtojson');
const fs = require('fs');

const { initializeDatabase, insertStops } = require('./src/db');

const start = async () => {
    await initializeDatabase();
    const allStops = await csvtojsonV2().fromFile('data/stops.csv');
    const trainStops = JSON.parse(fs.readFileSync('data/train-stops.json'));

    await insertStops(allStops, trainStops);
};

start();
