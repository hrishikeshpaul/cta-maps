'use strict';

const mongoose = require('mongoose');

const Logger = require('./logger');

class Db {
    constructor() {
        this.connection = {};
    }

    async init() {
        try {
            const conn = await mongoose.connect(process.env.DATABASE_URL);

            console.log('>>> MongoAtlas connected...');

            this.connection = conn.connection;
        } catch (err) {
            throw err;
        }
    }

    async dropCollection(collectionName) {
        const logger = new Logger(`dropCollection "${collectionName}"`);

        logger.begin();

        return new Promise((resolve, reject) => {
            this.connection.dropCollection(collectionName, (err) => {
                if (err) {
                    logger.fail();
                    reject(err);
                } else {
                    logger.success();
                    resolve();
                }
            });
        });
    }
}


module.exports = Db;
