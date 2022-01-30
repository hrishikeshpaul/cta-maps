'use strict';

const Trip = require('../models/trips');
const Logger = require('../utils/logger');

const insertTrips = async (tripData, db) => {
    const logger = new Logger('insertTrips');
    const trips = [];
    logger.begin();

    try {
        await db.dropCollection('trips');

        tripData.forEach((trip) => {
            trips.push({
                id: trip.trip_id,
                routeId: trip.route_id,
                serviceId: trip.service_id || 'N/A',
                directionId: trip.direction_id,
                blockId: trip.block_id || 'N/A',
                shapeId: trip.shape_id,
                direction: trip.direction,
                wheelchairBoarding: trip.wheelchair_accessible,
                scheduleTripId: trip.schd_trip_id || 'N/A',
            });
        });

        await Trip.insertMany([...trips]);

        logger.success();
    } catch (err) {
        logger.fail();
        throw err;
    }
};

module.exports = {
    insertTrips,
};
