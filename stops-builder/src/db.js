'use strict';

const mongoose = require('mongoose');

const BusStop = require('./schemas/bus');

const initializeDatabase = async () => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URL);
        console.log('MongoAtlas connected...');
        const collections = await conn.connection.db.listCollections().toArray();
        if (collections.length) {
            conn.connection.dropCollection('bus-stops', (err) => {
                if (err) console.log(err);
                else console.log('Collection "bus-stops" dropped...');
            });
        }
    } catch (err) {
        console.log(err);
    }
};

const createBusStops = async (allStops) => {
    const stopsDocs = [];

    try {
        allStops.forEach((stop) => {
            if (parseInt(stop.stop_id, 10) >= 1 && parseInt(stop.stop_id, 10) <= 18615 && stop.parent_station === '') {
                const newStop = {
                    id: stop.stop_id.toString(),
                    code: stop.stop_code,
                    name: stop.stop_name,
                    description: stop.stop_desc,
                    lat: stop.stop_lat,
                    lng: stop.stop_lon,
                    wheelchairBoarding: stop.wheelchair_boarding,
                };

                stopsDocs.push(newStop);
            }
        });

        console.log(stopsDocs);

        await BusStop.collection.insertMany(stopsDocs);
        console.log('Bus stops inserted....');
    } catch (err) {
        console.log(err);
    }
};

module.exports = { initializeDatabase, createBusStops };
