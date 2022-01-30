'use strict';

const { dropCollection } = require('../utils/db');
const Stop = require('../models/stops');
const Logger = require('../utils/logger');

const insertStops = async (allStops, trainStops, db) => {
    const logger = new Logger('insertStops');
    const busStops = [];
    const dbTrainStops = [];

    try {
        await dropCollection('stops', db);
    } catch (err) {
        throw err;
    }

    logger.begin();

    try {
        allStops.forEach((stop) => {
            const baseStop = {
                id: stop.stop_id,
                code: stop.stop_code,
                name: stop.stop_name,
                description: stop.stop_desc,
                location: {
                    type: 'Point',
                    coordinates: [parseFloat(stop.stop_lat), parseFloat(stop.stop_lon)],
                },
                wheelchairBoarding: stop.wheelchair_boarding,
            };

            if (parseInt(stop.stop_id, 10) >= 1 && parseInt(stop.stop_id, 10) <= 29999 && stop.parent_station === '') {
                busStops.push({
                    ...baseStop,
                    type: 'B',
                });
            }

            if (
                parseInt(stop.stop_id, 10) >= 40000 &&
                parseInt(stop.stop_id, 10) <= 49999 &&
                stop.parent_station === ''
            ) {
                const foundTrainStops = trainStops.filter((s) => s.map_id === stop.stop_id);

                if (foundTrainStops.length) {
                    dbTrainStops.push({
                        ...baseStop,
                        type: 'T',
                        red: foundTrainStops.some((t) => t.red === true),
                        blue: foundTrainStops.some((t) => t.blue === true),
                        green: foundTrainStops.some((t) => t.g === true),
                        brown: foundTrainStops.some((t) => t.brn === true),
                        purple: foundTrainStops.some((t) => t.p === true),
                        pexp: foundTrainStops.some((t) => t.pexp === true),
                        yellow: foundTrainStops.some((t) => t.y === true),
                        pink: foundTrainStops.some((t) => t.pnk === true),
                        orange: foundTrainStops.some((t) => t.o === true),
                    });
                }
            }
        });

        await Stop.collection.insertMany([...busStops, ...dbTrainStops]);

        logger.success();
    } catch (err) {
        logger.fail();
        throw err;
    }
};

module.exports = { insertStops };
