'use strict';

require('dotenv').config();

const { initializeDatabase, createBusStops } = require('./src/db');
const csvtojsonV2 = require('csvtojson');

const start = async () => {
    await initializeDatabase();
    const allStops = await csvtojsonV2().fromFile('data/stops.csv');

    await createBusStops(allStops);
};

start();
