'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TripSchema = new Schema({
    id: {
        type: String,
        unique: true,
    },
    routeId: {
        type: String,
    },
    serviceId: {
        type: String,
    },
    scheduleTripId: {
        type: String,
    },
    directionId: {
        type: String,
    },
    blockId: {
        type: String,
    },
    shapeId: {
        type: String,
    },
    direction: {
        type: String,
        enum: ['North', 'South', 'East', 'West', '0', '1'],
    },
    wheelchairBoarding: {
        type: String,
    },
});

module.exports = mongoose.model('Trip', TripSchema, 'trips');
