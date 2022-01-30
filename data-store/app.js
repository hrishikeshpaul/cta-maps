'use strict';

require('dotenv').config();
const { exit } = require('process');

const Db = require('./src/utils/db');
const { insertStops } = require('./src/services/stops-service');
const { insertTrips } = require('./src/services/trips-service');
const { readStopsFile, readTripsFile, readShapesFile } = require('./src/services/file-service');

const Arguments = ['stops', 'trips', 'shapes'];

const Functions = {
    stops: async (db) => {
        const { allStops, trainStops } = await readStopsFile();
        await insertStops(allStops, trainStops, db);
    },
    trips: async (db) => {
        const { trips } = await readTripsFile();
        await insertTrips(trips, db);
    },
};

const start = async () => {
    const db = new Db();
    await db.init();

    const args = process.argv.slice(2);
    const promises = [];

    if (args.length) {
        args.forEach((arg) => {
            if (Arguments.includes(arg)) {
                promises.push(Functions[arg](db));
            } else {
                throw Error(`Invalid argument - ${arg}`);
            }
        });
    } else {
        promises.push(Functions.stops(db));
        promises.push(Functions.trips(db));

        // await FunctionMapper.shapes();
    }

    await Promise.all(promises);
    exit();
};

start();
