'use strict';

const mongoose = require('mongoose');

const initializeDatabase = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('MongoAtlas connected...');
    } catch (err) {
        console.log(err);
    }
};

module.exports = { initializeDatabase };
