'use strict';

const mongoose = require('mongoose');

const Stop = require('./schema');

const initializeDatabase = async () => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URL);

        console.log('MongoAtlas connected...');

        const collections = await conn.connection.db.listCollections().toArray();

        if (collections.length) {
            collections.forEach((collection) => {
                conn.connection.dropCollection(collection.name, (err) => {
                    if (err) console.log(err);
                    else console.log(`Collection "${collection.name}" dropped...`);
                });
            });
        }
    } catch (err) {
       throw err;
    }
};

const insertStops = async (allStops, trainStops) => {
    const busStops = [];
    const dbTrainStops = [];

    try {
        allStops.forEach((stop) => {
            const baseStop = {
                id: stop.stop_id,
                code: stop.stop_code,
                name: stop.stop_name,
                description: stop.stop_desc,
                lat: stop.stop_lat,
                lng: stop.stop_lon,
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
                        description: foundTrainStops[0].station_descriptive_name,
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
        console.log('Bus stops inserted...');
    } catch (err) {
        throw err;
    }
};

module.exports = { initializeDatabase, insertStops };
