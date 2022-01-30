'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TripSchema = new Schema({
    id: {
        type: String,
        unique: true,
        required: true,
    },
    routeId: {
        type: String,
        required: true,
    },
    serviceId: {
        type: String,
        required: true,
    },
    tripId: {
        type: String,
        required: true,
    },
    directionId: {
        type: String,
        required: true,
    },
    blockId: {
        type: String,
        required: true,
    },
    shapeId: {
        type: String,
        required: true,
    },
    direction: {
        type: String,
        enum: ['North', 'South', 'East', 'West'],
    },
    wheelchairBoarding: {
        type: String,
    },
    type: {
        type: String,
        enum: ['B', 'T'],
        required: true,
    },
    childStops: {
        type: [Object],
    },
    ada: {
        type: Boolean,
        default: false,
    },
    red: {
        type: Boolean,
        default: false,
    },
    blue: {
        type: Boolean,
        default: false,
    },
    green: {
        type: Boolean,
        default: false,
    },
    brown: {
        type: Boolean,
        default: false,
    },
    purple: {
        type: Boolean,
        default: false,
    },
    pexp: {
        type: Boolean,
        default: false,
    },
    yellow: {
        type: Boolean,
        default: false,
    },
    pink: {
        type: Boolean,
        default: false,
    },
    orange: {
        type: Boolean,
        default: false,
    },
});

TripSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Trip', TripSchema, 'trips');
