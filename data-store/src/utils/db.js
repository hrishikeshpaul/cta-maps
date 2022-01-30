'use strict';

const mongoose = require('mongoose');

const Logger = require('./logger');

const initializeDatabase = async () => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URL);

        console.log('>>> MongoAtlas connected...');

        return conn.connection;
    } catch (err) {
        throw err;
    }
};

const dropCollection = (collectionName, connection) => {
    const logger = new Logger(`dropCollection - "${collectionName}"`);

    logger.begin();

    return new Promise((resolve, reject) => {
        connection.dropCollection(collectionName, (err) => {
            if (err) {
                logger.fail();
                reject(err);
            } else {
                logger.success();
                resolve();
            }
        });
    });
};

module.exports = { initializeDatabase, dropCollection };
