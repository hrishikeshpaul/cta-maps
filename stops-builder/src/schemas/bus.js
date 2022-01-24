const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Bus = new Schema({
    id: {
        type: String,
        unique: true,
        required: true,
    },
    code: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    lat: {
        type: Number,
        required: true,
    },
    lon: {
        type: Number,
        required: true,
    },
    wheelchairBoarding: {
        type: Number,
    },
});

module.exports = mongoose.model('BusStop', Bus, 'bus-stops');
